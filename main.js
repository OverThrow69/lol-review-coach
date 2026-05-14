const { app, BrowserWindow, ipcMain, shell } = require("electron");
const fs = require("fs");
const https = require("https");
const path = require("path");
const packageJson = require("./package.json");

let mainWindow = null;
let overlayWindow = null;
let autoUpdater = null;

function createOverlayWindow() {
  if (overlayWindow && !overlayWindow.isDestroyed()) return;
  overlayWindow = new BrowserWindow({
    width: 376,
    height: 170,
    transparent: true,
    frame: false,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    focusable: true,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, "overlay-preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });
  overlayWindow.loadFile("overlay.html");
  overlayWindow.once("ready-to-show", () => {});
}

function sendOverlayData(data) {
  if (overlayWindow && !overlayWindow.isDestroyed()) {
    overlayWindow.webContents.send("overlay:data", data);
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    minWidth: 920,
    minHeight: 680,
    title: "LoL Review Coach",
    backgroundColor: "#101417",
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  mainWindow = win;
  win.loadFile("index.html");
}

function sendUpdateStatus(status) {
  if (mainWindow && !mainWindow.isDestroyed()) {
    mainWindow.webContents.send("update:status", status);
  }
}

function setupAutoUpdater() {
  const publish = packageJson.build?.publish?.[0];
  const updatesConfigured = publish?.owner && publish.owner !== "CHANGE_ME_GITHUB_USERNAME";
  if (!updatesConfigured) {
    return false;
  }

  autoUpdater = require("electron-updater").autoUpdater;
  autoUpdater.autoDownload = true;
  autoUpdater.autoInstallOnAppQuit = true;

  autoUpdater.on("checking-for-update", () => {
    sendUpdateStatus({ state: "checking", message: "Checking for updates..." });
  });
  autoUpdater.on("update-available", (info) => {
    sendUpdateStatus({ state: "available", message: `Update ${info.version} available. Downloading...` });
  });
  autoUpdater.on("update-not-available", () => {
    sendUpdateStatus({ state: "current", message: "App is up to date." });
  });
  autoUpdater.on("download-progress", (progress) => {
    sendUpdateStatus({ state: "downloading", message: `Downloading update ${Math.round(progress.percent)}%` });
  });
  autoUpdater.on("update-downloaded", (info) => {
    sendUpdateStatus({ state: "ready", message: `Update ${info.version} ready. Restart app to install.` });
  });
  autoUpdater.on("error", (error) => {
    sendUpdateStatus({ state: "error", message: error.message || "Update check failed." });
  });
  return true;
}

function lockfilePaths() {
  const paths = [
    "C:\\Riot Games\\League of Legends\\lockfile",
    "C:\\Program Files\\Riot Games\\League of Legends\\lockfile",
    "C:\\Program Files (x86)\\Riot Games\\League of Legends\\lockfile",
  ];

  const localAppData = process.env.LOCALAPPDATA;
  if (localAppData) {
    paths.push(path.join(localAppData, "Riot Games", "League of Legends", "lockfile"));
  }

  for (const drive of "CDEFGHIJKLMNOPQRSTUVWXYZ") {
    paths.push(`${drive}:\\Riot Games\\League of Legends\\lockfile`);
  }

  return [...new Set(paths)];
}

function readLockfile() {
  const lockfilePath = lockfilePaths().find((item) => fs.existsSync(item));
  if (!lockfilePath) {
    throw new Error("League Client lockfile nie gevind nie. Maak League of Legends oop en probeer weer.");
  }

  const content = fs.readFileSync(lockfilePath, "utf8").trim();
  const [name, pid, port, password, protocol] = content.split(":");

  if (!port || !password || !protocol) {
    throw new Error("League lockfile kon nie gelees word nie.");
  }

  return { name, pid, port, password, protocol, lockfilePath };
}

function lcuRequest(lockfile, endpoint) {
  const auth = Buffer.from(`riot:${lockfile.password}`).toString("base64");

  return new Promise((resolve, reject) => {
    const request = https.request(
      {
        hostname: "127.0.0.1",
        port: lockfile.port,
        path: endpoint,
        method: "GET",
        rejectUnauthorized: false,
        headers: {
          Authorization: `Basic ${auth}`,
          Accept: "application/json",
        },
      },
      (response) => {
        let body = "";
        response.on("data", (chunk) => {
          body += chunk;
        });
        response.on("end", () => {
          if (response.statusCode < 200 || response.statusCode >= 300) {
            reject(new Error(`League API fout ${response.statusCode}: ${endpoint}`));
            return;
          }

          try {
            resolve(body ? JSON.parse(body) : null);
          } catch (error) {
            reject(error);
          }
        });
      },
    );

    request.on("error", reject);
    request.end();
  });
}

function fetchText(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (response) => {
      let body = "";
      response.on("data", (chunk) => {
        body += chunk;
      });
      response.on("end", () => {
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}: ${url}`));
          return;
        }
        resolve(body);
      });
    }).on("error", reject);
  });
}

function findPatchArticles(value, out = []) {
  if (!value || typeof value !== "object") return out;
  if (Array.isArray(value)) {
    value.forEach((item) => findPatchArticles(item, out));
    return out;
  }

  if (value.title && value.publishedAt && value.action?.payload?.url && /patch/i.test(value.title)) {
    out.push(value);
  }

  Object.values(value).forEach((item) => findPatchArticles(item, out));
  return out;
}

async function getLatestLeaguePatch() {
  const pageUrl = "https://www.leagueoflegends.com/en-us/news/tags/patch-notes/";
  const html = await fetchText(pageUrl);
  const match = html.match(/<script id="__NEXT_DATA__" type="application\/json">(.*?)<\/script>/);
  if (!match) throw new Error("Could not read Riot patch notes data.");

  const data = JSON.parse(match[1]);
  const article = findPatchArticles(data.props?.pageProps || data)
    .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))[0];

  if (!article) throw new Error("No patch notes found.");
  const url = new URL(article.action.payload.url, "https://www.leagueoflegends.com").toString();
  const description = article.description?.body?.replace(/<[^>]*>/g, "") || "";

  return {
    title: article.title,
    publishedAt: article.publishedAt,
    url,
    description,
    source: "Riot Games official patch notes",
  };
}

function liveClientRequest(endpoint) {
  return new Promise((resolve, reject) => {
    const request = httpRequest({
      hostname: "127.0.0.1",
      port: 2999,
      path: endpoint,
      method: "GET",
      rejectUnauthorized: false,
      headers: {
        Accept: "application/json",
      },
    }, resolve, reject);

    request.end();
  });
}

function httpRequest(options, resolve, reject) {
  const request = https.request(options, (response) => {
    let body = "";
    response.on("data", (chunk) => {
      body += chunk;
    });
    response.on("end", () => {
      if (response.statusCode < 200 || response.statusCode >= 300) {
        reject(new Error(`League API fout ${response.statusCode}: ${options.path}`));
        return;
      }

      try {
        resolve(body ? JSON.parse(body) : null);
      } catch (error) {
        reject(error);
      }
    });
  });

  request.on("error", reject);
  return request;
}

async function getLeagueProfile() {
  const lockfile = readLockfile();
  const [summoner, region, gameflow] = await Promise.all([
    lcuRequest(lockfile, "/lol-summoner/v1/current-summoner"),
    lcuRequest(lockfile, "/riotclient/region-locale").catch(() => null),
    lcuRequest(lockfile, "/lol-gameflow/v1/gameflow-phase").catch(() => null),
  ]);

  return {
    displayName: summoner.displayName || summoner.gameName || "Onbekend",
    gameName: summoner.gameName || "",
    tagLine: summoner.tagLine || "",
    summonerLevel: summoner.summonerLevel,
    profileIconId: summoner.profileIconId,
    puuid: summoner.puuid,
    region: region?.region || region?.webRegion || "Onbekend",
    locale: region?.locale || app.getLocale() || "Onbekend",
    gameflow: gameflow || "Menus",
  };
}

function normalizeRole(position) {
  const value = String(position || "").toLowerCase();
  const roles = {
    top: "top",
    jungle: "jungle",
    middle: "mid",
    mid: "mid",
    bottom: "adc",
    bot: "adc",
    utility: "support",
    support: "support",
  };

  return roles[value] || "";
}

function championNameById(summary, championId) {
  const id = Number(championId);
  if (!id || !Array.isArray(summary)) return "";
  const champion = summary.find((item) => Number(item.id) === id);
  return champion?.name || champion?.alias || "";
}

function classifyQueue({ queueId, queue, gameMode }) {
  const id = Number(queueId || 0);
  const text = `${queue || ""} ${gameMode || ""}`.toLowerCase();

  if (id === 450 || text.includes("aram")) return "aram";
  if ([420, 440].includes(id) || text.includes("ranked")) return "ranked";
  if ([400, 430, 490].includes(id) || text.includes("normal") || text.includes("quickplay") || text.includes("draft") || text.includes("blind")) return "normal";
  if (text.includes("classic")) return "normal";
  return "unknown";
}

async function getLiveGameContext(profile) {
  try {
    const liveData = await liveClientRequest("/liveclientdata/allgamedata");
    const activeName = liveData?.activePlayer?.riotIdGameName || liveData?.activePlayer?.summonerName || profile.displayName;
    const player = liveData?.allPlayers?.find((item) => {
      const riotId = `${item.riotIdGameName || ""}#${item.riotIdTagLine || ""}`.toLowerCase();
      const profileRiotId = `${profile.gameName || profile.displayName}#${profile.tagLine || ""}`.toLowerCase();
      return item.summonerName === activeName || riotId === profileRiotId;
    });

    const gameMode = liveData?.gameData?.gameMode || "";
    const queue = liveData?.gameData?.queueName || "Live game";
    const queueId = liveData?.gameData?.queueId || liveData?.gameData?.gameQueueConfigId || 0;

    return {
      champion: player?.championName || "",
      role: "",
      gameMode,
      queue,
      queueId,
      queueType: classifyQueue({ queueId, queue, gameMode }),
      stats: player?.scores ? {
        kills: player.scores.kills || 0,
        deaths: player.scores.deaths || 0,
        assists: player.scores.assists || 0,
        cs: (player.scores.creepScore || 0),
        minutes: Math.max(1, Math.round((liveData?.gameData?.gameTime || 60) / 60)),
        vision: player.scores.wardScore || 0,
        controlWards: 0,
        objectives: 0,
      } : null,
      source: "In-game",
    };
  } catch {
    return null;
  }
}

function participantFromMatch(game, profile) {
  const participants = game?.participants || game?.participantIdentities || [];
  const participantIdentity = game?.participantIdentities?.find((item) => {
    const player = item.player || {};
    return player.puuid === profile.puuid ||
      player.summonerId === profile.summonerId ||
      player.gameName === profile.gameName ||
      player.summonerName === profile.displayName;
  });

  if (participantIdentity?.participantId && Array.isArray(game?.participants)) {
    return game.participants.find((item) => item.participantId === participantIdentity.participantId);
  }

  return participants.find((item) => {
    const player = item.player || {};
    return item.puuid === profile.puuid ||
      player.puuid === profile.puuid ||
      item.summonerId === profile.summonerId ||
      player.summonerId === profile.summonerId ||
      item.summonerName === profile.displayName ||
      player.summonerName === profile.displayName;
  });
}

async function getLatestMatchContext(lockfile, profile, championSummary) {
  const history = await lcuRequest(lockfile, "/lol-match-history/v1/products/lol/current-summoner/matches?begIndex=0&endIndex=1").catch(() => null);
  const game = history?.games?.games?.[0] || history?.games?.[0];
  if (!game) return null;

  const fullGame = game.gameId
    ? await lcuRequest(lockfile, `/lol-match-history/v1/games/${game.gameId}`).catch(() => game)
    : game;
  const participant = participantFromMatch(fullGame, profile);
  const stats = participant?.stats || participant;
  const timeline = participant?.timeline || {};
  if (!stats) return null;

  const championId = participant?.championId || stats.championId;
  const gameDuration = fullGame.gameDuration || game.gameDuration || stats.timePlayed || 1800;
  const objectives = (stats.turretKills || 0) +
    (stats.inhibitorKills || 0) +
    (stats.dragonKills || 0) +
    (stats.baronKills || 0) +
    (stats.objectivesStolen || 0);

  const gameMode = fullGame.gameMode || game.gameMode || "";
  const queue = fullGame.queueName || game.queueName || "Latest match";
  const queueId = fullGame.queueId || fullGame.queue?.id || game.queueId || game.queue?.id || 0;

  const kills = stats.kills || 0;
  const assists = stats.assists || 0;
  const allParticipants = fullGame?.participants || [];
  const teamId = participant?.teamId;
  const teamKills = teamId
    ? allParticipants
        .filter((p) => p.teamId === teamId)
        .reduce((sum, p) => sum + ((p.stats || p).kills || 0), 0)
    : 0;
  const kp = teamKills > 0 ? Math.min(100, Math.round((kills + assists) / teamKills * 100)) : 0;

  return {
    champion: championNameById(championSummary, championId) || participant?.championName || "",
    role: normalizeRole(timeline.lane === "BOTTOM" && timeline.role === "DUO_SUPPORT" ? "support" : timeline.lane),
    gameMode,
    queue,
    queueId,
    queueType: classifyQueue({ queueId, queue, gameMode }),
    stats: {
      kills,
      deaths: stats.deaths || 0,
      assists,
      cs: (stats.totalMinionsKilled || 0) + (stats.neutralMinionsKilled || 0),
      minutes: Math.max(1, Math.round(gameDuration / 60)),
      kp,
      vision: stats.visionScore || 0,
      controlWards: stats.visionWardsBoughtInGame || stats.detectorWardsPlaced || 0,
      objectives,
    },
    source: "Latest match",
  };
}

async function getGameContext() {
  const lockfile = readLockfile();
  const [summoner, region, gameflow, gameflowSession, lobby, champSelect, championSummary] = await Promise.all([
    lcuRequest(lockfile, "/lol-summoner/v1/current-summoner"),
    lcuRequest(lockfile, "/riotclient/region-locale").catch(() => null),
    lcuRequest(lockfile, "/lol-gameflow/v1/gameflow-phase").catch(() => null),
    lcuRequest(lockfile, "/lol-gameflow/v1/session").catch(() => null),
    lcuRequest(lockfile, "/lol-lobby/v2/lobby").catch(() => null),
    lcuRequest(lockfile, "/lol-champ-select/v1/session").catch(() => null),
    lcuRequest(lockfile, "/lol-game-data/assets/v1/champion-summary.json").catch(() => []),
  ]);

  const profile = {
    displayName: summoner.displayName || summoner.gameName || "Onbekend",
    gameName: summoner.gameName || "",
    tagLine: summoner.tagLine || "",
    summonerLevel: summoner.summonerLevel,
    profileIconId: summoner.profileIconId,
    puuid: summoner.puuid,
    summonerId: summoner.summonerId,
    region: region?.region || region?.webRegion || "Onbekend",
    locale: region?.locale || app.getLocale() || "Onbekend",
    gameflow: gameflow || "Menus",
  };

  const localCellId = champSelect?.localPlayerCellId;
  const localPick = champSelect?.myTeam?.find((item) => item.cellId === localCellId);
  const champSelectChampionId = localPick?.championId || localPick?.championPickIntent;
  const champSelectQueueId = lobby?.gameConfig?.queueId || gameflowSession?.gameData?.queue?.id || gameflowSession?.gameData?.queue?.queueId || 0;
  const champSelectGameMode = gameflowSession?.gameData?.gameMode || lobby?.gameConfig?.gameMode || "";
  const champSelectQueue = lobby?.gameConfig?.queueName || gameflowSession?.gameData?.queue?.description || "";
  const champSelectContext = champSelect ? {
    champion: championNameById(championSummary, champSelectChampionId),
    role: normalizeRole(localPick?.assignedPosition),
    gameMode: champSelectGameMode,
    queue: champSelectQueue,
    queueId: champSelectQueueId,
    queueType: classifyQueue({ queueId: champSelectQueueId, queue: champSelectQueue, gameMode: champSelectGameMode }),
    source: "Champ select",
  } : null;

  const liveContext = await getLiveGameContext(profile);
  const latestMatchContext = liveContext ? null : await getLatestMatchContext(lockfile, profile, championSummary);
  const fallbackQueueId = lobby?.gameConfig?.queueId || gameflowSession?.gameData?.queue?.id || gameflowSession?.gameData?.queue?.queueId || 0;
  const fallbackGameMode = gameflowSession?.gameData?.gameMode || lobby?.gameConfig?.gameMode || "";
  const fallbackQueue = lobby?.gameConfig?.queueName || gameflowSession?.gameData?.queue?.description || "";
  const game = liveContext || champSelectContext || {
    champion: "",
    role: normalizeRole(lobby?.localMember?.firstPositionPreference || lobby?.localMember?.secondPositionPreference),
    gameMode: fallbackGameMode,
    queue: fallbackQueue,
    queueId: fallbackQueueId,
    queueType: classifyQueue({ queueId: fallbackQueueId, queue: fallbackQueue, gameMode: fallbackGameMode }),
    source: gameflow || "League Client",
  };

  return { profile, game: latestMatchContext || game };
}

const gotTheLock = app.requestSingleInstanceLock();
if (!gotTheLock) {
  app.quit();
} else {
  app.on("second-instance", () => {
    if (mainWindow && !mainWindow.isDestroyed()) {
      if (mainWindow.isMinimized()) mainWindow.restore();
      mainWindow.focus();
    }
  });
}

app.whenReady().then(() => {
  const updatesConfigured = setupAutoUpdater();
  ipcMain.handle("league:get-profile", getLeagueProfile);
  ipcMain.handle("league:get-context", getGameContext);
  ipcMain.handle("league:get-latest-patch", getLatestLeaguePatch);
  ipcMain.handle("open:url", (_event, url) => shell.openExternal(url));
  ipcMain.handle("update:check", async () => {
    if (!updatesConfigured) {
      return { state: "not-configured", message: "Update channel not configured yet. Set GitHub owner/repo before release." };
    }
    if (!app.isPackaged) {
      return { state: "dev", message: "Updates work in the packaged app." };
    }
    autoUpdater.checkForUpdatesAndNotify();
    return { state: "checking", message: "Checking for updates..." };
  });
  ipcMain.handle("update:restart", () => {
    autoUpdater.quitAndInstall(false, true);
  });
  ipcMain.handle("overlay:show", (_event, x, y) => {
    if (!overlayWindow || overlayWindow.isDestroyed()) createOverlayWindow();
    if (x !== undefined && y !== undefined) overlayWindow.setPosition(x, y);
    overlayWindow.show();
  });
  ipcMain.handle("overlay:hide", () => {
    if (overlayWindow && !overlayWindow.isDestroyed()) overlayWindow.hide();
  });
  ipcMain.handle("overlay:push", (_event, data) => {
    sendOverlayData(data);
  });
  createWindow();
  createOverlayWindow();
  if (app.isPackaged && updatesConfigured) {
    setTimeout(() => autoUpdater.checkForUpdatesAndNotify(), 4500);
  }

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

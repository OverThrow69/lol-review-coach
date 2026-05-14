const form = document.querySelector("#reviewForm");
const resetBtn = document.querySelector("#resetBtn");
const profileBtn = document.querySelector("#profileBtn");
const saveReviewBtn = document.querySelector("#saveReviewBtn");
const clearHistoryBtn = document.querySelector("#clearHistoryBtn");
const updateBtn = document.querySelector("#updateBtn");
const restartUpdateBtn = document.querySelector("#restartUpdateBtn");
const languageSelect = document.querySelector("#languageSelect");
const saveState = document.querySelector("#saveState");

let currentLang = localStorage.getItem("lolReviewCoach:language") || "af";

const i18n = {
  af: {
    checkUpdates: "Check Updates",
    connectProfile: "Connect Profile",
    todayPlan: "Vandag se speelplan",
    mainHabit: "Main habit",
    inGameRule: "In-game rule",
    sessionNote: "Session note",
    activeProfile: "Aktiewe profiel",
    notConnected: "Nie gekoppel nie",
    connectHint: "Maak League Client oop en druk Connect Profile.",
    autoDetectDisconnected: "Auto detect nie gekoppel nie",
    waitingLeague: "Wag vir League Client",
    detectHint: "Maak League oop. Champion/role word gevul in lobby, champ select of in-game.",
    releaseReady: "Release channel ready",
    releaseHint: "Wanneer jy builds op GitHub Releases publish, kan testers updates van hier af kry.",
    recordingTitle: "Recording live match",
    recordingBadge: "Recording",
    finishedTitle: "Match finished",
    readyBadge: "Review ready",
    waitingMatch: "Waiting for match",
    idle: "Idle",
    recordingSummary: "Ek record jou game stil in die agtergrond. Wanneer die match eindig, maak ek die review outomaties.",
    waitingSummary: "Die review sal outomaties verskyn wanneer jou match eindig.",
    reviewSaved: "Review gestoor",
    autoSaved: "Outomaties gestoor",
    saving: "Stoor...",
    noReviews: "Nog geen saved reviews nie",
    noReviewsHint: "Save een na elke game sodat die app jou patterns kan wys.",
    updateReady: "Update ready",
    updateStatus: "Update status",
    noUpdateMessage: "No update message.",
    desktopOnly: "Updates only work in the desktop app.",
    updatesNotConfigured: "Update channel not configured yet. Set GitHub owner/repo before release.",
    ignoredAramTitle: "ARAM ignored",
    ignoredAramMeta: "ARAM word nie vir reviews gestoor nie, want dit is nie 'n goeie Summoner's Rift improvement sample nie.",
    ignoredAramSummary: "ARAM detected. Ek record of save nie hierdie match nie.",
    ranked: "Ranked",
    normal: "Normal",
    aram: "ARAM",
    unknownQueue: "Unknown queue",
    mistakesHeading: "Waar jy verkeerd gegaan het",
    improveHeading: "Waar om te verbeter",
    positivesHeading: "Wat jy reg gedoen het",
    nextFocus: "Volgende game fokus",
    trainingPlan: "Training plan",
    reviewHistory: "Review history",
    tabMistakes: "Foute",
    tabImprove: "Verbeter",
    tabStrengths: "Sterkpunte",
    tabFocus: "Fokus",
    tabTraining: "Training",
    tabProHabits: "Pro Habits",
    tabHistory: "History",
    tabLeagueUpdates: "League Updates",
    leagueUpdatesHeading: "League updates",
    refreshPatch: "Refresh",
    proHabitsHeading: "Pro habits",
    logout: "Teken uit",
  },
  en: {
    checkUpdates: "Check Updates",
    connectProfile: "Connect Profile",
    todayPlan: "Today's Game Plan",
    mainHabit: "Main habit",
    inGameRule: "In-game rule",
    sessionNote: "Session note",
    activeProfile: "Active profile",
    notConnected: "Not connected",
    connectHint: "Open League Client and press Connect Profile.",
    autoDetectDisconnected: "Auto detect is not connected",
    waitingLeague: "Waiting for League Client",
    detectHint: "Open League. Champion/role will fill from lobby, champ select, or in-game.",
    releaseReady: "Release channel ready",
    releaseHint: "When you publish builds on GitHub Releases, testers can get updates here.",
    recordingTitle: "Recording live match",
    recordingBadge: "Recording",
    finishedTitle: "Match finished",
    readyBadge: "Review ready",
    waitingMatch: "Waiting for match",
    idle: "Idle",
    recordingSummary: "I am recording your game in the background. When the match ends, I will build the review automatically.",
    waitingSummary: "The review will appear automatically when your match ends.",
    reviewSaved: "Review saved",
    autoSaved: "Auto-saved",
    saving: "Saving...",
    noReviews: "No saved reviews yet",
    noReviewsHint: "Save one after each game so the app can show your patterns.",
    updateReady: "Update ready",
    updateStatus: "Update status",
    noUpdateMessage: "No update message.",
    desktopOnly: "Updates only work in the desktop app.",
    updatesNotConfigured: "Update channel not configured yet. Set GitHub owner/repo before release.",
    ignoredAramTitle: "ARAM ignored",
    ignoredAramMeta: "ARAM is not saved for reviews because it is not a good Summoner's Rift improvement sample.",
    ignoredAramSummary: "ARAM detected. I will not record or save this match.",
    ranked: "Ranked",
    normal: "Normal",
    aram: "ARAM",
    unknownQueue: "Unknown queue",
    mistakesHeading: "Where you went wrong",
    improveHeading: "Where to improve",
    positivesHeading: "What you did well",
    nextFocus: "Next game focus",
    trainingPlan: "Training plan",
    reviewHistory: "Review history",
    tabMistakes: "Mistakes",
    tabImprove: "Improve",
    tabStrengths: "Strengths",
    tabFocus: "Focus",
    tabTraining: "Training",
    tabProHabits: "Pro Habits",
    tabHistory: "History",
    tabLeagueUpdates: "League Updates",
    leagueUpdatesHeading: "League updates",
    refreshPatch: "Refresh",
    proHabitsHeading: "Pro habits",
    logout: "Sign out",
  },
};

let latestLeaguePatch = null;

function t(key) {
  return i18n[currentLang]?.[key] || i18n.af[key] || key;
}

function applyLanguage() {
  document.documentElement.lang = currentLang;
  languageSelect.value = currentLang;
  updateBtn.textContent = t("checkUpdates");
  profileBtn.textContent = t("connectProfile");
  document.querySelectorAll("[data-i18n]").forEach((node) => {
    node.textContent = t(node.dataset.i18n);
  });
  if (!activeProfile) {
    outputs.profileName.textContent = t("notConnected");
    outputs.profileMeta.textContent = t("connectHint");
  }
  outputs.updateTitle.textContent = t("releaseReady");
  outputs.updateMeta.textContent = t("releaseHint");
  renderChangelog();
}

const outputs = {
  grade: document.querySelector("#grade"),
  score: document.querySelector("#score"),
  scoreRing: document.querySelector("#scoreRing"),
  metrics: document.querySelector("#metrics"),
  mistakes: document.querySelector("#mistakes"),
  improvements: document.querySelector("#improvements"),
  positives: document.querySelector("#positives"),
  focusList: document.querySelector("#focusList"),
  profileStrip: document.querySelector("#profileStrip"),
  profileIcon: document.querySelector("#profileIcon"),
  profileName: document.querySelector("#profileName"),
  profileMeta: document.querySelector("#profileMeta"),
  detectStrip: document.querySelector("#detectStrip"),
  detectTitle: document.querySelector("#detectTitle"),
  detectMeta: document.querySelector("#detectMeta"),
  updateTitle: document.querySelector("#updateTitle"),
  updateMeta: document.querySelector("#updateMeta"),
  liveMonitor: document.querySelector("#liveMonitor"),
  liveTitle: document.querySelector("#liveTitle"),
  liveBadge: document.querySelector("#liveBadge"),
  liveKda: document.querySelector("#liveKda"),
  liveFarm: document.querySelector("#liveFarm"),
  liveTime: document.querySelector("#liveTime"),
  liveSnapshots: document.querySelector("#liveSnapshots"),
  postGameSummary: document.querySelector("#postGameSummary"),
  trainingPlan: document.querySelector("#trainingPlan"),
  proHabits: document.querySelector("#proHabits"),
  primaryHabit: document.querySelector("#primaryHabit"),
  preGameRule: document.querySelector("#preGameRule"),
  sessionStatus: document.querySelector("#sessionStatus"),
  sessionPlan: document.querySelector("#sessionPlan"),
  reviewHistory: document.querySelector("#reviewHistory"),
  changelogList: document.querySelector("#changelogList"),
};
const refreshLeaguePatchBtn = document.querySelector("#refreshLeaguePatchBtn");

let activeProfile = null;
window.contextTimer = null;
let liveSession = {
  active: false,
  saved: false,
  snapshots: [],
  lastGame: null,
};

const roleTargets = {
  unknown: { cs: 6.2, vision: 0.9, kp: 48, wards: 2 },
  top: { cs: 6.8, vision: 0.85, kp: 42, wards: 2 },
  jungle: { cs: 5.5, vision: 1.05, kp: 58, wards: 3 },
  mid: { cs: 7.0, vision: 0.9, kp: 50, wards: 2 },
  adc: { cs: 7.4, vision: 0.72, kp: 48, wards: 1 },
  support: { cs: 1.2, vision: 1.75, kp: 58, wards: 4 },
};

const tagFeedback = {
  earlyDeath: {
    mistake: ["Vroee dood", "Jy het waarskynlik lane tempo of jungle threat onderskat voor level 6."],
    improve: ["Eerste 4 minute", "Track waar die enemy jungler begin en speel die eerste wave met 'n exit-plan."],
  },
  badRecall: {
    mistake: ["Recall timing", "'n Slegte recall gee plates, wave control of objective tempo weg."],
    improve: ["Recall vensters", "Recall na jy die wave crash, of wanneer jou jungler dieselfde kant tempo het."],
  },
  missedObjective: {
    mistake: ["Objective venster gemis", "Jou span het waarskynlik nie vroeg genoeg vision, reset of lane priority gehad nie."],
    improve: ["90-sekonde voorbereiding", "Begin vision en recalls 90 sekondes voor dragon, grubs, herald of baron."],
  },
  overextended: {
    mistake: ["Te ver sonder inligting", "Jy het waarskynlik geveg of gepush toe belangrike enemies van die map af was."],
    improve: ["Map check ritme", "Kyk elke paar sekondes map toe voordat jy nog een wave, plate of camp vat."],
  },
  goodRoam: {
    positive: ["Goeie roam", "Jy het jou lane pressure in 'n groter map voordeel verander."],
  },
  wonLane: {
    positive: ["Lane gewen", "Jy het jou matchup goed genoeg gespeel om 'n individuele voordeel te bou."],
  },
  goodWaveCrash: {
    positive: ["Goeie wave crash", "Jy het tempo geskep deur die wave eers in te druk voordat jy reset of roam."],
  },
  badObjectiveSetup: {
    mistake: ["Objective setup was laat", "Die fight het waarskynlik begin voordat jou span vision, lane priority of reset tempo gehad het."],
    improve: ["Objective setup", "Begin 90 sekondes voor spawn: push naaste wave, reset, koop control ward, beweeg eerste river toe."],
  },
  goodPeel: {
    positive: ["Goeie peel", "Jy het waarskynlik jou carry of backline beskerm in plaas daarvan om net kills te jaag."],
  },
};

function numberValue(id) {
  return Math.max(0, Number(document.querySelector(`#${id}`).value) || 0);
}

function valueOf(id) {
  return document.querySelector(`#${id}`).value;
}

function getFormData() {
  const tags = [...document.querySelectorAll("input[name='tags']:checked")].map((item) => item.value);

  return {
    profile: activeProfile,
    champion: document.querySelector("#champion").value.trim() || "Detecting champion",
    role: document.querySelector("#role").value || "unknown",
    gameMode: document.querySelector("#gameMode").value.trim(),
    detectSource: document.querySelector("#detectSource").value.trim(),
    kills: numberValue("kills"),
    deaths: numberValue("deaths"),
    assists: numberValue("assists"),
    cs: numberValue("cs"),
    minutes: Math.max(1, numberValue("minutes")),
    kp: Math.min(100, numberValue("kp")),
    vision: numberValue("vision"),
    controlWards: numberValue("controlWards"),
    objectives: numberValue("objectives"),
    goldState: valueOf("goldState"),
    laneState: valueOf("laneState"),
    killQuality: valueOf("killQuality"),
    farmPattern: valueOf("farmPattern"),
    routePattern: valueOf("routePattern"),
    deathPattern: valueOf("deathPattern"),
    teamfightPattern: valueOf("teamfightPattern"),
    leadUse: valueOf("leadUse"),
    trainingFocus: valueOf("trainingFocus"),
    skillLevel: valueOf("skillLevel"),
    gamesToday: Math.max(1, numberValue("gamesToday")),
    startTime: document.querySelector("#startTime").value || "17:00",
    reviewDepth: valueOf("reviewDepth"),
    mindset: valueOf("mindset"),
    notes: document.querySelector("#notes").value.trim(),
    tags,
  };
}

function setNumber(id, value) {
  const input = document.querySelector(`#${id}`);
  if (!input || value === undefined || value === null || Number.isNaN(Number(value))) return;
  input.value = Math.max(0, Math.round(Number(value)));
}

function setValue(id, value) {
  const input = document.querySelector(`#${id}`);
  if (!input || value === undefined || value === null || value === "") return;
  input.value = value;
}

function inferReviewFields() {
  const data = getFormData();
  const target = roleTargets[data.role] || roleTargets.unknown;
  const kda = (data.kills + data.assists) / Math.max(1, data.deaths);
  const csPerMin = data.cs / Math.max(1, data.minutes);
  const visionPerMin = data.vision / Math.max(1, data.minutes);
  const aheadByKda = kda >= 3.2 && data.deaths <= 4;
  const behindByDeaths = data.deaths >= 7 || kda < 1.4;

  setValue("goldState", aheadByKda ? "ahead" : behindByDeaths ? "behind" : "even");
  setValue("laneState", csPerMin >= target.cs * 0.95 && data.deaths <= 4 ? "won" : csPerMin < target.cs * 0.72 || data.deaths >= 7 ? "lost" : "stable");
  setValue("killQuality", data.kills >= 8 && data.objectives <= 1 ? "noConversion" : data.kills >= 6 && data.deaths <= 4 ? "useful" : data.kills <= 2 && data.assists >= 8 ? "shutdowns" : "useful");
  setValue("farmPattern", csPerMin < target.cs * 0.72 ? "missedFreeWaves" : data.minutes >= 24 && csPerMin < target.cs * 0.85 ? "stoppedMidGame" : csPerMin > target.cs * 1.12 && data.kp < target.kp * 0.75 ? "overfarmed" : "steady");
  setValue("routePattern", data.objectives <= 1 && data.minutes >= 24 ? "lateObjective" : data.kp < target.kp * 0.75 ? "wrongSide" : "clean");
  setValue("deathPattern", data.deaths >= 7 && visionPerMin < target.vision * 0.75 ? "noVision" : data.deaths >= 7 && data.kills >= 5 ? "greed" : data.deaths >= 7 ? "badFight" : "normal");
  setValue("teamfightPattern", data.kp < target.kp * 0.7 ? "splitTooMuch" : data.deaths >= 7 ? "tooEarly" : "useful");
  setValue("leadUse", aheadByKda && data.objectives >= 3 ? "converted" : aheadByKda && data.objectives <= 1 ? "passive" : behindByDeaths && data.deaths <= 5 ? "survivedBehind" : behindByDeaths ? "forcedBehind" : "converted");
  setValue("trainingFocus", "auto");
  document.querySelector("#notes").value = [
    `Auto review: ${data.champion} ${data.role}.`,
    `KDA ${data.kills}/${data.deaths}/${data.assists}, CS/min ${csPerMin.toFixed(1)}, vision/min ${visionPerMin.toFixed(1)}.`,
    aheadByKda ? "Detected: likely ahead." : behindByDeaths ? "Detected: likely behind." : "Detected: likely even.",
  ].join(" ");
}

function profileStorageId() {
  return window.firebaseAuth?.currentUser?.uid || activeProfile?.puuid || "guest";
}

function stateKey() {
  return `lolReviewCoach:${profileStorageId()}:state`;
}

function historyKey() {
  return `lolReviewCoach:${profileStorageId()}:history`;
}

function gradeFromScore(score) {
  if (score >= 90) return "S";
  if (score >= 82) return "A";
  if (score >= 70) return "B";
  if (score >= 58) return "C";
  if (score >= 46) return "D";
  return "E";
}

function analyse(data) {
  const target = roleTargets[data.role] || roleTargets.unknown;
  const roleName = data.role === "unknown" ? "jou role" : data.role;
  const kda = (data.kills + data.assists) / Math.max(1, data.deaths);
  const csPerMin = data.cs / data.minutes;
  const visionPerMin = data.vision / data.minutes;
  const deathsPerTen = data.deaths / data.minutes * 10;

  const mistakes = [];
  const improvements = [];
  const positives = [];
  let score = 50;

  score += Math.min(18, kda * 5);
  score += Math.min(16, csPerMin / target.cs * 14);
  score += Math.min(14, visionPerMin / target.vision * 12);
  score += Math.min(12, data.kp / target.kp * 10);
  score += Math.min(10, data.objectives * 2.5);
  score += Math.min(6, data.controlWards / Math.max(1, target.wards) * 4);
  score -= Math.max(0, deathsPerTen - 1.4) * 10;

  if (data.deaths >= 8 || deathsPerTen > 2.2) {
    mistakes.push(["Te veel deaths", `Jy het ${data.deaths} keer gesterf. Dit steel tempo, farm en objective druk van jou span.`]);
    improvements.push(["Death review", "Kyk elke death terug en merk: was dit vision, wave state, cooldowns, of greed? Los eers die grootste patroon op."]);
  } else if (data.deaths <= 3) {
    positives.push(["Goeie oorlewing", "Jy het min shutdowns weggegee en waarskynlik jou tempo stabiel gehou."]);
  }

  if (csPerMin < target.cs * 0.78 && data.role !== "support") {
    mistakes.push(["Farm het weggeval", `${csPerMin.toFixed(1)} CS/min is onder 'n sterk ${roleName}-teiken.`]);
    improvements.push(["CS plan", "Vir die volgende game: tel jou CS op 10 minute, 15 minute en 20 minute. Mik eers vir konsekwentheid, nie perfeksie nie."]);
  } else if (csPerMin >= target.cs && data.role !== "support") {
    positives.push(["Sterk farm", `${csPerMin.toFixed(1)} CS/min beteken jy het goud goed bly insamel.`]);
  }

  if (visionPerMin < target.vision * 0.72) {
    mistakes.push(["Lae vision", `Jou vision was ${visionPerMin.toFixed(1)} per minuut. Jy het moontlik fights geneem sonder genoeg inligting.`]);
    improvements.push(["Vision roete", "Plaas wards op jou volgende objective-kant voordat jy push of rotate. Vision voor aksie, nie na paniek nie."]);
  } else if (visionPerMin >= target.vision) {
    positives.push(["Goeie map inligting", "Jou vision score pas goed by jou role en help jou span besluite neem."]);
  }

  if (data.kp < target.kp * 0.78) {
    mistakes.push(["Lae kill deelname", `${data.kp}% KP wys jy was moontlik laat by fights of vas in side lane sonder payoff.`]);
    improvements.push(["Tempo na skermutselings", "Na wave crash of camp clear, kyk dadelik of jy eerste kan beweeg na mid, river of objective."]);
  } else if (data.kp >= target.kp) {
    positives.push(["Betrokke by fights", `${data.kp}% KP wys jy was deel van baie belangrike aksies.`]);
  }

  if (data.objectives <= 1 && data.minutes >= 24) {
    mistakes.push(["Min objective impak", "Jy was min betrokke by towers, dragons, grubs, herald of baron setup." ]);
    improvements.push(["Objective timer", "Maak jou plan rondom die volgende spawn: push lane, reset, koop wards, beweeg eerste."]);
  } else if (data.objectives >= 4) {
    positives.push(["Sterk objective deelname", "Jy het jou voordeel in map progress omskep, nie net kills gejaag nie."]);
  }

  if (data.goldState === "ahead") {
    if (data.leadUse === "converted" || data.objectives >= 4) {
      positives.push(["Lead gebruik", "Jy het jou voordeel in towers, objectives of map control verander. Dis hoe jy games toemaak."]);
    }
    if (data.leadUse === "threw" || data.deathPattern === "greed" || data.killQuality === "chased") {
      mistakes.push(["Voor maar te riskant", "Toe jy voor was, het jy waarskynlik extra kills of waves gejaag in plaas van die game veilig toe te maak."]);
      improvements.push(["Wanneer jy voor is", "Gebruik jou lead om vision diep te sit, waves te druk en objectives te force wanneer enemies moet antwoord. Moenie 50/50 fights vat nie."]);
      score -= 8;
    }
    if (data.leadUse === "passive") {
      mistakes.push(["Voor maar te min druk", "Jy was voor, maar die map het waarskynlik nie genoeg verander nie. 'n Lead moet ruimte steel."]);
      improvements.push(["Lead na druk", "Na elke kill of goeie trade: vra wat jy vat next - plate, tower, dragon, jungle camp, vision of roam."]);
    }
  }

  if (data.goldState === "behind") {
    if (data.leadUse === "survivedBehind" || data.deaths <= 4) {
      positives.push(["Goed gespeel van agter", "Jy het die game waarskynlik lank genoeg stabiel gehou om comeback kanse oop te hou."]);
    }
    if (data.leadUse === "forcedBehind" || data.killQuality === "chased") {
      mistakes.push(["Agter maar steeds geforce", "Wanneer jy agter is, is random fights gewoonlik hoe die game vinnig wegbreek."]);
      improvements.push(["Wanneer jy agter is", "Speel vir free farm, shutdown picks met numbers advantage, vision traps en waves onder tower. Vermy fair fights."]);
      score -= 8;
    }
  }

  if (data.laneState === "lost") {
    mistakes.push(["Lane verloor", "Die vroee game het jou tempo en farm waarskynlik seergemaak. Kyk spesifiek na level 1-6 trades en wave states."]);
    improvements.push(["Lane recovery", "As jy lane verloor: freeze nader aan jou tower, vra vir cover op crash, en gee plate op as die alternatief 'n death is."]);
  } else if (data.laneState === "won") {
    positives.push(["Lane pressure", "Jy het genoeg druk gebou om eerste te beweeg of die enemy onder tower te hou."]);
  } else if (data.laneState === "ignoredWave") {
    mistakes.push(["Wave beheer verloor", "Roams, recalls of fights het waarskynlik gebeur sonder dat die wave eers reg was."]);
    improvements.push(["Wave voor play", "Crash die wave voor roam/recall. As jy nie kan crash nie, ping dat jy nie eerste kan beweeg nie."]);
  }

  if (data.killQuality === "chased") {
    mistakes.push(["Kills gejaag", "Kills is net goed as dit lei na tempo, objectives, towers of shutdown gold. Chase kills maak dikwels waves sleg."]);
    improvements.push(["Kill conversion", "Na 'n kill: stop vir 2 sekondes en kies die beste conversion - wave crash, plate, dragon, herald, baron, reset of invade."]);
  } else if (data.killQuality === "shutdowns") {
    positives.push(["Shutdown waarde", "Jy het belangrike goud teruggekry. Dit is groot as jy agter was of die enemy carry gestop het."]);
  } else if (data.killQuality === "noConversion") {
    mistakes.push(["Kills nie gebruik nie", "Jy het waarskynlik kills gekry, maar nie genoeg map waarde daarna geneem nie."]);
    improvements.push(["Na-kill roetine", "Elke kill moet 'n volgende aksie he: shove, reset, ward, objective, tower, invade of roam."]);
  }

  if (data.farmPattern === "missedFreeWaves") {
    mistakes.push(["Free waves gemis", "Jy het waarskynlik goud op die map gelos terwyl jy rondgestaan, gejaag of te lank gegroep het."]);
    improvements.push(["Free gold", "Elke keer as niks spawn nie, kyk side waves eerste. Free wave onder tower is amper altyd beter as rondloop."]);
  } else if (data.farmPattern === "stoppedMidGame") {
    mistakes.push(["Mid game farm drop", "Jou CS het waarskynlik na lane fase geval omdat jy te lank mid gegroep het."]);
    improvements.push(["Mid game route", "Catch side wave, beweeg deur vision, groepeer dan. Moenie net mid ARAM as daar free side farm is nie."]);
  } else if (data.farmPattern === "overfarmed") {
    mistakes.push(["Te lank gefarm", "Jy het dalk veilig goud gekry, maar objective windows of teamfights gemis."]);
    improvements.push(["Farm met timer", "Farm tot die volgende objective timer jou nodig het. By 60-90 sekondes moet jy al begin beweeg."]);
  } else if (data.farmPattern === "steady") {
    positives.push(["Konsekwente farming", "Jy het jou goudvloei stabiel gehou, wat jou items en scaling betroubaar maak."]);
  }

  if (data.routePattern === "lateObjective") {
    mistakes.push(["Laat by objectives", "Jy het waarskynlik eers beweeg toe die objective reeds begin of river reeds verloor was."]);
    improvements.push(["Route na objective", "Reset op 75-90 sekondes, loop deur veilige vision, en wees eerste in river met jou span."]);
  } else if (data.routePattern === "wrongSide") {
    mistakes.push(["Verkeerde kant van map", "Jy was moontlik top toe dragon belangrik was, of bot toe baron setup nodig was."]);
    improvements.push(["Map side plan", "Speel die kant waar die volgende objective of sterkste carry is. Side lane is goed net as jy pressure betyds omsit."]);
  } else if (data.routePattern === "randomRoams") {
    mistakes.push(["Roams sonder setup", "As jy roam sonder wave crash, verloor jy minions en gee jy enemy tempo terug."]);
    improvements.push(["Roam timing", "Roam na crash, na recall advantage, of wanneer enemy laner moet catch. Anders bly en fix wave."]);
  } else {
    positives.push(["Skoon routes", "Jou bewegings was waarskynlik gekoppel aan waves, resets en objective timers."]);
  }

  if (data.deathPattern === "greed") {
    mistakes.push(["Greed deaths", "Deaths vir een ekstra wave, plate of chase is duur omdat dit jou reset en objective tempo breek."]);
    improvements.push(["Exit rule", "Voor jy nog een wave vat: tel missing enemies en vra of jou flash/escape beskikbaar is."]);
  } else if (data.deathPattern === "noVision") {
    mistakes.push(["Deaths sonder vision", "Jy het waarskynlik donker areas betree of side lane gedruk sonder info."]);
    improvements.push(["Donker map rule", "As twee of meer enemies missing is, beweeg net met vision, teammate naby, of cooldowns gereed."]);
  } else if (data.deathPattern === "badFight") {
    mistakes.push(["Slegte fight ingang", "Die probleem was waarskynlik nie net die fight nie, maar wanneer en hoe jy ingestap het."]);
    improvements.push(["Fight ingang", "Wag vir belangrike cooldowns, kyk waar jou damage vandaan kom, en kies flank/front-to-back voor jy commit."]);
  }

  if (data.teamfightPattern === "tooEarly") {
    mistakes.push(["Te vroeg in fights", "Jy het moontlik engage of damage geneem voordat jou span kon follow."]);
    improvements.push(["Fight timing", "Tel jou span se afstand en cooldowns. Engage net as hulle binne follow-up range is."]);
  } else if (data.teamfightPattern === "tooLate") {
    mistakes.push(["Te laat in fights", "Jy het dalk gewag tot die fight klaar verloor was voordat jy damage of utility gegee het."]);
    improvements.push(["Vroeere posisie", "Staan voor die fight reeds op 'n plek waar jy damage kan doen sonder om eers deur chaos te loop."]);
  } else if (data.teamfightPattern === "wrongTarget") {
    mistakes.push(["Verkeerde target", "Jy het waarskynlik damage op 'n target gesit wat nie die fight sou wen nie."]);
    improvements.push(["Target plan", "Voor fight: kies of jou job backline dive, frontline shred, peel, of zone control is."]);
  } else if (data.teamfightPattern === "splitTooMuch") {
    mistakes.push(["Nie by fights nie", "Splitpush is net goed as dit towers vat of enemies trek. Anders verloor jou span 4v5."]);
    improvements.push(["Splitpush timer", "As TP/rotate nie moontlik is nie, push net wanneer jou span nie kan geforce word nie."]);
  } else {
    positives.push(["Teamfight waarde", "Jy het waarskynlik damage, peel, engage of presence gegee toe jou span dit nodig gehad het."]);
  }

  data.tags.forEach((tag) => {
    const feedback = tagFeedback[tag];
    if (!feedback) return;
    if (feedback.mistake) mistakes.push(feedback.mistake);
    if (feedback.improve) improvements.push(feedback.improve);
    if (feedback.positive) positives.push(feedback.positive);
  });

  const noteText = data.notes.toLowerCase();
  if (noteText.includes("tilt") || noteText.includes("angry") || noteText.includes("kwaad")) {
    mistakes.push(["Mental reset", "Jou notas wys tilt/frustrasie. Dit maak gewoonlik volgende besluite vinniger maar swakker."]);
    improvements.push(["Kort reset", "Na 'n slegte fight: haal asem, ping minder, vra net: wat is die volgende wave/objective?"]);
  }

  if (!mistakes.length) {
    mistakes.push(["Geen groot rooi vlag", "Op hierdie data lyk jou game stabiel. Die volgende stap is om een klein patroon per game te verbeter."]);
  }

  if (!improvements.length) {
    improvements.push(["Maak jou voordeel groter", "Kies een sterk punt en druk dit harder: lane lead na plates, roam, objective of vision control."]);
  }

  if (!positives.length) {
    positives.push(["Review mindset", "Jy het die game ontleed in plaas daarvan om net die uitslag te oordeel. Dit is reeds hoe jy beter word."]);
  }

  return {
    score: Math.max(1, Math.min(99, Math.round(score))),
    kda,
    csPerMin,
    visionPerMin,
    deathsPerTen,
    mistakes: mistakes.slice(0, 7),
    improvements: improvements.slice(0, 7),
    positives: positives.slice(0, 7),
  };
}

function renderList(element, items, type) {
  element.innerHTML = items
    .map(([title, body]) => `
      <article class="feedback-item ${type}">
        <strong>${title}</strong>
        <p>${body}</p>
      </article>
    `)
    .join("");
}

function renderMetrics(data, result) {
  const metricItems = [
    ["KDA", result.kda.toFixed(2)],
    ["CS/min", result.csPerMin.toFixed(1)],
    ["Vision/min", result.visionPerMin.toFixed(1)],
    ["Deaths/10", result.deathsPerTen.toFixed(1)],
    ["KP", `${data.kp}%`],
    ["Objectives", data.objectives],
  ];

  outputs.metrics.innerHTML = metricItems
    .map(([label, value]) => `
      <div class="metric">
        <span>${label}</span>
        <strong>${value}</strong>
      </div>
    `)
    .join("");
}

function renderFocus(result) {
  const focus = result.improvements.slice(0, 3).map((item) => item[0]);
  outputs.focusList.innerHTML = focus.map((item) => `<li>${item}</li>`).join("");
}

function chooseTrainingFocus(data, result) {
  const target = roleTargets[data.role] || roleTargets.unknown;
  const roleDefaultFocus = {
    top: "topWave",
    jungle: "jungleTempo",
    mid: "midTempo",
    adc: "adcPositioning",
    support: "supportVision",
    unknown: "laning",
  };

  if (data.trainingFocus !== "auto") return data.trainingFocus;
  if (data.goldState === "behind" || data.leadUse === "forcedBehind") return "playingBehind";
  if (data.goldState === "ahead" && (data.leadUse === "threw" || data.leadUse === "passive")) return "playingAhead";
  if (data.farmPattern !== "steady" || result.csPerMin < target.cs * 0.82) return "farm";
  if (data.routePattern !== "clean" || data.objectives <= 1) return "objectives";
  if (data.teamfightPattern !== "useful" || data.deathPattern === "badFight") return "teamfights";
  if (result.visionPerMin < target.vision * 0.8 || data.deathPattern === "noVision") return "vision";
  if (data.laneState !== "stable") return "laning";
  return roleDefaultFocus[data.role] || roleDefaultFocus.unknown;
}

function focusLabel(focus) {
  const labels = currentLang === "en"
    ? {
        topWave: "top wave control",
        jungleTempo: "jungle tempo",
        midTempo: "mid roam tempo",
        adcPositioning: "adc positioning",
        supportVision: "support vision control",
        jungleTracking: "enemy jungle tracking",
        laning: "laning",
        farm: "farming",
        objectives: "objectives",
        teamfights: "teamfights",
        playingAhead: "playing ahead",
        playingBehind: "playing behind",
        vision: "vision",
      }
    : {
        topWave: "top wave beheer",
        jungleTempo: "jungle tempo",
        midTempo: "mid roam tempo",
        adcPositioning: "adc posisionering",
        supportVision: "support vision beheer",
        jungleTracking: "enemy jungle tracking",
        laning: "laning",
        farm: "farming",
        objectives: "objectives",
        teamfights: "teamfights",
        playingAhead: "voor speel",
        playingBehind: "agter speel",
        vision: "vision",
      };

  return labels[focus] || focus.replace(/([A-Z])/g, " $1").toLowerCase();
}

function buildTrainingPlan(data, result) {
  const focus = chooseTrainingFocus(data, result);
  const target = roleTargets[data.role] || roleTargets.unknown;
  const levelTip = {
    bronze: "Hou dit eenvoudig: een habit per game, geen fancy plays nodig nie.",
    gold: "Meet die habit elke game en kyk of jou deaths/objectives verbeter.",
    emerald: "Voeg timers en wave state by jou besluit voordat jy beweeg.",
    master: "Soek klein tempo windows: reset timings, fog pressure en cross-map trades.",
  }[data.skillLevel];

  const plans = {
    laning: [
      ["Laning drill", "Vir die eerste 10 minute: trade net wanneer jou wave groter is, enemy key cooldown uit is, of enemy gaan last-hit."],
      ["Wave vraag", "Voor elke recall/roam: kan ek die wave crash? As nee, bly en fix eers die wave."],
      ["Review marker", "Kyk net na minute 1-6 terug en merk die eerste trade wat die lane moeilik gemaak het."],
    ],
    farm: [
      ["CS target", `Mik vir ${Math.max(5, target.cs - 0.5).toFixed(1)} CS/min vir ${data.gamesToday} games. Ignoreer random fights wat geen objective gee nie.`],
      ["Mid game route", "Na lane fase: catch side wave, beweeg deur vision, groepeer vir objective. Herhaal dit elke wave cycle."],
      ["Free wave rule", "As daar 'n wave onder jou tower inkom, vat dit voordat jy mid rondstaan."],
    ],
    jungleTracking: [
      ["First clear read", "By 1:30: vra waar enemy jungler begin het. By 3:15: ping waar hy waarskynlik eindig."],
      ["Gank timer", "Speel veilig wanneer jou wave gepush is en enemy jungler se kant onbekend is."],
      ["Review marker", "Elke death voor 8 minute: was enemy jungler se posisie bekend of geraai?"],
    ],
    topWave: [
      ["Top wave control", "Speel die eerste 4 waves vir wave state: slow push, crash, reset of freeze. Moenie fight as jou wave sleg is nie."],
      ["Side lane plan", "Na lane fase: druk side wave net tot waar jy vision het, dan beweeg na objective of trek pressure veilig."],
      ["TP / rotate check", "Voor jy split: kan jy betyds by dragon/baron fight wees, of vat jy tower as hulle fight?"],
    ],
    jungleTempo: [
      ["Clear to purpose", "Elke clear moet eindig met 'n rede: gank, invade, objective, countergank of reset. Moenie random rondloop nie."],
      ["Lane state read", "Gank lanes wat setup het: enemy gepush, teammate CC, of enemy flash down. Force minder low-chance ganks."],
      ["Objective setup", "45-90 sekondes voor objective: clear na daardie kant toe en sit vision voor die enemy daar is."],
    ],
    midTempo: [
      ["Mid priority", "Crash wave voor roam. As jy nie crash nie, verloor jy tempo en minions vir 'n coinflip roam."],
      ["Roam window", "Roam na cannon wave, enemy recall, of wanneer jou jungler dieselfde kant speel."],
      ["Fog pressure", "As jy nie kan roam nie, verdwyn kort uit vision sodat side lanes moet respekteer."],
    ],
    adcPositioning: [
      ["Damage without dying", "Voor fight: staan waar jy die naaste threat kan hit sonder om deur frontline/CC te loop."],
      ["Wave income", "Catch safe waves tot jou item spike. Moenie mid rondstaan as daar free bot/top wave onder tower is nie."],
      ["Threat tracking", "Hou enemy engage spell in jou kop. Jy mag eers vorentoe stap wanneer dit gemis of gebruik is."],
    ],
    supportVision: [
      ["Vision line", "Ward die kant waar jou span volgende wil speel, nie net die bush langs jou nie."],
      ["Roam timing", "Roam nadat bot wave crash of jou ADC veilig kan farm. Moenie jou ADC in 'n doomed wave los nie."],
      ["Peel or engage", "Voor fight: besluit of jou job engage, peel of vision denial is. Moenie half-half speel nie."],
    ],
    objectives: [
      ["90 sekonde rule", "By 90 sekondes voor dragon/baron: push wave, reset, koop control ward, beweeg eerste."],
      ["No late river", "Moenie eers river instap wanneer objective reeds spawn en vision verloor is nie. Trade cross-map as jy laat is."],
      ["Conversion", "Na elke kill: kies tower, objective, invade, deep ward of reset. Geen doelloose chase nie."],
    ],
    teamfights: [
      ["Job voor fight", "Voor fight begin, se jou job hardop: engage, peel, frontline damage, backline dive, of zone."],
      ["Cooldown check", "Commit eers wanneer jou belangrikste spell en escape beskikbaar is, of wanneer enemy key cooldown uit is."],
      ["Replay marker", "Kyk die eerste 3 sekondes van elke fight: was jou posisie reg voordat die fight begin het?"],
    ],
    playingAhead: [
      ["Lead conversion", "As jy voor is: druk wave, sit deep vision, vat jungle camp/objective. Geen 50/50 chase sonder payoff nie."],
      ["Shutdown protection", "As jy shutdown het, fight net met vision en teammate range. Jou death is die enemy se comeback."],
      ["Close plan", "Elke lead moet eindig in tower, dragon/baron, inhibitor druk, of enemy jungle control."],
    ],
    playingBehind: [
      ["Stabilize", "As jy agter is: farm onder tower, gee slegte waves op, en fight net met numbers advantage of shutdown setup."],
      ["No fair fights", "Moenie 1v1/2v2 vat as items agter is nie. Speel vir picks, traps en enemy mistakes."],
      ["Comeback income", "Soek free side waves en safe camps. Jou doel is item breakpoint, nie hero play nie."],
    ],
    vision: [
      ["Ward with purpose", "Ward die kant waar jy volgende wil speel, nie net waar jy nou staan nie."],
      ["Dark map rule", "As twee enemies missing is, push nie nog een wave sonder vision, escape spell of teammate naby nie."],
      ["Control ward habit", "Koop control ward voor objective setup, nie na die fight klaar begin het nie."],
    ],
  };

  return {
    focus,
    items: [
      [currentLang === "en" ? "Main focus" : "Hoof fokus", focusLabel(focus)],
      ...plans[focus],
      [currentLang === "en" ? "Level adjustment" : "Vlak aanpassing", levelTip],
    ],
  };
}

function renderTrainingPlan(data, result) {
  const plan = buildTrainingPlan(data, result);
  outputs.trainingPlan.innerHTML = plan.items
    .map(([title, body]) => `
      <article class="training-item">
        <strong>${title}</strong>
        <p>${body}</p>
      </article>
    `)
    .join("");
}

function buildProHabits(data, result) {
  const role = data.role || "unknown";
  const shared = currentLang === "en"
    ? [
        ["Tempo before kills", "Pros ask what the kill unlocks: wave crash, tower, objective, reset, invade, or vision. A kill with no conversion is just a clip."],
        ["Wave first", "Before roaming, recalling, or fighting, check the wave. Bad wave state turns good mechanics into bad decisions."],
        ["Play with timers", "Think 90 seconds ahead for dragon, baron, item spikes, summoners, ultimates, and recall windows."],
        ["Fog and information", "Pros win before the fight by controlling fog, denying vision, and forcing enemies to walk into bad zones."],
      ]
    : [
        ["Tempo voor kills", "Pros vra wat die kill oopmaak: wave crash, tower, objective, reset, invade of vision. 'n Kill sonder conversion is net 'n clip."],
        ["Wave eerste", "Voor roam, recall of fight: kyk eers die wave. Slegte wave state maak goeie mechanics in slegte besluite."],
        ["Speel met timers", "Dink 90 sekondes vooruit vir dragon, baron, item spikes, summoners, ultimates en recall windows."],
        ["Fog en inligting", "Pros wen voor die fight deur fog te beheer, vision te deny en enemies in slegte zones te force."],
      ];

  const roleRules = {
    top: currentLang === "en"
      ? [
          ["Pro top rule", "Your lane is wave management plus pressure. Crash/freeze properly, then decide if you are splitting, grouping, or holding TP pressure."],
          ["Side lane value", "A pro splitpush either takes tower, pulls two enemies, or arrives first to the objective. Anything else is overextension."],
        ]
      : [
          ["Pro top rule", "Jou lane is wave management plus pressure. Crash/freeze reg, dan besluit of jy split, group of TP pressure hou."],
          ["Side lane waarde", "'n Pro splitpush vat tower, trek twee enemies, of arrive eerste by objective. Enige iets anders is overextend."],
        ],
    jungle: currentLang === "en"
      ? [
          ["Pro jungle rule", "Every camp path must have a purpose: gank, cover, invade, objective, countergank, or reset. Random walking loses games."],
          ["Strong-side read", "Pros play around lane states, not feelings. Gank where waves, CC, flash timers, and objective side line up."],
        ]
      : [
          ["Pro jungle rule", "Elke camp path moet 'n doel he: gank, cover, invade, objective, countergank of reset. Random rondloop verloor games."],
          ["Strong-side read", "Pros speel rondom lane states, nie feelings nie. Gank waar waves, CC, flash timers en objective side saamwerk."],
        ],
    mid: currentLang === "en"
      ? [
          ["Pro mid rule", "Mid is tempo. Crash wave, move first, control fog, and make side lanes scared even when you do not roam."],
          ["Roam discipline", "A pro roam starts after wave control. If you roam on a bad wave, you donate gold and lose pressure."],
        ]
      : [
          ["Pro mid rule", "Mid is tempo. Crash wave, beweeg eerste, beheer fog, en maak side lanes bang selfs wanneer jy nie roam nie."],
          ["Roam discipline", "'n Pro roam begin na wave control. As jy op 'n slegte wave roam, donate jy gold en verloor pressure."],
        ],
    adc: currentLang === "en"
      ? [
          ["Pro ADC rule", "Your job is consistent DPS without dying. Hit what is safe, track engage cooldowns, and live through the first wave of threat."],
          ["Income discipline", "Pros do not ARAM mid while free side waves die. Catch safe waves until item spike, then group with purpose."],
        ]
      : [
          ["Pro ADC rule", "Jou job is konsekwente DPS sonder om te sterf. Hit wat veilig is, track engage cooldowns, en leef deur die eerste threat wave."],
          ["Income discipline", "Pros ARAM nie mid terwyl free side waves doodgaan nie. Catch safe waves tot item spike, dan group met doel."],
        ],
    support: currentLang === "en"
      ? [
          ["Pro support rule", "Support controls information. Ward where your team wants to play next and deny the enemy path before objective fights."],
          ["Roam discipline", "A pro roam protects tempo: roam after crash, after reset, or when ADC is safe. Do not abandon a doomed wave."],
        ]
      : [
          ["Pro support rule", "Support beheer inligting. Ward waar jou span volgende wil speel en deny enemy path voor objective fights."],
          ["Roam discipline", "'n Pro roam beskerm tempo: roam na crash, na reset, of wanneer ADC veilig is. Moenie 'n doomed wave los nie."],
        ],
    unknown: currentLang === "en"
      ? [["Role detection", "Once League exposes your role, this tab will switch to role-specific pro rules. For now, focus on wave, tempo, vision, and timers."]]
      : [["Role detection", "Sodra League jou role gee, switch hierdie tab na role-specific pro rules. Vir nou: fokus op wave, tempo, vision en timers."]],
  };

  const reviewRule = result.deathsPerTen > 2
    ? currentLang === "en"
      ? [["Death standard", "Pros treat every death as a review marker. Ask: did I die for wave, vision, cooldowns, spacing, or greed?"]]
      : [["Death standard", "Pros behandel elke death as 'n review marker. Vra: was dit wave, vision, cooldowns, spacing of greed?"]]
    : currentLang === "en"
      ? [["Keep the standard", "Low deaths means you can now push harder on tempo: earlier resets, stronger vision, and cleaner objective setup."]]
      : [["Hou die standaard", "Lae deaths beteken jy kan nou harder op tempo druk: vroeer resets, sterker vision en cleaner objective setup."]];

  return [...shared, ...(roleRules[role] || roleRules.unknown), ...reviewRule];
}

function renderProHabits(data, result) {
  outputs.proHabits.innerHTML = buildProHabits(data, result)
    .map(([title, body]) => `
      <article class="training-item">
        <strong>${title}</strong>
        <p>${body}</p>
      </article>
    `)
    .join("");
}

function sessionReviewMinutes(depth) {
  if (depth === "deep") return 10;
  if (depth === "normal") return 5;
  return 2;
}

function buildSessionPlan(data, result) {
  const focus = chooseTrainingFocus(data, result);
  const reviewMinutes = sessionReviewMinutes(data.reviewDepth);
  const label = focusLabel(focus);

  const mindsetRule = currentLang === "en"
    ? {
        calm: "Play calm: one clean decision beats one flashy outplay.",
        limit: "Limit test with purpose: after each mistake, name the rule you broke.",
        safe: "Play consistent: no coinflip fights without objective payoff.",
      }[data.mindset]
    : {
        calm: "Speel kalm: een skoon besluit klop een fancy outplay.",
        limit: "Limit test met doel: na elke fout, noem die reël wat jy gebreek het.",
        safe: "Speel konsekwent: geen coinflip fights sonder objective payoff nie.",
      }[data.mindset];

  const ruleByFocus = currentLang === "en"
    ? {
        laning: "Wave before roam or recall.",
        farm: "Catch free waves before random fights.",
        jungleTracking: "Track enemy jungler at 1:30 and 3:15.",
        topWave: "Control wave before trades and roams.",
        jungleTempo: "Clear toward a purpose, not random movement.",
        midTempo: "Crash mid wave before you roam.",
        adcPositioning: "Hit safely before chasing damage.",
        supportVision: "Set vision where your team plays next.",
        objectives: "Start objective setup 90 seconds early.",
        teamfights: "Choose your fight job before you walk in.",
        playingAhead: "Convert lead, protect shutdown.",
        playingBehind: "No fair fights when behind.",
        vision: "Ward where you want to play next.",
      }
    : {
        laning: "Wave voor roam of recall.",
        farm: "Vat free waves voor random fights.",
        jungleTracking: "Track enemy jungler by 1:30 en 3:15.",
        topWave: "Beheer wave voor trades en roams.",
        jungleTempo: "Clear met 'n doel, nie random beweging nie.",
        midTempo: "Crash mid wave voor jy roam.",
        adcPositioning: "Hit veilig voor jy skade jaag.",
        supportVision: "Sit vision waar jou span volgende speel.",
        objectives: "Begin objective setup 90 sekondes vroeg.",
        teamfights: "Kies jou fight-job voor jy instap.",
        playingAhead: "Verander lead, beskerm shutdown.",
        playingBehind: "Geen fair fights wanneer jy agter is nie.",
        vision: "Ward waar jy volgende wil speel.",
      };

  const steps = currentLang === "en"
    ? [
        `Before queue: read one rule only — ${ruleByFocus[focus]}`,
        `Game 1–${data.gamesToday}: focus on ${label}, not LP or teammates.`,
        `After each game: ${reviewMinutes} minute review, save it, then reset.`,
        mindsetRule,
      ]
    : [
        `Voor queue: lees slegs een reël — ${ruleByFocus[focus]}`,
        `Game 1–${data.gamesToday}: fokus op ${label}, nie LP of spanmaats nie.`,
        `Na elke game: ${reviewMinutes} minuut review, stoor dit, dan reset.`,
        mindsetRule,
      ];

  return {
    focus,
    focusLabel: label,
    rule: ruleByFocus[focus],
    status: currentLang === "en"
      ? `${data.gamesToday} games from ${data.startTime}`
      : `${data.gamesToday} games vanaf ${data.startTime}`,
    steps,
  };
}

function renderSessionPlan(data, result) {
  const plan = buildSessionPlan(data, result);
  outputs.primaryHabit.textContent = plan.focusLabel;
  outputs.preGameRule.textContent = plan.rule;
  outputs.sessionStatus.textContent = plan.status;
  outputs.sessionPlan.innerHTML = plan.steps.map((step) => `<li>${step}</li>`).join("");
}

function getHistory() {
  try {
    return JSON.parse(localStorage.getItem(historyKey()) || "[]");
  } catch {
    return [];
  }
}

function setHistory(items) {
  localStorage.setItem(historyKey(), JSON.stringify(items.slice(0, 20)));
}

function saveReview() {
  const data = getFormData();
  const result = analyse(data);
  const plan = buildSessionPlan(data, result);
  const entry = {
    date: new Date().toLocaleString(),
    champion: data.champion,
    role: data.role,
    score: result.score,
    grade: gradeFromScore(result.score),
    focus: plan.focusLabel,
    mistake: result.mistakes[0]?.[0] || "Geen groot rooi vlag",
    improve: result.improvements[0]?.[0] || "Volgende game fokus",
  };

  setHistory([entry, ...getHistory()]);
  renderHistory();
  saveState.textContent = t("reviewSaved");
  syncToFirestore();
  return entry;
}

function saveAutoReview() {
  const entry = saveReview();
  outputs.postGameSummary.textContent = currentLang === "en"
    ? `Post-game review ready: ${entry.grade} ${entry.score}. Main focus next game: ${entry.focus}.`
    : `Post-game review klaar: ${entry.grade} ${entry.score}. Main focus volgende game: ${entry.focus}.`;
  return entry;
}

function renderLiveMonitor(status = "idle") {
  const last = liveSession.snapshots.at(-1);
  outputs.liveMonitor.classList.toggle("recording", status === "recording");
  outputs.liveMonitor.classList.toggle("finished", status === "finished");

  if (status === "recording") {
    outputs.liveTitle.textContent = t("recordingTitle");
    outputs.liveBadge.textContent = t("recordingBadge");
  } else if (status === "finished") {
    outputs.liveTitle.textContent = t("finishedTitle");
    outputs.liveBadge.textContent = t("readyBadge");
  } else {
    outputs.liveTitle.textContent = t("waitingMatch");
    outputs.liveBadge.textContent = t("idle");
  }

  outputs.liveSnapshots.textContent = String(liveSession.snapshots.length);
  outputs.liveKda.textContent = last?.stats ? `${last.stats.kills}/${last.stats.deaths}/${last.stats.assists}` : "0/0/0";
  outputs.liveFarm.textContent = last?.stats ? `${last.stats.cs} CS` : "0 CS";
  outputs.liveTime.textContent = last?.stats ? `${last.stats.minutes} min` : "0 min";

  if (status === "recording") {
    outputs.postGameSummary.textContent = t("recordingSummary");
  } else if (status === "idle" && !liveSession.saved) {
    outputs.postGameSummary.textContent = t("waitingSummary");
  }
}

function queueTypeLabel(type) {
  if (type === "ranked") return t("ranked");
  if (type === "normal") return t("normal");
  if (type === "aram") return t("aram");
  return t("unknownQueue");
}

function recordLiveSnapshot(game) {
  if (!game?.stats || game.queueType === "aram") return;

  if (!liveSession.active) {
    liveSession = {
      active: true,
      saved: false,
      snapshots: [],
      lastGame: game,
    };
  }

  liveSession.lastGame = game;
  liveSession.snapshots.push({
    at: Date.now(),
    champion: game.champion,
    role: game.role,
    stats: { ...game.stats },
  });
  liveSession.snapshots = liveSession.snapshots.slice(-240);
  renderLiveMonitor("recording");
}

function finishLiveSession() {
  if (!liveSession.active || liveSession.saved || liveSession.snapshots.length === 0) {
    renderLiveMonitor(liveSession.saved ? "finished" : "idle");
    return;
  }

  liveSession.active = false;
  liveSession.saved = true;
  saveAutoReview();
  renderLiveMonitor("finished");
}

function ignoreAramGame(game) {
  liveSession = {
    active: false,
    saved: false,
    snapshots: [],
    lastGame: game,
  };
  renderLiveMonitor("idle");
  outputs.liveTitle.textContent = t("ignoredAramTitle");
  outputs.liveBadge.textContent = t("aram");
  outputs.postGameSummary.textContent = t("ignoredAramSummary");
}

function renderHistory() {
  const items = getHistory();
  if (!items.length) {
    outputs.reviewHistory.innerHTML = `
      <article class="history-item">
        <strong>${t("noReviews")}</strong>
        <span>${t("noReviewsHint")}</span>
      </article>
    `;
    return;
  }

  outputs.reviewHistory.innerHTML = items
    .map((item) => `
      <article class="history-item">
        <strong>${item.grade} ${item.score} - ${item.champion} ${item.role}</strong>
        <span>${item.date} | focus: ${item.focus}</span>
        <p>${item.mistake} -> ${item.improve}</p>
      </article>
    `)
    .join("");
}

function renderChangelog() {
  if (!outputs.changelogList) return;

  const fallback = {
    title: "League of Legends Patch 26.10 Notes",
    publishedAt: "2026-05-12T18:00:00.000Z",
    url: "https://www.leagueoflegends.com/en-us/news/game-updates/league-of-legends-patch-26-10-notes/",
    description: currentLang === "en"
      ? "Patch 26.10 included champion buffs/nerfs, item and rune changes, Arena updates, ARAM quality of life changes, and minion aggro changes."
      : "Patch 26.10 het champion buffs/nerfs, item en rune changes, Arena updates, ARAM quality of life changes, en minion aggro changes ingesluit.",
    source: "Riot Games official patch notes",
  };
  const patch = latestLeaguePatch || fallback;
  const date = new Date(patch.publishedAt).toLocaleDateString();
  const helper = currentLang === "en"
    ? "Use this to adjust your habits when League changes champions, items, runes, objectives, or game systems."
    : "Gebruik dit om jou habits aan te pas wanneer League champions, items, runes, objectives of game systems verander.";

  outputs.changelogList.innerHTML = `
    <article class="history-item">
      <strong>${patch.title}</strong>
      <span>${date} | ${patch.source}</span>
      <p>${patch.description || helper}</p>
      <p>${helper}</p>
      <button class="mini-button" type="button" id="openPatchNotesBtn">${currentLang === "en" ? "Open Riot patch notes" : "Maak Riot patch notes oop"}</button>
    </article>
  `;
  document.querySelector("#openPatchNotesBtn")?.addEventListener("click", () => {
    window.externalLinks?.open(patch.url);
  });
}

async function refreshLeaguePatch() {
  if (!window.leagueAPI?.getLatestPatch) {
    renderChangelog();
    return;
  }

  outputs.changelogList.innerHTML = `
    <article class="history-item">
      <strong>${currentLang === "en" ? "Checking Riot patch notes..." : "Kyk vir Riot patch notes..."}</strong>
      <span>leagueoflegends.com</span>
    </article>
  `;

  try {
    latestLeaguePatch = await window.leagueAPI.getLatestPatch();
  } catch {
    latestLeaguePatch = null;
  }
  renderChangelog();
}

function render() {
  const data = getFormData();
  const result = analyse(data);

  outputs.grade.textContent = gradeFromScore(result.score);
  outputs.score.textContent = result.score;
  outputs.scoreRing.style.background = `conic-gradient(var(--gold) ${result.score}%, rgba(255, 255, 255, 0.1) 0)`;

  renderMetrics(data, result);
  renderList(outputs.mistakes, result.mistakes, "mistake");
  renderList(outputs.improvements, result.improvements, "improve");
  renderList(outputs.positives, result.positives, "positive");
  renderFocus(result);
  renderTrainingPlan(data, result);
  renderProHabits(data, result);
  renderSessionPlan(data, result);
  renderHistory();
  renderChangelog();

  localStorage.setItem(stateKey(), JSON.stringify(data));
  saveState.textContent = t("autoSaved");
  scheduleFirestoreSync();
}

function renderProfile(profile, error) {
  outputs.profileStrip.classList.toggle("connected", Boolean(profile));
  outputs.profileStrip.classList.toggle("error", Boolean(error));

  if (profile) {
    const riotName = profile.tagLine ? `${profile.gameName || profile.displayName}#${profile.tagLine}` : profile.displayName;
    outputs.profileIcon.textContent = String(profile.summonerLevel || "?");
    outputs.profileName.textContent = riotName;
    outputs.profileMeta.textContent = `Level ${profile.summonerLevel || "?"} | ${profile.region} | ${profile.gameflow}`;
    return;
  }

  outputs.profileIcon.textContent = error ? "!" : "?";
  outputs.profileName.textContent = error ? (currentLang === "en" ? "Could not connect" : "Kon nie koppel nie") : t("notConnected");
  outputs.profileMeta.textContent = error || t("connectHint");
}

function renderDetection(game, error) {
  outputs.detectStrip.classList.toggle("connected", Boolean(game && !error));
  outputs.detectStrip.classList.toggle("error", Boolean(error));

  if (error) {
    outputs.detectTitle.textContent = t("autoDetectDisconnected");
    outputs.detectMeta.textContent = error;
    return;
  }

  if (!game) {
    outputs.detectTitle.textContent = t("waitingLeague");
    outputs.detectMeta.textContent = t("detectHint");
    return;
  }

  const champion = game.champion || (currentLang === "en" ? "Champion not picked yet" : "Champion nog nie gekies nie");
  const role = game.role ? game.role.toUpperCase() : (currentLang === "en" ? "role unknown" : "role onbekend");
  const mode = game.queue || game.gameMode || (currentLang === "en" ? "mode unknown" : "mode onbekend");
  const queueType = queueTypeLabel(game.queueType);
  outputs.detectTitle.textContent = `${champion} | ${role}`;
  outputs.detectMeta.textContent = `${queueType} | ${mode} | ${game.source || "League Client"}`;

  if (game.queueType === "aram") {
    outputs.detectTitle.textContent = t("ignoredAramTitle");
    outputs.detectMeta.textContent = t("ignoredAramMeta");
  }
}

function renderUpdateStatus(status) {
  if (!status) return;
  outputs.updateTitle.textContent = status.state === "ready" ? t("updateReady") : t("updateStatus");
  outputs.updateMeta.textContent = status.message || t("noUpdateMessage");
  restartUpdateBtn.classList.toggle("hidden", status.state !== "ready");
}

function showTab(tabName) {
  document.querySelectorAll(".tab-button").forEach((button) => {
    button.classList.toggle("active", button.dataset.tab === tabName);
  });
  document.querySelectorAll(".tab-panel").forEach((panel) => {
    panel.classList.toggle("active", panel.dataset.panel === tabName);
  });
  localStorage.setItem("lolReviewCoach:activeTab", tabName);
}

function applyDetectedGame(game) {
  if (!game) return;

  if (game.champion) {
    document.querySelector("#champion").value = game.champion;
  }

  if (game.role && roleTargets[game.role]) {
    document.querySelector("#role").value = game.role;
  } else {
    document.querySelector("#role").value = "";
  }

  const mode = game.queue || game.gameMode || "";
  if (mode) {
    document.querySelector("#gameMode").value = mode;
  }

  document.querySelector("#detectSource").value = game.source || "League Client";

  if (game.queueType === "aram") {
    ignoreAramGame(game);
    return;
  }

  if (game.stats) {
    setNumber("kills", game.stats.kills);
    setNumber("deaths", game.stats.deaths);
    setNumber("assists", game.stats.assists);
    setNumber("cs", game.stats.cs);
    setNumber("minutes", game.stats.minutes);
    setNumber("vision", game.stats.vision);
    setNumber("controlWards", game.stats.controlWards);
    setNumber("objectives", game.stats.objectives);
    if (game.stats.kp) setNumber("kp", game.stats.kp);
    inferReviewFields();
  }
}

async function refreshLeagueContext({ silent = false } = {}) {
  if (!window.leagueAPI?.getContext) {
    renderDetection(null, "Maak die desktop app oop, nie die HTML file nie.");
    return;
  }

  try {
    const context = await window.leagueAPI.getContext();
    activeProfile = context.profile;
    renderProfile(activeProfile, null);
    applyDetectedGame(context.game);
    renderDetection(context.game, null);
    if (context.game?.queueType === "aram") {
      ignoreAramGame(context.game);
    } else if (context.game?.source === "In-game" && context.game?.stats) {
      recordLiveSnapshot(context.game);
    } else {
      finishLiveSession();
    }
    render();
  } catch (error) {
    if (!silent) renderProfile(null, error.message);
    renderDetection(null, error.message);
    finishLiveSession();
  }
}

async function connectProfile() {
  if (!window.leagueAPI) {
    renderProfile(null, currentLang === "en" ? "Open the app with npm start, not directly as HTML." : "Maak die app oop met npm start, nie direk as HTML nie.");
    return;
  }

  profileBtn.disabled = true;
  profileBtn.textContent = currentLang === "en" ? "Connecting..." : "Koppel...";
  renderProfile(null, null);

  try {
    const context = window.leagueAPI.getContext
      ? await window.leagueAPI.getContext()
      : { profile: await window.leagueAPI.getProfile(), game: null };
    activeProfile = context.profile;
    renderProfile(activeProfile, null);
    restore();
    applyDetectedGame(context.game);
    renderDetection(context.game, null);
    if (context.game?.queueType === "aram") {
      ignoreAramGame(context.game);
    } else if (context.game?.source === "In-game" && context.game?.stats) {
      recordLiveSnapshot(context.game);
    }
    render();
  } catch (error) {
    activeProfile = null;
    renderProfile(null, error.message);
  } finally {
    profileBtn.disabled = false;
    profileBtn.textContent = t("connectProfile");
  }
}

function restore() {
  const saved = localStorage.getItem(stateKey()) || localStorage.getItem("lolReviewCoach");
  if (!saved) return;

  let data;
  try {
    data = JSON.parse(saved);
  } catch {
    localStorage.removeItem(stateKey());
    return;
  }
  Object.entries(data).forEach(([key, value]) => {
    if (key === "tags") {
      document.querySelectorAll("input[name='tags']").forEach((checkbox) => {
        checkbox.checked = value.includes(checkbox.value);
      });
      return;
    }

    if (key === "profile") {
      activeProfile = value;
      if (activeProfile) renderProfile(activeProfile, null);
      return;
    }

    const input = document.querySelector(`#${key}`);
    if (input) input.value = value;
  });
}

form.addEventListener("input", () => {
  saveState.textContent = t("saving");
  render();
});

resetBtn.addEventListener("click", () => {
  localStorage.removeItem(stateKey());
  form.reset();
  document.querySelector("#kills").value = 0;
  document.querySelector("#deaths").value = 0;
  document.querySelector("#assists").value = 0;
  document.querySelector("#cs").value = 0;
  document.querySelector("#minutes").value = 1;
  document.querySelector("#kp").value = 0;
  document.querySelector("#vision").value = 0;
  document.querySelector("#controlWards").value = 0;
  document.querySelector("#objectives").value = 0;
  document.querySelector("#gameMode").value = "";
  document.querySelector("#detectSource").value = "";
  document.querySelector("#gamesToday").value = 3;
  document.querySelector("#startTime").value = "17:00";
  render();
});

profileBtn.addEventListener("click", connectProfile);
saveReviewBtn.addEventListener("click", saveReview);
clearHistoryBtn.addEventListener("click", () => {
  localStorage.removeItem(historyKey());
  renderHistory();
});
updateBtn.addEventListener("click", async () => {
  if (!window.appUpdates) {
    renderUpdateStatus({ state: "error", message: t("desktopOnly") });
    return;
  }
  renderUpdateStatus(await window.appUpdates.check());
});
restartUpdateBtn.addEventListener("click", () => {
  window.appUpdates?.restart();
});
refreshLeaguePatchBtn.addEventListener("click", refreshLeaguePatch);
window.appUpdates?.onStatus(renderUpdateStatus);
languageSelect.addEventListener("change", () => {
  currentLang = languageSelect.value;
  localStorage.setItem("lolReviewCoach:language", currentLang);
  applyLanguage();
  render();
});
document.querySelectorAll(".tab-button").forEach((button) => {
  button.addEventListener("click", () => showTab(button.dataset.tab));
});

// ── Firestore sync ─────────────────────────────────────────────────────────

let syncTimer = null;

function scheduleFirestoreSync() {
  clearTimeout(syncTimer);
  syncTimer = setTimeout(syncToFirestore, 2000);
}

async function syncToFirestore() {
  const uid = window.firebaseAuth?.currentUser?.uid;
  if (!uid || !window.firebaseDb) return;
  try {
    const { profile: _, ...stateToSync } = getFormData();
    await window.firebaseDb.collection("users").doc(uid).set({
      state: stateToSync,
      history: getHistory(),
      language: currentLang,
      email: window.firebaseAuth.currentUser.email,
    }, { merge: true });
  } catch {
    // localStorage is die fallback
  }
}

async function loadFromFirestore(uid) {
  if (!window.firebaseDb) return;
  try {
    const doc = await window.firebaseDb.collection("users").doc(uid).get();
    if (!doc.exists) return;
    const data = doc.data();
    if (data.language) {
      currentLang = data.language;
      localStorage.setItem("lolReviewCoach:language", currentLang);
    }
    if (data.history?.length) {
      localStorage.setItem(`lolReviewCoach:${uid}:history`, JSON.stringify(data.history));
    }
    if (data.state) {
      localStorage.setItem(`lolReviewCoach:${uid}:state`, JSON.stringify(data.state));
    }
  } catch {
    // gebruik localStorage cache
  }
}
window.loadFromFirestore = loadFromFirestore;

// ── App startup (geroep deur auth.js na suksesvolle login) ──────────────────

window.initApp = function () {
  restore();
  applyLanguage();
  showTab(localStorage.getItem("lolReviewCoach:activeTab") || "mistakes");
  render();
  renderLiveMonitor("idle");
  refreshLeaguePatch();
  connectProfile();
  if (window.contextTimer) clearInterval(window.contextTimer);
  window.contextTimer = setInterval(() => refreshLeagueContext({ silent: true }), 5000);
};

window.addEventListener("beforeunload", () => {
  if (window.contextTimer) clearInterval(window.contextTimer);
});

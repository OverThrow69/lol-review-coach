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
  rolePlaybook: document.querySelector("#rolePlaybook"),
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
  const en = currentLang === "en";
  const target = roleTargets[data.role] || roleTargets.unknown;
  const roleName = data.role === "unknown" ? (en ? "your role" : "jou role") : data.role;
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
    mistakes.push(en
      ? ["Too many deaths", `You died ${data.deaths} times (${deathsPerTen.toFixed(1)}/10 min). Every death gave the enemy free gold, reset their cooldowns, and handed them an objective window — that is why you felt behind even when you had kills. Instead of forcing that next play, recall when you are low and regroup.`]
      : ["Te veel deaths", `Jy het ${data.deaths} keer gesterf (${deathsPerTen.toFixed(1)}/10 min). Elke death het die enemy gratis goud gegee, hul cooldowns gereset, en 'n objective venster gegee — dis hoekom jy agter gevoel het selfs met kills. Recall as jy laag is eerder as om nog een play te force.`]);
    improvements.push(en
      ? ["Review each death", "Watch every death and ask: did I push a wave with enemies missing? Did I chase past their side? Was my flash/escape on cooldown? Fix the most common answer first."]
      : ["Kyk elke death terug", "Vra by elke death: het ek gepush terwyl enemies missing was? Het ek te ver gejaag? Was my flash/escape op cooldown? Los die mees algemene antwoord eerste op."]);
  } else if (data.deaths <= 3) {
    positives.push(en
      ? ["Excellent survival!", `Only ${data.deaths} death${data.deaths === 1 ? "" : "s"} — you kept your shutdown bounty low, stayed in the game longer, and gave your team consistent tempo. That discipline is exactly what separates good players from great ones.`]
      : ["Uitstekende oorlewing!", `Slegs ${data.deaths} death${data.deaths === 1 ? "" : "s"} — jy het jou shutdown bounty laag gehou, langer in die game gebly, en jou span konstante tempo gegee. Daardie dissipline is presies wat goeie spelers van groot spelers onderskei.`]);
  }

  if (csPerMin < target.cs * 0.78 && data.role !== "support") {
    const missedCs = Math.round((target.cs - csPerMin) * data.minutes);
    const missedGold = missedCs * 20;
    mistakes.push(en
      ? ["CS falling off", `${csPerMin.toFixed(1)} CS/min vs a target of ${target.cs.toFixed(1)} — that is roughly ${missedCs} missed minions (~${missedGold}g), enough for a full component item you never had. That missing item is why your trades felt weak and your fights were harder than they needed to be. Instead of chasing that kill or grouping mid, go collect that side wave first.`]
      : ["Farm het weggeval", `${csPerMin.toFixed(1)} CS/min teenoor 'n teiken van ${target.cs.toFixed(1)} — dit is ongeveer ${missedCs} gemiste minions (~${missedGold}g), genoeg vir 'n volledige komponent item. Daai missing item is hoekom jou trades swak gevoel het en jou fights harder was as nodig. Eerder as om 'n kill te jaag of mid te groepeer, gaan collect eers daai side wave.`]);
    improvements.push(en
      ? ["CS checkpoints", "Track your CS at 10, 15, and 20 minutes. Every 10 CS = ~200 gold. When you crash a wave and it bounces back, follow it — never let it die under tower for free."]
      : ["CS kontrolepunte", "Tel jou CS op 10, 15 en 20 minute. Elke 10 CS = ~200 goud. As 'n wave bounced en terugrol, volg dit — laat dit nooit gratis onder toren sterf nie."]);
  } else if (csPerMin >= target.cs && data.role !== "support") {
    const extraCs = Math.round((csPerMin - target.cs) * data.minutes);
    positives.push(en
      ? ["Great farming!", `${csPerMin.toFixed(1)} CS/min — about ${extraCs} extra minions above target. That extra gold means your item spikes hit harder and earlier than the enemy's. Keep using that advantage to force objective fights before they can scale back.`]
      : ["Uitstekende farm!", `${csPerMin.toFixed(1)} CS/min — ongeveer ${extraCs} ekstra minions bo teiken. Daai ekstra goud beteken jou item spikes slaan harder en vroeer as die enemy s'n. Hou aan om daai voordeel te gebruik om objective fights te force voordat hulle kan inscale.`]);
  }

  if (visionPerMin < target.vision * 0.72) {
    mistakes.push(en
      ? ["Low vision", `${visionPerMin.toFixed(1)} vision/min is well below what a ${roleName} should produce. Without wards on the objective side, you were guessing where the enemy was — that is why you got caught or arrived late to fights. You should have placed a ward before pushing that wave or rotating, not after the scare.`]
      : ["Lae vision", `${visionPerMin.toFixed(1)} vision/min is ver onder wat 'n ${roleName} moet produseer. Sonder wards op die objective-kant het jy geraai waar die enemy is — dis hoekom jy gevang is of laat by fights was. Jy moes 'n ward geplaas het voordat jy gepush of geroteer het, nie na die skrik nie.`]);
    improvements.push(en
      ? ["Ward before you move", "Every time you recall and buy, place the control ward before walking back. When you push past river, drop a ward in the brush first. Vision before action."]
      : ["Ward voor jy beweeg", "Elke keer as jy recall en koop, plaas die control ward voor jy terugloop. As jy verby die river push, drop 'n ward in die brush eerste. Vision voor aksie."]);
  } else if (visionPerMin >= target.vision) {
    positives.push(en
      ? ["Top-tier map awareness!", `${visionPerMin.toFixed(1)} vision/min — your wards gave your team the information to make confident decisions. That is the kind of contribution that does not show on the kill scoreboard but wins games.`]
      : ["Top-klas map bewustheid!", `${visionPerMin.toFixed(1)} vision/min — jou wards het jou span die inligting gegee om met selfvertroue besluite te neem. Dit is die soort bydrae wat nie op die kill-telkaart wys nie maar games wen.`]);
  }

  if (data.kp < target.kp * 0.78) {
    mistakes.push(en
      ? ["Low kill participation", `${data.kp}% KP means most of your team's kills happened without you. You were probably farming a side lane when your team was fighting, or rotating too late. That means your team was effectively 4v5 in those fights, which is why they lost them. Instead, after crashing a wave, immediately check the minimap before going back to farm.`]
      : ["Lae kill deelname", `${data.kp}% KP beteken meeste van jou span se kills het sonder jou gebeur. Jy was waarskynlik besig met side lane terwyl jou span geveg het, of jy het te laat geroteer. Dit beteken jou span was 4v5 in daai fights — dis hoekom hulle hulle verloor het. Na wave crash, kyk dadelik na die minimap voor jy terugfarm.`]);
    improvements.push(en
      ? ["Rotate after clearing", "Crash your wave, check if dragon/herald is alive or if your team is fighting. If they are, rotate immediately — do not auto-pilot farm while your team dies."]
      : ["Roteer na clear", "Crash jou wave, kyk of dragon/herald leef of jou span veg. As hulle veg, roteer dadelik — moenie op autopilot farm terwyl jou span sterf nie."]);
  } else if (data.kp >= target.kp) {
    positives.push(en
      ? ["Great fight presence!", `${data.kp}% KP — you were in the right place at the right time and helped your team win the important moments. That is pro-level map reading.`]
      : ["Geweldige fight teenwoordigheid!", `${data.kp}% KP — jy was op die regte plek op die regte tyd en het jou span gehelp om die belangrike oomblikke te wen. Dit is pro-vlak map lees.`]);
  }

  if (data.objectives <= 1 && data.minutes >= 24) {
    mistakes.push(en
      ? ["Kills wasted on scoreboards", `Only ${data.objectives} objective${data.objectives === 1 ? "" : "s"} in ${data.minutes} minutes despite ${data.kills} kills. Every kill gives you 30–45 seconds of enemy respawn time — that is a FREE window to take a tower, grubs, or dragon. Instead you went back to lane or stood around. Kills on the scoreboard do not win games. Towers, dragons, and baron do.`]
      : ["Kills vermors op telkaart", `Slegs ${data.objectives} objective${data.objectives === 1 ? "" : "s"} in ${data.minutes} minute ondanks ${data.kills} kills. Elke kill gee jou 30–45 sekondes gratis respawn tyd — daai venster is genoeg vir 'n toren, grubs of dragon. Eerder het jy teruggegaan na jou lane of rondgestaan. Kills op die telkaart wen nie games nie. Torens, dragons en baron wel.`]);
    improvements.push(en
      ? ["Kill → objective checklist", "The moment an enemy dies, ask: 1. Which objective can I reach in 30 seconds? 2. How many plates are left on the nearest tower? 3. Can I invade their jungle for free camps? Pick one and GO."]
      : ["Kill → objective kontrolelys", "Die oomblik 'n enemy sterf, vra: 1. Watter objective kan ek in 30 sekondes bereik? 2. Hoeveel plates is oor op die naaste toren? 3. Kan ek hul jungle invade vir gratis camps? Kies een en GAAN."]);
  } else if (data.objectives >= 4) {
    positives.push(en
      ? ["That is how you win games!", `${data.objectives} objectives — you understood that kills are just the key, and map objectives are what you unlock with them. Most players never make that mental shift. You did.`]
      : ["Dit is hoe jy games wen!", `${data.objectives} objectives — jy het verstaan dat kills net die sleutel is, en map objectives is wat jy daarmee oopsluit. Die meeste spelers maak nooit daai gedagtesprong nie. Jy het.`]);
  }

  if (data.goldState === "ahead") {
    if (data.leadUse === "converted" || data.objectives >= 4) {
      positives.push(en
        ? ["You played like a winner!", `${data.kills}/${data.deaths}/${data.assists} with ${data.objectives} objectives — you turned your lead into map control instead of just a better KDA. That is exactly the difference between a player who wins ranked and a player who does not.`]
        : ["Jy het soos 'n wenner gespeel!", `${data.kills}/${data.deaths}/${data.assists} met ${data.objectives} objectives — jy het jou lead in map beheer omgesit, nie net 'n beter KDA nie. Dit is presies die verskil tussen 'n speler wat ranked wen en een wat nie.`]);
    }
    if (data.leadUse === "threw" || data.deathPattern === "greed" || data.killQuality === "chased") {
      mistakes.push(en
        ? ["You had the lead but threw it", `You were ahead in gold but kept chasing kills instead of taking objectives. Each kill you chased gave you about 300g but cost you 30–45 seconds where you could have taken a tower worth 150–300g in plates PLUS the map pressure. You handed them time to scale back. Next time an enemy dies, ask: tower or more kills? Almost always the answer is tower.`]
        : ["Jy het die lead maar weggegooi", `Jy was voor in goud maar het kills bly jaag eerder as objectives te vat. Elke kill wat jy gejaag het het jou ~300g gegee maar het jou 30–45 sekondes gekos waar jy 'n toren kon gehad het vir 150–300g in plates PLUS die map druk. Jy het hulle tyd gegee om terug in te scale. Volgende keer as 'n enemy sterf, vra: toren of meer kills? Amper altyd is die antwoord toren.`]);
      improvements.push(en
        ? ["Use your lead", "When ahead and an enemy dies: 1. Plates left on the nearest tower? Push now. 2. Dragon/herald within 90 seconds? Rotate. 3. Can you take their jungle? Do it. Then recall and come back stronger."]
        : ["Gebruik jou lead", "As jy voor is en 'n enemy sterf: 1. Plates oor op die naaste toren? Push nou. 2. Dragon/herald binne 90 sekondes? Roteer. 3. Kan jy hul jungle vat? Doen dit. Dan recall en kom sterker terug."]);
      score -= 8;
    }
    if (data.leadUse === "passive") {
      mistakes.push(en
        ? ["Gold lead sitting unused", `You were ahead but played too passively — the map did not reflect your advantage at all. When you are ahead in CS or kills, your items are stronger than theirs RIGHT NOW. That window closes the moment they complete their next item. You should have been pushing towers, forcing dragon, or invading their jungle while you had the damage advantage.`]
        : ["Goud-voorsprong sit ongebruik", `Jy was voor maar het te passief gespeel — die map het glad nie jou voordeel gewys nie. Wanneer jy voor is in CS of kills, is jou items sterker as syne REGTE NOU. Daai venster sluit die oomblik hulle hul volgende item voltooi. Jy moes torens gepush, dragon geforce, of hul jungle invade het terwyl jy die damage voordeel gehad het.`]);
      improvements.push(en
        ? ["Item spike = strike window", "Every time you complete an item before them, you have a short window where you win every fight. Push a tower, force an objective fight, or invade their jungle — then recall before the window closes."]
        : ["Item spike = strike venster", "Elke keer as jy 'n item voor hulle voltooi, het jy 'n kort venster waar jy elke fight wen. Push 'n toren, force 'n objective fight, of invade hul jungle — dan recall voor die venster sluit."]);
    }
  }

  if (data.goldState === "behind") {
    if (data.leadUse === "survivedBehind" || data.deaths <= 4) {
      positives.push(en
        ? ["Great mental — played it properly!", "You stayed disciplined when you were losing. Farming safely and refusing bad fights is exactly what coaches teach — it keeps you in the game until the enemy makes a mistake or overchases, and then you punish it."]
        : ["Goeie mental — jy het dit reg gespeel!", "Jy het gedissiplineerd gebly toe jy agter was. Veilig farm en slegte fights weier is presies wat coaches leer — dit hou jou in die game totdat die enemy 'n fout maak of te ver jaag, en dan straf jy dit."]);
    }
    if (data.leadUse === "forcedBehind" || data.killQuality === "chased") {
      mistakes.push(en
        ? ["Behind but forcing fights", `When you are behind in gold, every random fight is a coin flip that the enemy wins because their items are stronger than yours. You forced fights and made it worse. The correct play when behind is: farm under tower, hit your item spike first, THEN look for a shutdown fight on their fed player — not a straight 1v1 you cannot win.`]
        : ["Agter maar fights geforce", `Wanneer jy agter is in goud, is elke random fight 'n munsgooi wat die enemy wen omdat hul items sterker as joune is. Jy het fights geforce en dit erger gemaak. Die korrekte speel wanneer agter is: farm onder toren, bereik jou item spike eerste, DAN soek 'n shutdown fight op hul fed speler — nie 'n direkte 1v1 wat jy nie kan wen nie.`]);
      improvements.push(en
        ? ["Farm to spike, then hunt", "Farm safely until your next item. Once you have it, look for a 2v1 shutdown trap near their jungle entry or an objective fight where their lead player overextends."]
        : ["Farm na spike, dan jaag", "Farm veilig tot jou volgende item. Sodra jy dit het, soek 'n 2v1 shutdown trap naby hul jungle ingang of 'n objective fight waar hul lead speler te ver extend."]);
      score -= 8;
    }
  }

  if (data.laneState === "lost") {
    mistakes.push(en
      ? ["Lost the lane", "Losing lane at level 1–6 sets the tone for the whole game — you were behind in farm, you could not rotate first, and you handed the enemy tempo to pressure objectives. Look at your level 1 positioning, your level 2–3 trades, and whether your wave was bouncing toward them when you fought."]
      : ["Lane verloor", "Lane verloor op level 1–6 stel die toon vir die hele game — jy was agter in farm, jy kon nie eerste roteer nie, en jy het die enemy tempo gegee om objectives te druk. Kyk na jou level 1 posisionering, level 2–3 trades, en of jou wave na hulle gerol het toe jy geveg het."]);
    improvements.push(en
      ? ["Lane recovery mode", "If you lose lane: freeze the wave near your tower, farm safely, and ping when you cannot follow a roam. Give up plates rather than dying trying to hold them."]
      : ["Lane recovery modus", "As jy lane verloor: freeze die wave naby jou tower, farm veilig, en ping as jy nie 'n roam kan volg nie. Gee plates op eerder as om te sterf om hulle te hou."]);
  } else if (data.laneState === "won") {
    positives.push(en
      ? ["You won the lane — well done!", "You built enough pressure to move first or keep the enemy under their tower. Now the next step is converting that pressure into plates, objectives, or tempo before the enemy jungler can reset the lane."]
      : ["Jy het die lane gewen — goed gedaan!", "Jy het genoeg druk gebou om eerste te beweeg of die enemy onder tower te hou. Die volgende stap is om daai druk om te skakel na plates, objectives of tempo voordat die enemy jungler die lane kan reset."]);
  } else if (data.laneState === "ignoredWave") {
    mistakes.push(en
      ? ["Wave control lost", "You roamed, recalled, or fought without setting up the wave first. That costs you minions AND gives the enemy a free recall to buy items while the wave crashes into them. Always crash the wave or put it in a freeze before you leave the lane."]
      : ["Wave beheer verloor", "Jy het geroam, gerecall, of geveg sonder om eers die wave op te stel. Dit kos jou minions EN gee die enemy 'n gratis recall om items te koop terwyl die wave in hulle crash. Crash altyd die wave of sit dit in 'n freeze voor jy die lane verlaat."]);
    improvements.push(en
      ? ["Wave before every move", "Before roaming or recalling, check the wave: crash it into their tower, or set a freeze near yours. If you cannot do either, ping that you cannot follow first."]
      : ["Wave voor elke beweging", "Voor elke roam of recall, kyk die wave: crash dit in hul toren, of sit 'n freeze naby joune. As jy nie een van albei kan doen nie, ping dat jy nie eerste kan volg nie."]);
  }

  if (data.killQuality === "chased") {
    mistakes.push(en
      ? ["Chasing kills past objectives", `You got ${data.kills} kills but only ${data.objectives} objective${data.objectives === 1 ? "" : "s"}. Every time you chased that kill instead of rotating, you wasted 30–45 seconds of free respawn time where the enemy tower was basically undefended. Those towers and drakes are what actually end games. Next time they die, stop the chase and look at the map first.`]
      : ["Kills verby objectives gejaag", `Jy het ${data.kills} kills gekry maar slegs ${data.objectives} objective${data.objectives === 1 ? "" : "s"}. Elke keer as jy daai kill gejaag het eerder as om te roteer, het jy 30–45 sekondes gratis respawn tyd vermors waar die enemy toren feitlik onverdedig was. Daai torens en drakes is wat eintlik games beëindig. Volgende keer as hulle sterf, stop die jagtog en kyk eers na die map.`]);
    improvements.push(en
      ? ["Kill → look at map → objective", "When an enemy dies: stop and look at the minimap. What objective is closest? Push for it. The kill already happened — the free time is what matters now."]
      : ["Kill → kyk na map → objective", "Wanneer 'n enemy sterf: stop en kyk na die minimap. Watter objective is naaste? Push daarvoor. Die kill het al gebeur — die gratis tyd is wat nou saak maak."]);
  } else if (data.killQuality === "shutdowns") {
    positives.push(en
      ? ["Smart — you denied their bounty!", "You shut down their fed player and took the gold off the board. Now use that spike to force the next objective before they respawn and start building back up again."]
      : ["Slim — jy het hul bounty ontken!", "Jy het hul fed speler afgesit en die goud van die bord gevat. Gebruik nou daai spike om die volgende objective te force voordat hulle respawn en weer begin opbou."]);
  } else if (data.killQuality === "noConversion") {
    mistakes.push(en
      ? ["Kills not turned into map pressure", `${data.kills} kills, but only ${data.objectives} objective${data.objectives === 1 ? "" : "s"}. When you kill the enemy jungler or laner, that is your green light — grubs are free, plates on the nearest tower are worth ~160g each, and their jungle camps are unguarded. You ignored all of that and the map stayed the same even though you were winning fights.`]
      : ["Kills nie in map druk omgesit nie", `${data.kills} kills, maar slegs ${data.objectives} objective${data.objectives === 1 ? "" : "s"}. Wanneer jy die enemy jungler of laner doodmaak, is dit jou groen lig — grubs is gratis, plates op die naaste toren is elk ~160g werd, en hul jungle camps is onbewaak. Jy het dit alles geïgnoreer en die map het dieselfde gebly selfs al het jy fights gewen.`]);
    improvements.push(en
      ? ["After-kill action plan", "Kill secured → immediately ask: 1. Objective spawned or within 60 seconds? Take it. 2. Plates on a nearby tower? Push for them. 3. Enemy jungle open? Take camps. Do one of these every single time."]
      : ["Na-kill aksieplan", "Kill geskuur → vra dadelik: 1. Objective gespawn of binne 60 sekondes? Vat dit. 2. Plates op 'n nabye toren? Push daarvoor. 3. Enemy jungle oop? Vat camps. Doen een van hierdie elke enkele keer."]);
  }

  if (data.farmPattern === "missedFreeWaves") {
    mistakes.push(en
      ? ["Free gold left on the map", "You missed free waves — probably by grouping mid, chasing kills, or standing around. A single wave is worth 200–250g and takes 10 seconds to collect. Every time you walked past a crashing wave, you handed that gold to no one, while the enemy was probably collecting theirs."]
      : ["Gratis goud op die map gelaat", "Jy het free waves gemis — waarskynlik deur mid te groepeer, kills te jaag, of rond te staan. 'n Enkele wave is 200–250g werd en neem 10 sekondes om te collect. Elke keer as jy verby 'n crashing wave geloop het, het jy daai goud aan niemand gegee, terwyl die enemy waarskynlik syne collected het."]);
    improvements.push(en
      ? ["Side lane first, then group", "When nothing is spawning, check the side lanes before joining your team. A free wave crashing under tower is almost always worth more than standing mid."]
      : ["Side lane eerste, dan groepeer", "Wanneer niks spawn nie, kyk eers die side lanes voor jy jou span join. 'n Free wave wat onder die toren crash is amper altyd meer werd as om mid te staan."]);
  } else if (data.farmPattern === "stoppedMidGame") {
    mistakes.push(en
      ? ["Farm dropped in mid-game", "Your CS fell off because you grouped mid instead of catching side waves first. While you were standing around mid, that side wave crashed under tower for free — about 200–300g lost per wave, every rotation. Your team needed objectives, not your physical presence mid while gold died on the sides."]
      : ["Farm het in mid-game weggeval", "Jou CS het weggeval omdat jy mid gegroepeer het eerder as om eers side waves te catch. Terwyl jy mid rondgestaan het, het daai side wave gratis onder die toren gecrash — ongeveer 200–300g verloor per wave, elke rotasie. Jou span het objectives nodig gehad, nie jou fisiese teenwoordigheid mid terwyl goud aan die kante sterf nie."]);
    improvements.push(en
      ? ["Catch side wave, then group", "Crash or catch the side wave first, then rotate with vision. Do not ARAM mid while free farm dies on the sides."]
      : ["Catch side wave, dan groepeer", "Crash of catch die side wave eerste, dan roteer met vision. Moenie mid ARAM terwyl free farm aan die kante sterf nie."]);
  } else if (data.farmPattern === "overfarmed") {
    mistakes.push(en
      ? ["Over-farming — missed team windows", "You farmed safely but your team needed you for objectives and fights that could have ended the game. Gold sitting in your pocket is worthless if you lose before you spend it. Farm with a purpose — once an objective window opens, stop and rotate."]
      : ["Oor-farm — span vensters gemis", "Jy het veilig goud gekry maar jou span het jou nodig gehad vir objectives en fights wat die game kon beëindig het. Goud in jou sak is waardeloos as jy verloor voor jy dit spandeer. Farm met 'n doel — sodra 'n objective venster oopgaan, stop en roteer."]);
    improvements.push(en
      ? ["Farm with an objective timer", "Watch objective timers. At 60–90 seconds before dragon, baron, or herald, stop farming and start moving. Gold only matters if the game is still winnable."]
      : ["Farm met 'n objective timer", "Kyk objective timers. By 60–90 sekondes voor dragon, baron of herald, stop farm en begin beweeg. Goud is net saak as die game nog wenbaar is."]);
  } else if (data.farmPattern === "steady") {
    positives.push(en
      ? ["Consistent gold income — nice!", "Your CS stayed strong throughout the game, which means your item spikes hit on time every time. That kind of reliable gold income is what makes your champion feel powerful and your fights feel winnable."]
      : ["Konsekwente goud inkomste — mooi!", "Jou CS was sterk regdeur die game, wat beteken jou item spikes het elke keer op tyd geslaan. Daai soort betroubare goud inkomste is wat jou champion kragtig laat voel en jou fights wenbaar maak."]);
  }

  if (data.routePattern === "lateObjective") {
    mistakes.push(en
      ? ["Arriving late to objectives", "You only started moving when the objective had already spawned — by then the enemy had vision on river and you were walking into a reactive fight blind. Objectives are won in the 90 seconds before they spawn, not during. You need to be setting vision and positioning BEFORE the timer hits zero."]
      : ["Laat by objectives", "Jy het eers begin beweeg toe die objective al gespawn het — teen daai tyd het die enemy al vision op river gehad en jy het blind in 'n reaktiewe fight ingeloop. Objectives word gewen in die 90 sekondes voor hulle spawn, nie tydens nie. Jy moet vision opstel en posisioneer VOOR die timer nul bereik."]);
    improvements.push(en
      ? ["Move 90 seconds early", "At 75–90 seconds before the objective spawns: recall, buy, ward the river entries, and walk in BEFORE the enemy does. You want to be there first, not responding to them."]
      : ["Beweeg 90 sekondes vroeg", "By 75–90 sekondes voor die objective spawn: recall, koop, ward die river ingange, en loop IN VOORDAT die enemy. Jy wil eerste daar wees, nie op hulle reageer nie."]);
  } else if (data.routePattern === "wrongSide") {
    mistakes.push(en
      ? ["Wrong side of the map", "You were top side when dragon was alive, or bottom side when baron was the priority. Being on the wrong side meant your team either fought without you, or you TP'd in too late and arrived low. Map side follows the next major objective — not where the lane pressure feels good."]
      : ["Verkeerde kant van die map", "Jy was top kant toe dragon leef was, of bottom kant toe baron die prioriteit was. Op die verkeerde kant wees beteken jou span het sonder jou geveg, of jy het te laat ge-TP en laag aangekom. Map kant volg die volgende groot objective — nie waar die lane druk goed voel nie."]);
    improvements.push(en
      ? ["Play toward the next objective", "Always position on the side of the next major objective. Side lane pressure is only worth it if you can TP or rotate to the fight in time."]
      : ["Posisioneer na die volgende objective", "Wees altyd op die kant van die volgende groot objective. Side lane druk is net die moeite werd as jy kan TP of roteer na die fight betekds."]);
  } else if (data.routePattern === "randomRoams") {
    mistakes.push(en
      ? ["Roaming without wave setup", "You left the lane before crashing the wave — that gave the enemy free minions AND free time to shove and recall or roam themselves. Roaming only has real value when the wave is crashing into their tower, taking gold away from them while you are elsewhere making plays."]
      : ["Roam sonder wave opstelling", "Jy het die lane verlaat voor die wave gecrash het — dit het die enemy gratis minions gegee EN gratis tyd om te shove en te recall of self te roam. Roam het slegs werklike waarde as die wave in hul toren crash, wat hulle goud ontneem terwyl jy elders speel maak."]);
    improvements.push(en
      ? ["Crash wave, then roam", "Before leaving your lane: crash the wave into their tower or set a slow push. Only then roam. If you cannot crash it in time, stay and fix the wave first."]
      : ["Crash wave, dan roam", "Voor jy jou lane verlaat: crash die wave in hul toren of stel 'n slow push. Dan eers roam. As jy dit nie op tyd kan crash nie, bly en fix die wave eerste."]);
  } else {
    positives.push(en
      ? ["Excellent map movement!", "Your movements were linked to waves, resets, and objective timers — that is genuinely how high-elo players think. Most players just wander. You had purpose behind every move."]
      : ["Uitstekende map beweging!", "Jou bewegings was gekoppel aan waves, resets en objective timers — dit is regtig hoe hoë-elo spelers dink. Die meeste spelers dwaal net rond. Jy het doel agter elke beweging gehad."]);
  }

  if (data.deathPattern === "greed") {
    mistakes.push(en
      ? ["Dying for one more", "You died chasing that last kill, grabbing one more wave, or going for one more plate when you should have recalled. That single death broke your recall timing, handed the enemy your bounty, and gave them objective tempo for free. The wave or plate was worth ~200g. The death probably cost you 400–600g in bounty and 30–45 seconds of objective control. Not worth it."]
      : ["Sterf vir nog een", "Jy het gesterf om daai laaste kill te jaag, nog een wave te grab, of nog een plate te kry toe jy moes gerecall het. Daai enkele death het jou recall timing gebreek, die enemy jou bounty gegee, en hulle gratis objective tempo gegee. Die wave of plate was ~200g werd. Die death het jou waarskynlik 400–600g in bounty en 30–45 sekondes objective beheer gekos. Dit was nie die moeite werd nie."]);
    improvements.push(en
      ? ["The exit rule", "Before taking one more wave or chasing: check how many enemies are missing and whether your flash is up. If both feel risky, recall. Coming back full is always better than dying trying to squeeze out 200g."]
      : ["Die exit reël", "Voor jy nog 'n wave vat of jaag: kyk hoeveel enemies missing is en of jou flash op is. As albei riskant voel, recall. Terugkom vol is altyd beter as sterf om 200g te probeer kry."]);
  } else if (data.deathPattern === "noVision") {
    mistakes.push(en
      ? ["Walked into the dark and died", "You moved into areas with no vision and got caught — the enemy was waiting there, and you had no idea because you had no wards. That is not an outplay, that is information they had and you did not. Every time you push a side lane or move through river without a ward, you are handing the enemy a free kill."]
      : ["In die donker ingeloop en gesterf", "Jy het in areas sonder vision beweeg en gevang geword — die enemy het daar gewag, en jy het geen idee gehad nie omdat jy geen wards gehad het nie. Dit is nie 'n outplay nie, dit is inligting wat hulle gehad het en jy nie. Elke keer as jy 'n side lane push of deur river beweeg sonder 'n ward, gee jy die enemy 'n gratis kill."]);
    improvements.push(en
      ? ["Ward before you move", "Two or more enemies missing? Only move with a ward placed ahead of you, a teammate nearby, or your escape on cooldown. If none of those are true, do not push."]
      : ["Ward voor jy beweeg", "Twee of meer enemies missing? Beweeg net met 'n ward voor jou, 'n spanmaat naby, of jou ontsnapping nie op cooldown nie. As nie een van die drie waar is nie, moenie push nie."]);
  } else if (data.deathPattern === "badFight") {
    mistakes.push(en
      ? ["Bad fight entry", "The problem was not the fight itself — it was when and where you walked in. You likely entered at the wrong angle (front-to-back into their whole team), before your damage was in position, or with key abilities on cooldown. A fight that looks even can be a losing fight if you walk in wrong."]
      : ["Slegte fight ingang", "Die probleem was nie die fight self nie — dit was wanneer en waar jy ingestap het. Jy het waarskynlik op die verkeerde hoek ingestap (front-to-back in hul hele span), voor jou damage in posisie was, of met sleutel vermoëns op cooldown. 'n Fight wat gelyk lyk kan 'n verloor fight wees as jy verkeerd instap."]);
    improvements.push(en
      ? ["Choose your angle before committing", "Before walking into a fight, ask: are my key abilities up? Where is my damage coming from? Can I flank instead of going head-on? If all three answers are bad, wait 5 seconds and re-evaluate."]
      : ["Kies jou hoek voor jy commit", "Voor jy 'n fight in stap, vra: is my sleutel vermoëns op? Waarvandaan kom my damage? Kan ek flank eerder as front-on? As al drie antwoorde sleg is, wag 5 sekondes en herevalueer."]);
  }

  if (data.teamfightPattern === "tooEarly") {
    mistakes.push(en
      ? ["Engaged before your team was ready", "You started the fight while your team was still walking in or had cooldowns down — that left you in a 1v5 or 2v5 situation. When you engage solo, the enemy can focus all their damage on you before your team even arrives. Instead, flash the engage signal to your team, wait for them to be in range, then go together."]
      : ["Engage voor jou span gereed was", "Jy het die fight begin terwyl jou span nog aangestap het of cooldowns af was — dit het jou in 'n 1v5 of 2v5 situasie gelaat. Wanneer jy solo engage, kan die enemy al hul damage op jou fokus voor jou span selfs aankom. In plaas daarvan, ping die engage sein aan jou span, wag totdat hulle in range is, dan gaan saam."]);
    improvements.push(en
      ? ["Wait for follow-up, then engage", "Before initiating: check that at least 2 teammates are within 1–2 seconds of follow-up range. If they are not close enough, hold the engage and let them catch up."]
      : ["Wag vir follow-up, dan engage", "Voor inisieer: kyk of ten minste 2 spanmaats binne 1–2 sekondes follow-up range is. As hulle nie naby genoeg is nie, hou die engage en laat hulle inhaal."]);
  } else if (data.teamfightPattern === "tooLate") {
    mistakes.push(en
      ? ["Arrived late to the fight", "You held back until the fight was nearly over — by the time your damage landed, your team was already dead or the enemy had escaped. Late damage rarely changes outcomes. You need to already be in position BEFORE the fight starts, not running toward it when the first spell lands."]
      : ["Te laat by die fight aangekom", "Jy het gewag tot die fight amper verby was — teen die tyd as jou damage geland het, was jou span al dood of die enemy het ontsnap. Laat damage verander selde uitkomste. Jy moet al in posisie wees VOORDAT die fight begin, nie hardloop daarheen as die eerste spell land nie."]);
    improvements.push(en
      ? ["Pre-position before the fight", "Watch where your team is walking and get ahead of them. You should already be in your fight position 5–10 seconds before the first ability is cast."]
      : ["Posisioneer voor die fight", "Kyk waarheen jou span loop en kom voor hulle. Jy moet al in jou fight posisie wees 5–10 sekondes voor die eerste vermoë gegooi word."]);
  } else if (data.teamfightPattern === "wrongTarget") {
    mistakes.push(en
      ? ["Wrong target in teamfights", "You focused the tank or frontline while the enemy carry stayed alive and killed your team. Killing their frontline does not win fights — removing their damage dealers does. The tank is designed to absorb your damage. Walk past them and hit whoever is threatening your team."]
      : ["Verkeerde target in teamfights", "Jy het die tank of frontline gefokus terwyl die enemy carry bly lewe en jou span doodgemaak het. Om hul frontline te doodmaak wen nie fights nie — om hul damage dealers te verwyder wel. Die tank is ontwerp om jou damage te absorbeer. Loop verby hulle en slaan wie ook al jou span bedreig."]);
    improvements.push(en
      ? ["Pick your job before the fight", "Before every fight decide: am I diving their backline, shredding their frontline, peeling for my carry, or zoning their flanks? Know your job before the first ability is cast."]
      : ["Kies jou job voor die fight", "Voor elke fight besluit: duik ek in hul backline, shred ek hul frontline, peel ek vir my carry, of zone ek hul flanke? Ken jou job voor die eerste vermoë gegooi word."]);
  } else if (data.teamfightPattern === "splitTooMuch") {
    mistakes.push(en
      ? ["Split-pushing while team fights", "Your side push is only worth it if you take a tower or force 2+ enemies to follow. Otherwise your team is fighting 4v5 and losing because of it. A tower you took while your team lost the game-deciding fight does not matter."]
      : ["Splitpush terwyl span veg", "Jou side push is net die moeite werd as jy 'n toren vat of 2+ enemies forseer om te volg. Anders veg jou span 4v5 en verloor daardeur. 'n Toren wat jy gevat het terwyl jou span die game-bepalende fight verloor het, maak nie saak nie."]);
    improvements.push(en
      ? ["Split with TP or not at all", "Only split when you have TP ready to join a fight, or when your team is safe and cannot be engaged on. Otherwise, group and fight."]
      : ["Splitpush met TP of glad nie", "Split slegs wanneer jy TP gereed het om 'n fight te join, of wanneer jou span veilig is en nie op geengage kan word nie. Anders, groepeer en veg."]);
  } else {
    positives.push(en
      ? ["Great teamfight value!", "You contributed damage, peel, engage, or presence exactly when your team needed it. Most players show up late or hit the wrong target — you did neither."]
      : ["Geweldige teamfight waarde!", "Jy het damage, peel, engage of teenwoordigheid gegee presies wanneer jou span dit nodig gehad het. Die meeste spelers arriveer laat of slaan die verkeerde target — jy het nie een van albei gedoen nie."]);
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
    mistakes.push(en
      ? ["Mental reset needed", "Your notes suggest tilt or frustration. That usually speeds up decisions without improving them."]
      : ["Mental reset", "Jou notas wys tilt/frustrasie. Dit maak gewoonlik volgende besluite vinniger maar swakker."]);
    improvements.push(en
      ? ["Short reset", "After a bad fight: breathe, reduce pings, and ask only: what is the next wave or objective?"]
      : ["Kort reset", "Na 'n slegte fight: haal asem, ping minder, vra net: wat is die volgende wave/objective?"]);
  }

  if (!mistakes.length) {
    mistakes.push(en
      ? ["Looks clean — keep tightening", "On this data your game looks stable with no obvious red flags. The next level of improvement is not fixing big mistakes, it is tightening the small ones: 5 extra CS here, a ward placed 10 seconds earlier there, an objective taken 20 seconds faster. Stack those tiny edges every game."]
      : ["Lyk skoon — bly vernou", "Op hierdie data lyk jou game stabiel sonder voor die hand liggende rooi vlae. Die volgende verbetering-vlak is nie groot foute regstel nie, dit is die klein een vernou: 5 ekstra CS hier, 'n ward 10 sekondes vroeer geplaas daar, 'n objective 20 sekondes vinniger gevat. Stapel daai klein voordele elke game."]);
  }

  if (!improvements.length) {
    improvements.push(en
      ? ["Push your strengths even harder", "Pick your best skill from this game and take it up another level: lane lead into plates, faster objective rotations, or vision in deeper positions."]
      : ["Druk jou sterkpunte nog harder", "Kies jou beste vaardigheid van hierdie game en neem dit 'n vlak hoer: lane lead na plates, vinniger objective rotasies, of vision in dieper posisies."]);
  }

  if (!positives.length) {
    positives.push(en
      ? ["You reviewed instead of just raging — that matters", "Most players close the client and repeat the same mistakes next game. You stopped to analyse. That habit alone will take you further than any tip in this app."]
      : ["Jy het gereview eerder as net te rage — dit tel", "Die meeste spelers sluit die kliënt en herhaal dieselfde foute volgende game. Jy het gestop om te analiseer. Daai gewoonte alleen sal jou verder neem as enige wenk in hierdie app."]);
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

  const levelTip = currentLang === "en"
    ? {
        bronze: "Keep it simple: one habit per game, no fancy plays needed.",
        gold: "Track the habit every game and check if your deaths and objectives improve.",
        emerald: "Add timers and wave state to your decision before you move.",
        master: "Look for small tempo windows: reset timings, fog pressure, and cross-map trades.",
      }[data.skillLevel]
    : {
        bronze: "Hou dit eenvoudig: een habit per game, geen fancy plays nodig nie.",
        gold: "Meet die habit elke game en kyk of jou deaths/objectives verbeter.",
        emerald: "Voeg timers en wave state by jou besluit voordat jy beweeg.",
        master: "Soek klein tempo windows: reset timings, fog pressure en cross-map trades.",
      }[data.skillLevel];

  const plans = currentLang === "en" ? {
    laning: [
      ["Laning drill", "First 10 minutes: only trade when your wave is bigger, an enemy key cooldown is down, or the enemy is going to last-hit."],
      ["Wave check", "Before every recall or roam: can I crash the wave? If not, stay and fix the wave first."],
      ["Review marker", "Rewatch only minutes 1–6 and mark the first trade that made the lane difficult."],
    ],
    farm: [
      ["CS target", `Aim for ${Math.max(5, target.cs - 0.5).toFixed(1)} CS/min for ${data.gamesToday} games. Skip random fights with no objective payoff.`],
      ["Mid game route", "After laning: catch side wave, move through vision, group for objective. Repeat every wave cycle."],
      ["Free wave rule", "If a wave is crashing under your tower, take it before standing around mid."],
    ],
    jungleTracking: [
      ["First clear read", "At 1:30 ask where the enemy jungler started. At 3:15 ping where they are likely to be."],
      ["Gank timer", "Play safe when your wave is pushed and the enemy jungler's side is unknown."],
      ["Review marker", "Every death before 8 minutes: was the enemy jungler's position known or guessed?"],
    ],
    topWave: [
      ["Top wave control", "Play the first 4 waves for wave state: slow push, crash, reset, or freeze. Never fight on a bad wave."],
      ["Side lane plan", "After laning: push the side wave only to where you have vision, then rotate to objectives or pull pressure safely."],
      ["TP / rotate check", "Before splitting: can you TP to the dragon/baron fight in time, or do you take tower while they fight?"],
    ],
    jungleTempo: [
      ["Clear with purpose", "Every clear path must end with a reason: gank, invade, objective, countergank, or reset. No random walking."],
      ["Lane state read", "Gank lanes that are set up: enemy pushed, teammate has CC, or enemy flash is down. Force fewer low-chance ganks."],
      ["Objective setup", "45–90 seconds before an objective: clear toward that side and place vision before the enemy gets there."],
    ],
    midTempo: [
      ["Mid priority", "Crash the wave before roaming. If you roam on a bad wave, you lose minions and give enemy tempo back."],
      ["Roam window", "Roam after cannon wave, an enemy recall, or when your jungler is playing the same side."],
      ["Fog pressure", "If you cannot roam, disappear briefly from vision so side lanes are forced to respect you."],
    ],
    adcPositioning: [
      ["Damage without dying", "Before a fight: stand where you can hit the nearest threat without walking through frontline or CC."],
      ["Wave income", "Catch safe waves until your item spike. Do not ARAM mid when there are free bot or top waves under tower."],
      ["Threat tracking", "Keep the enemy engage spell in your head. You can only step forward once it is used or on cooldown."],
    ],
    supportVision: [
      ["Vision line", "Ward where your team wants to play next, not just the bush beside you."],
      ["Roam timing", "Roam after the bot wave crashes or when your ADC can farm safely. Never abandon a losing wave."],
      ["Peel or engage", "Before a fight, decide your job: engage, peel, or vision denial. Do not play half-half."],
    ],
    objectives: [
      ["90 second rule", "90 seconds before dragon/baron: push your wave, reset, buy a control ward, and move first."],
      ["No late river", "Never enter river when the objective has already spawned and vision is lost. Trade cross-map if you are late."],
      ["Kill conversion", "After every kill: pick tower, objective, invade, deep ward, or reset. No aimless chasing."],
    ],
    teamfights: [
      ["Job before fight", "Before the fight starts, say your role out loud: engage, peel, frontline damage, backline dive, or zone."],
      ["Cooldown check", "Only commit when your key spell and escape are up, or when the enemy key cooldown is down."],
      ["Replay marker", "Rewatch the first 3 seconds of every fight: was your position right before it started?"],
    ],
    playingAhead: [
      ["Use your lead", "When you are ahead: push waves, place deep vision, take jungle camps and objectives. No 50/50 chasing without payoff."],
      ["Protect your shutdown", "If you have a big shutdown bounty, only fight with vision and teammates close. Your death is their comeback."],
      ["Close it out", "Every lead must convert to tower, dragon/baron, inhibitor pressure, or enemy jungle control — not just more kills."],
    ],
    playingBehind: [
      ["Stabilise first", "When behind: farm under tower, give up bad waves, and only fight with numbers advantage or a shutdown opportunity."],
      ["No fair fights", "Do not take 1v1 or 2v2 fights when your items are behind. Play for picks, traps, and enemy mistakes instead."],
      ["Build back income", "Find free side waves and safe jungle camps. Your goal is reaching an item spike, not making flashy plays."],
    ],
    vision: [
      ["Ward with purpose", "Ward where you want to play next, not just where you are standing now."],
      ["Dark map rule", "If two or more enemies are missing, do not push another wave without vision, an escape spell, or a teammate nearby."],
      ["Control ward habit", "Buy a control ward before objective setup, not after the fight has already started."],
    ],
  } : {
    laning: [
      ["Laning drill", "Vir die eerste 10 minute: trade net wanneer jou wave groter is, enemy key cooldown uit is, of enemy gaan last-hit."],
      ["Wave vraag", "Voor elke recall/roam: kan ek die wave crash? As nee, bly en fix eers die wave."],
      ["Review marker", "Kyk net na minute 1-6 terug en merk die eerste trade wat die lane moeilik gemaak het."],
    ],
    farm: [
      ["CS teiken", `Mik vir ${Math.max(5, target.cs - 0.5).toFixed(1)} CS/min vir ${data.gamesToday} games. Ignoreer random fights wat geen objective gee nie.`],
      ["Mid game roete", "Na lane fase: catch side wave, beweeg deur vision, groepeer vir objective. Herhaal dit elke wave cycle."],
      ["Free wave reël", "As daar 'n wave onder jou tower inkom, vat dit voordat jy mid rondstaan."],
    ],
    jungleTracking: [
      ["Eerste clear lees", "By 1:30: vra waar enemy jungler begin het. By 3:15: ping waar hy waarskynlik eindig."],
      ["Gank timer", "Speel veilig wanneer jou wave gepush is en enemy jungler se kant onbekend is."],
      ["Review marker", "Elke death voor 8 minute: was enemy jungler se posisie bekend of geraai?"],
    ],
    topWave: [
      ["Top wave beheer", "Speel die eerste 4 waves vir wave state: slow push, crash, reset of freeze. Moenie fight as jou wave sleg is nie."],
      ["Side lane plan", "Na lane fase: druk side wave net tot waar jy vision het, dan beweeg na objective of trek pressure veilig."],
      ["TP / rotate check", "Voor jy split: kan jy betyds by dragon/baron fight wees, of vat jy tower as hulle fight?"],
    ],
    jungleTempo: [
      ["Clear met doel", "Elke clear moet eindig met 'n rede: gank, invade, objective, countergank of reset. Moenie random rondloop nie."],
      ["Lane state lees", "Gank lanes wat setup het: enemy gepush, teammate CC, of enemy flash down. Force minder low-chance ganks."],
      ["Objective setup", "45-90 sekondes voor objective: clear na daardie kant toe en sit vision voor die enemy daar is."],
    ],
    midTempo: [
      ["Mid prioriteit", "Crash wave voor roam. As jy nie crash nie, verloor jy tempo en minions vir 'n coinflip roam."],
      ["Roam venster", "Roam na cannon wave, enemy recall, of wanneer jou jungler dieselfde kant speel."],
      ["Fog druk", "As jy nie kan roam nie, verdwyn kort uit vision sodat side lanes moet respekteer."],
    ],
    adcPositioning: [
      ["Skade sonder dood", "Voor fight: staan waar jy die naaste threat kan hit sonder om deur frontline/CC te loop."],
      ["Wave inkomste", "Catch safe waves tot jou item spike. Moenie mid rondstaan as daar free bot/top wave onder tower is nie."],
      ["Threat opsporing", "Hou enemy engage spell in jou kop. Jy mag eers vorentoe stap wanneer dit gemis of gebruik is."],
    ],
    supportVision: [
      ["Vision lyn", "Ward die kant waar jou span volgende wil speel, nie net die bush langs jou nie."],
      ["Roam tydsberekening", "Roam nadat bot wave crash of jou ADC veilig kan farm. Moenie jou ADC in 'n doomed wave los nie."],
      ["Peel of engage", "Voor fight: besluit of jou job engage, peel of vision denial is. Moenie half-half speel nie."],
    ],
    objectives: [
      ["90 sekonde reël", "By 90 sekondes voor dragon/baron: push wave, reset, koop control ward, beweeg eerste."],
      ["Geen laat rivier", "Moenie eers river instap wanneer objective reeds spawn en vision verloor is nie. Trade cross-map as jy laat is."],
      ["Kill omskakeling", "Na elke kill: kies tower, objective, invade, deep ward of reset. Geen doelloose chase nie."],
    ],
    teamfights: [
      ["Job voor fight", "Voor fight begin, sê jou job hardop: engage, peel, frontline damage, backline dive, of zone."],
      ["Cooldown check", "Commit eers wanneer jou belangrikste spell en escape beskikbaar is, of wanneer enemy key cooldown uit is."],
      ["Replay marker", "Kyk die eerste 3 sekondes van elke fight: was jou posisie reg voordat die fight begin het?"],
    ],
    playingAhead: [
      ["Lead omskakeling", "As jy voor is: druk wave, sit deep vision, vat jungle camp/objective. Geen 50/50 chase sonder payoff nie."],
      ["Shutdown beskerming", "As jy 'n groot shutdown het, fight net met vision en teammate range. Jou death is die enemy se comeback."],
      ["Sluit die game", "Elke lead moet eindig in tower, dragon/baron, inhibitor druk, of enemy jungle control — nie net meer kills nie."],
    ],
    playingBehind: [
      ["Stabiliseer eers", "As jy agter is: farm onder tower, gee slegte waves op, en fight net met numbers advantage of shutdown setup."],
      ["Geen fair fights", "Moenie 1v1/2v2 vat as items agter is nie. Speel vir picks, traps en enemy mistakes."],
      ["Bou inkomste terug", "Soek free side waves en safe camps. Jou doel is item breakpoint, nie hero play nie."],
    ],
    vision: [
      ["Ward met doel", "Ward die kant waar jy volgende wil speel, nie net waar jy nou staan nie."],
      ["Donker map reël", "As twee enemies missing is, push nie nog een wave sonder vision, escape spell of teammate naby nie."],
      ["Control ward gewoonte", "Koop control ward voor objective setup, nie na die fight klaar begin het nie."],
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
    .map(([title, body], i) => `
      <article class="habit-accordion" data-open="false">
        <button class="habit-header" type="button" aria-expanded="false" aria-controls="habit-body-${i}">
          <span class="habit-title">${title}</span>
          <span class="habit-chevron" aria-hidden="true">›</span>
        </button>
        <div class="habit-body" id="habit-body-${i}" hidden>
          <p>${body}</p>
        </div>
      </article>
    `)
    .join("");

  outputs.proHabits.querySelectorAll(".habit-header").forEach((btn) => {
    btn.addEventListener("click", () => {
      const article = btn.closest(".habit-accordion");
      const open = article.dataset.open === "true";
      article.dataset.open = open ? "false" : "true";
      btn.setAttribute("aria-expanded", String(!open));
      const body = article.querySelector(".habit-body");
      body.hidden = open;
    });
  });
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

function buildRolePlaybook(data, result) {
  const en = currentLang === "en";
  const role = data.role || "unknown";
  const ahead = data.goldState === "ahead";
  const behind = data.goldState === "behind";
  const cspm = result.csPerMin;
  const target = roleTargets[role] || roleTargets.unknown;
  const csAhead = cspm >= target.cs;

  const plays = {
    adc: en ? [
      {
        situation: "After a kill",
        title: ahead || csAhead ? "Push for plates — you outscale them right now" : "Shove the wave then decide",
        body: `Health above 60% AND their support is dead too? Push the next tower for plates (~160g each) then take dragon if it's up. Health low? Shove the wave under their tower, then recall — dying again resets all your momentum.`,
      },
      {
        situation: "CS advantage",
        title: "Your gold lead is your power spike window",
        body: `You have more items than them right now. Use it: push for a tower dive with your support, zone them under tower, or force a 2v2 trade when you know you win it. This window closes when they back and spend.`,
      },
      {
        situation: "You got killed",
        title: "Recover safely — no revenge trades",
        body: `Farm under tower and rebuild to your next item spike. One more death snowballs their support too. Look for a 2v1 opportunity when their ADC overextends — that's your comeback moment.`,
      },
      {
        situation: "Objective coming up",
        title: "Shove wave → ward river → position",
        body: `90 seconds before dragon: crash the wave, tell your support to ward the pit, then walk toward dragon. Your job is sustained DPS and not dying in the first 5 seconds of the fight.`,
      },
    ] : [
      {
        situation: "Na 'n kill",
        title: ahead || csAhead ? "Push vir plates — jy outscale hulle nou" : "Shove die wave dan besluit",
        body: `Gesondheid bo 60% EN hul support ook dood? Push die toren vir plates (~160g elk) dan vat dragon as dit op is. Gesondheid laag? Shove die wave onder hul toren, dan recall — nog 'n death reset al jou momentum.`,
      },
      {
        situation: "CS voordeel",
        title: "Jou goud-voorsprong is jou power spike venster",
        body: `Jy het meer items as hulle nou. Gebruik dit: push vir 'n toren dive met jou support, zone hulle onder toren, of force 'n 2v2 trade wanneer jy weet jy wen dit. Hierdie venster sluit wanneer hulle terug gaan en spend.`,
      },
      {
        situation: "Jy is doodgemaak",
        title: "Herstel veilig — geen wraak trades nie",
        body: `Farm onder toren en herbou na jou volgende item spike. Nog een death snowball ook hul support. Soek 'n 2v1 geleentheid wanneer hul ADC te ver uitstrek — dit is jou comeback oomblik.`,
      },
      {
        situation: "Objective kom op",
        title: "Shove wave → ward rivier → posisioneer",
        body: `90 sekondes voor dragon: crash die wave, sê jou support moet die put ward, dan loop na dragon. Jou job is volgehoue DPS en om nie in die eerste 5 sekondes te sterf nie.`,
      },
    ],

    support: en ? [
      {
        situation: "Your ADC just got a kill",
        title: "Read ADC health before you decide",
        body: `ADC healthy and enemy support dead? Rotate mid for a 3v2 or set deep river vision for the next objective. ADC low health? Stay — shove the wave under their tower first, then let them recall safely.`,
      },
      {
        situation: "Enemy carry just died",
        title: "Ward the objective pit before they respawn",
        body: `Push the tower immediately. Then place a control ward inside the dragon or baron pit. Your vision in those 30–40 seconds is worth more than any kill — it sets up the next fight before they even get back.`,
      },
      {
        situation: "On every recall",
        title: "Always buy a control ward",
        body: `Every single back: control ward first. Then walk to the dragon side and place it before returning to lane. If you skip this once, the enemy support will have better vision than you for the next 3 minutes.`,
      },
      {
        situation: "Your ADC is ahead",
        title: "Shift from protecting to enabling",
        body: `Your job changes when your ADC is winning. Stop playing reactive and start placing deep vision where the next objective is. Look for a roam mid to create a 3v2 — your ADC can farm safely while you make plays.`,
      },
    ] : [
      {
        situation: "Jou ADC het 'n kill gekry",
        title: "Lees ADC gesondheid voor jy besluit",
        body: `ADC gesond en enemy support dood? Roteer mid vir 'n 3v2 of sit diep rivier vision vir die volgende objective. ADC lae gesondheid? Bly — shove die wave onder hul toren eers, dan laat hulle veilig recall.`,
      },
      {
        situation: "Enemy carry is dood",
        title: "Ward die objective put voor hulle respawn",
        body: `Push die toren onmiddellik. Plaas dan 'n control ward binne die dragon of baron put. Jou vision in daardie 30–40 sekondes is meer werd as enige kill — dit stel die volgende fight op voordat hulle terug kom.`,
      },
      {
        situation: "By elke recall",
        title: "Koop altyd 'n control ward",
        body: `Elke enkele recall: control ward eerste. Loop dan na die dragon kant en plaas dit voor jy na lane terugkeer. As jy dit een keer oorslaan, het die enemy support beter vision as jy vir die volgende 3 minute.`,
      },
      {
        situation: "Jou ADC is voor",
        title: "Skuif van beskerm na aktiveer",
        body: `Jou job verander wanneer jou ADC wen. Stop met reaktief speel en begin diep vision plaas waar die volgende objective is. Soek 'n roam mid vir 'n 3v2 — jou ADC kan veilig farm terwyl jy plays maak.`,
      },
    ],

    jungle: en ? [
      {
        situation: "You killed a laner",
        title: "Check the objective timer NOW",
        body: `Dragon/herald alive and within 90 seconds? Start it immediately — you have a numbers advantage. Not yet? Take their nearest jungle camp (free gold), then look at the opposite side for another gank or a second objective.`,
      },
      {
        situation: "You killed the enemy jungler",
        title: "Invade their whole side of the jungle",
        body: `This is your free window. Walk into their jungle and take every camp you can see — they cannot contest anything. Take the camp they just cleared AND their side camps. This snowballs your next objective fight.`,
      },
      {
        situation: "After clearing a camp",
        title: "Always clear toward the next objective",
        body: `Plan your path before you start: clear camps on the same side as the next dragon or herald. When you finish your clear, you're already in position to fight or set vision — you never walk across the whole map empty.`,
      },
      {
        situation: "A laner is winning",
        title: "Take tempo to the objective side",
        body: `Stop repeatedly ganking the same winning lane. Take the tempo to the objective side instead — set vision for dragon, contest their jungler's camps, and look for cross-map pressure that forces a fight on YOUR terms.`,
      },
    ] : [
      {
        situation: "Jy het 'n laner doodgemaak",
        title: "Check die objective timer NOU",
        body: `Dragon/herald lewendig en binne 90 sekondes? Begin dit onmiddellik — jy het 'n nommers voordeel. Nog nie? Vat hul naaste jungle camp (gratis goud), dan kyk na die teenoorgestelde kant vir 'n ander gank of 'n tweede objective.`,
      },
      {
        situation: "Jy het die enemy jungler doodgemaak",
        title: "Invade hul hele kant van die jungle",
        body: `Dit is jou gratis venster. Loop in hul jungle en vat elke camp jy kan sien — hulle kan niks betwis nie. Vat die camp wat hulle pas gecleared het EN hul side camps. Dit snowball jou volgende objective fight.`,
      },
      {
        situation: "Na 'n camp clear",
        title: "Clear altyd na die volgende objective toe",
        body: `Beplan jou pad voor jy begin: clear camps aan dieselfde kant as die volgende dragon of herald. Wanneer jy jou clear klaarmaak, is jy al in posisie om te fight of vision te sit — jy loop nooit leeg oor die hele map nie.`,
      },
      {
        situation: "'n Laner wen",
        title: "Neem tempo na die objective kant",
        body: `Stop om dieselfde wenner lane herhaaldelik te gank. Neem die tempo na die objective kant eerder — sit vision vir dragon, betwis hul jungler se camps, en soek cross-map druk wat 'n fight op JOU terme forseer.`,
      },
    ],

    mid: en ? [
      {
        situation: "You just killed the enemy mid",
        title: "Crash the wave FIRST, then roam",
        body: `Get the cannon minion under their tower before you move. That shove gives you 15–20 seconds of free roam time. Is dragon alive? Shove and ping your team to start it. Bot or top losing? Walk over — a 3v2 or 4v3 changes the whole game.`,
      },
      {
        situation: "Your wave is shoved in",
        title: "This is your roam window — use it",
        body: `Walk toward bot for a 3v2 or top to set up a herald dive. Even if you do not get a kill, your presence forces the enemy laners to play back. Disappear briefly from vision — side laners must respect the possibility you are there.`,
      },
      {
        situation: "You are ahead",
        title: "Mid pressure = the whole map scared",
        body: `Use your gold advantage to push the enemy mid tower. A fallen mid tower lets you roam freely and forces enemies to defend. Your CS lead means your items are stronger — trade, push, and make them react to you.`,
      },
      {
        situation: "You got killed",
        title: "Shove the next wave, ward, reset mentally",
        body: `Do not try to revenge trade immediately. Shove the next wave to their tower, place a ward at the river entrance, then ask your jungler to give you cover. One clean wave crash puts you back in the game faster than a coinflip rematch.`,
      },
    ] : [
      {
        situation: "Jy het die enemy mid doodgemaak",
        title: "Crash die wave EERS, dan roam",
        body: `Kry die cannon minion onder hul toren voor jy beweeg. Daardie shove gee jou 15–20 sekondes gratis roam tyd. Is dragon lewendig? Shove en ping jou span om dit te begin. Bot of top verloor? Loop oor — 'n 3v2 of 4v3 verander die hele game.`,
      },
      {
        situation: "Jou wave is ingeshove",
        title: "Dit is jou roam venster — gebruik dit",
        body: `Loop na bot vir 'n 3v2 of top om 'n herald dive op te stel. Al kry jy nie 'n kill nie, forseer jou teenwoordigheid die enemy laners om terug te speel. Verdwyn kort uit vision — side laners moet die moontlikheid respekteer dat jy daar is.`,
      },
      {
        situation: "Jy is voor",
        title: "Mid druk = die hele map bang",
        body: `Gebruik jou goud voordeel om die enemy mid toren te push. 'n Gevalle mid toren laat jou vry roam en forseer enemies om te verdedig. Jou CS voorsprong beteken jou items is sterker — trade, push, en laat hulle op jou reageer.`,
      },
      {
        situation: "Jy is doodgemaak",
        title: "Shove die volgende wave, ward, reset",
        body: `Moenie probeer om onmiddellik wraak te neem nie. Shove die volgende wave na hul toren, plaas 'n ward by die rivier ingang, dan vra jou jungler vir cover. Een skoon wave crash sit jou vinniger terug in die game as 'n coinflip rematch.`,
      },
    ],

    top: en ? [
      {
        situation: "You just got a kill",
        title: "TP up? Convert to dragon side. No TP? Take max plates.",
        body: `Have TP available? Push the wave for plates, then immediately TP to the dragon fight or rotate. No TP? Take every plate you can before they respawn (~160g each), then recall. A kill without plates or TP impact is half the value.`,
      },
      {
        situation: "You took their tower",
        title: "Rotate — an empty lane is wasted tempo",
        body: `Push the wave under their next tower and rotate toward dragon or baron side. If herald is up, call your jungler and take it into mid tower. A fallen top tower only matters if you make the enemy react to you elsewhere.`,
      },
      {
        situation: "You are losing lane",
        title: "Freeze near your tower and call for a gank",
        body: `Stop taking bad trades — let the wave crash under your tower and freeze it there. Ask your jungler to set up a gank. Give up plates if the alternative is another death. One good gank trade is worth more than 3 plates.`,
      },
      {
        situation: "Herald is spawning",
        title: "This is your biggest early game tool",
        body: `Coordinate with your jungler to take herald at 8–13 minutes. Use it on the mid tower — a free opening in mid is worth more than any kill. If you have TP and a side push, you can split-push top while your team fights around baron later.`,
      },
    ] : [
      {
        situation: "Jy het 'n kill gekry",
        title: "TP op? Converteer na dragon kant. Geen TP? Vat max plates.",
        body: `TP beskikbaar? Push die wave vir plates, dan onmiddellik TP na die dragon fight of roteer. Geen TP? Vat elke plate jy kan voor hulle respawn (~160g elk), dan recall. 'n Kill sonder plates of TP impak is half die waarde.`,
      },
      {
        situation: "Jy het hul toren gevat",
        title: "Roteer — 'n leë lane is gemors tempo",
        body: `Push die wave onder hul volgende toren en roteer na dragon of baron kant. As herald op is, roep jou jungler en vat dit na mid toren. 'n Gevalle top toren maak net saak as jy die enemy forseer om elders op jou te reageer.`,
      },
      {
        situation: "Jy verloor die lane",
        title: "Freeze naby jou toren en vra vir 'n gank",
        body: `Stop met slegte trades — laat die wave onder jou toren crash en freeze dit daar. Vra jou jungler om 'n gank op te stel. Gee plates op as die alternatief nog 'n death is. Een goeie gank trade is meer werd as 3 plates.`,
      },
      {
        situation: "Herald spawn binnekort",
        title: "Dit is jou grootste early game instrument",
        body: `Koördineer met jou jungler om herald by 8–13 minute te vat. Gebruik dit op die mid toren — 'n gratis opening in mid is meer werd as enige kill. As jy TP het en 'n side push, kan jy top split terwyl jou span later rondom baron veg.`,
      },
    ],

    unknown: en ? [
      {
        situation: "General",
        title: "Connect your League profile to unlock role-specific tips",
        body: "Once your role is detected (from lobby, champ select, or in-game), this panel will switch to specific plays for your role — what to do after a kill, when you are ahead, and how to use your gold advantage.",
      },
    ] : [
      {
        situation: "Algemeen",
        title: "Koppel jou League profiel vir rol-spesifieke wenke",
        body: "Sodra jou rol bespeur is (van lobby, champ select, of in-game), sal hierdie paneel verander na spesifieke plays vir jou rol — wat om te doen na 'n kill, wanneer jy voor is, en hoe om jou goud voordeel te gebruik.",
      },
    ],
  };

  return plays[role] || plays.unknown;
}

function renderRolePlaybook(data, result) {
  const en = currentLang === "en";
  const role = data.role || "unknown";
  const roleLabel = { top: "Top", jungle: "Jungle", mid: "Mid", adc: "ADC", support: "Support" }[role] || (en ? "Role" : "Rol");
  const cards = buildRolePlaybook(data, result);

  document.querySelector("#playbookEyebrow").textContent = en ? `${roleLabel} Playbook` : `${roleLabel} Speelboek`;
  document.querySelector("#coach-heading").textContent = en ? "What to do next" : "Wat om volgende te doen";

  outputs.rolePlaybook.innerHTML = cards.map((card) => `
    <div class="play-card">
      <div class="play-situation">${card.situation}</div>
      <strong>${card.title}</strong>
      <p>${card.body}</p>
    </div>
  `).join("");
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
    outputs.postGameSummary.textContent = getLiveTip(last?.stats);
  } else if (status === "idle" && !liveSession.saved) {
    outputs.postGameSummary.textContent = t("waitingSummary");
  }
}

function getLiveTip(stats) {
  if (!stats) return t("recordingSummary");
  const en = currentLang === "en";
  const role = liveSession.lastGame?.role || "unknown";
  const target = roleTargets[role] || roleTargets.unknown;
  const mins = stats.minutes || 1;
  const cspm = stats.cs / mins;
  const vpm = stats.vision / mins;
  const kda = (stats.kills + stats.assists) / Math.max(1, stats.deaths);
  const tips = [];

  // Bad: deaths spiking early
  if (stats.deaths >= 5 && mins <= 18) {
    const missedGold = stats.deaths * 300;
    tips.push(en
      ? `${stats.deaths} deaths — you've handed ~${missedGold}g in bounties to the enemy. Stop forcing plays. Farm under your tower, let them push to you, and wait for a clear window before engaging again.`
      : `${stats.deaths} deaths — jy het ~${missedGold}g in bounties aan die enemy gegee. Stop om plays te force. Farm onder jou toren, laat hulle na jou toe push, en wag vir 'n duidelike venster voor jy weer engage.`);
  } else if (stats.deaths >= 4 && mins < 15) {
    tips.push(en
      ? `${stats.deaths} deaths before 15 min — each one handed them gold AND objective tempo. Play under your tower now, freeze the wave, and let them make a mistake first.`
      : `${stats.deaths} deaths voor 15 min — elke een het hulle goud EN objective tempo gegee. Speel onder toren nou, freeze die wave, en laat hulle eerste 'n fout maak.`);
  }

  // Bad: CS falling behind
  if (cspm < target.cs * 0.75 && role !== "support") {
    const missedCs = Math.round((target.cs - cspm) * mins);
    const missedGold = missedCs * 20;
    tips.push(en
      ? `CS is ${cspm.toFixed(1)}/min — that is ~${missedCs} missed minions (~${missedGold}g) vs your target. That missing gold is why your items feel weak right now. Clear side waves before grouping mid.`
      : `CS is ${cspm.toFixed(1)}/min — dit is ~${missedCs} gemiste minions (~${missedGold}g) vs jou teiken. Daai missing goud is hoekom jou items nou swak voel. Clear side waves voor jy groepeer.`);
  }

  // Bad: no vision
  if (vpm < target.vision * 0.5 && mins > 10) {
    tips.push(en
      ? `Vision is ${vpm.toFixed(1)}/min — you are moving without knowing where the enemy is. Buy a control ward every recall. One ward placed in the right brush can win a dragon fight and save your life.`
      : `Vision is ${vpm.toFixed(1)}/min — jy beweeg sonder om te weet waar die enemy is. Koop 'n control ward elke recall. Een ward in die regte bos kan 'n dragon fight wen en jou lewe red.`);
  }

  // Good: great KDA
  if (kda >= 4 && stats.kills >= 3) {
    const objNote = stats.objectives >= 3
      ? (en ? " and taking objectives" : " en objectives vat")
      : (en ? " — now convert that lead into objectives" : " — skakel nou daai lead om na objectives");
    tips.push(en
      ? `Great game! KDA ${kda.toFixed(1)}${objNote}. Keep snowballing — push for towers and drakes before they can scale back into the game.`
      : `Goeie game! KDA ${kda.toFixed(1)}${objNote}. Hou aan om te snowball — push vir torens en drakes voor hulle terug in die game kan scale.`);
  }

  // Good: killing it early
  if (stats.kills >= 4 && mins <= 15 && stats.deaths <= 2) {
    tips.push(en
      ? `${stats.kills} kills, only ${stats.deaths} deaths before 15 min — you are dominating the early game. Punish it: push for plates, rotate for dragon, invade their jungle. Do not let them breathe.`
      : `${stats.kills} kills, slegs ${stats.deaths} deaths voor 15 min — jy domineer die vroeë game. Straf dit: push vir plates, roteer vir dragon, invade hul jungle. Moenie hulle laat asemhaal nie.`);
  }

  // Good: solid objectives
  if (stats.objectives >= 4 && kda >= 2) {
    tips.push(en
      ? `Excellent! ${stats.objectives} objectives — you are converting your lead into real map control. Keep setting vision 90 seconds before the next spawn and arrive first.`
      : `Uitstekend! ${stats.objectives} objectives — jy skakel jou lead om in regte map beheer. Hou aan om vision 90 sekondes voor die volgende spawn te stel en eerste aan te kom.`);
  }

  // Default
  if (!tips.length) {
    tips.push(en
      ? `${stats.kills}/${stats.deaths}/${stats.assists} — stay on your main focus this game. Waves, vision, objectives.`
      : `${stats.kills}/${stats.deaths}/${stats.assists} — bly op jou hooffokus hierdie game. Waves, vision, objectives.`);
  }
  return tips[Math.floor(Date.now() / 30000) % tips.length];
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

  const prevSnap = liveSession.snapshots.at(-1);
  liveSession.lastGame = game;
  liveSession.snapshots.push({
    at: Date.now(),
    champion: game.champion,
    role: game.role,
    stats: { ...game.stats },
  });
  liveSession.snapshots = liveSession.snapshots.slice(-240);
  renderLiveMonitor("recording");

  const overlayData = buildOverlayTip(game, prevSnap?.stats);
  window.liveOverlay?.push(overlayData);
  window.liveOverlay?.show(20, 20);
}

function buildOverlayTip(game, prevStats) {
  const en = currentLang === "en";
  const role = game.role || "unknown";
  const stats = game.stats;
  const target = roleTargets[role] || roleTargets.unknown;
  const mins = stats.minutes || 1;
  const cspm = stats.cs / mins;
  const vpm = stats.vision / mins;
  const kda = (stats.kills + stats.assists) / Math.max(1, stats.deaths);

  // Event detection vs previous snapshot
  const justKilled  = prevStats && stats.kills   > prevStats.kills;
  const justDied    = prevStats && stats.deaths  > prevStats.deaths;
  const newKills    = justKilled ? stats.kills  - prevStats.kills  : 0;
  const newDeaths   = justDied   ? stats.deaths - prevStats.deaths : 0;
  const isMultiKill = newKills >= 2;
  const isWinning   = kda >= 3 && stats.kills >= 3 && stats.deaths <= 3;
  const isBehind    = stats.deaths >= 5 || (kda < 1 && mins >= 10);

  // Objective timers
  const dragonSpawnMins = Math.ceil(mins / 5) * 5;
  const dragonSecs  = Math.round((dragonSpawnMins - mins) * 60);
  const baronUp     = mins >= 20;
  const heraldUp    = mins >= 8 && mins < 19.75;
  const baronSecs   = baronUp ? Math.round((Math.ceil((mins - 20) / 6) * 6 + 20 - mins) * 60) : 999;

  let situation = "";
  let tip = "";
  let goTo = "";
  let objectiveTimer = "";

  // ── PRIORITY 1: Just died ────────────────────────────────────────────────
  if (justDied) {
    goTo = "base";
    if (stats.deaths >= 5) {
      situation = en ? `Stop forcing (${stats.deaths} deaths)` : `Stop om te force (${stats.deaths} deaths)`;
      const t5 = {
        adc:     en ? `${stats.deaths} deaths — <strong>recall + buy</strong>. Play safe under tower. No revenge.` : `${stats.deaths} deaths — <strong>recall + koop</strong>. Veilig onder toren. Geen wraak.`,
        support: en ? `${stats.deaths} deaths — <strong>ward on recall</strong>. Stay behind your carry.`          : `${stats.deaths} deaths — <strong>ward op recall</strong>. Bly agter jou carry.`,
        jungle:  en ? `${stats.deaths} deaths — <strong>farm YOUR jungle only</strong>. Stop invading alone.`    : `${stats.deaths} deaths — <strong>farm net JOU jungle</strong>. Stop solo invade.`,
        mid:     en ? `${stats.deaths} deaths — <strong>shove wave, then recall</strong>. Come back full HP.`    : `${stats.deaths} deaths — <strong>shove wave, dan recall</strong>. Kom vol HP terug.`,
        top:     en ? `${stats.deaths} deaths — <strong>farm under tower</strong>. Give up plates, keep your life.` : `${stats.deaths} deaths — <strong>farm onder toren</strong>. Gee plates op, hou jou lewe.`,
        unknown: en ? `${stats.deaths} deaths — <strong>reset and play safe</strong>. No risky plays.`           : `${stats.deaths} deaths — <strong>reset en speel veilig</strong>. Geen risky plays.`,
      };
      tip = t5[role] || t5.unknown;
    } else {
      situation = en ? "You just died" : "Jy het net gesterf";
      const t1 = {
        adc:     en ? `Recall — <strong>let support shove</strong>. No revenge trade.`                : `Recall — <strong>laat support shove</strong>. Geen wraak trade.`,
        support: en ? `Ward objective side on recall. <strong>Vision now</strong> stops next death.`  : `Ward objective kant op recall. <strong>Vision nou</strong> stop volgende death.`,
        jungle:  en ? `Base until camps respawn. <strong>Don't invade while behind.</strong>`         : `Base tot camps respawn. <strong>Moenie invade terwyl agter nie.</strong>`,
        mid:     en ? `Shove wave under tower → <strong>recall</strong>. Back full HP.`              : `Shove wave onder toren → <strong>recall</strong>. Terug vol HP.`,
        top:     en ? `Farm under tower. <strong>Give up plates — your life > plates.</strong>`      : `Farm onder toren. <strong>Gee plates op — jou lewe > plates.</strong>`,
        unknown: en ? `<strong>Farm safely, reset</strong>. No immediate rematch.`                   : `<strong>Farm veilig, reset</strong>. Geen onmiddellike rematch.`,
      };
      tip = t1[role] || t1.unknown;
    }
  }
  // ── PRIORITY 2: Just got a kill ──────────────────────────────────────────
  else if (justKilled) {
    situation = isMultiKill
      ? (en ? `MULTI-KILL! +${newKills} 🔥` : `MULTI-KILL! +${newKills} 🔥`)
      : (en ? `Kill! +${newKills}` : `Kill! +${newKills}`);

    if (dragonSecs <= 120 && !baronUp) {
      goTo = "dragon";
      objectiveTimer = `Dragon ${formatCountdown(dragonSecs)}`;
      const td = {
        adc:     en ? `Dragon in ${formatCountdown(dragonSecs)} — <strong>push bot plates then rotate.</strong>` : `Dragon in ${formatCountdown(dragonSecs)} — <strong>push bot plates dan roteer.</strong>`,
        support: en ? `Ward dragon pit NOW. <strong>Ping team — take dragon.</strong>`                           : `Ward dragon put NOU. <strong>Ping span — vat dragon.</strong>`,
        jungle:  en ? `Dragon in ${formatCountdown(dragonSecs)} — <strong>SMITE IT NOW.</strong>`               : `Dragon in ${formatCountdown(dragonSecs)} — <strong>SMITE DIT NOU.</strong>`,
        mid:     en ? `Crash wave → <strong>rotate dragon. Ping team.</strong>`                                  : `Crash wave → <strong>roteer dragon. Ping span.</strong>`,
        top:     en ? `TP bot → <strong>take dragon.</strong> This is the window.`                              : `TP bot → <strong>vat dragon.</strong> Dit is die venster.`,
        unknown: en ? `Kill window — <strong>take dragon</strong> before they respawn.`                         : `Kill venster — <strong>vat dragon</strong> voor hulle respawn.`,
      };
      tip = td[role] || td.unknown;
    } else if (baronUp && baronSecs <= 120) {
      goTo = "baron";
      objectiveTimer = `Baron ${formatCountdown(baronSecs)}`;
      tip = en ? `Kill window — push to <strong>baron pit</strong> right now.` : `Kill venster — push na <strong>baron put</strong> nou dadelik.`;
    } else if (heraldUp) {
      goTo = "herald";
      tip = en ? `Kill → <strong>take herald NOW</strong>. Use it to destroy a tower.` : `Kill → <strong>vat herald NOU</strong>. Gebruik dit om 'n toren te vernietig.`;
    } else {
      goTo = "mid";
      const tk = {
        adc:     en ? `Push for <strong>plates</strong> (~160g each) if HP > 60%.`                         : `Push vir <strong>plates</strong> (~160g elk) as HP > 60%.`,
        support: en ? `Rotate mid for a <strong>3v2</strong> or ward the next objective pit.`               : `Roteer mid vir 'n <strong>3v2</strong> of ward die volgende objective put.`,
        jungle:  en ? `Take their <strong>jungle camps</strong> — they cannot stop you right now.`          : `Vat hul <strong>jungle camps</strong> — hulle kan jou nie stop nou nie.`,
        mid:     en ? `Crash wave → roam <strong>bot or top</strong>. Get more plates.`                     : `Crash wave → roam <strong>bot of top</strong>. Kry meer plates.`,
        top:     en ? `Take <strong>tower plates</strong> (~160g each) before they respawn.`                : `Vat <strong>toren plates</strong> (~160g elk) voor hulle respawn.`,
        unknown: en ? `Take the nearest <strong>tower or objective</strong>. Don't waste the window.`       : `Vat die naaste <strong>toren of objective</strong>. Moenie die venster mors nie.`,
      };
      tip = tk[role] || tk.unknown;
    }
  }
  // ── PRIORITY 3: CS falling behind ───────────────────────────────────────
  else if (cspm < target.cs * 0.72 && role !== "support") {
    const missedGs = Math.round((target.cs - cspm) * mins * 20);
    situation = en ? "Missing gold" : "Goud gemis";
    tip = en
      ? `${cspm.toFixed(1)} CS/min — ~${missedGs}g behind. <strong>Clear side wave</strong> before grouping.`
      : `${cspm.toFixed(1)} CS/min — ~${missedGs}g agter. <strong>Clear side wave</strong> voor groepeer.`;
    goTo = "mid";
  }
  // ── PRIORITY 4: Dying too much early ────────────────────────────────────
  else if (stats.deaths >= 4 && mins <= 15) {
    situation = en ? "Too many deaths" : "Te veel deaths";
    tip = en
      ? `${stats.deaths} deaths before 15 min — each one gave them gold AND tempo. <strong>Play under tower.</strong>`
      : `${stats.deaths} deaths voor 15 min — elke een het hulle goud EN tempo gegee. <strong>Speel onder toren.</strong>`;
    goTo = "base";
  }
  // ── PRIORITY 5: No vision ────────────────────────────────────────────────
  else if (vpm < target.vision * 0.5 && mins > 10) {
    situation = en ? "No vision" : "Geen vision";
    tip = en
      ? `Vision ${vpm.toFixed(1)}/min — you are moving <strong>blind</strong>. Buy control ward next recall.`
      : `Vision ${vpm.toFixed(1)}/min — jy beweeg <strong>blind</strong>. Koop control ward next recall.`;
    goTo = "mid";
  }
  // ── PRIORITY 6: You are winning — congratulate + push lead ──────────────
  else if (isWinning) {
    situation = en ? "You are winning!" : "Jy wen!";
    const tw = {
      adc:     en ? `KDA ${kda.toFixed(1)} — <strong>push plates</strong>, stay relevant, don't die.`   : `KDA ${kda.toFixed(1)} — <strong>push plates</strong>, bly relevant, moenie sterf.`,
      support: en ? `Ahead — <strong>deep ward</strong> and force next objective.`                       : `Voor — <strong>diep ward</strong> en force volgende objective.`,
      jungle:  en ? `KDA ${kda.toFixed(1)} — <strong>control objectives</strong>, not just kills.`      : `KDA ${kda.toFixed(1)} — <strong>beheer objectives</strong>, nie net kills.`,
      mid:     en ? `Ahead — crash wave, <strong>roam and snowball</strong> other lanes.`                : `Voor — crash wave, <strong>roam en snowball</strong> ander lanes.`,
      top:     en ? `Ahead — <strong>push plates or TP</strong> to help your team win fights.`           : `Voor — <strong>push plates of TP</strong> om jou span te help wen.`,
      unknown: en ? `KDA ${kda.toFixed(1)} — use this lead for <strong>objectives, not kills.</strong>` : `KDA ${kda.toFixed(1)} — gebruik lead vir <strong>objectives, nie kills.</strong>`,
    };
    tip = tw[role] || tw.unknown;
    goTo = dragonSecs <= 180 && !baronUp ? "dragon" : baronUp ? "baron" : "mid";
    if (dragonSecs <= 180 && !baronUp) objectiveTimer = `Dragon ${formatCountdown(dragonSecs)}`;
    else if (baronUp && baronSecs <= 180) objectiveTimer = `Baron ${formatCountdown(baronSecs)}`;
  }
  // ── PRIORITY 7: Objective window ────────────────────────────────────────
  else if (dragonSecs <= 90 && !baronUp) {
    goTo = "dragon";
    objectiveTimer = `Dragon ${formatCountdown(dragonSecs)}`;
    situation = en ? "Dragon soon" : "Dragon binnekort";
    tip = en
      ? `Dragon in <strong>${formatCountdown(dragonSecs)}</strong> — ward and position now.`
      : `Dragon in <strong>${formatCountdown(dragonSecs)}</strong> — ward en posisioneer nou.`;
  } else if (baronUp && baronSecs <= 90) {
    goTo = "baron";
    objectiveTimer = `Baron ${formatCountdown(baronSecs)}`;
    situation = en ? "Baron soon" : "Baron binnekort";
    tip = en
      ? `Baron in <strong>${formatCountdown(baronSecs)}</strong> — set vision now.`
      : `Baron in <strong>${formatCountdown(baronSecs)}</strong> — sit vision nou.`;
  } else if (heraldUp) {
    goTo = "herald";
    objectiveTimer = en ? "Herald up" : "Herald op";
    situation = en ? "Herald is up" : "Herald is op";
    tip = en ? `<strong>Take herald</strong> — use it to destroy a tower.` : `<strong>Vat herald</strong> — gebruik dit om 'n toren te vernietig.`;
  }
  // ── DEFAULT: role habit tip ──────────────────────────────────────────────
  else {
    situation = en ? "Stay focused" : "Bly gefokus";
    const td = {
      adc:     en ? `${stats.cs} CS — <strong>farm to your spike</strong> then play with your team.`  : `${stats.cs} CS — <strong>farm na jou spike</strong> dan speel met span.`,
      support: en ? `Ward the <strong>next objective side</strong>. Vision wins fights first.`         : `Ward die <strong>volgende objective kant</strong>. Vision wen fights eerste.`,
      jungle:  en ? `Clear toward <strong>next objective</strong>. Position beats ganks.`              : `Clear na <strong>volgende objective</strong>. Posisie klop ganks.`,
      mid:     en ? `Shove wave → <strong>look for a roam</strong>. Fog pressure costs nothing.`      : `Shove wave → <strong>soek 'n roam</strong>. Fog druk kos niks.`,
      top:     en ? `Manage your wave. <strong>Push plates</strong> when safe, freeze when not.`       : `Bestuur jou wave. <strong>Push plates</strong> as veilig, freeze as nie.`,
      unknown: en ? `${stats.kills}/${stats.deaths}/${stats.assists} — <strong>stay on your habit.</strong>` : `${stats.kills}/${stats.deaths}/${stats.assists} — <strong>bly by jou habit.</strong>`,
    };
    tip = td[role] || td.unknown;
    goTo = "mid";
  }

  // Always show an objective timer in the corner if one is close
  if (!objectiveTimer) {
    if (!baronUp && dragonSecs <= 180) objectiveTimer = `Dragon ${formatCountdown(dragonSecs)}`;
    else if (baronUp && baronSecs <= 180) objectiveTimer = `Baron ${formatCountdown(baronSecs)}`;
  }

  return { situation, tip, goTo: goTo || "mid", objectiveTimer };
}

function formatCountdown(secs) {
  if (secs <= 0) return "NOW";
  const m = Math.floor(secs / 60);
  const s = secs % 60;
  return m > 0 ? `${m}:${String(s).padStart(2, "0")}` : `${s}s`;
}

function finishLiveSession() {
  window.liveOverlay?.hide();
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
  renderRolePlaybook(data, result);
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
  const source = game.source && game.source !== game.queue ? ` | ${game.source}` : "";
  outputs.detectTitle.textContent = `${champion} | ${role}`;
  outputs.detectMeta.textContent = `${queueType} | ${mode}${source}`;

  if (game.queueType === "aram") {
    outputs.detectTitle.textContent = t("ignoredAramTitle");
    outputs.detectMeta.textContent = t("ignoredAramMeta");
  }
}

function renderUpdateStatus(status) {
  if (!status) return;
  const showStrip = ["available", "downloading", "ready", "error"].includes(status.state);
  document.querySelector("#updateStrip").classList.toggle("hidden", !showStrip);
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
    } else {
      finishLiveSession();
    }
    render();
  } catch (error) {
    activeProfile = null;
    renderProfile(null, error.message);
    finishLiveSession();
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

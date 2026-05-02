const appState = {
  accountName: "Alex Mercer",
  connected: false,
  screen: "auth",
  game: null,
  selectedRegionId: null,
  selectedProvince: null,
  selectedNodeId: null,
  selectedMovementUnitId: null,
  selectedUnitCommandMode: null,
  selectedUnitStackIds: [],
  unitStackAssignments: {},
  nextLocalStackId: 1,
  selectedUnitType: "infantry",
  movementOrders: {},
  movementRoutePreview: null,
  unitLocalPositions: {},
  unitProvinceAssignments: {},
  unitVisualStates: {},
  unitVisualFrame: null,
  unitVisualFrameAt: 0,
  captureProgress: {},
  provinceOwnerOverrides: {},
  gameplaySaveLoaded: false,
  gameplaySaveKey: "",
  gameplaySaveTimer: null,
  gameplayCaptureTickAt: 0,
  movementFrame: null,
  movementRenderTick: 0,
  socketReconnectTimer: null,
  socketReconnectAttempts: 0,
  leafletMap: null,
  leafletLayers: null,
  mapLibreMap: null,
  deckInstance: null,
  deckCollisionExtension: null,
  deckSelectedFeatureId: null,
  deckHoveredFeatureId: null,
  provinceEngine: null,
  provinceTooltip: null,
  provinceHoverFrame: null,
  deckViewFrame: null,
  deckLayerFrame: null,
  deckLayerSignature: "",
  deckCurrentLayers: [],
  deckUnitLayerSignature: "",
  deckZoomLevelIndex: 3,
  deckZoomWheelLockUntil: 0,
  deckZoomSnapFrame: null,
  deckFeatureCache: null,
  deckFeatureBoundsCache: new WeakMap(),
  deckFeatureAreaCache: new WeakMap(),
  countryLayer: null,
  provinceLayer: null,
  countryBorderLayer: null,
  countryLabelLayer: null,
  provinceLabelLayer: null,
  unitLayer: null,
  cityLayer: null,
  resourceNodeLayer: null,
  infrastructureLayer: null,
  geoDataLoaded: false,
  geoDataLoading: false,
  geoDataError: null,
  debugMapBuilt: false,
  debugMapLoading: false,
  debugMapError: null,
  debugMapData: null,
  debugZoom: null,
  debugSelectedProvinceId: null,
  debugSelectedProvinceName: "None",
  debugZoomTier: "far",
  debugZoomStep: "theater",
  debugLabelCollisionFrame: null,
  toastTimer: null,
};

const $ = (id) => document.getElementById(id);

const screenAuth = $("screen-auth");
const screenLobby = $("screen-lobby");
const screenGame = $("screen-game");
const loginForm = $("login-form");
const accountModeLabel = $("account-mode-label");
const accountUsernameInput = $("account-username");
const accountEmailInput = $("account-email");
const accountPasswordInput = $("account-password");
const accountMessage = $("account-message");
const commanderField = $("commander-field");
const emailField = $("email-field");
const loginAccountButton = $("login-account");
const previewWorldButton = $("preview-world");
const playerNameInput = $("player-name");
const connectionStatus = $("connection-status");
const tickValue = $("tick-value");
const serverName = $("server-name");
const topPlayer = $("top-player");
const lobbyCaption = $("lobby-caption");
const countryList = $("country-list");
const backToAuth = $("back-to-auth");
const previewFromLobby = $("preview-from-lobby");
const playerCountryName = $("player-country-name");
const playerCaption = $("player-caption");
const playerTrait = $("player-trait");
const stabilityFill = $("stability-fill");
const stabilityValue = $("stability-value");
const resourceGrid = $("resource-grid");
const productionGrid = $("production-grid");
const manpowerValue = $("manpower-value");
const selectedRegionType = $("selected-region-type");
const selectedRegion = $("selected-region");
const buildActions = $("build-actions");
const recruitActions = $("recruit-actions");
const movementActions = $("movement-actions");
const provinceCommandCard = $("province-command-card");
const closeProvincePanel = $("close-province-panel");
const playerViewLabel = $("player-view-label");
const diplomacyList = $("diplomacy-list");
const mapLibreMapContainer = $("maplibre-map");
const deckOverlayContainer = $("deck-overlay");
const leafletMapContainer = $("leaflet-map");
const terrainCanvas = $("terrain-canvas");
const gameMap = $("game-map");
const newsCount = $("news-count");
const newsFeed = $("news-feed");
const gamePlayer = $("game-player");
const gameDay = $("game-day");
const decisionPanel = $("decision-panel");
const decisionBody = $("decision-body");
const decisionActions = $("decision-actions");
const militaryOverview = $("military-overview");
const winStatus = $("win-status");
const toast = $("toast");

function showCommandCard(...classes) {
  if (!provinceCommandCard) return;
  provinceCommandCard.hidden = false;
  provinceCommandCard.classList.add("active", ...classes);
}

function hideCommandCard() {
  if (!provinceCommandCard) return;
  provinceCommandCard.classList.remove("active", "basic-province", "unit-command");
  provinceCommandCard.hidden = true;
}

const resourceLabels = {
  steel: "Steel",
  oil: "Oil",
  electronics: "Electronics",
  money: "Money",
};

const nodeKindLabels = {
  capital: "Capital",
  city: "Major City",
  money: "Finance",
  steel: "Steel",
  oil: "Oil",
  electronics: "Electronics",
  rare: "Rare Materials",
  industry: "Industry",
  military: "Military Base",
  airbase: "Airfield",
  naval: "Naval Port",
};

const nodeKindBadges = {
  capital: "CAP",
  city: "CITY",
  money: "$",
  steel: "STL",
  oil: "OIL",
  electronics: "ELC",
  rare: "RARE",
  industry: "IND",
  military: "MIL",
  airbase: "AIR",
  naval: "NAV",
};

const countryNameToId = {
  Germany: "germany",
  "Saudi Arabia": "saudi",
  Sweden: "sweden",
  "United States of America": "usa",
  "United States": "usa",
  Russia: "russia",
  China: "china",
  "United Kingdom": "uk",
  France: "france",
};

const countryIdToGeoName = {
  germany: "Germany",
  saudi: "Saudi Arabia",
  sweden: "Sweden",
  usa: "United States of America",
  russia: "Russia",
  china: "China",
  uk: "United Kingdom",
  france: "France",
};

const countryLabelPositions = {
  germany: [51.1, 10.2],
  saudi: [23.9, 45.2],
  sweden: [62.4, 16.7],
  usa: [39.8, -98.6],
  russia: [57.8, 70.0],
  china: [35.7, 103.8],
  uk: [54.2, -2.4],
  france: [46.6, 2.2],
};

const countryLabelOverrides = {
  "united states of america": { display: "UNITED STATES", tier: 1, coords: [-98.6, 39.8] },
  "united states": { display: "UNITED STATES", tier: 1, coords: [-98.6, 39.8] },
  canada: { display: "CANADA", tier: 1, coords: [-103.5, 58.2] },
  greenland: { display: "GREENLAND", tier: 1, coords: [-41.7, 72.0] },
  russia: { display: "RUSSIA", tier: 1, coords: [70.0, 57.8] },
  "russian federation": { display: "RUSSIA", tier: 1, coords: [70.0, 57.8] },
  china: { display: "CHINA", tier: 1, coords: [104.7, 35.1], labelMax: 12.2, fitWidth: 92, fitHeight: 44 },
  india: { display: "INDIA", tier: 1, coords: [78.6, 22.4], labelMax: 9.8, fitWidth: 60, fitHeight: 38 },
  brazil: { display: "BRAZIL", tier: 1, coords: [-53.2, -10.8] },
  australia: { display: "AUSTRALIA", tier: 1, coords: [134.5, -25.5] },
  france: { display: "FRANCE", tier: 2, coords: [2.25, 46.7], minStep: "theater", labelMax: 5.0, labelMin: 3.2, fitWidth: 30, fitHeight: 23 },
  germany: { display: "GERMANY", tier: 2, coords: [10.35, 51.15], minStep: "theater", labelMax: 4.7, labelMin: 3.0, fitWidth: 26, fitHeight: 23 },
  spain: { display: "SPAIN", tier: 2, coords: [-3.7, 40.2], minStep: "theater", labelMax: 5.2, labelMin: 3.2, fitWidth: 34, fitHeight: 25 },
  portugal: { display: "PORTUGAL", tier: 3, coords: [-8.0, 39.7], minStep: "theater", labelMax: 3.1, labelMin: 2.35, fitWidth: 14, fitHeight: 26 },
  italy: { display: "ITALY", tier: 2, coords: [12.4, 42.7], minStep: "theater", labelMax: 4.1, labelMin: 2.85, fitWidth: 24, fitHeight: 24 },
  poland: { display: "POLAND", tier: 2, coords: [19.1, 52.0], minStep: "theater", labelMax: 4.1, labelMin: 2.9, fitWidth: 28, fitHeight: 19 },
  belgium: { display: "BELGIUM", tier: 3, coords: [4.7, 50.7], minStep: "theater", labelMax: 2.45, labelMin: 1.9, fitWidth: 12, fitHeight: 8 },
  switzerland: { display: "SWISS", tier: 3, coords: [8.2, 46.8], minStep: "theater", labelMax: 2.55, labelMin: 1.95, fitWidth: 14, fitHeight: 8 },
  austria: { display: "AUSTRIA", tier: 3, coords: [14.1, 47.6], minStep: "theater", labelMax: 2.9, labelMin: 2.1, fitWidth: 20, fitHeight: 8 },
  hungary: { display: "HUNGARY", tier: 3, coords: [19.3, 47.0], minStep: "theater", labelMax: 2.85, labelMin: 2.05, fitWidth: 18, fitHeight: 8 },
  romania: { display: "ROMANIA", tier: 3, coords: [25.0, 45.9], minStep: "theater", labelMax: 3.55, labelMin: 2.25, fitWidth: 25, fitHeight: 15 },
  bulgaria: { display: "BULGARIA", tier: 3, coords: [25.1, 42.7], minStep: "theater", labelMax: 3.1, labelMin: 2.05, fitWidth: 22, fitHeight: 11 },
  croatia: { display: "CROATIA", tier: 3, coords: [16.4, 45.2], minStep: "theater", labelMax: 2.65, labelMin: 1.9, fitWidth: 18, fitHeight: 8 },
  czechia: { display: "CZECHIA", tier: 3, coords: [15.4, 49.8], minStep: "theater", labelMax: 2.75, labelMin: 2.0, fitWidth: 19, fitHeight: 8 },
  "czech republic": { display: "CZECHIA", tier: 3, coords: [15.4, 49.8], minStep: "theater", labelMax: 2.75, labelMin: 2.0, fitWidth: 19, fitHeight: 8 },
  netherlands: { display: "NETHERLANDS", tier: 3, coords: [5.3, 52.1], minStep: "theater", labelMax: 2.35, labelMin: 1.8, fitWidth: 12, fitHeight: 10 },
  denmark: { display: "DENMARK", tier: 3, coords: [9.7, 56.1], minStep: "theater", labelMax: 2.7, labelMin: 1.95, fitWidth: 14, fitHeight: 12 },
  greece: { display: "GREECE", tier: 3, coords: [22.2, 39.1], minStep: "theater", labelMax: 3.0, labelMin: 2.05, fitWidth: 19, fitHeight: 13 },
  turkey: { display: "TURKEY", tier: 2, coords: [35.3, 39.0], minStep: "theater", labelMax: 4.8, labelMin: 3.0, fitWidth: 43, fitHeight: 17 },
  ukraine: { display: "UKRAINE", tier: 2, coords: [31.3, 49.0], minStep: "theater", labelMax: 4.8, labelMin: 3.0, fitWidth: 42, fitHeight: 20 },
  sweden: { display: "SWEDEN", tier: 3, coords: [16.7, 62.4], minStep: "theater", labelMax: 3.9, labelMin: 2.45, fitWidth: 24, fitHeight: 39 },
  finland: { display: "FINLAND", tier: 3, coords: [26.2, 64.3], minStep: "theater", labelMax: 3.5, labelMin: 2.25, fitWidth: 21, fitHeight: 34 },
  "saudi arabia": { display: "SAUDI ARABIA", lines: ["SAUDI", "ARABIA"], tier: 2, coords: [44.9, 23.7], minStep: "theater", labelMax: 6.2, labelMin: 3.7, fitWidth: 46, fitHeight: 32 },
  "south africa": { display: "SOUTH AFRICA", tier: 2, coords: [24.3, -29.1] },
  sudan: { display: "SUDAN", tier: 3, coords: [30.1, 15.8], minStep: "theater", labelMax: 4.25, labelMin: 2.5, fitWidth: 33, fitHeight: 24 },
  iraq: { display: "IRAQ", tier: 3, coords: [43.7, 33.1], minStep: "theater", labelMax: 3.25, labelMin: 2.1, fitWidth: 20, fitHeight: 14 },
  iran: { display: "IRAN", tier: 2, coords: [53.4, 32.1], minStep: "theater", labelMax: 5.4, labelMin: 3.2, fitWidth: 46, fitHeight: 25 },
  "islamic republic of iran": { display: "IRAN", tier: 2, coords: [53.4, 32.1], minStep: "theater", labelMax: 5.4, labelMin: 3.2, fitWidth: 46, fitHeight: 25 },
  mongolia: { display: "MONGOLIA", tier: 2, coords: [103.3, 46.8], minStep: "theater", labelMax: 6.1, labelMin: 3.4, fitWidth: 58, fitHeight: 22 },
  japan: { display: "JAPAN", tier: 2, coords: [138.1, 37.7], minStep: "theater", labelMax: 4.1, labelMin: 2.55, fitWidth: 22, fitHeight: 34 },
  "south korea": { display: "KOREA", tier: 3, coords: [127.8, 36.4], minStep: "theater-plus", labelMax: 2.9, labelMin: 2.0, fitWidth: 13, fitHeight: 16 },
  "republic of korea": { display: "KOREA", tier: 3, coords: [127.8, 36.4], minStep: "theater-plus", labelMax: 2.9, labelMin: 2.0, fitWidth: 13, fitHeight: 16 },
  "north korea": { display: "N. KOREA", tier: 3, coords: [127.2, 40.1], minStep: "country", labelMax: 2.65, labelMin: 1.9, fitWidth: 13, fitHeight: 12 },
  "democratic people's republic of korea": { display: "N. KOREA", tier: 3, coords: [127.2, 40.1], minStep: "country", labelMax: 2.65, labelMin: 1.9, fitWidth: 13, fitHeight: 12 },
  afghanistan: { display: "AFGHANISTAN", tier: 3, coords: [66.2, 33.8], minStep: "theater", labelMax: 3.7, labelMin: 2.25, fitWidth: 30, fitHeight: 16 },
  pakistan: { display: "PAKISTAN", tier: 2, coords: [69.3, 29.9], minStep: "theater", labelMax: 4.7, labelMin: 2.85, fitWidth: 36, fitHeight: 21 },
  kazakhstan: { display: "KAZAKHSTAN", tier: 2, coords: [67.5, 48.2], minStep: "theater", labelMax: 6.8, labelMin: 3.8, fitWidth: 72, fitHeight: 26 },
  mexico: { display: "MEXICO", tier: 2, coords: [-102.5, 23.8], delayedWorld: true },
  "united kingdom": { display: "UNITED KINGDOM", lines: ["UNITED", "KINGDOM"], tier: 2, coords: [-2.6, 54.8], minStep: "theater", labelMax: 4.15, labelMin: 2.8, fitWidth: 22, fitHeight: 30 },
  norway: { display: "NORWAY", tier: 3, coords: [10.4, 64.7], minStep: "theater", labelMax: 3.35, labelMin: 2.15, fitWidth: 17, fitHeight: 42 },
  egypt: { display: "EGYPT", tier: 3, coords: [30.1, 26.8], minStep: "theater", labelMax: 4.0, labelMin: 2.45, fitWidth: 27, fitHeight: 20 },
  libya: { display: "LIBYA", tier: 3, coords: [17.2, 27.0], minStep: "theater", labelMax: 4.0, labelMin: 2.4, fitWidth: 35, fitHeight: 20 },
  algeria: { display: "ALGERIA", tier: 3, coords: [2.6, 28.0], minStep: "theater", labelMax: 4.6, labelMin: 2.65, fitWidth: 42, fitHeight: 24 },
  morocco: { display: "MOROCCO", tier: 3, coords: [-6.2, 31.8], minStep: "theater", labelMax: 3.35, labelMin: 2.1, fitWidth: 23, fitHeight: 15 },
  "democratic republic of the congo": { display: "DR CONGO", tier: 3, coords: [23.7, -2.8] },
  "dem rep congo": { display: "DR CONGO", tier: 3, coords: [23.7, -2.8] },
  "democratic republic of congo": { display: "DR CONGO", tier: 3, coords: [23.7, -2.8] },
  fiji: { display: "FIJI", tier: 3, hiddenFar: true },
  kiribati: { display: "KIRIBATI", tier: 3, hiddenFar: true },
};

const mapSources = {
  countries: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_0_countries.geojson",
  provinces: "https://raw.githubusercontent.com/nvkelso/natural-earth-vector/master/geojson/ne_10m_admin_1_states_provinces.geojson",
};

const debugCities = [
  { name: "London", coords: [-0.1276, 51.5072], type: "capital", tier: 1, priority: 1, country: "uk", label: { x: -15, y: -12, anchor: "end" } },
  { name: "Paris", coords: [2.3522, 48.8566], type: "capital", tier: 2, priority: 2, country: "france", label: { x: -14, y: 15, anchor: "end" } },
  { name: "Berlin", coords: [13.4050, 52.5200], type: "capital", tier: 2, priority: 2, country: "germany", label: { x: 14, y: -11, anchor: "start" } },
  { name: "Stockholm", coords: [18.0686, 59.3293], type: "capital", tier: 3, priority: 4, country: "sweden", label: { x: 12, y: -9, anchor: "start" } },
  { name: "Moscow", coords: [37.6173, 55.7558], type: "capital", tier: 1, country: "russia", label: { x: 13, y: 4, anchor: "start" } },
  { name: "Riyadh", coords: [46.6753, 24.7136], type: "capital", tier: 2, country: "saudi", label: { x: 13, y: 5, anchor: "start" } },
  { name: "Washington", coords: [-77.0369, 38.9072], type: "capital", tier: 1, country: "usa", label: { x: -12, y: 5, anchor: "end" } },
  { name: "Beijing", coords: [116.4074, 39.9042], type: "capital", tier: 1, country: "china", label: { x: 12, y: 5, anchor: "start" } },
  { name: "Hamburg", coords: [9.9937, 53.5511], type: "city", priority: 4, country: "germany", label: { x: -10, y: -7, anchor: "end" } },
  { name: "Munich", coords: [11.5820, 48.1351], type: "city", priority: 4, country: "germany", label: { x: 10, y: 10, anchor: "start" } },
  { name: "Gothenburg", coords: [11.9746, 57.7089], type: "city", priority: 5, country: "sweden", label: { x: -10, y: 8, anchor: "end" } },
  { name: "Madrid", coords: [-3.7038, 40.4168], type: "capital", tier: 3, priority: 4, country: null, label: { x: -11, y: 10, anchor: "end" } },
  { name: "Rome", coords: [12.4964, 41.9028], type: "capital", tier: 3, priority: 4, country: null, label: { x: 11, y: 10, anchor: "start" } },
  { name: "Warsaw", coords: [21.0122, 52.2297], type: "capital", tier: 3, priority: 4, country: null, label: { x: 12, y: 3, anchor: "start" } },
  { name: "Cairo", coords: [31.2357, 30.0444], type: "capital", tier: 3, priority: 3, country: null, label: { x: 12, y: 8, anchor: "start" } },
  { name: "Ankara", coords: [32.8597, 39.9334], type: "capital", tier: 3, priority: 4, country: null, label: { x: 11, y: -8, anchor: "start" } },
  { name: "Tehran", coords: [51.3890, 35.6892], type: "capital", tier: 3, priority: 4, country: null, label: { x: 12, y: 6, anchor: "start" } },
  { name: "Baghdad", coords: [44.3661, 33.3152], type: "capital", tier: 3, priority: 5, country: null, label: { x: 10, y: 8, anchor: "start" } },
  { name: "Istanbul", coords: [28.9784, 41.0082], type: "city", priority: 3, country: null, label: { x: -10, y: -8, anchor: "end" } },
  { name: "Alexandria", coords: [29.9187, 31.2001], type: "city", priority: 4, country: null, label: { x: -10, y: 8, anchor: "end" } },
  { name: "Casablanca", coords: [-7.5898, 33.5731], type: "city", priority: 4, country: null, label: { x: -10, y: 8, anchor: "end" } },
  { name: "Barcelona", coords: [2.1734, 41.3851], type: "city", priority: 4, country: null, label: { x: 10, y: 8, anchor: "start" } },
  { name: "Milan", coords: [9.1900, 45.4642], type: "city", priority: 4, country: null, label: { x: 10, y: -8, anchor: "start" } },
  { name: "Jeddah", coords: [39.1925, 21.4858], type: "port", country: "saudi", label: { x: -10, y: 8, anchor: "end" } },
  { name: "Hamburg Port", coords: [9.9937, 53.5511], type: "port", priority: 4, country: "germany", label: { x: -10, y: -9, anchor: "end" } },
  { name: "Piraeus Port", coords: [23.6469, 37.9420], type: "port", priority: 4, country: null, label: { x: 10, y: 8, anchor: "start" } },
  { name: "Ramstein Airbase", coords: [7.6003, 49.4369], type: "airbase", priority: 4, country: "germany", label: { x: 10, y: -8, anchor: "start" } },
  { name: "Incirlik Airbase", coords: [35.4259, 37.0021], type: "airbase", priority: 4, country: null, label: { x: 10, y: 8, anchor: "start" } },
  { name: "Dammam Oil", coords: [50.0888, 26.4207], type: "resource", country: "saudi", badge: "OIL", label: { x: 10, y: 8, anchor: "start" } },
  { name: "Ruhr Steel", coords: [7.2, 51.45], type: "resource", country: "germany", badge: "STL", label: { x: -10, y: 9, anchor: "end" } },
  { name: "Baltic Gate", coords: [18.5, 55.5], type: "choke", country: "sweden", badge: "SEA", label: { x: 10, y: 8, anchor: "start" } },
];

debugCities.push(
  { name: "Rabat", coords: [-6.8498, 34.0209], type: "capital", tier: 3, priority: 4, country: "morocco" },
  { name: "Casablanca", coords: [-7.5898, 33.5731], type: "city", priority: 3, country: "morocco" },
  { name: "Marrakech", coords: [-7.9811, 31.6295], type: "city", priority: 4, country: "morocco" },
  { name: "Algiers", coords: [3.0588, 36.7538], type: "capital", tier: 3, priority: 3, country: "algeria" },
  { name: "Oran", coords: [-0.6337, 35.6971], type: "city", priority: 4, country: "algeria" },
  { name: "Constantine", coords: [6.6147, 36.3650], type: "city", priority: 4, country: "algeria" },
  { name: "Tunis", coords: [10.1815, 36.8065], type: "capital", tier: 3, priority: 4, country: "tunisia" },
  { name: "Tripoli", coords: [13.1913, 32.8872], type: "capital", tier: 3, priority: 3, country: "libya" },
  { name: "Benghazi", coords: [20.0686, 32.1167], type: "city", priority: 4, country: "libya" },
  { name: "Sabha", coords: [14.4283, 27.0377], type: "city", priority: 4, country: "libya" },
  { name: "Nouakchott", coords: [-15.9785, 18.0735], type: "capital", tier: 3, priority: 4, country: "mauritania" },
  { name: "Atar", coords: [-13.0499, 20.5169], type: "city", priority: 5, country: "mauritania" },
  { name: "Bamako", coords: [-8.0029, 12.6392], type: "capital", tier: 3, priority: 4, country: "mali" },
  { name: "Timbuktu", coords: [-3.0074, 16.7666], type: "city", priority: 5, country: "mali" },
  { name: "Niamey", coords: [2.1254, 13.5116], type: "capital", tier: 3, priority: 4, country: "niger" },
  { name: "Agadez", coords: [7.9911, 16.9742], type: "city", priority: 5, country: "niger" },
  { name: "N'Djamena", coords: [15.0444, 12.1348], type: "capital", tier: 3, priority: 4, country: "chad" },
  { name: "Faya-Largeau", coords: [19.1111, 17.9257], type: "city", priority: 5, country: "chad" },
  { name: "Khartoum", coords: [32.5599, 15.5007], type: "capital", tier: 3, priority: 4, country: "sudan" },
  { name: "Port Sudan", coords: [37.2164, 19.6158], type: "city", priority: 4, country: "sudan" },
  { name: "Juba", coords: [31.5825, 4.8594], type: "capital", tier: 3, priority: 4, country: "south-sudan" },
  { name: "Addis Ababa", coords: [38.7578, 8.9806], type: "capital", tier: 3, priority: 4, country: "ethiopia" },
  { name: "Asmara", coords: [38.9251, 15.3229], type: "capital", tier: 3, priority: 5, country: "eritrea" },
  { name: "Djibouti", coords: [43.1456, 11.5721], type: "capital", tier: 3, priority: 5, country: "djibouti" },
  { name: "Mogadishu", coords: [45.3182, 2.0469], type: "capital", tier: 3, priority: 4, country: "somalia" },
  { name: "Nairobi", coords: [36.8219, -1.2921], type: "capital", tier: 3, priority: 3, country: "kenya" },
  { name: "Mombasa", coords: [39.6682, -4.0435], type: "city", priority: 4, country: "kenya" },
  { name: "Kampala", coords: [32.5825, 0.3476], type: "capital", tier: 3, priority: 4, country: "uganda" },
  { name: "Kigali", coords: [30.0619, -1.9441], type: "capital", tier: 3, priority: 5, country: "rwanda" },
  { name: "Bujumbura", coords: [29.3639, -3.3614], type: "city", priority: 5, country: "burundi" },
  { name: "Dar es Salaam", coords: [39.2083, -6.7924], type: "city", priority: 4, country: "tanzania" },
  { name: "Dodoma", coords: [35.7516, -6.1630], type: "capital", tier: 3, priority: 5, country: "tanzania" },
  { name: "Abuja", coords: [7.4951, 9.0765], type: "capital", tier: 3, priority: 3, country: "nigeria" },
  { name: "Lagos", coords: [3.3792, 6.5244], type: "city", priority: 3, country: "nigeria" },
  { name: "Kano", coords: [8.5167, 12.0000], type: "city", priority: 3, country: "nigeria" },
  { name: "Ibadan", coords: [3.9470, 7.3775], type: "city", priority: 4, country: "nigeria" },
  { name: "Accra", coords: [-0.1870, 5.6037], type: "capital", tier: 3, priority: 4, country: "ghana" },
  { name: "Kumasi", coords: [-1.6163, 6.6885], type: "city", priority: 4, country: "ghana" },
  { name: "Dakar", coords: [-17.4677, 14.7167], type: "capital", tier: 3, priority: 4, country: "senegal" },
  { name: "Conakry", coords: [-13.5784, 9.6412], type: "capital", tier: 3, priority: 5, country: "guinea" },
  { name: "Abidjan", coords: [-4.0083, 5.3599], type: "city", priority: 4, country: "c-te-d-ivoire" },
  { name: "Yamoussoukro", coords: [-5.2767, 6.8276], type: "capital", tier: 3, priority: 5, country: "c-te-d-ivoire" },
  { name: "Yaounde", coords: [11.5021, 3.8480], type: "capital", tier: 3, priority: 4, country: "cameroon" },
  { name: "Douala", coords: [9.7085, 4.0511], type: "city", priority: 4, country: "cameroon" },
  { name: "Bangui", coords: [18.5582, 4.3947], type: "capital", tier: 3, priority: 4, country: "central-african-republic" },
  { name: "Kinshasa", coords: [15.2663, -4.4419], type: "capital", tier: 3, priority: 3, country: "democratic-republic-of-the-congo" },
  { name: "Mbuji-Mayi", coords: [23.5898, -6.1360], type: "city", priority: 4, country: "democratic-republic-of-the-congo" },
  { name: "Brazzaville", coords: [15.2663, -4.2634], type: "capital", tier: 3, priority: 4, country: "republic-of-the-congo" },
  { name: "Libreville", coords: [9.4673, 0.4162], type: "capital", tier: 3, priority: 5, country: "gabon" }
);

const debugSupplyRoutes = [
  { name: "Rhine Strategic Corridor", tier: "primary", path: [[4.9, 52.4], [5.8, 51.9], [6.9, 51.5], [7.9, 50.7], [8.7, 50.1], [10.0, 49.2], [11.6, 48.1]] },
  { name: "Channel Command Corridor", tier: "primary", path: [[-0.1276, 51.5072], [0.8, 50.7], [2.3522, 48.8566], [6.1, 49.5], [9.2, 51.1], [13.4050, 52.5200]] },
  { name: "Northern Rail Axis", tier: "primary", path: [[13.4050, 52.5200], [17.0, 52.4], [21.0122, 52.2297], [26.8, 53.0], [32.0, 54.2], [37.6173, 55.7558]] },
  { name: "Mediterranean Supply Corridor", tier: "secondary", path: [[2.1734, 41.3851], [6.2, 42.7], [12.4964, 41.9028], [17.8, 40.4], [23.6469, 37.9420], [28.9784, 41.0082], [32.8597, 39.9334]] },
  { name: "Levant Energy Route", tier: "secondary", path: [[31.2357, 30.0444], [34.9, 31.8], [39.2, 33.1], [44.3661, 33.3152], [48.1, 34.4], [51.3890, 35.6892]] },
  { name: "Arabian Oil Route", tier: "secondary", path: [[46.6753, 24.7136], [49.1, 25.6], [50.0888, 26.4207], [46.5, 24.0], [42.2, 22.0], [39.1925, 21.4858]] },
  { name: "Iberian Logistics Arc", tier: "secondary", path: [[-3.7038, 40.4168], [-1.2, 41.0], [2.1734, 41.3851], [5.4, 43.3], [9.1900, 45.4642]] },
  { name: "North Africa Coastal Route", tier: "secondary", path: [[-7.5898, 33.5731], [-2.6, 35.1], [3.1, 36.7], [10.2, 36.8], [20.0, 32.7], [29.9187, 31.2001]] },
  { name: "Bavarian Provincial Road", tier: "local", path: [[8.7, 50.1], [9.7, 49.4], [10.8, 48.8], [11.6, 48.1], [12.4, 47.8]] },
  { name: "North German Provincial Road", tier: "local", path: [[7.2, 51.45], [8.6, 52.1], [9.9937, 53.5511], [11.2, 53.0], [13.4050, 52.5200]] },
  { name: "French Interior Road", tier: "local", path: [[2.3522, 48.8566], [3.6, 47.2], [4.8, 45.8], [6.1, 44.3], [7.3, 43.7]] },
  { name: "Nile Provincial Road", tier: "local", path: [[31.2357, 30.0444], [30.8, 29.2], [30.4, 28.1], [30.7, 26.6], [31.4, 25.7]] },
  { name: "Anatolian Provincial Road", tier: "local", path: [[28.9784, 41.0082], [30.4, 40.3], [32.8597, 39.9334], [34.1, 39.1], [35.4259, 37.0021]] },
];

const macroProvinceHubs = {
  germany: [
    { name: "Berlin", coords: [13.4050, 52.5200] },
    { name: "Hamburg", coords: [9.9937, 53.5511] },
    { name: "Munich", coords: [11.5820, 48.1351] },
    { name: "Frankfurt", coords: [8.6821, 50.1109] },
    { name: "Cologne", coords: [6.9603, 50.9375] },
    { name: "Stuttgart", coords: [9.1829, 48.7758] },
    { name: "Leipzig", coords: [12.3731, 51.3397] },
    { name: "Hanover", coords: [9.7320, 52.3759] },
  ],
  kosovo: [
    { name: "Pristina", coords: [21.1655, 42.6629] },
    { name: "Prizren", coords: [20.7397, 42.2139] },
    { name: "Mitrovica", coords: [20.8667, 42.8833] },
  ],
  france: [
    { name: "Paris", coords: [2.3522, 48.8566] },
    { name: "Lyon", coords: [4.8357, 45.7640] },
    { name: "Marseille", coords: [5.3698, 43.2965] },
    { name: "Bordeaux", coords: [-0.5792, 44.8378] },
    { name: "Toulouse", coords: [1.4442, 43.6047] },
    { name: "Lille", coords: [3.0573, 50.6292] },
    { name: "Nantes", coords: [-1.5536, 47.2184] },
    { name: "Strasbourg", coords: [7.7521, 48.5734] },
  ],
  turkey: [
    { name: "Istanbul", coords: [28.9784, 41.0082] },
    { name: "Ankara", coords: [32.8597, 39.9334] },
    { name: "Izmir", coords: [27.1428, 38.4237] },
    { name: "Adana", coords: [35.3213, 37.0000] },
    { name: "Trabzon", coords: [39.7168, 41.0027] },
    { name: "Van", coords: [43.3800, 38.5012] },
  ],
};

Object.assign(macroProvinceHubs, {
  germany: [
    { name: "Berlin", coords: [13.4050, 52.5200] },
    { name: "Hamburg", coords: [9.9937, 53.5511] },
    { name: "Munich", coords: [11.5820, 48.1351] },
    { name: "Frankfurt", coords: [8.6821, 50.1109] },
    { name: "Cologne", coords: [6.9603, 50.9375] },
    { name: "Stuttgart", coords: [9.1829, 48.7758] },
    { name: "Leipzig", coords: [12.3731, 51.3397] },
    { name: "Hanover", coords: [9.7320, 52.3759] },
    { name: "Dresden", coords: [13.7373, 51.0504] },
    { name: "Ruhr", coords: [7.2, 51.45] },
  ],
  france: [
    { name: "Paris", coords: [2.3522, 48.8566] },
    { name: "Lyon", coords: [4.8357, 45.7640] },
    { name: "Marseille", coords: [5.3698, 43.2965] },
    { name: "Bordeaux", coords: [-0.5792, 44.8378] },
    { name: "Toulouse", coords: [1.4442, 43.6047] },
    { name: "Lille", coords: [3.0573, 50.6292] },
    { name: "Nantes", coords: [-1.5536, 47.2184] },
    { name: "Strasbourg", coords: [7.7521, 48.5734] },
    { name: "Nice", coords: [7.2620, 43.7102] },
    { name: "Rennes", coords: [-1.6778, 48.1173] },
  ],
  saudi: [
    { name: "Riyadh", coords: [46.6753, 24.7136] },
    { name: "Jeddah", coords: [39.1925, 21.4858] },
    { name: "Mecca", coords: [39.8262, 21.3891] },
    { name: "Medina", coords: [39.5692, 24.5247] },
    { name: "Dammam", coords: [50.0888, 26.4207] },
    { name: "Tabuk", coords: [36.5715, 28.3835] },
    { name: "Abha", coords: [42.5053, 18.2164] },
    { name: "Hail", coords: [41.6907, 27.5114] },
  ],
  belgium: [
    { name: "Brussels", coords: [4.3517, 50.8503] },
    { name: "Antwerp", coords: [4.4025, 51.2194] },
    { name: "Ghent", coords: [3.7174, 51.0543] },
    { name: "Liege", coords: [5.5797, 50.6326] },
  ],
  netherlands: [
    { name: "Amsterdam", coords: [4.9041, 52.3676] },
    { name: "Rotterdam", coords: [4.4777, 51.9244] },
    { name: "The Hague", coords: [4.3007, 52.0705] },
    { name: "Eindhoven", coords: [5.4697, 51.4416] },
  ],
  denmark: [
    { name: "Copenhagen", coords: [12.5683, 55.6761] },
    { name: "Aarhus", coords: [10.2039, 56.1629] },
    { name: "Odense", coords: [10.4024, 55.4038] },
    { name: "Aalborg", coords: [9.9217, 57.0488] },
  ],
  switzerland: [
    { name: "Zurich", coords: [8.5417, 47.3769] },
    { name: "Geneva", coords: [6.1432, 46.2044] },
    { name: "Bern", coords: [7.4474, 46.9480] },
    { name: "Basel", coords: [7.5886, 47.5596] },
    { name: "Lausanne", coords: [6.6323, 46.5197] },
  ],
  kosovo: [
    { name: "Pristina", coords: [21.1655, 42.6629] },
    { name: "Prizren", coords: [20.7397, 42.2139] },
    { name: "Mitrovica", coords: [20.8667, 42.8833] },
  ],
  portugal: [
    { name: "Lisbon", coords: [-9.1393, 38.7223] },
    { name: "Porto", coords: [-8.6291, 41.1579] },
    { name: "Coimbra", coords: [-8.4292, 40.2033] },
    { name: "Faro", coords: [-7.9304, 37.0194] },
    { name: "Braga", coords: [-8.4265, 41.5454] },
    { name: "Funchal", coords: [-16.9241, 32.6669] },
  ],
  greece: [
    { name: "Athens", coords: [23.7275, 37.9838] },
    { name: "Thessaloniki", coords: [22.9444, 40.6401] },
    { name: "Patras", coords: [21.7346, 38.2466] },
    { name: "Heraklion", coords: [25.1442, 35.3387] },
    { name: "Larissa", coords: [22.4191, 39.6390] },
    { name: "Ioannina", coords: [20.8537, 39.6650] },
    { name: "Rhodes", coords: [28.2278, 36.4341] },
  ],
  austria: [
    { name: "Vienna", coords: [16.3738, 48.2082] },
    { name: "Graz", coords: [15.4395, 47.0707] },
    { name: "Linz", coords: [14.2858, 48.3069] },
    { name: "Salzburg", coords: [13.0550, 47.8095] },
    { name: "Innsbruck", coords: [11.4041, 47.2692] },
    { name: "Klagenfurt", coords: [14.3056, 46.6247] },
  ],
  hungary: [
    { name: "Budapest", coords: [19.0402, 47.4979] },
    { name: "Debrecen", coords: [21.6273, 47.5316] },
    { name: "Szeged", coords: [20.1414, 46.2530] },
    { name: "Miskolc", coords: [20.7784, 48.1035] },
    { name: "Pecs", coords: [18.2323, 46.0727] },
    { name: "Gyor", coords: [17.6504, 47.6875] },
  ],
  romania: [
    { name: "Bucharest", coords: [26.1025, 44.4268] },
    { name: "Cluj", coords: [23.5899, 46.7712] },
    { name: "Timisoara", coords: [21.2087, 45.7489] },
    { name: "Iasi", coords: [27.6014, 47.1585] },
    { name: "Constanta", coords: [28.6348, 44.1598] },
    { name: "Craiova", coords: [23.7949, 44.3302] },
    { name: "Brasov", coords: [25.5887, 45.6427] },
    { name: "Galati", coords: [28.0078, 45.4353] },
  ],
  bulgaria: [
    { name: "Sofia", coords: [23.3219, 42.6977] },
    { name: "Plovdiv", coords: [24.7453, 42.1354] },
    { name: "Varna", coords: [27.9147, 43.2141] },
    { name: "Burgas", coords: [27.4626, 42.5048] },
    { name: "Ruse", coords: [25.9534, 43.8356] },
    { name: "Stara Zagora", coords: [25.6257, 42.4258] },
  ],
  poland: [
    { name: "Warsaw", coords: [21.0122, 52.2297] },
    { name: "Krakow", coords: [19.9450, 50.0647] },
    { name: "Lodz", coords: [19.4550, 51.7592] },
    { name: "Wroclaw", coords: [17.0385, 51.1079] },
    { name: "Poznan", coords: [16.9252, 52.4064] },
    { name: "Gdansk", coords: [18.6466, 54.3520] },
    { name: "Szczecin", coords: [14.5528, 53.4285] },
    { name: "Lublin", coords: [22.5684, 51.2465] },
  ],
  sweden: [
    { name: "Stockholm", coords: [18.0686, 59.3293] },
    { name: "Gothenburg", coords: [11.9746, 57.7089] },
    { name: "Malmo", coords: [13.0038, 55.6050] },
    { name: "Uppsala", coords: [17.6389, 59.8586] },
    { name: "Umea", coords: [20.2630, 63.8258] },
    { name: "Lulea", coords: [22.1547, 65.5848] },
    { name: "Orebro", coords: [15.2134, 59.2753] },
    { name: "Linkoping", coords: [15.6214, 58.4108] },
  ],
  norway: [
    { name: "Oslo", coords: [10.7522, 59.9139] },
    { name: "Bergen", coords: [5.3221, 60.3929] },
    { name: "Trondheim", coords: [10.3951, 63.4305] },
    { name: "Stavanger", coords: [5.7331, 58.9690] },
    { name: "Tromso", coords: [18.9553, 69.6492] },
    { name: "Bodo", coords: [14.4049, 67.2804] },
    { name: "Kristiansand", coords: [8.0000, 58.1467] },
  ],
  finland: [
    { name: "Helsinki", coords: [24.9384, 60.1699] },
    { name: "Tampere", coords: [23.7610, 61.4978] },
    { name: "Turku", coords: [22.2666, 60.4518] },
    { name: "Oulu", coords: [25.4651, 65.0121] },
    { name: "Kuopio", coords: [27.6782, 62.8924] },
    { name: "Jyvaskyla", coords: [25.7473, 62.2426] },
    { name: "Rovaniemi", coords: [25.7294, 66.5039] },
  ],
  spain: [
    { name: "Madrid", coords: [-3.7038, 40.4168] },
    { name: "Barcelona", coords: [2.1734, 41.3851] },
    { name: "Valencia", coords: [-0.3763, 39.4699] },
    { name: "Seville", coords: [-5.9845, 37.3891] },
    { name: "Zaragoza", coords: [-0.8891, 41.6488] },
    { name: "Malaga", coords: [-4.4214, 36.7213] },
    { name: "Bilbao", coords: [-2.9350, 43.2630] },
    { name: "Valladolid", coords: [-4.7245, 41.6523] },
    { name: "Santiago", coords: [-8.5448, 42.8782] },
  ],
  italy: [
    { name: "Rome", coords: [12.4964, 41.9028] },
    { name: "Milan", coords: [9.1900, 45.4642] },
    { name: "Naples", coords: [14.2681, 40.8518] },
    { name: "Turin", coords: [7.6869, 45.0703] },
    { name: "Palermo", coords: [13.3615, 38.1157] },
    { name: "Florence", coords: [11.2558, 43.7696] },
    { name: "Venice", coords: [12.3155, 45.4408] },
    { name: "Bologna", coords: [11.3426, 44.4949] },
    { name: "Bari", coords: [16.8719, 41.1171] },
  ],
  turkey: [
    { name: "Istanbul", coords: [28.9784, 41.0082] },
    { name: "Ankara", coords: [32.8597, 39.9334] },
    { name: "Izmir", coords: [27.1428, 38.4237] },
    { name: "Adana", coords: [35.3213, 37.0000] },
    { name: "Trabzon", coords: [39.7168, 41.0027] },
    { name: "Van", coords: [43.3800, 38.5012] },
    { name: "Antalya", coords: [30.7133, 36.8969] },
    { name: "Diyarbakir", coords: [40.2306, 37.9144] },
    { name: "Konya", coords: [32.4846, 37.8746] },
    { name: "Gaziantep", coords: [37.3781, 37.0662] },
  ],
  ukraine: [
    { name: "Kyiv", coords: [30.5234, 50.4501] },
    { name: "Kharkiv", coords: [36.2304, 49.9935] },
    { name: "Odesa", coords: [30.7233, 46.4825] },
    { name: "Dnipro", coords: [35.0462, 48.4647] },
    { name: "Lviv", coords: [24.0297, 49.8397] },
    { name: "Donetsk", coords: [37.8029, 48.0159] },
    { name: "Zaporizhzhia", coords: [35.1396, 47.8388] },
    { name: "Simferopol", coords: [34.1024, 44.9521] },
    { name: "Vinnytsia", coords: [28.4682, 49.2331] },
    { name: "Chernihiv", coords: [31.2893, 51.4982] },
  ],
  iran: [
    { name: "Tehran", coords: [51.3890, 35.6892] },
    { name: "Mashhad", coords: [59.6168, 36.2605] },
    { name: "Isfahan", coords: [51.6776, 32.6546] },
    { name: "Shiraz", coords: [52.5311, 29.5918] },
    { name: "Tabriz", coords: [46.2919, 38.0800] },
    { name: "Ahvaz", coords: [48.6842, 31.3183] },
    { name: "Kerman", coords: [57.0724, 30.2839] },
    { name: "Bandar Abbas", coords: [56.2666, 27.1832] },
    { name: "Qom", coords: [50.8764, 34.6399] },
    { name: "Rasht", coords: [49.5832, 37.2808] },
  ],
  egypt: [
    { name: "Cairo", coords: [31.2357, 30.0444] },
    { name: "Alexandria", coords: [29.9187, 31.2001] },
    { name: "Port Said", coords: [32.3019, 31.2653] },
    { name: "Suez", coords: [32.5498, 29.9668] },
    { name: "Luxor", coords: [32.6396, 25.6872] },
    { name: "Aswan", coords: [32.8998, 24.0889] },
    { name: "Asyut", coords: [31.1800, 27.1800] },
  ],
  algeria: [
    { name: "Algiers", coords: [3.0588, 36.7538] },
    { name: "Oran", coords: [-0.6337, 35.6971] },
    { name: "Constantine", coords: [6.6147, 36.3650] },
    { name: "Annaba", coords: [7.7667, 36.9000] },
    { name: "Tamanrasset", coords: [5.5228, 22.7850] },
    { name: "Ouargla", coords: [5.3250, 31.9500] },
    { name: "Bechar", coords: [-2.2167, 31.6167] },
    { name: "Setif", coords: [5.4147, 36.1900] },
  ],
  libya: [
    { name: "Tripoli", coords: [13.1913, 32.8872] },
    { name: "Benghazi", coords: [20.0686, 32.1167] },
    { name: "Misrata", coords: [15.0925, 32.3754] },
    { name: "Sabha", coords: [14.4283, 27.0377] },
    { name: "Tobruk", coords: [23.9764, 32.0761] },
    { name: "Kufra", coords: [23.2696, 24.1783] },
  ],
  india: [
    { name: "Delhi", coords: [77.1025, 28.7041] },
    { name: "Mumbai", coords: [72.8777, 19.0760] },
    { name: "Bengaluru", coords: [77.5946, 12.9716] },
    { name: "Kolkata", coords: [88.3639, 22.5726] },
    { name: "Chennai", coords: [80.2707, 13.0827] },
    { name: "Hyderabad", coords: [78.4867, 17.3850] },
    { name: "Ahmedabad", coords: [72.5714, 23.0225] },
    { name: "Pune", coords: [73.8567, 18.5204] },
    { name: "Jaipur", coords: [75.7873, 26.9124] },
    { name: "Lucknow", coords: [80.9462, 26.8467] },
    { name: "Kanpur", coords: [80.3319, 26.4499] },
    { name: "Nagpur", coords: [79.0882, 21.1458] },
    { name: "Patna", coords: [85.1376, 25.5941] },
    { name: "Bhopal", coords: [77.4126, 23.2599] },
    { name: "Kochi", coords: [76.2673, 9.9312] },
    { name: "Guwahati", coords: [91.7362, 26.1445] },
    { name: "Srinagar", coords: [74.7973, 34.0837] },
    { name: "Bhubaneswar", coords: [85.8245, 20.2961] },
  ],
  china: [
    { name: "Beijing", coords: [116.4074, 39.9042] },
    { name: "Shanghai", coords: [121.4737, 31.2304] },
    { name: "Guangzhou", coords: [113.2644, 23.1291] },
    { name: "Shenzhen", coords: [114.0579, 22.5431] },
    { name: "Chengdu", coords: [104.0665, 30.5728] },
    { name: "Chongqing", coords: [106.5516, 29.5630] },
    { name: "Wuhan", coords: [114.3055, 30.5928] },
    { name: "Xian", coords: [108.9398, 34.3416] },
    { name: "Tianjin", coords: [117.3616, 39.3434] },
    { name: "Nanjing", coords: [118.7969, 32.0603] },
    { name: "Hangzhou", coords: [120.1551, 30.2741] },
    { name: "Qingdao", coords: [120.3826, 36.0671] },
    { name: "Shenyang", coords: [123.4315, 41.8057] },
    { name: "Harbin", coords: [126.6424, 45.7567] },
    { name: "Kunming", coords: [102.8329, 24.8801] },
    { name: "Urumqi", coords: [87.6168, 43.8256] },
    { name: "Lhasa", coords: [91.1322, 29.6604] },
    { name: "Lanzhou", coords: [103.8343, 36.0611] },
    { name: "Hohhot", coords: [111.7492, 40.8426] },
    { name: "Changsha", coords: [112.9388, 28.2282] },
    { name: "Fuzhou", coords: [119.2965, 26.0745] },
    { name: "Nanning", coords: [108.3669, 22.8170] },
  ],
  usa: [
    { name: "Washington", coords: [-77.0369, 38.9072] },
    { name: "New York", coords: [-74.0060, 40.7128] },
    { name: "Boston", coords: [-71.0589, 42.3601] },
    { name: "Atlanta", coords: [-84.3880, 33.7490] },
    { name: "Miami", coords: [-80.1918, 25.7617] },
    { name: "Chicago", coords: [-87.6298, 41.8781] },
    { name: "Detroit", coords: [-83.0458, 42.3314] },
    { name: "Dallas", coords: [-96.7970, 32.7767] },
    { name: "Houston", coords: [-95.3698, 29.7604] },
    { name: "Denver", coords: [-104.9903, 39.7392] },
    { name: "Phoenix", coords: [-112.0740, 33.4484] },
    { name: "Los Angeles", coords: [-118.2437, 34.0522] },
    { name: "San Francisco", coords: [-122.4194, 37.7749] },
    { name: "Seattle", coords: [-122.3321, 47.6062] },
    { name: "Portland", coords: [-122.6765, 45.5152] },
    { name: "Las Vegas", coords: [-115.1398, 36.1699] },
    { name: "Minneapolis", coords: [-93.2650, 44.9778] },
    { name: "Kansas City", coords: [-94.5786, 39.0997] },
    { name: "New Orleans", coords: [-90.0715, 29.9511] },
    { name: "Salt Lake", coords: [-111.8910, 40.7608] },
    { name: "San Diego", coords: [-117.1611, 32.7157] },
    { name: "Charlotte", coords: [-80.8431, 35.2271] },
  ],
  brazil: [
    { name: "Brasilia", coords: [-47.8825, -15.7942] },
    { name: "Sao Paulo", coords: [-46.6333, -23.5505] },
    { name: "Rio", coords: [-43.1729, -22.9068] },
    { name: "Salvador", coords: [-38.5014, -12.9777] },
    { name: "Fortaleza", coords: [-38.5267, -3.7319] },
    { name: "Recife", coords: [-34.8770, -8.0476] },
    { name: "Manaus", coords: [-60.0217, -3.1190] },
    { name: "Belem", coords: [-48.4902, -1.4558] },
    { name: "Porto Alegre", coords: [-51.2177, -30.0346] },
    { name: "Curitiba", coords: [-49.2733, -25.4284] },
    { name: "Belo Horizonte", coords: [-43.9378, -19.9167] },
    { name: "Goiania", coords: [-49.2648, -16.6869] },
    { name: "Cuiaba", coords: [-56.0979, -15.6010] },
    { name: "Campo Grande", coords: [-54.6464, -20.4697] },
    { name: "Sao Luis", coords: [-44.3028, -2.5307] },
    { name: "Natal", coords: [-35.2094, -5.7945] },
  ],
  canada: [
    { name: "Ottawa", coords: [-75.6972, 45.4215] },
    { name: "Toronto", coords: [-79.3832, 43.6532] },
    { name: "Montreal", coords: [-73.5673, 45.5017] },
    { name: "Quebec", coords: [-71.2080, 46.8139] },
    { name: "Halifax", coords: [-63.5752, 44.6488] },
    { name: "Winnipeg", coords: [-97.1384, 49.8951] },
    { name: "Regina", coords: [-104.6189, 50.4452] },
    { name: "Calgary", coords: [-114.0719, 51.0447] },
    { name: "Edmonton", coords: [-113.4938, 53.5461] },
    { name: "Vancouver", coords: [-123.1207, 49.2827] },
    { name: "Victoria", coords: [-123.3656, 48.4284] },
    { name: "Whitehorse", coords: [-135.0568, 60.7212] },
    { name: "Yellowknife", coords: [-114.3718, 62.4540] },
    { name: "Iqaluit", coords: [-68.5170, 63.7467] },
    { name: "Saskatoon", coords: [-106.6700, 52.1579] },
    { name: "Thunder Bay", coords: [-89.2477, 48.3809] },
  ],
  australia: [
    { name: "Canberra", coords: [149.1300, -35.2809] },
    { name: "Sydney", coords: [151.2093, -33.8688] },
    { name: "Melbourne", coords: [144.9631, -37.8136] },
    { name: "Brisbane", coords: [153.0251, -27.4698] },
    { name: "Perth", coords: [115.8605, -31.9505] },
    { name: "Adelaide", coords: [138.6007, -34.9285] },
    { name: "Darwin", coords: [130.8456, -12.4634] },
    { name: "Hobart", coords: [147.3272, -42.8821] },
    { name: "Townsville", coords: [146.8179, -19.2590] },
    { name: "Alice Springs", coords: [133.8807, -23.6980] },
    { name: "Broome", coords: [122.2367, -17.9614] },
    { name: "Newcastle", coords: [151.7817, -32.9283] },
  ],
  cyprus: [
    { name: "Nicosia", coords: [33.3823, 35.1856] },
    { name: "Limassol", coords: [33.0333, 34.6750] },
    { name: "Larnaca", coords: [33.6292, 34.9229] },
  ],
  morocco: [
    { name: "Rabat", coords: [-6.8498, 34.0209] },
    { name: "Casablanca", coords: [-7.5898, 33.5731] },
    { name: "Marrakech", coords: [-7.9811, 31.6295] },
    { name: "Fes", coords: [-4.9778, 34.0181] },
    { name: "Tangier", coords: [-5.8339, 35.7595] },
  ],
  tunisia: [
    { name: "Tunis", coords: [10.1815, 36.8065] },
    { name: "Sfax", coords: [10.7603, 34.7406] },
    { name: "Sousse", coords: [10.6369, 35.8256] },
    { name: "Kairouan", coords: [10.0963, 35.6781] },
  ],
  mauritania: [
    { name: "Nouakchott", coords: [-15.9785, 18.0735] },
    { name: "Nouadhibou", coords: [-17.0347, 20.9310] },
    { name: "Atar", coords: [-13.0499, 20.5169] },
    { name: "Kiffa", coords: [-11.4045, 16.6166] },
  ],
  mali: [
    { name: "Bamako", coords: [-8.0029, 12.6392] },
    { name: "Sikasso", coords: [-5.6665, 11.3167] },
    { name: "Timbuktu", coords: [-3.0074, 16.7666] },
    { name: "Gao", coords: [-0.0447, 16.2717] },
    { name: "Mopti", coords: [-4.1833, 14.4833] },
  ],
  niger: [
    { name: "Niamey", coords: [2.1254, 13.5116] },
    { name: "Agadez", coords: [7.9911, 16.9742] },
    { name: "Zinder", coords: [8.9881, 13.8072] },
    { name: "Maradi", coords: [7.1017, 13.5000] },
    { name: "Tahoua", coords: [5.2692, 14.8903] },
  ],
  chad: [
    { name: "N'Djamena", coords: [15.0444, 12.1348] },
    { name: "Moundou", coords: [16.0856, 8.5667] },
    { name: "Abeche", coords: [20.8324, 13.8292] },
    { name: "Faya-Largeau", coords: [19.1111, 17.9257] },
    { name: "Sarh", coords: [18.3903, 9.1429] },
  ],
  sudan: [
    { name: "Khartoum", coords: [32.5599, 15.5007] },
    { name: "Omdurman", coords: [32.4846, 15.6445] },
    { name: "Port Sudan", coords: [37.2164, 19.6158] },
    { name: "Nyala", coords: [24.8833, 12.0500] },
    { name: "Kassala", coords: [36.4000, 15.4500] },
    { name: "El Obeid", coords: [30.2167, 13.1833] },
  ],
  "south-sudan": [
    { name: "Juba", coords: [31.5825, 4.8594] },
    { name: "Wau", coords: [27.9916, 7.7029] },
    { name: "Malakal", coords: [31.6605, 9.5334] },
    { name: "Bor", coords: [31.5591, 6.2089] },
  ],
  ethiopia: [
    { name: "Addis Ababa", coords: [38.7578, 8.9806] },
    { name: "Dire Dawa", coords: [41.8661, 9.6009] },
    { name: "Mekelle", coords: [39.4753, 13.4967] },
    { name: "Gondar", coords: [37.4667, 12.6000] },
    { name: "Hawassa", coords: [38.4763, 7.0621] },
    { name: "Bahir Dar", coords: [37.3908, 11.5742] },
  ],
  eritrea: [
    { name: "Asmara", coords: [38.9251, 15.3229] },
    { name: "Massawa", coords: [39.4753, 15.6097] },
    { name: "Keren", coords: [38.4511, 15.7779] },
  ],
  djibouti: [
    { name: "Djibouti", coords: [43.1456, 11.5721] },
    { name: "Tadjoura", coords: [42.8844, 11.7853] },
  ],
  somalia: [
    { name: "Mogadishu", coords: [45.3182, 2.0469] },
    { name: "Kismayo", coords: [42.5454, -0.3582] },
    { name: "Baidoa", coords: [43.6498, 3.1138] },
    { name: "Bosaso", coords: [49.1816, 11.2755] },
  ],
  kenya: [
    { name: "Nairobi", coords: [36.8219, -1.2921] },
    { name: "Mombasa", coords: [39.6682, -4.0435] },
    { name: "Kisumu", coords: [34.7617, -0.0917] },
    { name: "Nakuru", coords: [36.0800, -0.3031] },
    { name: "Eldoret", coords: [35.2698, 0.5143] },
  ],
  uganda: [
    { name: "Kampala", coords: [32.5825, 0.3476] },
    { name: "Gulu", coords: [32.2990, 2.7746] },
    { name: "Mbarara", coords: [30.6589, -0.6072] },
    { name: "Jinja", coords: [33.2042, 0.4244] },
  ],
  rwanda: [
    { name: "Kigali", coords: [30.0619, -1.9441] },
    { name: "Butare", coords: [29.7394, -2.5967] },
  ],
  burundi: [
    { name: "Bujumbura", coords: [29.3639, -3.3614] },
    { name: "Gitega", coords: [29.9246, -3.4288] },
  ],
  tanzania: [
    { name: "Dodoma", coords: [35.7516, -6.1630] },
    { name: "Dar es Salaam", coords: [39.2083, -6.7924] },
    { name: "Arusha", coords: [36.6820, -3.3869] },
    { name: "Mwanza", coords: [32.9000, -2.5167] },
    { name: "Mbeya", coords: [33.4500, -8.9000] },
  ],
  nigeria: [
    { name: "Abuja", coords: [7.4951, 9.0765] },
    { name: "Lagos", coords: [3.3792, 6.5244] },
    { name: "Kano", coords: [8.5167, 12.0000] },
    { name: "Ibadan", coords: [3.9470, 7.3775] },
    { name: "Kaduna", coords: [7.4384, 10.5105] },
    { name: "Port Harcourt", coords: [7.0498, 4.8156] },
    { name: "Maiduguri", coords: [13.1571, 11.8333] },
    { name: "Sokoto", coords: [5.2333, 13.0627] },
    { name: "Enugu", coords: [7.4988, 6.5244] },
    { name: "Benin City", coords: [5.6037, 6.3350] },
  ],
  ghana: [
    { name: "Accra", coords: [-0.1870, 5.6037] },
    { name: "Kumasi", coords: [-1.6163, 6.6885] },
    { name: "Tamale", coords: [-0.8393, 9.4075] },
    { name: "Sekondi", coords: [-1.7554, 4.9340] },
  ],
  "burkina-faso": [
    { name: "Ouagadougou", coords: [-1.5197, 12.3714] },
    { name: "Bobo-Dioulasso", coords: [-4.2979, 11.1771] },
    { name: "Koudougou", coords: [-2.3627, 12.2526] },
  ],
  senegal: [
    { name: "Dakar", coords: [-17.4677, 14.7167] },
    { name: "Touba", coords: [-15.8833, 14.8667] },
    { name: "Saint-Louis", coords: [-16.4896, 16.0326] },
    { name: "Ziguinchor", coords: [-16.2833, 12.5833] },
  ],
  guinea: [
    { name: "Conakry", coords: [-13.5784, 9.6412] },
    { name: "Kankan", coords: [-9.3057, 10.3854] },
    { name: "Nzerekore", coords: [-8.8253, 7.7478] },
    { name: "Labe", coords: [-12.3000, 11.3167] },
  ],
  "c-te-d-ivoire": [
    { name: "Yamoussoukro", coords: [-5.2767, 6.8276] },
    { name: "Abidjan", coords: [-4.0083, 5.3599] },
    { name: "Bouake", coords: [-5.0303, 7.6906] },
    { name: "Korhogo", coords: [-5.6333, 9.4500] },
  ],
  "ivory-coast": [
    { name: "Yamoussoukro", coords: [-5.2767, 6.8276] },
    { name: "Abidjan", coords: [-4.0083, 5.3599] },
    { name: "Bouake", coords: [-5.0303, 7.6906] },
    { name: "Korhogo", coords: [-5.6333, 9.4500] },
  ],
  cameroon: [
    { name: "Yaounde", coords: [11.5021, 3.8480] },
    { name: "Douala", coords: [9.7085, 4.0511] },
    { name: "Garoua", coords: [13.3923, 9.3014] },
    { name: "Maroua", coords: [14.3159, 10.5956] },
    { name: "Bamenda", coords: [10.1591, 5.9631] },
  ],
  "central-african-republic": [
    { name: "Bangui", coords: [18.5582, 4.3947] },
    { name: "Bambari", coords: [20.6757, 5.7679] },
    { name: "Berberati", coords: [15.7864, 4.2612] },
    { name: "Bria", coords: [21.9863, 6.5423] },
  ],
  "democratic-republic-of-the-congo": [
    { name: "Kinshasa", coords: [15.2663, -4.4419] },
    { name: "Lubumbashi", coords: [27.4794, -11.6876] },
    { name: "Mbuji-Mayi", coords: [23.5898, -6.1360] },
    { name: "Kisangani", coords: [25.2000, 0.5167] },
    { name: "Goma", coords: [29.2228, -1.6741] },
    { name: "Kananga", coords: [22.4178, -5.8962] },
    { name: "Bukavu", coords: [28.8608, -2.5083] },
    { name: "Mbandaka", coords: [18.2603, 0.0487] },
  ],
  "dem-rep-congo": [
    { name: "Kinshasa", coords: [15.2663, -4.4419] },
    { name: "Lubumbashi", coords: [27.4794, -11.6876] },
    { name: "Mbuji-Mayi", coords: [23.5898, -6.1360] },
    { name: "Kisangani", coords: [25.2000, 0.5167] },
    { name: "Goma", coords: [29.2228, -1.6741] },
    { name: "Kananga", coords: [22.4178, -5.8962] },
    { name: "Bukavu", coords: [28.8608, -2.5083] },
    { name: "Mbandaka", coords: [18.2603, 0.0487] },
  ],
  "republic-of-the-congo": [
    { name: "Brazzaville", coords: [15.2663, -4.2634] },
    { name: "Pointe-Noire", coords: [11.8664, -4.7692] },
    { name: "Dolisie", coords: [12.6667, -4.2000] },
  ],
  congo: [
    { name: "Brazzaville", coords: [15.2663, -4.2634] },
    { name: "Pointe-Noire", coords: [11.8664, -4.7692] },
    { name: "Dolisie", coords: [12.6667, -4.2000] },
  ],
  gabon: [
    { name: "Libreville", coords: [9.4673, 0.4162] },
    { name: "Port-Gentil", coords: [8.7815, -0.7193] },
    { name: "Franceville", coords: [13.5836, -1.6333] },
  ],
});

const macroProvinceCountOverrides = {
  malta: 2,
  luxembourg: 2,
  cyprus: 3,
  lebanon: 2,
  kosovo: 3,
  albania: 4,
  belgium: 4,
  netherlands: 4,
  denmark: 4,
  switzerland: 5,
  serbia: 5,
  croatia: 5,
  portugal: 6,
  greece: 7,
  austria: 6,
  hungary: 6,
  romania: 8,
  bulgaria: 6,
  poland: 8,
  sweden: 8,
  norway: 7,
  finland: 7,
  germany: 10,
  france: 10,
  spain: 9,
  italy: 9,
  turkey: 10,
  ukraine: 10,
  iran: 10,
  saudi: 8,
  "saudi-arabia": 8,
  egypt: 7,
  algeria: 8,
  libya: 6,
  russia: 20,
  china: 20,
  india: 18,
  usa: 20,
  "united-states-of-america": 20,
  brazil: 16,
  canada: 16,
  australia: 12,
};

Object.assign(macroProvinceHubs, {
  uk: [
    { name: "London", coords: [-0.1276, 51.5072] },
    { name: "Birmingham", coords: [-1.8904, 52.4862] },
    { name: "Manchester", coords: [-2.2426, 53.4808] },
    { name: "Glasgow", coords: [-4.2518, 55.8642] },
    { name: "Cardiff", coords: [-3.1791, 51.4816] },
    { name: "Belfast", coords: [-5.9301, 54.5973] },
  ],
  russia: [
    { name: "Moscow", coords: [37.6173, 55.7558] },
    { name: "Saint Petersburg", coords: [30.3351, 59.9343] },
    { name: "Nizhny Novgorod", coords: [44.0065, 56.3269] },
    { name: "Kazan", coords: [49.1064, 55.7961] },
    { name: "Samara", coords: [50.1002, 53.1959] },
    { name: "Volgograd", coords: [44.5169, 48.7080] },
    { name: "Rostov", coords: [39.7015, 47.2357] },
    { name: "Yekaterinburg", coords: [60.6057, 56.8389] },
    { name: "Chelyabinsk", coords: [61.4026, 55.1644] },
    { name: "Perm", coords: [56.2294, 58.0105] },
    { name: "Ufa", coords: [55.9587, 54.7351] },
    { name: "Novosibirsk", coords: [82.9204, 55.0302] },
    { name: "Omsk", coords: [73.3682, 54.9885] },
    { name: "Krasnoyarsk", coords: [92.8526, 56.0153] },
    { name: "Irkutsk", coords: [104.2964, 52.2871] },
    { name: "Yakutsk", coords: [129.7326, 62.0355] },
    { name: "Vladivostok", coords: [131.8855, 43.1155] },
    { name: "Khabarovsk", coords: [135.0719, 48.4802] },
    { name: "Murmansk", coords: [33.0827, 68.9585] },
    { name: "Arkhangelsk", coords: [40.5158, 64.5393] },
    { name: "Kaliningrad", coords: [20.4522, 54.7104] },
    { name: "Voronezh", coords: [39.2003, 51.6608] },
    { name: "Saratov", coords: [46.0342, 51.5336] },
    { name: "Tyumen", coords: [65.5343, 57.1530] },
    { name: "Krasnodar", coords: [38.9747, 45.0355] },
  ],
  kazakhstan: [
    { name: "Astana", coords: [71.4304, 51.1282] },
    { name: "Almaty", coords: [76.9286, 43.2220] },
    { name: "Shymkent", coords: [69.5901, 42.3417] },
    { name: "Aktobe", coords: [57.1660, 50.2839] },
    { name: "Karaganda", coords: [73.0850, 49.8060] },
    { name: "Atyrau", coords: [51.9238, 47.0945] },
    { name: "Pavlodar", coords: [76.9674, 52.2873] },
    { name: "Oskemen", coords: [82.6059, 49.9484] },
    { name: "Kostanay", coords: [63.6246, 53.2198] },
    { name: "Kyzylorda", coords: [65.5092, 44.8488] },
  ],
  morocco: [
    { name: "Rabat", coords: [-6.8498, 34.0209] },
    { name: "Casablanca", coords: [-7.5898, 33.5731] },
    { name: "Marrakesh", coords: [-8.0089, 31.6295] },
    { name: "Fez", coords: [-5.0078, 34.0181] },
    { name: "Tangier", coords: [-5.8340, 35.7595] },
  ],
  japan: [
    { name: "Tokyo", coords: [139.6917, 35.6895] },
    { name: "Osaka", coords: [135.5023, 34.6937] },
    { name: "Nagoya", coords: [136.9066, 35.1815] },
    { name: "Sapporo", coords: [141.3545, 43.0618] },
    { name: "Fukuoka", coords: [130.4017, 33.5902] },
    { name: "Hiroshima", coords: [132.4553, 34.3853] },
    { name: "Sendai", coords: [140.8719, 38.2682] },
    { name: "Naha", coords: [127.6792, 26.2124] },
  ],
  mexico: [
    { name: "Mexico City", coords: [-99.1332, 19.4326] },
    { name: "Guadalajara", coords: [-103.3496, 20.6597] },
    { name: "Monterrey", coords: [-100.3161, 25.6866] },
    { name: "Puebla", coords: [-98.2063, 19.0414] },
    { name: "Tijuana", coords: [-117.0382, 32.5149] },
    { name: "Leon", coords: [-101.6841, 21.1220] },
    { name: "Merida", coords: [-89.5926, 20.9674] },
    { name: "Veracruz", coords: [-96.1342, 19.1738] },
    { name: "Ciudad Juarez", coords: [-106.4850, 31.6904] },
    { name: "Hermosillo", coords: [-110.9559, 29.0729] },
  ],
  "south-africa": [
    { name: "Pretoria", coords: [28.1881, -25.7461] },
    { name: "Johannesburg", coords: [28.0473, -26.2041] },
    { name: "Cape Town", coords: [18.4241, -33.9249] },
    { name: "Durban", coords: [31.0218, -29.8587] },
    { name: "Port Elizabeth", coords: [25.6022, -33.9608] },
    { name: "Bloemfontein", coords: [26.2041, -29.0852] },
    { name: "East London", coords: [27.9116, -33.0292] },
    { name: "Kimberley", coords: [24.7636, -28.7282] },
  ],
});

Object.assign(macroProvinceCountOverrides, {
  uk: 6,
  "united-kingdom": 6,
  kazakhstan: 10,
  morocco: 5,
  japan: 8,
  mexico: 10,
  "south-africa": 8,
  tunisia: 4,
  mauritania: 4,
  mali: 6,
  niger: 5,
  chad: 5,
  sudan: 6,
  "south-sudan": 4,
  ethiopia: 6,
  eritrea: 3,
  djibouti: 2,
  somalia: 4,
  kenya: 5,
  uganda: 4,
  rwanda: 2,
  burundi: 2,
  tanzania: 5,
  nigeria: 10,
  ghana: 4,
  "burkina-faso": 3,
  senegal: 4,
  guinea: 4,
  "c-te-d-ivoire": 4,
  "ivory-coast": 4,
  cameroon: 5,
  "central-african-republic": 4,
  "democratic-republic-of-the-congo": 8,
  "dem-rep-congo": 8,
  "republic-of-the-congo": 3,
  congo: 3,
  gabon: 3,
});

const fallbackProvinceNamePools = {
  albania: ["Tirana", "Durres", "Shkoder", "Vlore"],
  austria: ["Vienna", "Tyrol", "Styria", "Salzburg", "Linz", "Graz"],
  belgium: ["Brussels", "Antwerp", "Flanders", "Wallonia"],
  bulgaria: ["Sofia", "Plovdiv", "Varna", "Burgas", "Ruse", "Stara Zagora"],
  croatia: ["Zagreb", "Split", "Rijeka", "Osijek", "Dalmatia"],
  cyprus: ["Nicosia", "Limassol", "Larnaca", "Paphos"],
  denmark: ["Copenhagen", "Aarhus", "Jutland", "Zealand"],
  egypt: ["Cairo", "Alexandria", "Giza", "Suez", "Luxor", "Aswan", "Sinai"],
  finland: ["Helsinki", "Tampere", "Turku", "Oulu", "Lapland", "Karelia", "Savonia"],
  france: ["Paris", "Lyon", "Marseille", "Bordeaux", "Toulouse", "Lille", "Nantes", "Strasbourg", "Nice", "Rennes"],
  germany: ["Berlin", "Bavaria", "Saxony", "Ruhr", "Hamburg", "Frankfurt", "Stuttgart", "Hanover", "Cologne", "Munich"],
  greece: ["Athens", "Thessaloniki", "Patras", "Crete", "Larissa", "Rhodes", "Ioannina"],
  hungary: ["Budapest", "Debrecen", "Szeged", "Miskolc", "Pecs", "Gyor"],
  iran: ["Tehran", "Isfahan", "Shiraz", "Tabriz", "Mashhad", "Ahvaz", "Kerman", "Qom", "Rasht", "Bandar Abbas"],
  iraq: ["Baghdad", "Basra", "Mosul", "Erbil", "Najaf", "Kirkuk"],
  italy: ["Rome", "Milan", "Naples", "Turin", "Venice", "Florence", "Sicily", "Sardinia", "Bologna"],
  kosovo: ["Pristina", "Prizren", "Mitrovica"],
  lebanon: ["Beirut", "Tripoli", "Sidon", "Bekaa"],
  libya: ["Tripoli", "Benghazi", "Misrata", "Sabha", "Tobruk", "Sirte"],
  netherlands: ["Amsterdam", "Rotterdam", "Utrecht", "Brabant"],
  norway: ["Oslo", "Bergen", "Trondheim", "Stavanger", "Tromso", "Nordland", "Agder"],
  poland: ["Warsaw", "Krakow", "Gdansk", "Poznan", "Wroclaw", "Lodz", "Silesia", "Lublin"],
  portugal: ["Lisbon", "Porto", "Braga", "Coimbra", "Algarve", "Madeira"],
  romania: ["Bucharest", "Transylvania", "Moldavia", "Dobruja", "Banat", "Cluj", "Iasi", "Constanta"],
  saudi: ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Tabuk", "Abha", "Hail"],
  "saudi-arabia": ["Riyadh", "Jeddah", "Mecca", "Medina", "Dammam", "Tabuk", "Abha", "Hail"],
  serbia: ["Belgrade", "Novi Sad", "Nis", "Kragujevac", "Subotica"],
  spain: ["Madrid", "Barcelona", "Valencia", "Andalusia", "Basque Country", "Galicia", "Seville", "Zaragoza", "Murcia"],
  sweden: ["Stockholm", "Gothenburg", "Malmo", "Uppsala", "Norrbotten", "Vasterbotten", "Skane", "Dalarna"],
  switzerland: ["Zurich", "Geneva", "Bern", "Basel", "Ticino"],
  turkey: ["Istanbul", "Ankara", "Izmir", "Adana", "Konya", "Trabzon", "Van", "Antalya", "Diyarbakir", "Bursa"],
  ukraine: ["Kyiv", "Lviv", "Odesa", "Kharkiv", "Dnipro", "Donetsk", "Crimea", "Zaporizhzhia", "Poltava", "Vinnytsia"],
  uk: ["London", "Birmingham", "Manchester", "Glasgow", "Cardiff", "Belfast"],
  "united-kingdom": ["London", "Birmingham", "Manchester", "Glasgow", "Cardiff", "Belfast"],
};

const debugProjectionBounds = {
  minLng: -170,
  maxLng: 180,
  minLat: -56,
  maxLat: 76,
};

const debugCamera = {
  minZoom: 2.96,
  maxZoom: 5.72,
  theaterCenter: [43.5, 23.5],
  viewportCenter: [500, 310],
};

const deckZoomLevels = [
  { step: "tactical", zoom: debugCamera.maxZoom, center: [77.2, 22.6] },
  { step: "capitals", zoom: 4.78, center: [45.0, 30.0] },
  { step: "countries", zoom: 3.86, center: [42.5, 27.0] },
  { step: "world", zoom: debugCamera.minZoom, center: debugCamera.theaterCenter },
];

const theaterCameraBounds = [[debugProjectionBounds.minLng, debugProjectionBounds.minLat], [debugProjectionBounds.maxLng, debugProjectionBounds.maxLat]];

const cameraConfig = {
  bounds: [[12, -25], [72, 75]],
  home: [46.5, 18.5],
  defaultZoom: 4.15,
  minZoom: 3.75,
  maxZoom: 6.25,
  worldMax: 3.9,
  regionalMax: 4.85,
};

const countryTerrainTints = {
  germany: "#405944",
  saudi: "#776b45",
  sweden: "#385848",
  usa: "#4b6149",
  russia: "#4a5c48",
  china: "#5a6445",
  uk: "#3e5548",
  france: "#4f5e43",
};

const riverSystems = [
  {
    name: "Nile",
    coords: [[31.2, 30.1], [30.4, 28.6], [30.7, 26.2], [31.7, 24.1], [32.8, 21.9], [33.3, 19.8]],
  },
  {
    name: "Danube",
    coords: [[8.2, 48.1], [11.6, 48.4], [14.4, 48.2], [18.1, 47.8], [21.0, 46.2], [24.1, 45.2], [28.8, 45.1]],
  },
  {
    name: "Rhine",
    coords: [[8.3, 47.6], [7.7, 49.0], [7.0, 50.4], [6.5, 51.8], [5.2, 52.2]],
  },
  {
    name: "Dnieper",
    coords: [[30.5, 55.0], [31.0, 52.2], [30.5, 50.4], [31.4, 48.7], [32.6, 46.6]],
  },
  {
    name: "Volga",
    coords: [[33.1, 57.2], [37.6, 56.1], [44.0, 55.8], [48.0, 53.2], [47.8, 49.0], [46.4, 45.5]],
  },
  {
    name: "Tigris Euphrates",
    coords: [[38.3, 37.1], [40.1, 35.6], [42.7, 34.1], [44.1, 32.7], [47.6, 30.5]],
  },
];

const mountainRanges = [
  {
    name: "Alps",
    coords: [[5.8, 45.5], [7.8, 46.2], [10.2, 46.7], [12.4, 46.4], [15.4, 47.1]],
  },
  {
    name: "Pyrenees",
    coords: [[-1.7, 42.8], [0.8, 42.7], [2.7, 42.4]],
  },
  {
    name: "Scandinavian Mountains",
    coords: [[6.5, 59.2], [8.6, 61.5], [12.1, 64.1], [16.4, 67.2], [20.4, 68.7]],
  },
  {
    name: "Carpathians",
    coords: [[17.2, 48.8], [20.1, 49.2], [23.6, 48.5], [26.1, 47.1], [28.2, 45.5]],
  },
  {
    name: "Caucasus",
    coords: [[39.0, 42.7], [42.1, 43.3], [45.2, 42.9], [48.1, 42.2]],
  },
  {
    name: "Atlas",
    coords: [[-9.5, 31.2], [-6.4, 32.1], [-3.8, 34.0], [0.5, 35.6], [7.3, 36.4]],
  },
  {
    name: "Urals",
    coords: [[58.4, 51.2], [59.2, 54.2], [59.7, 57.4], [60.3, 60.2], [61.1, 63.7], [62.0, 66.2]],
  },
];

const desertTextureLines = [
  [[-15, 24], [-8, 25.4], [0, 24.7], [8, 26.2], [17, 25.7], [27, 27.1], [35, 26.4]],
  [[-11, 20.3], [-3, 21.7], [6, 20.9], [15, 22.1], [24, 21.4], [33, 22.9]],
  [[36, 20.2], [41, 21.7], [47, 21.1], [53, 23.2], [58, 22.8]],
  [[39, 27.6], [44, 28.7], [50, 27.9], [56, 29.1]],
];

const forestBelts = [
  [[7, 60.2], [13, 61.5], [20, 63.3], [28, 65.2]],
  [[26, 55.2], [34, 56.6], [43, 58.1], [53, 59.4], [62, 60.2]],
  [[16, 48.0], [22, 49.0], [28, 48.2], [34, 49.4]],
];

let socket = createSocket();

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  createAccount();
});

loginAccountButton.addEventListener("click", () => {
  loginAccount();
});

previewWorldButton.addEventListener("click", () => {
  previewWorld();
});

backToAuth.addEventListener("click", () => {
  appState.screen = "auth";
  render();
});

previewFromLobby.addEventListener("click", () => {
  previewWorld();
});

if (closeProvincePanel) {
  closeProvincePanel.addEventListener("click", () => {
    closeProvinceInfoPanel();
  });
}

function savedAccounts() {
  try {
    return JSON.parse(localStorage.getItem("worldMandateAccounts") || "{}");
  } catch (error) {
    return {};
  }
}

function saveAccounts(accounts) {
  localStorage.setItem("worldMandateAccounts", JSON.stringify(accounts));
}

function setAccountMessage(message, tone = "info") {
  accountMessage.textContent = message;
  accountMessage.className = `module-copy tone-${tone}`;
}

function enterLobby(accountName) {
  appState.accountName = accountName;
  topPlayer.textContent = accountName;
  appState.screen = "lobby";
  setAccountMessage("Account ready. Choose a country or preview the world.", "positive");
  render();
}

function createAccount() {
  const username = accountUsernameInput.value.trim();
  const email = accountEmailInput.value.trim();
  const password = accountPasswordInput.value;
  const commanderName = playerNameInput.value.trim() || username;

  if (username.length < 3) return setAccountMessage("Username needs at least 3 characters.", "warning");
  if (password.length < 4) return setAccountMessage("Password needs at least 4 characters.", "warning");

  const accounts = savedAccounts();
  if (accounts[username]) return setAccountMessage("That account already exists. Use Login.", "warning");

  accounts[username] = {
    username,
    email,
    password,
    commanderName,
    createdAt: new Date().toISOString(),
  };
  saveAccounts(accounts);
  enterLobby(commanderName);
}

function loginAccount() {
  const username = accountUsernameInput.value.trim();
  const password = accountPasswordInput.value;
  const account = savedAccounts()[username];

  if (!account) return setAccountMessage("No account found. Create one first.", "warning");
  if (account.password !== password) return setAccountMessage("Wrong password for this prototype account.", "danger");

  enterLobby(account.commanderName || username);
}

function previewWorld() {
  if (!appState.game || !appState.game.activeServerId) {
    const firstServer = appState.game && appState.game.servers && appState.game.servers[0];
    if (firstServer) {
      sendMessage({ type: "joinServer", serverId: firstServer.id });
      appState.screen = "lobby";
      return;
    }
  }
  appState.screen = "game";
  if (!appState.selectedRegionId && appState.game && appState.game.regions[0]) {
    appState.selectedRegionId = appState.game.regions[0].id;
  }
  render();
}

function createSocket() {
  const protocol = window.location.protocol === "https:" ? "wss" : "ws";
  const host = window.location.hostname || "127.0.0.1";
  const port = window.location.port || "4173";
  const ws = new WebSocket(`${protocol}://${host}:${port}`);

  ws.addEventListener("open", () => {
    appState.connected = true;
    appState.socketReconnectAttempts = 0;
    if (appState.socketReconnectTimer) {
      clearTimeout(appState.socketReconnectTimer);
      appState.socketReconnectTimer = null;
    }
    renderStatus();
  });

  ws.addEventListener("close", () => {
    appState.connected = false;
    renderStatus();
    scheduleSocketReconnect();
  });

  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.type === "state") {
      appState.game = message.payload;
      ensureUnitGameplayData();
      loadGameplayStateIfNeeded();
      applyProvinceOwnerOverrides();
      if (appState.game.viewerCountryId && appState.screen !== "game") appState.screen = "game";
      if (!appState.selectedRegionId && appState.game.viewerCountryId) {
        const homeRegion = appState.game.regions.find((region) => region.owner === appState.game.viewerCountryId);
        appState.selectedRegionId = homeRegion ? homeRegion.id : (appState.game.regions[0] && appState.game.regions[0].id) || null;
      }
      if (Object.keys(appState.movementOrders || {}).length || Object.keys(appState.captureProgress || {}).length) {
        startMovementAnimation();
      }
      render();
      return;
    }

    if (message.type === "error") showToast(message.message);
  });

  return ws;
}

function scheduleSocketReconnect() {
  if (appState.socketReconnectTimer) return;
  appState.socketReconnectAttempts += 1;
  const delay = Math.min(6000, 900 + (appState.socketReconnectAttempts * 450));
  showToast("Connection lost. Reconnecting...");
  appState.socketReconnectTimer = setTimeout(() => {
    appState.socketReconnectTimer = null;
    if (socket && socket.readyState === WebSocket.OPEN) return;
    socket = createSocket();
  }, delay);
}

function sendMessage(message) {
  if (socket.readyState !== WebSocket.OPEN) {
    showToast("Server is reconnecting...");
    scheduleSocketReconnect();
    return;
  }
  socket.send(JSON.stringify(message));
}

function switchScreen() {
  screenAuth.classList.toggle("active", appState.screen === "auth");
  screenLobby.classList.toggle("active", appState.screen === "lobby");
  screenGame.classList.toggle("active", appState.screen === "game");
  document.body.classList.toggle("game-map-only", appState.screen === "game");
}

function renderStatus() {
  connectionStatus.textContent = appState.connected ? "Connected" : "Offline";
  connectionStatus.className = appState.connected ? "tone-positive" : "tone-danger";
}

function ownedCountry() {
  return appState.game ? appState.game.countries.find((country) => country.id === appState.game.viewerCountryId) || null : null;
}

function viewer() {
  return appState.game && appState.game.viewer ? appState.game.viewer : ownedCountry();
}

function regionById(regionId) {
  return appState.game ? appState.game.regions.find((region) => region.id === regionId) || null : null;
}

function strategicNodeById(nodeId) {
  return appState.game && appState.game.strategicNodes
    ? appState.game.strategicNodes.find((node) => node.id === nodeId) || null
    : null;
}

function unitsByRegion(regionId) {
  return appState.game ? appState.game.units.filter((unit) => unit.regionId === regionId && !unit.toRegionId) : [];
}

function fmtResource(resource, value) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${Math.round(value)} ${resourceLabels[resource]}`;
}

function costLine(cost) {
  return Object.entries(cost || {})
    .filter(([, value]) => value)
    .map(([resource, value]) => `${value} ${resourceLabels[resource]}`)
    .join(" / ");
}

function normalizeName(value) {
  return String(value || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function nodeMatchesProvince(node, province) {
  if (!node || !province || node.country !== province.countryId) return false;
  const provinceName = normalizeName(province.name);
  const names = [node.province, node.name, ...(node.aliases || [])].map(normalizeName);
  return names.some((name) => name && (name === provinceName || name.includes(provinceName) || provinceName.includes(name)));
}

function nodesForProvince(province) {
  if (!appState.game || !appState.game.strategicNodes || !province) return [];
  return appState.game.strategicNodes.filter((node) => nodeMatchesProvince(node, province));
}

function nodesForCountry(countryId) {
  if (!appState.game || !appState.game.strategicNodes) return [];
  return appState.game.strategicNodes.filter((node) => node.country === countryId);
}

function resourceOutputText(output) {
  return Object.entries(resourceLabels)
    .map(([resource, label]) => [label, Math.round((output && output[resource]) || 0)])
    .filter(([, value]) => value > 0)
    .map(([label, value]) => `${value} ${label}`)
    .join(", ") || "No major output";
}

function sumNodeOutput(nodes, fallbackCountryId = null) {
  const output = { steel: 0, oil: 0, electronics: 0, money: 0 };
  for (const node of nodes) {
    for (const resource of Object.keys(output)) {
      output[resource] += (node.output && node.output[resource]) || 0;
    }
  }

  if (nodes.length === 0 && fallbackCountryId) {
    output.money = 2;
    output.steel = fallbackCountryId === "germany" || fallbackCountryId === "russia" || fallbackCountryId === "china" ? 2 : 1;
    output.oil = fallbackCountryId === "saudi" || fallbackCountryId === "russia" || fallbackCountryId === "usa" ? 1 : 0;
    output.electronics = fallbackCountryId === "sweden" || fallbackCountryId === "china" ? 1 : 0;
  }

  return output;
}

function nodeInfrastructureNames(nodes) {
  const names = [];
  for (const node of nodes) {
    for (const id of node.infrastructure || []) {
      const building = appState.game && appState.game.buildingTypes[id];
      names.push(building ? building.name : nodeKindLabels[id] || id);
    }
  }
  return [...new Set(names)];
}

function provinceValueSummary(province) {
  const nodes = nodesForProvince(province);
  const countryNodes = nodesForCountry(province.countryId);
  const output = sumNodeOutput(nodes, province.countryId);
  const population = nodes.reduce((total, node) => total + (node.population || 0), 0);
  const garrison = nodes.reduce((total, node) => total + (node.garrison || 0), 0);
  const slots = nodes.reduce((total, node) => total + (node.slots || 0), 0) || 1;
  const infrastructure = nodeInfrastructureNames(nodes);

  return {
    nodes,
    countryNodes,
    output,
    population,
    garrison,
    slots,
    infrastructure,
  };
}

function currentZoom() {
  return appState.leafletMap ? appState.leafletMap.getZoom() : cameraConfig.defaultZoom;
}

function cameraTier() {
  const zoom = currentZoom();
  if (zoom <= cameraConfig.worldMax) return "world";
  if (zoom <= cameraConfig.regionalMax) return "regional";
  return "province";
}

function nodeLod(node) {
  if (!node) return "province";
  if (node.kind === "capital") return "world";
  if (["money", "steel", "oil", "electronics", "rare"].includes(node.kind)) return "regional";
  return "province";
}

function nodeVisibleAtTier(node, tier) {
  const lod = nodeLod(node);
  if (tier === "world") return lod === "world";
  if (tier === "regional") return lod === "world" || lod === "regional";
  return true;
}

function strategicNodeClass(node, selected, tier) {
  const lod = nodeLod(node);
  const labelMode = tier === "world" && lod === "world" ? "label-on" : tier === "province" ? "label-on" : "label-compact";
  return `strategic-node node-${node.kind} tier-${tier} lod-${lod} ${labelMode} ${selected ? "selected" : ""} ${node.relation || "neutral"}`;
}

function nodeIconMetrics(node, tier) {
  const isResource = ["oil", "steel", "electronics", "rare"].includes(node.kind);
  const isCapital = node.kind === "capital";
  const badgeWidth = isCapital ? 30 : 22;
  const height = isCapital ? 34 : tier === "regional" ? 24 : 28;
  const width = isCapital ? 150 : tier === "regional" ? 56 : isResource ? 100 : 126;

  return {
    size: [width, height],
    anchor: [Math.round(badgeWidth / 2), Math.round(height / 2)],
  };
}

function nodeCoordinates(node) {
  const coordinates = Array.isArray(node.coordinates) ? node.coordinates : null;
  if (!coordinates) return null;
  const lng = Number(coordinates[0]);
  const lat = Number(coordinates[1]);
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) return null;
  if (lat < -90 || lat > 90 || lng < -180 || lng > 180) return null;
  return [lng, lat];
}

function nodeGeoJsonFeature(node) {
  const coordinates = nodeCoordinates(node);
  if (!coordinates) return null;
  return {
    type: "Feature",
    geometry: {
      type: "Point",
      coordinates,
    },
    properties: {
      id: node.id,
      name: node.name,
      kind: node.kind,
      country: node.country,
    },
  };
}

function setLayerVisible(layer, visible) {
  if (!appState.leafletMap || !layer) return;
  const active = appState.leafletMap.hasLayer(layer);
  if (visible && !active) layer.addTo(appState.leafletMap);
  if (!visible && active) layer.remove();
}

function ringArea(ring) {
  let area = 0;
  for (let index = 0, last = ring.length - 1; index < ring.length; last = index++) {
    const point = ring[index];
    const previous = ring[last];
    area += (previous[0] * point[1]) - (point[0] * previous[1]);
  }
  return area / 2;
}

function polygonArea(rings) {
  if (!rings || !rings.length) return 0;
  return Math.abs(ringArea(rings[0]));
}

function largestPolygonRings(feature) {
  const geometry = feature && feature.geometry;
  if (!geometry) return null;
  if (geometry.type === "Polygon") return geometry.coordinates;
  if (geometry.type !== "MultiPolygon") return null;

  return geometry.coordinates.reduce((best, polygon) => (
    !best || polygonArea(polygon) > polygonArea(best) ? polygon : best
  ), null);
}

function polygonCentroid(ring) {
  let x = 0;
  let y = 0;
  let area = 0;

  for (let index = 0, last = ring.length - 1; index < ring.length; last = index++) {
    const point = ring[index];
    const previous = ring[last];
    const factor = (previous[0] * point[1]) - (point[0] * previous[1]);
    x += (previous[0] + point[0]) * factor;
    y += (previous[1] + point[1]) * factor;
    area += factor;
  }

  if (Math.abs(area) < 0.000001) return null;
  return [x / (3 * area), y / (3 * area)];
}

function pointInRing(point, ring) {
  let inside = false;
  for (let index = 0, last = ring.length - 1; index < ring.length; last = index++) {
    const current = ring[index];
    const previous = ring[last];
    const intersects = ((current[1] > point[1]) !== (previous[1] > point[1])) &&
      (point[0] < ((previous[0] - current[0]) * (point[1] - current[1])) / (previous[1] - current[1]) + current[0]);
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point, rings) {
  if (!rings || !rings.length || !pointInRing(point, rings[0])) return false;
  return !rings.slice(1).some((hole) => pointInRing(point, hole));
}

function distanceToSegmentSquared(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  if (dx === 0 && dy === 0) {
    const px = point[0] - start[0];
    const py = point[1] - start[1];
    return (px * px) + (py * py);
  }
  const t = Math.max(0, Math.min(1, (((point[0] - start[0]) * dx) + ((point[1] - start[1]) * dy)) / ((dx * dx) + (dy * dy))));
  const x = start[0] + (t * dx);
  const y = start[1] + (t * dy);
  const px = point[0] - x;
  const py = point[1] - y;
  return (px * px) + (py * py);
}

function distanceToPolygonEdge(point, rings) {
  let best = Infinity;
  for (const ring of rings) {
    for (let index = 0, last = ring.length - 1; index < ring.length; last = index++) {
      best = Math.min(best, distanceToSegmentSquared(point, ring[last], ring[index]));
    }
  }
  return best;
}

function provinceLabelPoint(feature) {
  const rings = largestPolygonRings(feature);
  if (!rings || !rings[0] || rings[0].length < 4) return null;

  const centroid = polygonCentroid(rings[0]);
  if (centroid && pointInPolygon(centroid, rings)) return [centroid[1], centroid[0]];

  const lngs = rings[0].map((point) => point[0]);
  const lats = rings[0].map((point) => point[1]);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const columns = 12;
  const rows = 12;
  let bestPoint = null;
  let bestDistance = -1;

  for (let row = 1; row < rows; row++) {
    for (let column = 1; column < columns; column++) {
      const point = [
        minLng + ((maxLng - minLng) * column) / columns,
        minLat + ((maxLat - minLat) * row) / rows,
      ];
      if (!pointInPolygon(point, rings)) continue;
      const distance = distanceToPolygonEdge(point, rings);
      if (distance > bestDistance) {
        bestDistance = distance;
        bestPoint = point;
      }
    }
  }

  return bestPoint ? [bestPoint[1], bestPoint[0]] : null;
}

function labelBoxesOverlap(box, boxes) {
  return boxes.some((other) => !(
    box.right < other.left ||
    box.left > other.right ||
    box.bottom < other.top ||
    box.top > other.bottom
  ));
}

function provinceLabelPriority(feature) {
  const rings = largestPolygonRings(feature);
  const area = polygonArea(rings || []);
  const name = featureName(feature);
  return area * (name.length > 15 ? 0.84 : 1);
}

function renderLobby() {
  if (!appState.game) {
    lobbyCaption.textContent = "Waiting for server state...";
    countryList.innerHTML = "";
    return;
  }

  if (!appState.game.activeServerId) {
    lobbyCaption.textContent = `${appState.game.servers.length} active servers`;
    countryList.innerHTML = appState.game.servers
      .map(
        (server) => `
          <article class="country-option server-option">
            <div>
              <h3>${server.name}</h3>
              <small>${server.map} / ${server.speed} speed</small>
              <div class="country-meta">
                <span class="country-tag">${server.players}/${server.maxPlayers} players</span>
                <span class="country-tag">${server.openCountries} open countries</span>
                <span class="country-tag">${server.wars} wars</span>
                <span class="country-tag">tick ${server.tick}</span>
              </div>
            </div>
            <button data-server="${server.id}">Join Server</button>
          </article>
        `
      )
      .join("");

    countryList.querySelectorAll("[data-server]").forEach((button) => {
      button.addEventListener("click", () => {
        appState.selectedRegionId = null;
        appState.selectedNodeId = null;
        appState.selectedProvince = null;
        sendMessage({ type: "joinServer", serverId: button.dataset.server });
      });
    });
    return;
  }

  lobbyCaption.textContent = `${appState.game.countries.filter((country) => country.playable).length} playable countries`;
  countryList.innerHTML = appState.game.countries
    .filter((country) => country.playable)
    .map(
      (country) => `
        <article class="country-option">
          <div>
            <h3>${country.name}</h3>
            <small>${country.trait}</small>
            <div class="country-meta">
              <span class="country-tag">${country.claimed ? "claimed" : "open"}</span>
              <span class="country-tag">Stability ${country.stability}</span>
              <span class="country-tag">${country.regions} regions</span>
            </div>
          </div>
          <button data-country="${country.id}" ${country.claimed ? "disabled" : ""}>Take Control</button>
        </article>
      `
    )
    .join("");

  countryList.querySelectorAll("[data-country]").forEach((button) => {
    button.addEventListener("click", () => {
      sendMessage({ type: "join", name: appState.accountName, countryId: button.dataset.country });
    });
  });
}

function renderPlayerCard() {
  const country = viewer();
  const spectating = !appState.game.viewerCountryId;
  playerCountryName.textContent = country ? country.name : "Spectating World";
  playerTrait.textContent = country ? country.trait : "No country selected";
  playerCaption.textContent = country
    ? `${country.regions} regions controlled. Use resources to shape military, industry, and diplomacy.`
    : "Preview mode lets you inspect the live map, news, country economies, and AI wars before choosing a country.";
  playerViewLabel.textContent = country ? country.name : "Spectator";
  gamePlayer.textContent = appState.accountName;
  gameDay.textContent = `Tick ${String(appState.game.tick).padStart(2, "0")} | ${appState.game.serverName}`;
  winStatus.textContent = spectating ? "Preview mode" : (country && country.victory) || "No victory yet";

  const stability = (country && country.stability) || 0;
  stabilityValue.textContent = `${stability}%`;
  stabilityFill.style.width = `${stability}%`;
  stabilityFill.className = stability < 40 ? "meter-fill danger" : stability < 65 ? "meter-fill warning" : "meter-fill";
  if (manpowerValue) {
    const manpower = country ? Math.max(0, (country.regions || 0) * 120 - ((country.military.infantry || 0) * 20)) : 0;
    manpowerValue.textContent = country ? String(manpower) : "--";
  }
}

function renderResources() {
  const country = viewer();
  if (!country) {
    const strongest = appState.game.countries
      .slice()
      .sort((a, b) => b.regions - a.regions)
      .slice(0, 4);
    resourceGrid.innerHTML = strongest
      .map(
        (country) => `
          <article class="resource-tile">
            <span>${country.name}</span>
            <strong>${country.regions}</strong>
            <small>regions controlled</small>
          </article>
        `
      )
      .join("");
    productionGrid.innerHTML = appState.game.countries
      .slice(0, 4)
      .map(
        (country) => `
          <article class="resource-tile compact">
            <span>${country.name}</span>
            <strong>${country.stability}%</strong>
            <small>stability</small>
          </article>
        `
      )
      .join("");
    return;
  }

  resourceGrid.innerHTML = Object.entries(resourceLabels)
    .map(
      ([resource, label]) => `
        <article class="resource-tile resource-${resource}">
          <span>${label}</span>
          <strong>${Math.round(country.stockpile[resource] || 0)}</strong>
        </article>
      `
    )
    .join("");

  productionGrid.innerHTML = Object.entries(resourceLabels)
    .map(([resource, label]) => {
      const production = country.production[resource] || 0;
      const upkeep = country.upkeep[resource] || 0;
      const net = production - upkeep;
      return `
        <article class="resource-tile compact resource-${resource}">
          <span>${label}</span>
          <strong class="${net < 0 ? "tone-danger" : "tone-positive"}">${fmtResource(resource, net)}</strong>
          <small>${production} produced / ${upkeep} upkeep</small>
        </article>
      `;
    })
    .join("");
}

function renderSelectedRegion() {
  const region = regionById(appState.selectedRegionId);
  const country = viewer();
  const selectedNode = strategicNodeById(appState.selectedNodeId);

  if (appState.debugSelectedProvinceId) {
    renderDebugProvinceCommand();
    return;
  }

  if (selectedNode) {
    showCommandCard();
    const owner = appState.game.countries.find((entry) => entry.id === selectedNode.country);
    selectedRegionType.textContent = nodeKindLabels[selectedNode.kind] || "node";
    selectedRegion.innerHTML = `
      <h3>${selectedNode.name}</h3>
      <p><strong>Country:</strong> ${selectedNode.ownerName}</p>
      <p><strong>Province:</strong> ${selectedNode.province}</p>
      <p><strong>Population:</strong> ${selectedNode.population ? `${selectedNode.population.toFixed(1)}M` : "Regional site"}</p>
      <p><strong>Output:</strong> ${resourceOutputText(selectedNode.output)}</p>
      <p><strong>Infrastructure:</strong> ${nodeInfrastructureNames([selectedNode]).join(", ") || "None"}</p>
      <p><strong>Stability:</strong> ${selectedNode.stability || (owner && owner.stability) || 0}%</p>
      <p><strong>Garrison:</strong> ${selectedNode.garrison || 0} units / <strong>Slots:</strong> ${selectedNode.slots || 1}</p>
    `;
    buildActions.innerHTML = `<p class="module-copy">Node construction will use this site's ${selectedNode.slots || 1} slots.</p>`;
    recruitActions.innerHTML = (selectedNode.infrastructure || []).some((id) => ["airbase", "navalPort", "barracks"].includes(id))
      ? `<p class="module-copy">This node can support recruitment once province control is connected.</p>`
      : `<p class="module-copy">Industrial nodes boost economy and unlock upgrades.</p>`;
    movementActions.innerHTML = `<p class="module-copy">Units will move between province nodes and neighboring control zones.</p>`;
    return;
  }

  if (appState.selectedProvince) {
    showCommandCard();
    const province = appState.selectedProvince;
    const owner = province.country;
    const summary = provinceValueSummary(province);
    const strategicNodes = summary.nodes
      .map((node) => `${node.name} (${nodeKindLabels[node.kind] || node.kind})`)
      .join(", ");
    selectedRegionType.textContent = "province";
    selectedRegion.innerHTML = `
      <h3>${province.name}</h3>
      <p><strong>Country:</strong> ${owner ? owner.name : province.countryName}</p>
      <p><strong>Status:</strong> ${owner ? owner.relation : "neutral"}</p>
      <p><strong>Control:</strong> ${owner && owner.claimed ? "Player controlled country" : "AI / open country"}</p>
      <p><strong>Population:</strong> ${summary.population ? `${summary.population.toFixed(1)}M` : "Local population zone"}</p>
      <p><strong>Output:</strong> ${resourceOutputText(summary.output)}</p>
      <p><strong>Buildings:</strong> ${summary.infrastructure.join(", ") || "Local logistics"}</p>
      <p><strong>Stability:</strong> ${owner ? owner.stability : 0}%</p>
      <p><strong>Garrison:</strong> ${summary.garrison || 0} units / <strong>Construction slots:</strong> ${summary.slots}</p>
      <p><strong>Strategic nodes:</strong> ${strategicNodes || "No major node mapped here yet"}</p>
    `;
    buildActions.innerHTML = `<p class="module-copy">This province can support ${summary.slots} construction slot${summary.slots === 1 ? "" : "s"}.</p>`;
    recruitActions.innerHTML = summary.infrastructure.some((name) => ["Barracks", "Airbase", "Naval Port"].includes(name))
      ? `<p class="module-copy">Military infrastructure present. Click a node for recruitment detail.</p>`
      : `<p class="module-copy">Build military infrastructure here before major recruitment.</p>`;
    movementActions.innerHTML = `<p class="module-copy">Province movement lanes will connect from these strategic nodes.</p>`;
    return;
  }

  if (!region) {
    hideCommandCard();
    selectedRegionType.textContent = "--";
    selectedRegion.innerHTML = "";
    buildActions.innerHTML = "";
    recruitActions.innerHTML = "";
    movementActions.innerHTML = "";
    return;
  }

  const regionUnits = unitsByRegion(region.id);
  const ownUnits = regionUnits.filter((unit) => unit.owner === appState.game.viewerCountryId);
  const construction = region.construction
    ? `<p><strong>Building:</strong> ${region.construction.name}, ${region.construction.remaining} ticks left</p>`
    : "";

  selectedRegionType.textContent = region.type;
  showCommandCard();
  selectedRegion.innerHTML = `
    <h3>${region.name}</h3>
    <p><strong>Owner:</strong> ${region.ownerName}</p>
    <p><strong>Output:</strong> ${Object.entries(region.baseOutput).map(([resource, value]) => `${value} ${resourceLabels[resource]}`).join(", ") || "None"}</p>
    <p><strong>Buildings:</strong> ${region.buildings.map((id) => appState.game.buildingTypes[id].name).join(", ") || "None"}</p>
    ${construction}
    <p><strong>Units:</strong> ${regionUnits.map((unit) => `${unit.ownerName} ${unit.name}`).join(", ") || "None"}</p>
    <p><strong>Connections:</strong> ${region.neighbors.map((neighborId) => {
      const neighbor = regionById(neighborId);
      return (neighbor && neighbor.name) || neighborId;
    }).join(", ")}</p>
  `;

  renderBuildActions(region, country);
  renderRecruitActions(region, country);
  renderMovementActions(region, ownUnits);
}

function renderDebugProvinceCommand() {
  const province = appState.selectedProvince;
  if (provinceCommandCard) {
    showCommandCard("basic-province");
    provinceCommandCard.classList.remove("unit-command");
  }
  selectedRegionType.textContent = "province";
  if (province) {
    selectedRegion.innerHTML = `
      <div class="province-sheet-title">
        <h3>${province.name}</h3>
        <span>${province.ownerName}</span>
      </div>
      ${provinceCaptureStatusHtml(province)}
      ${provinceEtaStatusHtml(province)}
      <div class="province-stat-grid">
        <article>
          <span>Population</span>
          <strong>${province.population.toFixed(1)}M</strong>
        </article>
        <article>
          <span>Morale</span>
          <strong>${province.stability}%</strong>
        </article>
        <article>
          <span>Output</span>
          <strong>${provinceResourceSummary(province.resources)}</strong>
        </article>
      </div>
    `;
    buildActions.innerHTML = `
      <button class="mini-button province-action" type="button"><strong>Build</strong></button>
      <button class="mini-button province-action" type="button"><strong>Recruit</strong></button>
      <button class="mini-button province-action" type="button"><strong>Move</strong></button>
    `;
    recruitActions.innerHTML = "";
    movementActions.innerHTML = "";
    return;
  }
  selectedRegion.innerHTML = `
    <div class="province-sheet-title">
      <h3>${appState.debugSelectedProvinceName}</h3>
      <span>Unknown country</span>
    </div>
    <div class="province-stat-grid">
      <article>
        <span>Population</span>
        <strong>--</strong>
      </article>
      <article>
        <span>Morale</span>
        <strong>--</strong>
      </article>
        <article>
          <span>Output</span>
          <strong>--</strong>
        </article>
      </div>
  `;
  buildActions.innerHTML = `
    <button class="mini-button province-action" type="button"><strong>Build</strong></button>
    <button class="mini-button province-action" type="button"><strong>Recruit</strong></button>
    <button class="mini-button province-action" type="button"><strong>Move</strong></button>
  `;
  recruitActions.innerHTML = "";
  movementActions.innerHTML = "";
}

function closeProvinceInfoPanel() {
  if (appState.selectedProvince) appState.selectedProvince.selected = false;
  appState.selectedProvince = null;
  appState.selectedRegionId = null;
  appState.selectedNodeId = null;
  appState.selectedMovementUnitId = null;
  appState.selectedUnitCommandMode = null;
  appState.selectedUnitStackIds = [];
  appState.movementRoutePreview = null;
  appState.debugSelectedProvinceId = null;
  appState.debugSelectedProvinceName = "None";
  appState.deckSelectedFeatureId = null;
  hideCommandCard();
  selectedRegionType.textContent = "--";
  selectedRegion.innerHTML = "";
  buildActions.innerHTML = "";
  recruitActions.innerHTML = "";
  movementActions.innerHTML = "";
  appState.deckLayerSignature = "";
  updateDeckStrategyLayers();
}

function renderBuildActions(region, country) {
  if (!appState.game.viewerCountryId) {
    buildActions.innerHTML = `<p class="module-copy">Preview mode: create or login to command a country.</p>`;
    return;
  }
  if (!country || region.owner !== appState.game.viewerCountryId) {
    buildActions.innerHTML = `<p class="module-copy">Control this region to construct infrastructure.</p>`;
    return;
  }

  buildActions.innerHTML = Object.entries(appState.game.buildingTypes)
    .filter(([id]) => !region.buildings.includes(id))
    .map(
      ([id, building]) => `
        <button class="mini-button" data-build="${id}" ${region.construction ? "disabled" : ""}>
          <strong>${building.name}</strong>
          <span>${costLine(building.cost)}</span>
        </button>
      `
    )
    .join("");

  buildActions.querySelectorAll("[data-build]").forEach((button) => {
    button.addEventListener("click", () => {
      sendMessage({ type: "build", regionId: region.id, buildingId: button.dataset.build });
    });
  });
}

function renderRecruitActions(region, country) {
  if (!appState.game.viewerCountryId) {
    recruitActions.innerHTML = `<p class="module-copy">Choose a country to recruit units.</p>`;
    return;
  }
  if (!country || region.owner !== appState.game.viewerCountryId) {
    recruitActions.innerHTML = "";
    return;
  }

  recruitActions.innerHTML = Object.entries(appState.game.unitTypes)
    .map(
      ([id, unit]) => `
        <button class="mini-button" data-recruit="${id}">
          <strong>${unit.name}</strong>
          <span>${costLine(unit.cost)}</span>
        </button>
      `
    )
    .join("");

  recruitActions.querySelectorAll("[data-recruit]").forEach((button) => {
    button.addEventListener("click", () => {
      sendMessage({ type: "recruit", regionId: region.id, unitType: button.dataset.recruit });
    });
  });
}

function renderMovementActions(region, ownUnits) {
  if (ownUnits.length === 0) {
    movementActions.innerHTML = `<p class="module-copy">No idle units here. Select one of your occupied regions.</p>`;
    return;
  }

  movementActions.innerHTML = ownUnits
    .map((unit) =>
      region.neighbors
        .map((neighborId) => {
          const neighbor = regionById(neighborId);
          return `
            <button class="mini-button" data-move="${neighborId}" data-unit="${unit.type}">
              <strong>${unit.name} to ${neighbor.name}</strong>
              <span>${neighbor.ownerName} / ${neighbor.type}</span>
            </button>
          `;
        })
        .join("")
    )
    .join("");

  movementActions.querySelectorAll("[data-move]").forEach((button) => {
    button.addEventListener("click", () => {
      sendMessage({
        type: "move",
        fromRegionId: region.id,
        toRegionId: button.dataset.move,
        unitType: button.dataset.unit,
      });
    });
  });
}

function selectedProvinceEta(province) {
  if (!province || !movementApi() || !movementApi().movementEtaForOrder) return null;
  const preview = appState.movementRoutePreview;
  if (preview && preview.toProvinceId === province.id) return movementApi().movementEtaForOrder(preview);
  if (!appState.selectedMovementUnitId) return null;
  const order = appState.movementOrders && appState.movementOrders[appState.selectedMovementUnitId];
  if (order && order.toProvinceId === province.id) return movementApi().movementEtaForOrder(order);
  return null;
}

function provinceCaptureStatusHtml(province) {
  const capture = province && activeCaptureForProvince(province.id);
  if (!capture) return "";
  return `<div class="province-status-line">Capturing: ${Math.floor(Number(capture.progress || 0))}%</div>`;
}

function provinceEtaStatusHtml(province) {
  const eta = selectedProvinceEta(province);
  if (!eta) return "";
  return `<div class="province-status-line">ETA: ${eta.label}</div>`;
}

function selectedUnitSource() {
  if (!appState.selectedMovementUnitId || !appState.game) return null;
  return (appState.game.units || []).find((unit) => unit.id === appState.selectedMovementUnitId) || null;
}

function selectedUnitPanelData() {
  const unit = selectedUnitSource();
  if (!unit) return null;
  const rendered = deckUnitData(deckZoomStep()).find((entry) => (
    entry.id === unit.id ||
    (Array.isArray(entry.stackUnits) && entry.stackUnits.includes(unit.id))
  ));
  const province = unitCurrentProvince(unit);
  return {
    ...(rendered || unit),
    sourceUnit: unit,
    stackUnits: rendered && Array.isArray(rendered.stackUnits) ? rendered.stackUnits : [unit.id],
    stackCount: rendered && rendered.stackCount ? rendered.stackCount : 1,
    province,
    coords: rendered && rendered.coords ? rendered.coords : unitCurrentLngLat(unit),
  };
}

function unitPanelIconText(unit) {
  const type = unitVisualType(unit);
  if (type === "armor") return "AV";
  if (type === "infantry") return "INF";
  return "RCN";
}

function renderUnitCommandPanel() {
  const unit = selectedUnitPanelData();
  if (!unit) return;
  showCommandCard("basic-province", "unit-command");
  selectedRegionType.textContent = "unit";
  const province = unit.province || null;
  const hp = Number.isFinite(Number(unit.health)) ? Number(unit.health) : 100;
  const maxHp = unit.type === "tanks" ? 58 : unit.type === "navy" ? 70 : unit.type === "jets" ? 44 : 36;
  if (appState.selectedProvince) appState.selectedProvince.selected = false;
  appState.selectedProvince = null;
  appState.debugSelectedProvinceId = null;
  appState.debugSelectedProvinceName = "None";
  selectedRegion.innerHTML = `
    <div class="unit-sheet">
      <div class="unit-panel-icon unit-panel-${unitVisualType(unit)}">${unitPanelIconText(unit)}</div>
      <div class="province-sheet-title">
        <h3>${unit.stackCount > 1 ? `${unit.stackCount} Unit Stack` : unit.name}</h3>
        <span>${unit.ownerName || countryNameForId(unitOwnerId(unit))}</span>
      </div>
    </div>
    <div class="province-stat-grid unit-stat-grid">
      <article>
        <span>Type</span>
        <strong>${unitTypeLabel(unit)}</strong>
      </article>
      <article>
        <span>HP</span>
        <strong>${hp}/${maxHp}</strong>
      </article>
      <article>
        <span>Province</span>
        <strong>${province ? province.name : unit.provinceName || "Unknown"}</strong>
      </article>
    </div>
  `;
  const splitDisabled = unit.stackCount <= 1 ? "disabled" : "";
  buildActions.innerHTML = `
    <button class="mini-button province-action" type="button" data-unit-command="move"><strong>Move</strong></button>
    <button class="mini-button province-action" type="button" data-unit-command="attack"><strong>Attack</strong></button>
    <button class="mini-button province-action" type="button" data-unit-command="split" ${splitDisabled}><strong>Split</strong></button>
  `;
  recruitActions.innerHTML = "";
  movementActions.innerHTML = appState.selectedUnitCommandMode
    ? `<p class="module-copy">Command: ${appState.selectedUnitCommandMode.toUpperCase()}</p>`
    : "";
  bindUnitCommandButtons(unit);
}

function bindUnitCommandButtons(unit) {
  buildActions.querySelectorAll("[data-unit-command]").forEach((button) => {
    button.addEventListener("click", () => {
      const command = button.dataset.unitCommand;
      if (command === "move") {
        appState.selectedUnitCommandMode = "move";
        showToast(`${unit.name} ready to move. Hover and click a destination province.`);
      } else if (command === "attack") {
        appState.selectedUnitCommandMode = "attack";
        appState.movementRoutePreview = null;
        showToast(`${unit.name} attack order armed. Click an enemy unit or province.`);
      } else if (command === "split") {
        renderUnitSplitMenu(unit);
        return;
      }
      appState.deckLayerSignature = "";
      renderUnitCommandPanel();
      updateDeckStrategyLayers();
    });
  });
}

function renderUnitSplitMenu(unit) {
  const stackUnits = Array.isArray(unit.stackUnits) ? unit.stackUnits : [unit.id];
  if (stackUnits.length <= 1) return;
  const options = [];
  for (let count = 1; count < stackUnits.length; count += 1) {
    options.push(`<button class="mini-button province-action" type="button" data-split-count="${count}"><strong>Split ${count}</strong></button>`);
  }
  recruitActions.innerHTML = `<div class="unit-split-menu">${options.join("")}</div>`;
  recruitActions.querySelectorAll("[data-split-count]").forEach((button) => {
    button.addEventListener("click", () => splitSelectedUnitStack(Number(button.dataset.splitCount)));
  });
}

function splitSelectedUnitStack(count) {
  const unit = selectedUnitPanelData();
  const api = movementApi();
  if (!unit || !api || !api.splitStackIds) return;
  const result = api.splitStackIds(unit.stackUnits || [unit.id], count);
  if (!result.split.length) {
    showToast("This stack cannot be split.");
    return;
  }
  const stackId = `local-stack-${appState.nextLocalStackId++}`;
  const remainingStackId = `base-${unit.provinceId || "province"}`;
  result.split.forEach((unitId) => {
    appState.unitStackAssignments[unitId] = stackId;
  });
  result.remaining.forEach((unitId) => {
    appState.unitStackAssignments[unitId] = appState.unitStackAssignments[unitId] || remainingStackId;
  });
  appState.selectedMovementUnitId = result.split[0];
  appState.selectedUnitStackIds = result.split.slice();
  appState.selectedUnitCommandMode = null;
  appState.movementRoutePreview = null;
  scheduleGameplaySave();
  appState.deckLayerSignature = "";
  renderUnitCommandPanel();
  updateDeckStrategyLayers();
  showToast(`Split ${result.split.length} unit${result.split.length === 1 ? "" : "s"} into a new stack.`);
}

function renderDiplomacy() {
  if (!appState.game || !appState.game.viewerCountryId) {
    diplomacyList.innerHTML = appState.game
      ? appState.game.countries
          .map(
            (country) => `
              <article class="diplomacy-row">
                <div class="diplomacy-row-top">
                  <strong>${country.name}</strong>
                  <span class="country-tag">${country.regions} regions</span>
                </div>
                <p class="module-copy">${country.trait} / Stability ${country.stability}</p>
              </article>
            `
          )
          .join("")
      : "";
    return;
  }

  diplomacyList.innerHTML = appState.game.countries
    .filter((country) => country.id !== appState.game.viewerCountryId)
    .map(
      (country) => `
        <article class="diplomacy-row">
          <div class="diplomacy-row-top">
            <strong>${country.name}</strong>
            <span class="country-tag">${country.relation}</span>
          </div>
          <p class="module-copy">${country.trait} / Stability ${country.stability}</p>
          <div class="diplomacy-actions">
            <button class="mini-button small" data-war="${country.id}">War</button>
            <button class="mini-button small" data-alliance="${country.id}">Alliance</button>
            <button class="mini-button small" data-trade="${country.id}">Trade</button>
            <button class="mini-button small" data-peace="${country.id}">Peace</button>
          </div>
        </article>
      `
    )
    .join("");

  const bind = (selector, type, field) => {
    diplomacyList.querySelectorAll(selector).forEach((button) => {
      button.addEventListener("click", () => sendMessage({ type, targetCountryId: button.dataset[field] }));
    });
  };

  bind("[data-war]", "declareWar", "war");
  bind("[data-alliance]", "createAlliance", "alliance");
  bind("[data-trade]", "tradeDeal", "trade");
  bind("[data-peace]", "peaceTreaty", "peace");
}

function renderDecision() {
  const decision = appState.game && appState.game.viewer ? appState.game.viewer.pendingDecision : null;
  decisionPanel.hidden = !decision;
  if (!decision) {
    decisionBody.innerHTML = "";
    decisionActions.innerHTML = "";
    return;
  }

  decisionBody.innerHTML = `
    <h3>${decision.title}</h3>
    <p>${decision.body}</p>
  `;
  decisionActions.innerHTML = decision.choices
    .map((choice) => `<button class="mini-button" data-choice="${choice.id}">${choice.label}</button>`)
    .join("");
  decisionActions.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => sendMessage({ type: "decision", choiceId: button.dataset.choice }));
  });
}

function renderMilitary() {
  const country = viewer();
  if (!country) {
    militaryOverview.innerHTML = "";
    return;
  }

  militaryOverview.innerHTML = Object.entries(appState.game.unitTypes)
    .map(
      ([id, unit]) => `
        <article class="resource-tile compact">
          <span>${unit.name}</span>
          <strong>${country.military[id] || 0}</strong>
          <small>${costLine(unit.cost)}</small>
        </article>
      `
    )
    .join("");
}

function renderStats() {
  serverName.textContent = (appState.game && appState.game.serverName) || "World Mandate Live Theatre";
  tickValue.textContent = String((appState.game && appState.game.tick) || 0).padStart(2, "0");
}

function renderMap() {
  if (!appState.game) {
    gameMap.innerHTML = "";
    return;
  }

  if (window.maplibregl && window.deck && mapLibreMapContainer && deckOverlayContainer) {
    renderMapLibreDeckMap();
    return;
  }

  renderMapError("Map engine did not load. Final game map requires MapLibre and deck.gl.");
}

function svgEl(name, attributes = {}) {
  const element = document.createElementNS("http://www.w3.org/2000/svg", name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}

function mercatorY(lat) {
  const clamped = Math.max(-85, Math.min(85, lat));
  const radians = (clamped * Math.PI) / 180;
  return Math.log(Math.tan((Math.PI / 4) + (radians / 2)));
}

function createDebugProjection(width = 1000, height = 620) {
  const padding = 38;
  const west = (debugProjectionBounds.minLng * Math.PI) / 180;
  const east = (debugProjectionBounds.maxLng * Math.PI) / 180;
  const north = mercatorY(debugProjectionBounds.maxLat);
  const south = mercatorY(debugProjectionBounds.minLat);
  const scale = Math.min((width - (padding * 2)) / (east - west), (height - (padding * 2)) / (north - south));
  const centerX = (west + east) / 2;
  const centerY = (north + south) / 2;

  const project = ([lng, lat]) => {
    const x = width / 2 + (((lng * Math.PI) / 180) - centerX) * scale;
    const y = height / 2 - (mercatorY(lat) - centerY) * scale;
    return [x, y];
  };
  project.cacheKey = `debug-${width}-${height}`;
  return project;
}

function ringPath(ring, project) {
  return ring
    .map((coordinate, index) => {
      const [x, y] = project(coordinate);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ") + " Z";
}

function linePath(coordinates, project) {
  return coordinates
    .map((coordinate, index) => {
      const [x, y] = project(coordinate);
      return `${index === 0 ? "M" : "L"}${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(" ");
}

function drawTerrainBlob(ctx, project, lng, lat, radiusLng, radiusLat, innerColor, outerColor) {
  const [x, y] = project([lng, lat]);
  const [x2] = project([lng + radiusLng, lat]);
  const [, y2] = project([lng, lat + radiusLat]);
  const radius = Math.max(Math.abs(x2 - x), Math.abs(y2 - y), 18);
  const gradient = ctx.createRadialGradient(x, y, radius * 0.08, x, y, radius);
  gradient.addColorStop(0, innerColor);
  gradient.addColorStop(1, outerColor);
  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.ellipse(x, y, Math.abs(x2 - x), Math.abs(y2 - y), 0, 0, Math.PI * 2);
  ctx.fill();
}

function strokeProjectedLine(ctx, project, coordinates) {
  coordinates.forEach((coordinate, index) => {
    const [x, y] = project(coordinate);
    if (index === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
}

function drawDeterministicNoise(ctx, width, height, alpha, count) {
  for (let index = 0; index < count; index++) {
    const x = (index * 73 + ((index * index) % 211)) % width;
    const y = (index * 127 + ((index * 17) % 97)) % height;
    const shade = 150 + (index % 80);
    ctx.fillStyle = `rgba(${shade}, ${shade}, ${shade}, ${alpha})`;
    ctx.fillRect(x, y, 1, 1);
  }
}

function drawStrategicGrain(ctx, width, height, alpha, count, palette) {
  for (let index = 0; index < count; index++) {
    const x = (index * 41 + ((index * 29) % 173)) % width;
    const y = (index * 89 + ((index * index) % 251)) % height;
    const color = palette[index % palette.length];
    ctx.fillStyle = color.replace("ALPHA", alpha.toFixed(3));
    ctx.fillRect(x, y, index % 5 === 0 ? 2 : 1, 1);
  }
}

function drawProjectedTextureLines(ctx, project, lines, style) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = style.color;
  ctx.lineWidth = style.width;
  if (style.dash) ctx.setLineDash(style.dash);
  for (const line of lines) {
    ctx.beginPath();
    strokeProjectedLine(ctx, project, line);
    ctx.stroke();
  }
  ctx.restore();
}

function drawTerrainRidge(ctx, project, coordinates, width, shadowColor, highlightColor) {
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.translate(1.1, 1.2);
  ctx.strokeStyle = shadowColor;
  ctx.lineWidth = width;
  ctx.beginPath();
  strokeProjectedLine(ctx, project, coordinates);
  ctx.stroke();
  ctx.restore();

  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = highlightColor;
  ctx.lineWidth = Math.max(0.7, width * 0.24);
  ctx.beginPath();
  strokeProjectedLine(ctx, project, coordinates);
  ctx.stroke();
  ctx.restore();
}

function drawTerrainCanvas(countryFeatures, project) {
  if (!terrainCanvas || !terrainCanvas.getContext) return;

  const width = 1000;
  const height = 620;
  const dpr = Math.min(3, window.devicePixelRatio || 1);
  terrainCanvas.width = Math.round(width * dpr);
  terrainCanvas.height = Math.round(height * dpr);
  const ctx = terrainCanvas.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  ctx.clearRect(0, 0, width, height);

  const ocean = ctx.createLinearGradient(0, 0, width, height);
  ocean.addColorStop(0, "#124c5c");
  ocean.addColorStop(0.26, "#0b3446");
  ocean.addColorStop(0.58, "#062131");
  ocean.addColorStop(1, "#02101a");
  ctx.fillStyle = ocean;
  ctx.fillRect(0, 0, width, height);

  drawTerrainBlob(ctx, project, -24, 45, 32, 18, "rgba(1,12,20,0.28)", "rgba(1,12,20,0)");
  drawTerrainBlob(ctx, project, -12, 53, 24, 18, "rgba(12,57,74,0.26)", "rgba(12,57,74,0)");
  drawTerrainBlob(ctx, project, -4, 42, 16, 8, "rgba(75,150,155,0.15)", "rgba(75,150,155,0)");
  drawTerrainBlob(ctx, project, 17, 35, 22, 5.5, "rgba(65,154,151,0.25)", "rgba(65,154,151,0)");
  drawTerrainBlob(ctx, project, 19, 59, 12, 6, "rgba(102,170,174,0.2)", "rgba(102,170,174,0)");
  drawTerrainBlob(ctx, project, 35, 44, 7, 5, "rgba(13,73,88,0.2)", "rgba(13,73,88,0)");
  drawTerrainBlob(ctx, project, 4, 56, 12, 4.8, "rgba(12,42,58,0.28)", "rgba(12,42,58,0)");
  drawTerrainBlob(ctx, project, -8, 48, 28, 12, "rgba(119,187,188,0.1)", "rgba(119,187,188,0)");
  drawTerrainBlob(ctx, project, 29, 31, 25, 8, "rgba(98,184,183,0.13)", "rgba(98,184,183,0)");
  drawTerrainBlob(ctx, project, -43, -25, 18, 12, "rgba(42,112,124,0.14)", "rgba(42,112,124,0)");
  drawTerrainBlob(ctx, project, 138, -25, 20, 10, "rgba(25,82,96,0.16)", "rgba(25,82,96,0)");
  drawTerrainBlob(ctx, project, -150, 52, 24, 12, "rgba(17,55,72,0.16)", "rgba(17,55,72,0)");
  drawProjectedTextureLines(ctx, project, [
    [[-24, 36], [-12, 39], [2, 40.5], [16, 39.2], [30, 36.5]],
    [[-20, 50], [-7, 52.5], [9, 54.5], [23, 54.1], [38, 51.5]],
    [[-52, 47], [-37, 44.4], [-23, 40.2], [-10, 36.0]],
    [[24, 32], [34, 31.5], [44, 30.2], [55, 27.6]],
    [[126, 31], [133, 34.2], [141, 37.9], [146, 42.6]],
  ], { color: "rgba(92,150,158,0.045)", width: 0.42, dash: [7, 13] });
  drawStrategicGrain(ctx, width, height, 0.014, 2200, [
    "rgba(180,210,210,ALPHA)",
    "rgba(6,18,26,ALPHA)",
    "rgba(75,124,137,ALPHA)",
    "rgba(14,58,76,ALPHA)",
  ]);

  const landMask = new Path2D();
  for (const feature of countryFeatures) {
    const path = featurePath(feature, project);
    if (path) landMask.addPath(new Path2D(path));
  }

  ctx.save();
  ctx.clip(landMask);
  const land = ctx.createLinearGradient(120, 60, 850, 560);
  land.addColorStop(0, "#21372b");
  land.addColorStop(0.36, "#415538");
  land.addColorStop(0.68, "#60593a");
  land.addColorStop(1, "#765b32");
  ctx.fillStyle = land;
  ctx.fillRect(0, 0, width, height);

  drawTerrainBlob(ctx, project, 13, 50, 23, 8.5, "rgba(80,115,58,0.32)", "rgba(80,115,58,0)");
  drawTerrainBlob(ctx, project, 17, 63, 15, 8, "rgba(9,64,38,0.5)", "rgba(9,64,38,0)");
  drawTerrainBlob(ctx, project, 42, 58, 23, 9, "rgba(27,70,48,0.45)", "rgba(27,70,48,0)");
  drawTerrainBlob(ctx, project, 43, 66, 22, 6.5, "rgba(218,228,218,0.34)", "rgba(218,228,218,0)");
  drawTerrainBlob(ctx, project, 10, 27, 26, 10, "rgba(211,143,55,0.6)", "rgba(211,143,55,0)");
  drawTerrainBlob(ctx, project, 47, 23, 15, 9, "rgba(215,132,42,0.58)", "rgba(215,132,42,0)");
  drawTerrainBlob(ctx, project, 54, 43, 18, 7, "rgba(119,107,54,0.36)", "rgba(119,107,54,0)");
  drawTerrainBlob(ctx, project, 8, 46, 7, 3, "rgba(170,166,132,0.38)", "rgba(170,166,132,0)");
  drawTerrainBlob(ctx, project, 44, 50, 15, 7, "rgba(58,72,56,0.32)", "rgba(58,72,56,0)");
  drawTerrainBlob(ctx, project, 8, 47, 5.4, 2.2, "rgba(228,224,188,0.34)", "rgba(228,224,188,0)");
  drawTerrainBlob(ctx, project, 43, 42, 6.5, 2.8, "rgba(204,195,151,0.32)", "rgba(204,195,151,0)");
  drawTerrainBlob(ctx, project, 14, 64, 7, 4.8, "rgba(208,220,208,0.34)", "rgba(208,220,208,0)");
  drawTerrainBlob(ctx, project, -101, 39, 30, 12, "rgba(82,108,59,0.28)", "rgba(82,108,59,0)");
  drawTerrainBlob(ctx, project, -63, -8, 26, 16, "rgba(24,91,53,0.28)", "rgba(24,91,53,0)");
  drawTerrainBlob(ctx, project, -70, -22, 13, 14, "rgba(169,124,61,0.24)", "rgba(169,124,61,0)");
  drawTerrainBlob(ctx, project, 104, 36, 31, 12, "rgba(109,110,61,0.24)", "rgba(109,110,61,0)");
  drawTerrainBlob(ctx, project, 78, 22, 16, 9, "rgba(75,105,58,0.24)", "rgba(75,105,58,0)");
  drawTerrainBlob(ctx, project, 135, -24, 18, 11, "rgba(171,115,48,0.28)", "rgba(171,115,48,0)");
  drawTerrainBlob(ctx, project, -106, 55, 33, 9, "rgba(186,204,196,0.24)", "rgba(186,204,196,0)");
  drawTerrainBlob(ctx, project, 64, 32, 12, 5.5, "rgba(151,128,72,0.31)", "rgba(151,128,72,0)");
  drawTerrainBlob(ctx, project, 101, 46, 22, 8, "rgba(136,119,58,0.3)", "rgba(136,119,58,0)");
  drawTerrainBlob(ctx, project, 33, 15, 14, 8, "rgba(190,136,58,0.32)", "rgba(190,136,58,0)");
  drawStrategicGrain(ctx, width, height, 0.034, 7400, [
    "rgba(238,232,197,ALPHA)",
    "rgba(9,24,15,ALPHA)",
    "rgba(92,112,72,ALPHA)",
    "rgba(189,148,75,ALPHA)",
    "rgba(48,68,42,ALPHA)",
  ]);

  ctx.globalCompositeOperation = "multiply";
  drawTerrainBlob(ctx, project, 18, 62, 17, 8, "rgba(8,28,18,0.24)", "rgba(8,28,18,0)");
  drawTerrainBlob(ctx, project, 47, 59, 25, 9, "rgba(12,28,22,0.2)", "rgba(12,28,22,0)");
  drawTerrainBlob(ctx, project, 12, 27, 26, 10, "rgba(110,60,24,0.16)", "rgba(110,60,24,0)");
  drawTerrainBlob(ctx, project, -122, 47, 15, 9, "rgba(8,28,18,0.14)", "rgba(8,28,18,0)");
  drawTerrainBlob(ctx, project, 103, 62, 34, 10, "rgba(12,28,22,0.14)", "rgba(12,28,22,0)");
  drawTerrainBlob(ctx, project, -60, -4, 24, 16, "rgba(7,35,20,0.13)", "rgba(7,35,20,0)");
  ctx.globalCompositeOperation = "source-over";

  ctx.strokeStyle = "rgba(35,86,48,0.23)";
  ctx.lineWidth = 2.9;
  ctx.shadowBlur = 0;
  for (const belt of forestBelts) {
    ctx.beginPath();
    strokeProjectedLine(ctx, project, belt);
    ctx.stroke();
  }
  drawProjectedTextureLines(ctx, project, [
    [[5.4, 58.5], [10.8, 60.2], [16.2, 62.8], [22.5, 65.0]],
    [[24.0, 54.6], [33.0, 55.8], [42.5, 57.2], [55.0, 58.7], [66.0, 60.1]],
    [[7.0, 49.2], [14.0, 49.8], [22.0, 50.1], [30.0, 49.4]],
    [[98.0, 32.0], [107.0, 34.5], [116.0, 36.4], [124.0, 39.0]],
  ], { color: "rgba(6,26,14,0.19)", width: 0.78, dash: [1, 4] });

  ctx.strokeStyle = "rgba(237,184,90,0.22)";
  ctx.lineWidth = 1.05;
  for (const line of desertTextureLines) {
    ctx.beginPath();
    strokeProjectedLine(ctx, project, line);
    ctx.stroke();
  }
  drawProjectedTextureLines(ctx, project, [
    [[-16, 29.5], [-8, 30.5], [2, 31.0], [12, 30.2], [22, 31.0], [34, 29.6]],
    [[37, 24.2], [43, 25.3], [50, 24.4], [57, 25.6]],
    [[62, 34.5], [67, 35.5], [72, 35.1], [77, 34.3]],
    [[92, 47.4], [101, 48.4], [111, 47.8], [119, 46.9]],
  ], { color: "rgba(31,24,15,0.18)", width: 0.72, dash: [2, 5] });

  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  for (const range of mountainRanges) {
    drawTerrainRidge(ctx, project, range.coords, 4.2, "rgba(18,18,16,0.36)", "rgba(239,231,192,0.5)");
    drawTerrainRidge(ctx, project, range.coords.map(([lng, lat]) => [lng + 0.32, lat - 0.18]), 1.65, "rgba(45,42,34,0.22)", "rgba(222,213,172,0.3)");
    drawTerrainRidge(ctx, project, range.coords.map(([lng, lat]) => [lng - 0.28, lat + 0.14]), 1.05, "rgba(8,8,7,0.18)", "rgba(247,239,205,0.22)");
  }

  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.strokeStyle = "rgba(91,185,207,0.3)";
  ctx.lineWidth = 0.62;
  for (const river of riverSystems) {
    ctx.beginPath();
    strokeProjectedLine(ctx, project, river.coords);
    ctx.stroke();
  }
  ctx.restore();

  ctx.save();
  ctx.translate(1.25, 1.6);
  ctx.strokeStyle = "rgba(0,0,0,0.24)";
  ctx.lineWidth = 2.1;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.stroke(landMask);
  ctx.restore();

  ctx.save();
  ctx.strokeStyle = "rgba(72,137,148,0.055)";
  ctx.lineWidth = 2.6;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.stroke(landMask);
  ctx.strokeStyle = "rgba(126,196,199,0.115)";
  ctx.lineWidth = 1.05;
  ctx.stroke(landMask);
  ctx.strokeStyle = "rgba(126,202,207,0.18)";
  ctx.lineWidth = 0.74;
  ctx.shadowBlur = 0;
  ctx.shadowColor = "transparent";
  ctx.stroke(landMask);
  ctx.strokeStyle = "rgba(2,8,11,0.32)";
  ctx.lineWidth = 0.58;
  ctx.shadowBlur = 0;
  ctx.stroke(landMask);
  ctx.restore();
}

function syncTerrainCanvasTransform(transform) {
  if (!terrainCanvas) return;
  const rect = gameMap.getBoundingClientRect();
  const layoutWidth = gameMap.clientWidth || gameMap.offsetWidth || rect.width;
  const layoutHeight = gameMap.clientHeight || gameMap.offsetHeight || rect.height;
  const scaleX = layoutWidth / 1000;
  const scaleY = layoutHeight / 620;
  terrainCanvas.style.transform = `translate(${(transform.x * scaleX).toFixed(2)}px, ${(transform.y * scaleY).toFixed(2)}px) scale(${transform.k})`;
}

function featurePath(feature, project) {
  const geometry = feature && feature.geometry;
  if (!geometry) return "";
  if (geometry.type === "Polygon") {
    return geometry.coordinates.map((ring) => ringPath(ring, project)).join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((polygon) => polygon.map((ring) => ringPath(ring, project)).join(" "))
      .join(" ");
  }
  return "";
}

function collectCoordinates(coordinates, points = []) {
  if (!Array.isArray(coordinates)) return points;
  if (typeof coordinates[0] === "number" && typeof coordinates[1] === "number") {
    points.push(coordinates);
    return points;
  }
  for (const entry of coordinates) collectCoordinates(entry, points);
  return points;
}

function featureBounds(feature) {
  if (appState.deckFeatureBoundsCache && appState.deckFeatureBoundsCache.has(feature)) {
    return appState.deckFeatureBoundsCache.get(feature);
  }
  const points = collectCoordinates(feature && feature.geometry && feature.geometry.coordinates);
  if (!points.length) {
    if (appState.deckFeatureBoundsCache) appState.deckFeatureBoundsCache.set(feature, null);
    return null;
  }
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  for (const [lng, lat] of points) {
    if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;
    minLng = Math.min(minLng, lng);
    maxLng = Math.max(maxLng, lng);
    minLat = Math.min(minLat, lat);
    maxLat = Math.max(maxLat, lat);
  }

  if (!Number.isFinite(minLng) || !Number.isFinite(minLat)) return null;
  const bounds = { minLng, maxLng, minLat, maxLat };
  if (appState.deckFeatureBoundsCache) appState.deckFeatureBoundsCache.set(feature, bounds);
  return bounds;
}

function boundsIntersects(bounds, target) {
  return !(
    bounds.maxLng < target.minLng ||
    bounds.minLng > target.maxLng ||
    bounds.maxLat < target.minLat ||
    bounds.minLat > target.maxLat
  );
}

function featureCenter(feature) {
  const bounds = featureBounds(feature);
  if (!bounds) return { lng: 0, lat: 0, bounds: null };
  return {
    lng: (bounds.minLng + bounds.maxLng) / 2,
    lat: (bounds.minLat + bounds.maxLat) / 2,
    bounds,
  };
}

function terrainClassForFeature(feature) {
  const { lng, lat, bounds } = featureCenter(feature);
  if (!bounds) return "biome-plains";

  const isAlps = boundsIntersects(bounds, { minLng: 5, maxLng: 17, minLat: 44, maxLat: 49 });
  const isCaucasus = boundsIntersects(bounds, { minLng: 38, maxLng: 49, minLat: 40, maxLat: 44 });
  const isScandes = boundsIntersects(bounds, { minLng: 4, maxLng: 20, minLat: 58, maxLat: 69 });
  if (isAlps || isCaucasus || isScandes) return "biome-mountain terrain-relief";

  const isSahara = lat >= 18 && lat <= 32 && lng >= -18 && lng <= 35;
  const isArabia = lat >= 16 && lat <= 32 && lng >= 34 && lng <= 58;
  if (isSahara || isArabia) return "biome-desert";

  if (lat >= 64) return "biome-snow";
  if (lat >= 58 && lng >= 26) return "biome-snow";
  if (lat >= 56 && lng >= 3 && lng <= 31) return "biome-forest";
  if (lat >= 51 && lng >= 24) return "biome-forest";
  if (lat >= 38 && lat <= 52 && lng >= 38) return "biome-steppe";
  if (lat >= 45 && lat <= 58 && lng >= -10 && lng <= 32) return "biome-plains";
  if (lat >= 34 && lat <= 45 && lng >= -10 && lng <= 32) return "biome-plains";
  return "biome-plains";
}

function featureIntersectsDebugBounds(feature) {
  const bounds = featureBounds(feature);
  if (!bounds) return false;
  return !(
    bounds.maxLng < debugProjectionBounds.minLng ||
    bounds.minLng > debugProjectionBounds.maxLng ||
    bounds.maxLat < debugProjectionBounds.minLat ||
    bounds.minLat > debugProjectionBounds.maxLat
  );
}

function featureProjectedArea(feature, project) {
  const cacheKey = project && project.cacheKey;
  if (cacheKey && appState.deckFeatureAreaCache && appState.deckFeatureAreaCache.has(feature)) {
    const cached = appState.deckFeatureAreaCache.get(feature);
    if (cached && cached.key === cacheKey) return cached.area;
  }
  const bounds = featureBounds(feature);
  if (!bounds) {
    if (cacheKey && appState.deckFeatureAreaCache) appState.deckFeatureAreaCache.set(feature, { key: cacheKey, area: 0 });
    return 0;
  }
  const [x1, y1] = project([bounds.minLng, bounds.minLat]);
  const [x2, y2] = project([bounds.maxLng, bounds.maxLat]);
  const area = Math.abs((x2 - x1) * (y2 - y1));
  if (cacheKey && appState.deckFeatureAreaCache) appState.deckFeatureAreaCache.set(feature, { key: cacheKey, area });
  return area;
}

function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function featureProjectedBox(feature, project) {
  const bounds = featureBounds(feature);
  if (!bounds) return { width: 0, height: 0 };
  const corners = [
    project([bounds.minLng, bounds.minLat]),
    project([bounds.minLng, bounds.maxLat]),
    project([bounds.maxLng, bounds.minLat]),
    project([bounds.maxLng, bounds.maxLat]),
  ];
  const xs = corners.map(([x]) => x);
  const ys = corners.map(([, y]) => y);
  return {
    width: Math.max(...xs) - Math.min(...xs),
    height: Math.max(...ys) - Math.min(...ys),
  };
}

function countryLabelKeys(feature) {
  const props = feature.properties || {};
  return [
    props.NAME_LONG,
    props.NAME,
    props.ADMIN,
    props.SOVEREIGNT,
    props.BRK_NAME,
    props.FORMAL_EN,
  ]
    .filter(Boolean)
    .map((name) => normalizeName(name));
}

function countryLabelOverride(feature) {
  return countryLabelKeys(feature)
    .map((key) => countryLabelOverrides[key])
    .find(Boolean) || null;
}

function countryLabelName(feature) {
  const override = countryLabelOverride(feature);
  if (override && override.display) return override.display;
  const props = feature.properties || {};
  return props.NAME_LONG || props.NAME || props.ADMIN || props.SOVEREIGNT || "UNKNOWN";
}

function countryLabelLines(feature) {
  const override = countryLabelOverride(feature);
  if (override && Array.isArray(override.lines) && override.lines.length) {
    return override.lines.map((line) => String(line).toUpperCase());
  }
  return [countryLabelName(feature).toUpperCase()];
}

function countryLabelAnchor(feature) {
  const override = countryLabelOverride(feature);
  if (override && override.coords) return override.coords;

  const countryId = countryIdFromFeature(feature);
  if (countryId && countryLabelPositions[countryId]) {
    const [lat, lng] = countryLabelPositions[countryId];
    return [lng, lat];
  }

  const center = featureCenter(feature);
  return [center.lng, center.lat];
}

function countryLabelTier(feature, project) {
  const override = countryLabelOverride(feature);
  if (override && override.tier) return override.tier;
  const area = featureProjectedArea(feature, project);
  if (area > 16000) return 2;
  return 3;
}

function countryLabelLod(feature, project) {
  const override = countryLabelOverride(feature);
  if (override && override.minStep) return override.minStep;
  if (override && (override.tier === 1 || override.worldVisible)) return "theater";
  const tier = countryLabelTier(feature, project);
  if (tier === 1) return "theater";
  const box = featureProjectedBox(feature, project);
  const lines = countryLabelLines(feature);
  const longestLine = Math.max(...lines.map((line) => line.replace(/\s+/g, "").length), 1);
  const readableAtTheater = box.width > longestLine * 2.7 && box.height > lines.length * 7.8;
  if (tier === 2) return readableAtTheater ? "theater" : "country";
  const area = featureProjectedArea(feature, project);
  if (area > 5200 && readableAtTheater) return "theater";
  if (area > 5200) return "country-plus";
  return "province";
}

function countryLabelClass(feature, project) {
  const tier = countryLabelTier(feature, project);
  const override = countryLabelOverride(feature);
  const hiddenFar = override && override.hiddenFar ? " hidden-far" : "";
  const delayedWorld = override && override.delayedWorld ? " delayed-world" : "";
  const worldVisible = override && override.worldVisible ? " world-visible" : "";
  const lod = countryLabelLod(feature, project);
  return `country-label label-tier-${tier} label-lod-${lod} priority-${tier}${hiddenFar}${delayedWorld}${worldVisible}`;
}

function countryLabelStyle(feature, project) {
  const tier = countryLabelTier(feature, project);
  const override = countryLabelOverride(feature) || {};
  const projectedBox = featureProjectedBox(feature, project);
  const box = {
    width: override.fitWidth || projectedBox.width,
    height: override.fitHeight || projectedBox.height,
  };
  const lines = countryLabelLines(feature);
  const longestLine = Math.max(...lines.map((line) => line.replace(/\s+/g, "").length), 1);
  const lineCount = lines.length;
  const tierMax = override.labelMax || (tier === 1 ? 15.5 : tier === 2 ? 7.2 : 5.2);
  const tierMin = override.labelMin || (tier === 1 ? 6.6 : tier === 2 ? 3.6 : 2.9);
  const safeWidth = box.width * (lineCount > 1 ? 0.68 : 0.52);
  const safeHeight = box.height * (lineCount > 1 ? 0.62 : 0.48);
  const widthFit = safeWidth / (longestLine * 0.66);
  const heightFit = safeHeight / (lineCount * 1.12);
  const areaBoost = Math.sqrt(Math.max(featureProjectedArea(feature, project), 1)) * 0.04;
  const size = clampNumber(Math.min(widthFit, heightFit, tierMax + areaBoost), tierMin, tierMax);
  const tracking = clampNumber(size * (tier === 1 ? 0.1 : 0.075), 0.28, 1.35);
  const stroke = clampNumber(size * 0.17, 0.55, 1.45);
  return `--country-label-size:${size.toFixed(2)}px;--country-label-tracking:${tracking.toFixed(2)}px;--country-label-stroke:${stroke.toFixed(2)}px;`;
}

function debugFeatureId(feature, fallbackIndex) {
  const props = feature.properties || {};
  return props.id || props.adm1_code || props.ADM1_CODE || props.gn_id || props.name || props.NAME || `province-${fallbackIndex}`;
}

function debugFeatureName(feature) {
  const props = feature.properties || {};
  return props.name || props.NAME || props.name_en || props.NAME_EN || props.admin || props.ADMIN || "Unknown province";
}

function setDebugProvinceSelection(path, name, id) {
  const previous = gameMap.querySelector(".debug-province-path.selected");
  if (previous && previous !== path) previous.classList.remove("selected");
  path.classList.add("selected");
  appState.debugSelectedProvinceId = id;
  appState.debugSelectedProvinceName = name;
  updateDebugProvincePanel();
  renderDebugProvinceCommand();
}

function updateDebugProvincePanel() {
  const label = gameMap.querySelector("#debug-selected-province");
  if (label) label.textContent = `Selected: ${appState.debugSelectedProvinceName}`;
}

function updateDebugZoomTier(transform) {
  const step = debugZoomStep(transform.k);
  const tier = debugZoomTierForStep(step);
  if (tier === appState.debugZoomTier && step === appState.debugZoomStep) return;
  appState.debugZoomTier = tier;
  appState.debugZoomStep = step;
  gameMap.dataset.zoomTier = tier;
  gameMap.dataset.zoomStep = step;
  scheduleDebugLabelCollision();
}

function debugZoomStep(k) {
  if (k < 2.48) return "theater";
  if (k < 2.78) return "theater-plus";
  if (k < 3.16) return "country";
  if (k < 3.64) return "country-plus";
  if (k < 4.28) return "province-preview";
  if (k < 5.12) return "province";
  if (k < 6.35) return "operational";
  return "tactical";
}

function debugZoomTierForStep(step) {
  if (step === "theater" || step === "theater-plus") return "far";
  if (step === "country" || step === "country-plus" || step === "province-preview") return "mid";
  return "close";
}

function scheduleDebugLabelCollision() {
  if (appState.debugLabelCollisionFrame) return;
  appState.debugLabelCollisionFrame = requestAnimationFrame(() => {
    appState.debugLabelCollisionFrame = null;
    resolveDebugLabelCollisions();
  });
}

function resolveDebugLabelCollisions() {
  const labels = [...gameMap.querySelectorAll(".debug-city-label, .country-label")]
    .filter((label) => {
      const style = window.getComputedStyle(label);
      return style.display !== "none" && style.visibility !== "hidden" && Number(style.opacity || 1) !== 0;
    })
    .map((label) => ({
      label,
      group: label.closest(".debug-city") || label,
      rect: label.getBoundingClientRect(),
      priority: debugLabelCollisionPriority(label),
    }))
    .sort((a, b) => a.priority - b.priority);

  const accepted = [];
  for (const item of labels) {
    const overlaps = accepted.some((other) => !(
      item.rect.right < other.rect.left ||
      item.rect.left > other.rect.right ||
      item.rect.bottom < other.rect.top ||
      item.rect.top > other.rect.bottom
    ));
    item.group.classList.toggle("label-collided", overlaps);
    item.label.classList.toggle("label-collided", overlaps);
    if (!overlaps) accepted.push(item);
  }
}

function debugLabelCollisionPriority(label) {
  const group = label.closest(".debug-city") || label;
  const priority = Number((group.className.baseVal.match(/priority-(\d+)/) || [0, 6])[1]);
  if (label.classList.contains("country-label")) return priority;
  if (group.classList.contains("debug-city")) return 3 + priority;
  return 9;
}

function renderProjectionDebugMap() {
  renderMapError("Debug map fallback is disabled. Final game visuals require MapLibre and deck.gl.");
}

function renderMapLibreDeckMap() {
  document.body.classList.add("maplibre-active");
  if (leafletMapContainer) leafletMapContainer.hidden = true;
  if (terrainCanvas) terrainCanvas.hidden = true;
  gameMap.hidden = true;
  mapLibreMapContainer.hidden = false;
  deckOverlayContainer.hidden = false;

  if (!appState.debugMapData) {
    loadProjectionDebugData();
    renderMapLoading();
    return;
  }

  initMapLibreDeckMap();
  updateDeckStrategyLayers();
}

function initMapLibreDeckMap() {
  if (appState.mapLibreMap) return;

  const style = {
    version: 8,
    glyphs: "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources: {
      relief: {
        type: "raster",
        tiles: ["https://services.arcgisonline.com/ArcGIS/rest/services/World_Physical_Map/MapServer/tile/{z}/{y}/{x}"],
        tileSize: 256,
        maxzoom: 8,
      },
      terrain: {
        type: "raster-dem",
        tiles: ["https://demotiles.maplibre.org/terrain-tiles/{z}/{x}/{y}.png"],
        tileSize: 256,
        maxzoom: 12,
      },
    },
    layers: [
      {
        id: "wm-ocean",
        type: "background",
        paint: {
          "background-color": "#03121e",
        },
      },
      {
        id: "wm-relief",
        type: "raster",
        source: "relief",
        paint: {
          "raster-opacity": 0.80,
          "raster-contrast": -0.11,
          "raster-saturation": -0.58,
          "raster-brightness-min": 0.0,
          "raster-brightness-max": 0.70,
        },
      },
      {
        id: "wm-hillshade",
        type: "hillshade",
        source: "terrain",
        paint: {
          "hillshade-shadow-color": "rgba(0, 0, 0, 0.30)",
          "hillshade-highlight-color": "rgba(213, 210, 176, 0.09)",
          "hillshade-accent-color": "rgba(36, 51, 48, 0.08)",
          "hillshade-exaggeration": 0.12,
        },
      },
    ],
  };

  appState.mapLibreMap = new maplibregl.Map({
    container: mapLibreMapContainer,
    style,
    center: deckZoomLevels[appState.deckZoomLevelIndex].center,
    zoom: deckZoomLevels[appState.deckZoomLevelIndex].zoom,
    minZoom: debugCamera.minZoom,
    maxZoom: debugCamera.maxZoom,
    pitch: 0,
    bearing: 0,
    attributionControl: false,
    dragRotate: false,
    touchPitch: false,
    renderWorldCopies: false,
    maxBounds: theaterCameraBounds,
  });

  if (appState.mapLibreMap.dragPan) appState.mapLibreMap.dragPan.enable();
  if (appState.mapLibreMap.touchZoomRotate) {
    appState.mapLibreMap.touchZoomRotate.disable();
  }
  if (appState.mapLibreMap.scrollZoom) appState.mapLibreMap.scrollZoom.disable();
  if (appState.mapLibreMap.doubleClickZoom) appState.mapLibreMap.doubleClickZoom.disable();
  if (appState.mapLibreMap.boxZoom) appState.mapLibreMap.boxZoom.disable();
  if (appState.mapLibreMap.keyboard) appState.mapLibreMap.keyboard.disable();
  appState.mapLibreMap.zoomIn = () => setDeckZoomLevel(deckZoomLevelIndex() - 1);
  appState.mapLibreMap.zoomOut = () => setDeckZoomLevel(deckZoomLevelIndex() + 1);
  if (maplibregl.NavigationControl) {
    appState.mapLibreMap.addControl(new maplibregl.NavigationControl({ showCompass: false, visualizePitch: false }), "top-left");
  }
  mapLibreMapContainer.addEventListener("wheel", handleDeckDiscreteWheel, { passive: false });
  appState.mapLibreMap.on("load", () => {
    updateDeckStrategyLayers();
  });
  appState.mapLibreMap.on("move", scheduleDeckViewSync);
  appState.mapLibreMap.on("zoom", scheduleDeckViewSync);
  appState.mapLibreMap.on("mousemove", handleDeckMapHover);
  appState.mapLibreMap.on("mouseleave", hideProvinceTooltip);
  appState.mapLibreMap.on("moveend", scheduleDeckLayerUpdate);
  appState.mapLibreMap.on("zoomend", () => {
    scheduleDeckZoomSnap();
    scheduleDeckLayerUpdate();
  });
  appState.mapLibreMap.on("click", (event) => {
    if (!appState.deckInstance) return;
    const picked = appState.deckInstance.pickObject({
      x: event.point.x,
      y: event.point.y,
      radius: 5,
      layerIds: ["wm-unit-icons", "wm-province-borders", "wm-country-terrain"],
    });
    if (!picked || !picked.object) {
      closeProvinceInfoPanel();
      return;
    }
    if (picked.layer && picked.layer.id === "wm-unit-icons") {
      handleUnitMapClick(picked.object);
      return;
    }
    if (picked.layer && picked.layer.id === "wm-province-borders") {
      setDeckFeatureSelection(picked);
      return;
    }
    closeProvinceInfoPanel();
    appState.deckSelectedFeatureId = deckFeatureId(picked.object, picked.index || 0);
    appState.deckLayerSignature = "";
    updateDeckStrategyLayers();
  });

  appState.deckCollisionExtension = deck.CollisionFilterExtension ? [new deck.CollisionFilterExtension()] : [];
  appState.deckInstance = new deck.Deck({
    parent: deckOverlayContainer,
    views: [new deck.MapView({ repeat: false })],
    controller: false,
    initialViewState: mapLibreDeckViewState(),
    layers: [],
    pickingRadius: 4,
    useDevicePixels: true,
  });
}

function mapLibreDeckViewState() {
  const map = appState.mapLibreMap;
  const center = map ? map.getCenter() : { lng: debugCamera.theaterCenter[0], lat: debugCamera.theaterCenter[1] };
  return {
    longitude: center.lng,
    latitude: center.lat,
    zoom: map ? map.getZoom() : debugCamera.minZoom,
    pitch: map ? map.getPitch() : 0,
    bearing: map ? map.getBearing() : 0,
  };
}

function syncDeckViewState() {
  if (!appState.deckInstance || !appState.mapLibreMap) return;
  appState.deckInstance.setProps({ viewState: mapLibreDeckViewState() });
}

function scheduleDeckViewSync() {
  if (appState.deckViewFrame) return;
  appState.deckViewFrame = requestAnimationFrame(() => {
    appState.deckViewFrame = null;
    syncDeckViewState();
  });
}

function scheduleDeckLayerUpdate() {
  if (appState.deckLayerFrame) return;
  appState.deckLayerFrame = requestAnimationFrame(() => {
    appState.deckLayerFrame = null;
    updateDeckStrategyLayers();
  });
}

function deckZoomLevelIndex() {
  const zoom = appState.mapLibreMap ? appState.mapLibreMap.getZoom() : debugCamera.minZoom;
  let bestIndex = 0;
  let bestDistance = Infinity;
  deckZoomLevels.forEach((level, index) => {
    const distance = Math.abs(level.zoom - zoom);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  });
  return bestIndex;
}

function setDeckZoomLevel(index, aroundPoint) {
  if (!appState.mapLibreMap) return;
  const clampedIndex = clampNumber(index, 0, deckZoomLevels.length - 1);
  appState.deckZoomLevelIndex = clampedIndex;
  appState.deckLayerSignature = "";
  const target = deckZoomLevels[clampedIndex];
  const options = {
    zoom: target.zoom,
    duration: 260,
    easing: (t) => t * (2 - t),
  };
  if (target.step === "world") options.center = target.center;
  else if (aroundPoint) options.around = appState.mapLibreMap.unproject(aroundPoint);
  appState.mapLibreMap.easeTo(options);
}

function handleDeckDiscreteWheel(event) {
  if (!appState.mapLibreMap) return;
  event.preventDefault();
  const now = performance.now();
  if (now < appState.deckZoomWheelLockUntil) return;
  appState.deckZoomWheelLockUntil = now + 210;
  const direction = event.deltaY > 0 ? 1 : -1;
  const rect = mapLibreMapContainer.getBoundingClientRect();
  setDeckZoomLevel(deckZoomLevelIndex() + direction, [event.clientX - rect.left, event.clientY - rect.top]);
}

function scheduleDeckZoomSnap() {
  if (appState.deckZoomSnapFrame) return;
  appState.deckZoomSnapFrame = requestAnimationFrame(() => {
    appState.deckZoomSnapFrame = null;
    if (!appState.mapLibreMap) return;
    const index = deckZoomLevelIndex();
    appState.deckZoomLevelIndex = index;
    const targetZoom = deckZoomLevels[index].zoom;
    if (Math.abs(appState.mapLibreMap.getZoom() - targetZoom) > 0.04) {
      setDeckZoomLevel(index);
    }
  });
}

function deckZoomStep() {
  return deckZoomLevels[appState.deckZoomLevelIndex || 0].step;
}

function deckFeatureId(feature, index) {
  const props = feature.properties || {};
  return props.ADM0_A3 || props.ISO_A3 || props.GEOUNIT || props.ADMIN || props.NAME || `feature-${index}`;
}

function deckCountryColor(feature) {
  const selected = appState.deckSelectedFeatureId && appState.deckSelectedFeatureId === deckFeatureId(feature, 0);
  const { lng, lat } = featureCenter(feature);
  let color = [48, 68, 48, 118];
  if (lat >= 62 || (lat >= 55 && lng > 40)) color = [83, 94, 89, 112];
  else if ((lat >= 17 && lat <= 33 && lng >= -18 && lng <= 58) || (lng > 120 && lat < -12)) color = [117, 92, 58, 120];
  else if (lat >= 50 && lng >= -12 && lng <= 35) color = [36, 66, 42, 118];
  else if (lat >= 36 && lat <= 50 && lng >= 38 && lng <= 118) color = [76, 78, 55, 114];
  else if (lat < 5 && lng > -80 && lng < -35) color = [22, 67, 42, 120];
  return selected ? [Math.min(color[0] + 24, 255), Math.min(color[1] + 24, 255), Math.min(color[2] + 16, 255), 148] : color;
}

function deckRelationColor(feature, alpha = 74) {
  const countryId = countryIdFromFeature(feature);
  const country = countryId && appState.game && appState.game.countries.find((entry) => entry.id === countryId);
  if (!country) return [244, 247, 238, alpha];
  if (country.relation === "self") return [185, 228, 177, alpha];
  if (country.relation === "allied") return [175, 207, 230, alpha];
  if (country.relation === "war") return [232, 128, 118, alpha];
  if (country.relation === "trade" || country.relation === "peace") return [161, 215, 207, alpha];
  return [244, 247, 238, alpha];
}

function deckCountryLabelDatum(feature, index) {
  const override = countryLabelOverride(feature) || {};
  const tier = countryLabelTier(feature, (coord) => coord);
  const label = countryLabelLines(feature).join("\n");
  const [lng, lat] = countryLabelAnchor(feature);
  const max = override.labelMax || (tier === 1 ? 9.2 : tier === 2 ? 5.8 : 3.8);
  const min = override.labelMin || (tier === 1 ? 6.2 : tier === 2 ? 3.2 : 2.1);
  const size = clampNumber(max * 3.05, min * 3, tier === 1 ? 29 : tier === 2 ? 18 : 12);
  const id = deckFeatureId(feature, index);
  return {
    id,
    label,
    position: [lng, lat],
    size,
    tier,
    lod: override.minStep || (tier <= 2 ? "theater" : "country"),
    priority: tier === 1 ? 100 : tier === 2 ? 70 : 42,
  };
}

function deckCountryLabels(countryFeatures, step) {
  return countryFeatures
    .map(deckCountryLabelDatum)
    .filter((item) => {
      if (step === "world") return item.tier <= 2 && item.size >= 13;
      if (item.lod === "theater") return true;
      if (step === "countries") return true;
      if (item.lod === "theater-plus") return step !== "countries";
      return step === "tactical";
    });
}

function deckNodeData(step) {
  if (step === "world") return [];
  return debugCities.filter((city) => {
    if (city.type === "resource" || city.type === "choke") return false;
    if (city.type === "airbase") return step === "tactical";
    if (city.type === "port") return step === "tactical" && (city.priority || 5) <= 4;
    if (step === "countries") return (city.priority || 5) <= 3;
    if (step === "capitals") {
      if (city.type === "capital") return (city.priority || 4) <= 4;
      return (city.priority || 5) <= 3;
    }
    return true;
  });
}

function deckRouteData(step) {
  if (step === "world") return [];
  const engineRoutes = appState.provinceEngine && appState.provinceEngine.roads ? appState.provinceEngine.roads : [];
  if (!engineRoutes.length) return [];
  const maxDistance = step === "countries" ? 6.5 : step === "capitals" ? 9.5 : 13.5;
  return engineRoutes.filter((route) => {
    if (!Number.isFinite(route.distance) || route.distance > maxDistance) return false;
    if (step === "countries") return route.tier === "primary";
    if (step === "capitals") return route.tier !== "local";
    return true;
  });
}

function movementApi() {
  return window.WorldMandateMovement || null;
}

function gameplayStateStorageKey() {
  const serverId = appState.game && appState.game.activeServerId ? appState.game.activeServerId : "preview";
  return `worldMandateGameplay:${slugId(appState.accountName || "player")}:${serverId}`;
}

function countryById(countryId) {
  if (!countryId || !appState.game || !Array.isArray(appState.game.countries)) return null;
  return appState.game.countries.find((country) => country.id === countryId) || null;
}

function countryNameForId(countryId) {
  const country = countryById(countryId);
  return (country && country.name) || countryIdToGeoName[countryId] || countryId || "Neutral";
}

function unitOwnerId(unit) {
  if (!unit) return appState.game && appState.game.viewerCountryId ? appState.game.viewerCountryId : "neutral";
  return unit.ownerId || unit.owner || unit.countryId || unit.country || (appState.game && appState.game.viewerCountryId) || "neutral";
}

function unitTypeLabel(unit) {
  const type = unit && unit.type ? unit.type : "infantry";
  if (type === "tanks" || type === "armor" || type === "armoredVehicle") return "Armored Vehicle";
  if (type === "recon" || type === "reconVehicle" || type === "technical" || type === "lightVehicle") return "Recon Vehicle";
  return "Infantry";
}

function ensureUnitGameplayData() {
  if (!appState.game || !Array.isArray(appState.game.units)) return;
  appState.game.units.forEach((unit) => {
    const ownerId = unitOwnerId(unit);
    unit.ownerId = ownerId;
    unit.owner = unit.owner || ownerId;
    unit.ownerName = unit.ownerName || countryNameForId(ownerId);
    unit.type = unit.type || "infantry";
    unit.unitClass = unit.unitClass || unitTypeLabel(unit);
  });
}

function provinceById(provinceId) {
  return appState.provinceEngine && appState.provinceEngine.byId
    ? appState.provinceEngine.byId.get(provinceId) || null
    : null;
}

function provinceGameplayOwnerId(province) {
  if (!province) return "neutral";
  if (appState.provinceOwnerOverrides && Object.prototype.hasOwnProperty.call(appState.provinceOwnerOverrides, province.id)) {
    return appState.provinceOwnerOverrides[province.id] || "neutral";
  }
  return province.ownerId || province.owner || province.countryId || province.originalOwnerId || "neutral";
}

function applyProvinceOwnerOverrides(engine = appState.provinceEngine) {
  if (!engine || !Array.isArray(engine.provinces)) return;
  engine.provinces.forEach((province) => {
    if (!province.originalOwnerId) province.originalOwnerId = province.countryId || province.ownerId;
    if (!province.originalOwnerName) province.originalOwnerName = province.countryName || province.ownerName;
    const ownerId = provinceGameplayOwnerId(province);
    province.ownerId = ownerId;
    province.ownerName = countryNameForId(ownerId);
  });
}

function loadGameplayStateIfNeeded() {
  const key = gameplayStateStorageKey();
  if (appState.gameplaySaveLoaded && appState.gameplaySaveKey === key) return;
  appState.gameplaySaveLoaded = true;
  appState.gameplaySaveKey = key;
  appState.movementRoutePreview = null;
  try {
    const saved = typeof localStorage !== "undefined" ? JSON.parse(localStorage.getItem(key) || "{}") : {};
    appState.provinceOwnerOverrides = saved.provinceOwnerOverrides && typeof saved.provinceOwnerOverrides === "object" ? saved.provinceOwnerOverrides : {};
    appState.unitProvinceAssignments = saved.unitProvinceAssignments && typeof saved.unitProvinceAssignments === "object" ? saved.unitProvinceAssignments : {};
    appState.unitLocalPositions = saved.unitLocalPositions && typeof saved.unitLocalPositions === "object" ? saved.unitLocalPositions : {};
    appState.unitStackAssignments = saved.unitStackAssignments && typeof saved.unitStackAssignments === "object" ? saved.unitStackAssignments : {};
    appState.nextLocalStackId = Number.isFinite(Number(saved.nextLocalStackId)) ? Number(saved.nextLocalStackId) : 1;
    appState.captureProgress = saved.captureProgress && typeof saved.captureProgress === "object" ? saved.captureProgress : {};
    appState.movementOrders = saved.movementOrders && typeof saved.movementOrders === "object" ? saved.movementOrders : {};
  } catch (error) {
    console.warn("[gameplay] could not load local state", error);
  }
}

function saveGameplayState() {
  try {
    if (typeof localStorage === "undefined") return;
    const key = gameplayStateStorageKey();
    localStorage.setItem(key, JSON.stringify({
      provinceOwnerOverrides: appState.provinceOwnerOverrides || {},
      unitProvinceAssignments: appState.unitProvinceAssignments || {},
      unitLocalPositions: appState.unitLocalPositions || {},
      unitStackAssignments: appState.unitStackAssignments || {},
      nextLocalStackId: appState.nextLocalStackId || 1,
      captureProgress: appState.captureProgress || {},
      movementOrders: appState.movementOrders || {},
    }));
  } catch (error) {
    console.warn("[gameplay] could not save local state", error);
  }
}

function scheduleGameplaySave() {
  if (appState.gameplaySaveTimer) clearTimeout(appState.gameplaySaveTimer);
  appState.gameplaySaveTimer = setTimeout(() => {
    appState.gameplaySaveTimer = null;
    saveGameplayState();
  }, 250);
}

function regionCenterLngLat(regionId) {
  const region = regionById(regionId);
  const center = regionCenter(region);
  return center ? [center[1], center[0]] : null;
}

function movementProvinceList() {
  return appState.provinceEngine && Array.isArray(appState.provinceEngine.provinces)
    ? appState.provinceEngine.provinces
    : [];
}

function unitCurrentProvince(unit) {
  const api = movementApi();
  const provinces = movementProvinceList();
  if (!api || !unit || !provinces.length) return null;
  const assignedProvinceId = appState.unitProvinceAssignments[unit.id] || unit.localProvinceId || unit.provinceId;
  const fallbackCoords = appState.unitLocalPositions[unit.id] || regionCenterLngLat(unit.regionId) || unit.coords;
  const province = api.nearestProvinceForUnit(
    { ...unit, localProvinceId: assignedProvinceId },
    provinces,
    fallbackCoords
  );
  if (province) appState.unitProvinceAssignments[unit.id] = province.id;
  return province;
}

function activeCaptureForProvince(provinceId) {
  return provinceId && appState.captureProgress ? appState.captureProgress[provinceId] || null : null;
}

function stopCaptureForUnit(unitId, provinceId = null) {
  if (!unitId || !appState.captureProgress) return false;
  let changed = false;
  Object.entries(appState.captureProgress).forEach(([captureProvinceId, capture]) => {
    if (!capture || capture.unitId !== unitId) return;
    if (provinceId && captureProvinceId !== provinceId) return;
    delete appState.captureProgress[captureProvinceId];
    changed = true;
  });
  if (changed) {
    scheduleGameplaySave();
    appState.deckLayerSignature = "";
  }
  return changed;
}

function setProvinceGameplayOwner(province, ownerId) {
  if (!province) return;
  const nextOwnerId = ownerId || "neutral";
  appState.provinceOwnerOverrides[province.id] = nextOwnerId;
  province.ownerId = nextOwnerId;
  province.ownerName = countryNameForId(nextOwnerId);
  scheduleGameplaySave();
}

function beginCaptureIfNeeded(unit, province, now = Date.now()) {
  const api = movementApi();
  if (!api || !unit || !province) return null;
  const ownerId = unitOwnerId(unit);
  const provinceOwnerId = provinceGameplayOwnerId(province);
  const rate = api.captureRateFor(ownerId, provinceOwnerId, { neutralRate: 8, enemyRate: 3 });
  if (rate <= 0) {
    if (activeCaptureForProvince(province.id)) {
      delete appState.captureProgress[province.id];
      scheduleGameplaySave();
    }
    return null;
  }
  const existing = activeCaptureForProvince(province.id);
  const capture = {
    provinceId: province.id,
    provinceName: province.name,
    unitId: unit.id,
    ownerId,
    ownerName: countryNameForId(ownerId),
    previousOwnerId: provinceOwnerId,
    previousOwnerName: countryNameForId(provinceOwnerId),
    progress: existing && Number.isFinite(Number(existing.progress)) ? Number(existing.progress) : 0,
    rate,
    updatedAt: now,
  };
  appState.captureProgress[province.id] = capture;
  console.info("[capture] started", capture);
  scheduleGameplaySave();
  appState.deckLayerSignature = "";
  return capture;
}

function updateGameplayCaptures(now = Date.now()) {
  const api = movementApi();
  if (!api || !appState.game || !appState.captureProgress) return false;
  const entries = Object.values(appState.captureProgress).filter(Boolean);
  if (!entries.length) {
    appState.gameplayCaptureTickAt = now;
    return false;
  }
  const elapsedMs = appState.gameplayCaptureTickAt ? Math.max(0, now - appState.gameplayCaptureTickAt) : 0;
  appState.gameplayCaptureTickAt = now;
  if (!elapsedMs) return false;

  let changed = false;
  entries.forEach((capture) => {
    const province = provinceById(capture.provinceId);
    const unit = (appState.game.units || []).find((entry) => entry.id === capture.unitId);
    if (!province || !unit || (appState.movementOrders && appState.movementOrders[unit.id])) {
      delete appState.captureProgress[capture.provinceId];
      changed = true;
      return;
    }
    const unitProvince = unitCurrentProvince(unit);
    if (!unitProvince || unitProvince.id !== capture.provinceId) {
      delete appState.captureProgress[capture.provinceId];
      changed = true;
      return;
    }
    const rate = api.captureRateFor(capture.ownerId, provinceGameplayOwnerId(province), { neutralRate: 8, enemyRate: 3 });
    if (rate <= 0) {
      delete appState.captureProgress[capture.provinceId];
      changed = true;
      return;
    }
    const advanced = api.advanceCaptureProgress(capture, elapsedMs, rate);
    advanced.rate = rate;
    advanced.updatedAt = now;
    if (advanced.complete) {
      setProvinceGameplayOwner(province, capture.ownerId);
      delete appState.captureProgress[capture.provinceId];
      console.info("[capture] complete", {
        provinceId: province.id,
        provinceName: province.name,
        ownerId: capture.ownerId,
        ownerName: countryNameForId(capture.ownerId),
      });
      showToast(`${province.name} captured by ${countryNameForId(capture.ownerId)}.`);
      changed = true;
      return;
    }
    if (Math.floor(Number(capture.progress || 0)) !== Math.floor(Number(advanced.progress || 0))) changed = true;
    appState.captureProgress[capture.provinceId] = advanced;
  });

  if (changed) {
    if (appState.selectedProvince) renderDebugProvinceCommand();
    scheduleGameplaySave();
    appState.deckLayerSignature = "";
  }
  return changed;
}

function activeMovementOrder(unitId) {
  const order = appState.movementOrders && appState.movementOrders[unitId];
  if (!order || !movementApi()) return null;
  const advanced = movementApi().advanceMoveOrder(order, Date.now());
  if (!advanced) return null;
  if (advanced.done) {
    appState.unitLocalPositions[unitId] = advanced.position;
    if (advanced.toProvinceId) {
      appState.unitProvinceAssignments[unitId] = advanced.toProvinceId;
      const unit = appState.game && (appState.game.units || []).find((entry) => entry.id === unitId);
      if (unit) {
        unit.localProvinceId = advanced.toProvinceId;
        unit.provinceId = advanced.toProvinceId;
        const destinationProvince = provinceById(advanced.toProvinceId);
        beginCaptureIfNeeded(unit, destinationProvince);
      }
    }
    delete appState.movementOrders[unitId];
    scheduleGameplaySave();
    console.info("[movement] complete", {
      unitId,
      fromProvinceId: advanced.fromProvinceId,
      toProvinceId: advanced.toProvinceId,
      position: advanced.position,
    });
    return null;
  }
  appState.movementOrders[unitId] = advanced;
  return advanced;
}

function unitCurrentLngLat(unit) {
  if (!unit) return null;
  const order = activeMovementOrder(unit.id);
  if (order && order.position) return order.position;
  if (appState.unitLocalPositions && appState.unitLocalPositions[unit.id]) return appState.unitLocalPositions[unit.id];
  const province = unitCurrentProvince(unit);
  if (province && Array.isArray(province.center)) return province.center;
  return regionCenterLngLat(unit.regionId);
}

function unitVisualPulse(unit, now = Date.now()) {
  const offset = (stableHash(unit && unit.id) % 900) / 900;
  const wave = Math.sin(((now / 1000) + offset) * Math.PI * 2);
  return unit && unit.moving ? 0 : wave;
}

function smoothUnitVisualState(unit, targetCoords, targetHeading, moving) {
  const api = movementApi();
  const now = Date.now();
  const previous = appState.unitVisualStates[unit.id];
  if (!previous || !Array.isArray(previous.coords)) {
    const initial = {
      coords: targetCoords.slice(),
      heading: targetHeading || 0,
      moving,
      updatedAt: now,
    };
    appState.unitVisualStates[unit.id] = initial;
    return initial;
  }

  const elapsedMs = Math.max(16, Math.min(120, now - (previous.updatedAt || now)));
  const positionAmount = moving
    ? Math.min(0.62, 0.18 + (elapsedMs / 180))
    : Math.min(0.34, 0.1 + (elapsedMs / 420));
  const headingAmount = Math.min(0.42, 0.12 + (elapsedMs / 260));
  const coords = api && api.smoothPoint
    ? api.smoothPoint(previous.coords, targetCoords, positionAmount)
    : [
      previous.coords[0] + ((targetCoords[0] - previous.coords[0]) * positionAmount),
      previous.coords[1] + ((targetCoords[1] - previous.coords[1]) * positionAmount),
    ];
  const heading = api && api.smoothAngleDegrees
    ? api.smoothAngleDegrees(previous.heading || 0, targetHeading || 0, headingAmount)
    : targetHeading || previous.heading || 0;
  const next = {
    coords,
    heading,
    moving,
    updatedAt: now,
  };
  appState.unitVisualStates[unit.id] = next;
  return next;
}

function deckUnitData(step) {
  if (!appState.game) return [];
  const rendered = [];
  const stackGroups = new Map();
  const liveUnitIds = new Set();
  const rawUnits = (appState.game.units || [])
    .map((unit) => {
      const coords = unitCurrentLngLat(unit);
      if (!coords) return null;
      const order = appState.movementOrders && appState.movementOrders[unit.id];
      const province = unitCurrentProvince(unit);
      const ownerId = unitOwnerId(unit);
      const targetHeading = unitVisualHeading(unit, coords, order);
      const visualState = smoothUnitVisualState(unit, coords, targetHeading, Boolean(order));
      liveUnitIds.add(unit.id);
      return {
        ...unit,
        ownerId,
        ownerName: unit.ownerName || countryNameForId(ownerId),
        coords: visualState.coords,
        trueCoords: coords,
        provinceId: province ? province.id : unit.provinceId,
        provinceName: province ? province.name : null,
        heading: visualState.heading,
        moving: Boolean(order),
        selected: appState.selectedMovementUnitId === unit.id,
        progress: order ? order.progress || 0 : 0,
        idlePulse: unitVisualPulse(unit),
        stackGroupId: appState.unitStackAssignments[unit.id] || null,
        stackCount: 1,
        stackUnits: [unit.id],
      };
    })
    .filter(Boolean);

  Object.keys(appState.unitVisualStates || {}).forEach((unitId) => {
    if (!liveUnitIds.has(unitId)) delete appState.unitVisualStates[unitId];
  });

  rawUnits.forEach((unit) => {
    if (unit.moving || !unit.provinceId) {
      rendered.push(unit);
      return;
    }
    const stackKey = `${unit.ownerId}:${unit.provinceId}:${unit.stackGroupId || "main"}`;
    if (!stackGroups.has(stackKey)) {
      stackGroups.set(stackKey, { ...unit, stackUnits: [unit.id], stackCount: 1 });
      return;
    }
    const stack = stackGroups.get(stackKey);
    stack.stackCount += 1;
    stack.stackUnits.push(unit.id);
    stack.selected = stack.selected || unit.selected;
    if (unit.selected) {
      stack.id = unit.id;
      stack.name = unit.name;
      stack.type = unit.type;
      stack.unitClass = unit.unitClass;
    }
  });

  stackGroups.forEach((stack) => rendered.push(stack));
  return rendered;
}

function deckMovementRouteData() {
  if (!appState.movementOrders || !movementApi()) return [];
  const routes = [];
  Object.values(appState.movementOrders)
    .map((order) => movementApi().advanceMoveOrder(order, Date.now()))
    .filter(Boolean)
    .forEach((order) => {
      if (Array.isArray(order.segments) && order.segments.length) {
        order.segments.forEach((segment, index) => {
          routes.push({
            ...order,
            id: `${order.id}-segment-${index}`,
            path: segment.path,
            segment,
            segmentIndex: index,
            tier: "movement",
          });
        });
        return;
      }
      routes.push({
        ...order,
        tier: "movement",
      });
    });
  return routes;
}

function movementLayerSignature() {
  const orders = Object.values(appState.movementOrders || {});
  const captures = Object.values(appState.captureProgress || {})
    .map((capture) => `${capture.provinceId}:${Math.floor(Number(capture.progress || 0))}`)
    .join(",");
  const owners = Object.keys(appState.provinceOwnerOverrides || {}).length;
  const preview = appState.movementRoutePreview ? appState.movementRoutePreview.toProvinceId : "";
  return `${appState.selectedMovementUnitId || ""}:${orders.length}:${preview}:${captures}:${owners}`;
}

function logRenderedUnits(unitData) {
  const now = Date.now();
  if (appState.lastUnitRenderLogAt && now - appState.lastUnitRenderLogAt < 2200) return;
  appState.lastUnitRenderLogAt = now;
  console.info("[units] render", {
    count: unitData.length,
    units: unitData.map((unit) => ({
      id: unit.id,
      name: unit.name,
      type: unitTypeLabel(unit),
      owner: unit.ownerName || unit.ownerId,
      provinceId: unit.provinceId,
      provinceName: unit.provinceName,
      coords: unit.coords,
      stackCount: unit.stackCount || 1,
      moving: Boolean(unit.moving),
    })),
  });
}

function ensureUnitVisualAnimation() {
  if (!appState.game || appState.screen !== "game" || !appState.deckInstance) return;
  if (Object.keys(appState.movementOrders || {}).length || Object.keys(appState.captureProgress || {}).length) {
    startMovementAnimation();
  }
}

function selectMovementUnit(unit) {
  if (!unit) return;
  appState.selectedMovementUnitId = unit.id;
  appState.selectedUnitCommandMode = null;
  appState.selectedUnitStackIds = Array.isArray(unit.stackUnits) ? unit.stackUnits.slice() : [unit.id];
  appState.movementRoutePreview = null;
  if (appState.selectedProvince) appState.selectedProvince.selected = false;
  appState.selectedProvince = null;
  appState.deckSelectedFeatureId = null;
  appState.debugSelectedProvinceId = null;
  appState.debugSelectedProvinceName = "None";
  const province = unitCurrentProvince(unit);
  console.info("[movement] unit selected", {
    unitId: unit.id,
    unitName: unit.name,
    owner: unit.ownerName || unit.owner,
    provinceId: province ? province.id : null,
    provinceName: province ? province.name : null,
    stackUnits: appState.selectedUnitStackIds,
  });
  hideCommandCard();
  showToast(`${unit.ownerName || "Unit"} ${unit.name} selected.`);
  appState.deckLayerSignature = "";
  updateDeckStrategyLayers();
}

function logAttackTarget(target) {
  const attacker = selectedUnitPanelData();
  if (!attacker) return;
  const targetUnit = target && target.unit;
  const targetProvince = target && target.province;
  console.info("[attack] target selected", {
    attackerUnitId: attacker.id,
    attackerName: attacker.name,
    attackerOwner: attacker.ownerName || countryNameForId(unitOwnerId(attacker)),
    targetUnitId: targetUnit ? targetUnit.id : null,
    targetUnitName: targetUnit ? targetUnit.name : null,
    targetProvinceId: targetProvince ? targetProvince.id : targetUnit ? targetUnit.provinceId : null,
    targetProvinceName: targetProvince ? targetProvince.name : targetUnit ? targetUnit.provinceName : null,
    targetOwner: targetUnit ? targetUnit.ownerName || countryNameForId(unitOwnerId(targetUnit)) : targetProvince ? targetProvince.ownerName : null,
  });
  showToast(`Attack target logged: ${targetUnit ? targetUnit.name : targetProvince ? targetProvince.name : "target"}.`);
  appState.selectedUnitCommandMode = null;
  appState.movementRoutePreview = null;
  appState.deckLayerSignature = "";
  renderUnitCommandPanel();
  updateDeckStrategyLayers();
}

function handleUnitMapClick(unit) {
  if (!unit) return;
  if (
    appState.selectedMovementUnitId &&
    appState.selectedUnitCommandMode === "attack" &&
    unit.id !== appState.selectedMovementUnitId
  ) {
    logAttackTarget({ unit });
    return;
  }
  selectMovementUnit(unit);
}

function createProvinceMoveOrder(unit, province, now = Date.now()) {
  const api = movementApi();
  if (!api || !unit || !province) return null;
  const fromProvince = unitCurrentProvince(unit);
  const coords = fromProvince && Array.isArray(fromProvince.center) ? fromProvince.center : unitCurrentLngLat(unit);
  if (!coords) return null;
  if (fromProvince && fromProvince.id === province.id) {
    return { sameProvince: true, fromProvince, coords };
  }
  const order = api.createMoveOrder(
    {
      ...unit,
      coords,
      speed: unit.movementSpeed || 0.22,
      provinceId: fromProvince ? fromProvince.id : unit.localProvinceId || unit.regionId,
    },
    province,
    now,
    {
      provinces: movementProvinceList(),
      samples: 22,
      samplesPerSegment: 8,
      pauseMs: 260,
      maxProvinceSteps: 7,
      requireProvincePath: true,
    }
  );
  if (!order) return { blocked: true, fromProvince, coords };
  return {
    order,
    fromProvince,
    coords,
    eta: api.movementEtaForOrder ? api.movementEtaForOrder(order) : null,
  };
}

function clearMovementRoutePreview() {
  if (!appState.movementRoutePreview) return;
  appState.movementRoutePreview = null;
  appState.deckLayerSignature = "";
  updateDeckStrategyLayers();
}

function updateMovementRoutePreview(province) {
  if (appState.selectedUnitCommandMode !== "move" || !appState.selectedMovementUnitId || !appState.game || !province) {
    clearMovementRoutePreview();
    return;
  }
  if (appState.movementRoutePreview && appState.movementRoutePreview.toProvinceId === province.id) return;
  const unit = (appState.game.units || []).find((entry) => entry.id === appState.selectedMovementUnitId);
  const preview = createProvinceMoveOrder(unit, province, Date.now());
  appState.movementRoutePreview = preview && preview.order
    ? { ...preview.order, eta: preview.eta, tier: "preview" }
    : null;
  appState.deckLayerSignature = "";
  updateDeckStrategyLayers();
}

function deckMovementRoutePreviewData() {
  if (!appState.movementRoutePreview || !Array.isArray(appState.movementRoutePreview.path)) return [];
  const preview = appState.movementRoutePreview;
  if (Array.isArray(preview.segments) && preview.segments.length) {
    return preview.segments.map((segment, index) => ({
      ...preview,
      id: `${preview.id}-preview-${index}`,
      path: segment.path,
      segment,
      segmentIndex: index,
      tier: "preview",
    }));
  }
  return [preview];
}

function issueMoveOrderToProvince(province) {
  if (!province || !appState.selectedMovementUnitId || !appState.game) return false;
  const unit = (appState.game.units || []).find((entry) => entry.id === appState.selectedMovementUnitId);
  if (!unit) return false;
  const move = createProvinceMoveOrder(unit, province, Date.now());
  if (!move) return false;
  if (move.sameProvince) {
    console.info("[movement] ignored same-province order", {
      unitId: unit.id,
      provinceId: province.id,
      provinceName: province.name,
    });
    showToast(`${unit.name} is already in ${province.name}.`);
    appState.selectedUnitCommandMode = null;
    appState.movementRoutePreview = null;
    renderUnitCommandPanel();
    return true;
  }
  if (move.blocked) {
    console.info("[movement] route blocked", {
      unitId: unit.id,
      unitName: unit.name,
      fromProvinceId: move.fromProvince ? move.fromProvince.id : null,
      fromProvinceName: move.fromProvince ? move.fromProvince.name : null,
      toProvinceId: province.id,
      toProvinceName: province.name,
      reason: "No connected province path or route exceeds maxProvinceSteps",
    });
    showToast(`No valid province route to ${province.name}.`);
    appState.selectedUnitCommandMode = null;
    appState.movementRoutePreview = null;
    renderUnitCommandPanel();
    return true;
  }
  const { order, fromProvince, coords, eta } = move;
  stopCaptureForUnit(unit.id);
  appState.movementOrders[unit.id] = order;
  appState.unitLocalPositions[unit.id] = coords;
  appState.movementRoutePreview = null;
  appState.selectedMovementUnitId = unit.id;
  appState.selectedUnitCommandMode = null;
  console.info("[movement] order issued", {
    unitId: unit.id,
    unitName: unit.name,
    fromProvinceId: order.fromProvinceId,
    fromProvinceName: fromProvince ? fromProvince.name : null,
    toProvinceId: order.toProvinceId,
    toProvinceName: province.name,
    provincePath: order.provincePath,
    path: order.path,
    durationMs: order.durationMs,
    eta,
  });
  showToast(`${unit.name} moving to ${province.name}${eta ? ` (${eta.label})` : ""}.`);
  renderUnitCommandPanel();
  scheduleGameplaySave();
  appState.deckLayerSignature = "";
  updateDeckStrategyLayers();
  startMovementAnimation();
  return true;
}

function startMovementAnimation() {
  if (appState.movementFrame) return;
  const tick = () => {
    appState.movementFrame = null;
    const now = Date.now();
    const hasMovingOrders = Object.keys(appState.movementOrders || {}).length > 0;
    const captureChanged = updateGameplayCaptures(now);
    const beforeMovementSignature = movementLayerSignature();
    if (hasMovingOrders) updateDeckUnitLayers();
    const afterMovementSignature = movementLayerSignature();
    if (!Object.keys(appState.movementOrders || {}).length && !Object.keys(appState.captureProgress || {}).length) {
      if (captureChanged || beforeMovementSignature !== afterMovementSignature) {
        appState.deckLayerSignature = "";
        updateDeckStrategyLayers();
      }
      return;
    }
    if (captureChanged || beforeMovementSignature !== afterMovementSignature) {
      appState.deckLayerSignature = "";
      updateDeckStrategyLayers();
    }
    appState.movementFrame = requestAnimationFrame(tick);
  };
  appState.movementFrame = requestAnimationFrame(tick);
}

function stableHash(value) {
  const text = String(value || "");
  let hash = 2166136261;
  for (let index = 0; index < text.length; index += 1) {
    hash ^= text.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function slugId(value) {
  return String(value || "unknown")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "") || "unknown";
}

function provinceEngineIdFromFeature(feature, fallbackIndex = 0) {
  const props = feature.properties || {};
  const raw =
    props.id ||
    props.adm1_code ||
    props.ADM1_CODE ||
    props.gn_id ||
    props.GN_ID ||
    props.iso_3166_2 ||
    props.ISO_3166_2 ||
    `${provinceOwnerName(feature)}-${debugFeatureName(feature)}-${fallbackIndex}`;
  return `prov-${slugId(raw)}`;
}

function provinceOwnerName(feature) {
  const props = feature.properties || {};
  return (
    props.ownerName ||
    props.admin ||
    props.ADMIN ||
    props.geonunit ||
    props.GEONUNIT ||
    props.sovereignt ||
    props.SOVEREIGNT ||
    countryIdToGeoName[provinceCountryId(feature)] ||
    "Unclaimed"
  );
}

function provinceOwnerId(feature) {
  const props = feature.properties || {};
  if (props.ownerId) return props.ownerId;
  const namedId = provinceCountryId(feature);
  if (namedId) return namedId;
  return slugId(provinceOwnerName(feature));
}

function terrainLabelForPoint(lng, lat, bounds) {
  if (bounds && (
    boundsIntersects(bounds, { minLng: 5, maxLng: 17, minLat: 44, maxLat: 49 }) ||
    boundsIntersects(bounds, { minLng: 38, maxLng: 49, minLat: 40, maxLat: 44 }) ||
    boundsIntersects(bounds, { minLng: 4, maxLng: 20, minLat: 58, maxLat: 69 })
  )) {
    return "mountain";
  }
  if ((lat >= 18 && lat <= 33 && lng >= -18 && lng <= 58) || (lat >= 35 && lat <= 49 && lng >= 50 && lng <= 82)) return "desert";
  if (lat >= 64 || (lat >= 58 && lng >= 26)) return "tundra";
  if ((lat >= 55 && lng >= 3 && lng <= 36) || (lat >= 50 && lng >= 30 && lng <= 105)) return "forest";
  if (lat < 8 && lng > -82 && lng < -34) return "jungle";
  if (lat >= 38 && lat <= 52 && lng >= 38 && lng <= 118) return "steppe";
  return "plains";
}

function distanceLngLat(a, b) {
  const avgLat = ((a[1] + b[1]) / 2) * Math.PI / 180;
  const dx = (a[0] - b[0]) * Math.cos(avgLat);
  const dy = a[1] - b[1];
  return Math.sqrt(dx * dx + dy * dy);
}

function nearestStrategicNode(center, ownerId, ownerName) {
  const ownerKey = slugId(ownerName);
  let candidates = debugCities.filter((city) => city.country && city.country === ownerId);
  if (!candidates.length) {
    candidates = debugCities.filter((city) => city.country && slugId(city.country) === ownerKey);
  }
  if (!candidates.length) {
    candidates = debugCities.filter((city) => city.type === "capital" || city.type === "city");
  }
  return candidates
    .map((city) => ({ city, distance: distanceLngLat(center, city.coords) }))
    .sort((a, b) => a.distance - b.distance)[0] || null;
}

function provinceResourceProfile(province, hash) {
  const baseMoney = Math.round(clampNumber(province.population * 2.2 + 5 + (hash % 9), 4, 68));
  const resources = { steel: 0, oil: 0, electronics: 0, money: baseMoney };
  const owner = slugId(province.ownerName);

  if (province.terrain === "mountain" || province.terrain === "steppe" || ["germany", "france", "poland", "ukraine"].includes(owner)) {
    resources.steel = Math.round(6 + (hash % 18));
  }
  if (province.terrain === "desert" || ["saudi-arabia", "iraq", "iran", "libya", "algeria"].includes(owner)) {
    resources.oil = Math.round(8 + (hash % 24));
  }
  if (province.capital && province.capital.type === "capital") {
    resources.electronics = Math.round(7 + (hash % 12));
    resources.money += 12;
  } else if (province.capital && province.capital.type === "city") {
    resources.electronics = Math.round(3 + (hash % 8));
    resources.money += 6;
  }
  if (province.terrain === "forest" || province.terrain === "jungle") resources.steel += Math.round(2 + (hash % 5));

  return resources;
}

function provinceBuildingsForResources(province) {
  const buildings = [];
  if (province.capital && province.capital.type === "capital") buildings.push("Command Center");
  if (province.resources.steel > 0) buildings.push("Factory");
  if (province.resources.oil > 0) buildings.push("Refinery");
  if (province.resources.electronics > 0) buildings.push("Tech Hub");
  if (province.resources.money >= 18) buildings.push("Finance Center");
  if (province.population >= 1.5) buildings.push("Barracks");
  if (province.capital && province.capital.type === "port") buildings.push("Naval Port");
  return buildings.length ? buildings : ["Local Administration"];
}

function provinceObjectFromFeature(feature, index) {
  const props = feature.properties || {};
  const center = props.macroProvince && Number.isFinite(props.centerLng) && Number.isFinite(props.centerLat)
    ? { lng: props.centerLng, lat: props.centerLat, bounds: featureBounds(feature) }
    : featureCenter(feature);
  const bounds = center.bounds || featureBounds(feature);
  const id = provinceEngineIdFromFeature(feature, index);
  const ownerName = provinceOwnerName(feature);
  const ownerId = provinceOwnerId(feature);
  const coords = [center.lng, center.lat];
  const nearest = props.macroProvince
    ? { city: { name: props.hubName || props.name || debugFeatureName(feature), coords, type: props.hubType || "city" }, distance: 0 }
    : nearestStrategicNode(coords, ownerId, ownerName);
  const hash = stableHash(id);
  const areaScore = bounds ? Math.max(0.25, Math.sqrt(Math.max((bounds.maxLng - bounds.minLng) * (bounds.maxLat - bounds.minLat), 0.05))) : 0.8;
  const cityBoost = nearest && nearest.distance < 2.8 ? (nearest.city.type === "capital" ? 2.4 : 1.2) : 0;
  const population = Number(clampNumber(areaScore * 0.85 + cityBoost + ((hash % 18) / 20), 0.12, 34).toFixed(1));
  const capital = nearest && nearest.distance < 3.5
    ? { name: nearest.city.name, coords: nearest.city.coords, type: nearest.city.type || "city" }
    : { name: debugFeatureName(feature), coords, type: "regional hub" };
  const terrain = terrainLabelForPoint(center.lng, center.lat, bounds);
  const province = {
    id,
    featureId: debugFeatureId(feature, index),
    name: props.name || props.NAME || debugFeatureName(feature),
    countryId: ownerId,
    countryName: ownerName,
    originalOwnerId: ownerId,
    originalOwnerName: ownerName,
    ownerId,
    ownerName,
    capital,
    population,
    resources: null,
    terrain,
    neighbors: [],
    roadLinks: [],
    bounds,
    center: coords,
    polygon: feature.geometry,
    feature,
    hovered: false,
    selected: false,
    stability: 72 + (hash % 22),
    garrison: 1 + (hash % 5),
    slots: 2 + (hash % 4),
  };
  province.resources = provinceResourceProfile(province, hash);
  province.buildings = provinceBuildingsForResources(province);
  return province;
}

function buildProvinceEngine(provinceFeatures) {
  const provinces = provinceFeatures.map((feature, index) => provinceObjectFromFeature(feature, index));
  const byId = new Map();
  const byFeatureId = new Map();
  const byOwner = new Map();
  for (const province of provinces) {
    byId.set(province.id, province);
    byFeatureId.set(province.featureId, province);
    if (!byOwner.has(province.ownerName)) byOwner.set(province.ownerName, []);
    byOwner.get(province.ownerName).push(province);
  }

  const roads = [];
  const edgeKeys = new Set();
  for (const ownerProvinces of byOwner.values()) {
    for (const province of ownerProvinces) {
      const nearest = ownerProvinces
        .filter((candidate) => candidate.id !== province.id)
        .map((candidate) => ({ candidate, distance: distanceLngLat(province.center, candidate.center) }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, province.population > 3 ? 3 : 2);
      province.neighbors = nearest.map((entry) => entry.candidate.id);
      province.roadLinks = province.neighbors.slice();

      for (const entry of nearest) {
        const ids = [province.id, entry.candidate.id].sort();
        const key = ids.join("--");
        if (edgeKeys.has(key)) continue;
        edgeKeys.add(key);
        if (entry.distance > 16) continue;
        roads.push(buildProvinceRoad(province, entry.candidate, entry.distance, roads.length));
      }
    }
  }

  return { provinces, byId, byFeatureId, byOwner, roads };
}

function buildProvinceRoad(from, to, distance, index) {
  const start = from.capital && from.capital.coords ? from.capital.coords : from.center;
  const end = to.capital && to.capital.coords ? to.capital.coords : to.center;
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const length = Math.sqrt(dx * dx + dy * dy) || 1;
  const hash = stableHash(`${from.id}:${to.id}`);
  const bend = clampNumber(distance * 0.08, 0.12, 1.6) * (hash % 2 ? 1 : -1);
  const mid = [
    (start[0] + end[0]) / 2 + (-dy / length) * bend,
    (start[1] + end[1]) / 2 + (dx / length) * bend,
  ];
  const tier = from.population > 4.5 || to.population > 4.5 ? "primary" : from.population > 1.8 || to.population > 1.8 ? "secondary" : "local";
  return {
    id: `road-${index}-${from.id}-${to.id}`,
    name: `${from.capital.name} - ${to.capital.name}`,
    tier,
    from: from.id,
    to: to.id,
    distance,
    path: [start, mid, end],
  };
}

function provinceFromFeature(feature, index = 0) {
  const engine = appState.provinceEngine;
  if (!engine) return null;
  const id = provinceEngineIdFromFeature(feature, index);
  return engine.byId.get(id) || engine.byFeatureId.get(debugFeatureId(feature, index)) || null;
}

function provinceResourceSummary(resources) {
  return Object.entries(resources || {})
    .filter(([, value]) => value > 0)
    .map(([key, value]) => `${value} ${resourceLabels[key] || key}`)
    .join(" / ") || "No strategic output";
}

function provinceLineColor(feature, index, step) {
  const province = provinceFromFeature(feature, index);
  const selected = province && appState.deckSelectedFeatureId === province.id;
  const hovered = province && appState.deckHoveredFeatureId === province.id;
  if (selected) return [255, 253, 226, 240];
  if (hovered) return [248, 250, 232, 192];
  return [226, 230, 221, step === "world" ? 36 : step === "countries" ? 62 : step === "capitals" ? 92 : 122];
}

function provinceLineWidth(feature, index, step) {
  const province = provinceFromFeature(feature, index);
  if (province && appState.deckSelectedFeatureId === province.id) return step === "tactical" ? 1.72 : 1.42;
  if (province && appState.deckHoveredFeatureId === province.id) return step === "tactical" ? 1.26 : 1.04;
  return step === "world" ? 0.32 : step === "countries" ? 0.5 : step === "capitals" ? 0.72 : 0.94;
}

function provinceFillColor(feature, index, step = "tactical") {
  const province = provinceFromFeature(feature, index);
  if (province && appState.deckSelectedFeatureId === province.id) return [146, 207, 132, 46];
  if (province && appState.deckHoveredFeatureId === province.id) return [230, 244, 218, 28];
  const hash = stableHash(province ? province.id : debugFeatureId(feature, index));
  const capturedOwner = province && appState.provinceOwnerOverrides && appState.provinceOwnerOverrides[province.id];
  if (capturedOwner) {
    const selfOwned = appState.game && capturedOwner === appState.game.viewerCountryId;
    const baseCaptured = selfOwned ? [139, 190, 128] : [178, 148, 104];
    const capturedAlpha = step === "world" ? 8 : step === "countries" ? 14 : step === "capitals" ? 20 : 28;
    return [baseCaptured[0], baseCaptured[1], baseCaptured[2], capturedAlpha];
  }
  const warm = hash % 3 === 0;
  const base = warm ? [224, 220, 202] : [207, 220, 210];
  const lift = hash % 11;
  const alphaBase = step === "world" ? 1 : step === "countries" ? 3 : step === "capitals" ? 5 : 8;
  const alphaVariance = step === "world" ? 2 : step === "countries" ? 3 : step === "capitals" ? 5 : 7;
  return [
    Math.min(base[0] + lift, 255),
    Math.min(base[1] + Math.round(lift * 0.7), 255),
    Math.min(base[2] + Math.round(lift * 0.45), 255),
    alphaBase + (hash % alphaVariance),
  ];
}

function cityMarkerRadius(city) {
  if (city.type === "capital") return city.tier === 1 ? 26000 : city.tier === 2 ? 22000 : 19000;
  if ((city.priority || 5) <= 3) return 14500;
  if (city.type === "port" || city.type === "airbase") return 12500;
  return 9000;
}

function cityMarkerFill(city) {
  if (city.type === "capital") return [232, 225, 178, 172];
  if ((city.priority || 5) <= 3) return [220, 226, 216, 132];
  if (city.type === "port") return [112, 174, 184, 118];
  if (city.type === "airbase") return [157, 181, 206, 112];
  return [220, 226, 216, 96];
}

function cityMarkerLine(city) {
  if (city.type === "capital") return [9, 8, 5, 230];
  if (city.type === "port") return [2, 22, 29, 224];
  if (city.type === "airbase") return [5, 15, 30, 224];
  return [4, 7, 8, 216];
}

function svgIconUrl(svg) {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

const cityMarkerIcons = {
  capital: {
    url: svgIconUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="white" d="M32 5l7 17 18 2-14 12 4 18-15-10-15 10 4-18L7 24l18-2z"/><circle cx="32" cy="32" r="25" fill="none" stroke="white" stroke-width="5"/></svg>'),
    width: 64,
    height: 64,
    anchorX: 32,
    anchorY: 32,
    mask: true,
  },
  city: {
    url: svgIconUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><circle cx="32" cy="32" r="14" fill="white"/><circle cx="32" cy="32" r="23" fill="none" stroke="white" stroke-width="4"/></svg>'),
    width: 64,
    height: 64,
    anchorX: 32,
    anchorY: 32,
    mask: true,
  },
  port: {
    url: svgIconUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="white" d="M29 8h6v10h11v6H35v22c7-1 12-5 15-11l6 3c-5 11-13 16-24 16S13 49 8 38l6-3c3 6 8 10 15 11V24H18v-6h11z"/><circle cx="32" cy="12" r="6" fill="white"/></svg>'),
    width: 64,
    height: 64,
    anchorX: 32,
    anchorY: 32,
    mask: true,
  },
  airbase: {
    url: svgIconUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><path fill="white" d="M32 6l8 22 19 8-15 6 3 14-15-9-15 9 3-14-15-6 19-8z"/></svg>'),
    width: 64,
    height: 64,
    anchorX: 32,
    anchorY: 32,
    mask: true,
  },
};

const unitVisualIcons = {
  infantry: {
    url: "assets/units/infantry-l1.png",
    width: 211,
    height: 512,
    anchorX: 105.5,
    anchorY: 256,
    mask: false,
  },
  armor: {
    url: svgIconUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 104"><defs><linearGradient id="h" x1="26" y1="28" x2="104" y2="79"><stop stop-color="#879271"/><stop offset=".48" stop-color="#516044"/><stop offset="1" stop-color="#202d28"/></linearGradient><linearGradient id="t" x1="43" y1="22" x2="85" y2="48"><stop stop-color="#9aa482"/><stop offset="1" stop-color="#46533e"/></linearGradient></defs><path d="M19 64l18-23h52l22 21-12 22H32z" fill="#1f2d28"/><path d="M36 43h51l18 19H23z" fill="url(#h)"/><path d="M45 30h36l12 14H34z" fill="url(#t)"/><path d="M82 35l34-10 4 7-36 13z" fill="#16211e"/><path d="M31 68h70" stroke="#0c1514" stroke-width="12" stroke-linecap="round"/><path d="M35 68h62" stroke="#899178" stroke-width="5" stroke-linecap="round" opacity=".75"/><circle cx="42" cy="68" r="5" fill="#18231f"/><circle cx="60" cy="68" r="5" fill="#18231f"/><circle cx="78" cy="68" r="5" fill="#18231f"/><circle cx="94" cy="68" r="5" fill="#18231f"/><path d="M42 48h29" stroke="#e0dfc2" stroke-width="3" stroke-linecap="round" opacity=".42"/><path d="M24 63l13-20h52l17 18" fill="none" stroke="#d9dcc0" stroke-width="2" opacity=".25"/></svg>'),
    width: 128,
    height: 104,
    anchorX: 64,
    anchorY: 52,
    mask: false,
  },
  technical: {
    url: svgIconUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 96"><defs><linearGradient id="v" x1="26" y1="28" x2="91" y2="71"><stop stop-color="#8f9976"/><stop offset=".5" stop-color="#4e6046"/><stop offset="1" stop-color="#22322b"/></linearGradient></defs><path d="M23 58l14-22h39l21 19-10 21H34z" fill="#1e2c27"/><path d="M38 39h31l18 16H29z" fill="url(#v)"/><path d="M66 34l13-12 5 5-10 13z" fill="#17221f"/><path d="M76 25l24-8 3 6-25 9z" fill="#121c1a"/><circle cx="42" cy="73" r="9" fill="#0d1615"/><circle cx="80" cy="73" r="9" fill="#0d1615"/><circle cx="42" cy="73" r="4" fill="#a5aa92"/><circle cx="80" cy="73" r="4" fill="#a5aa92"/><path d="M41 47h20" stroke="#dddfc3" stroke-width="3" stroke-linecap="round" opacity=".44"/><path d="M29 58h58" stroke="#dfe0c5" stroke-width="1.8" opacity=".22"/></svg>'),
    width: 120,
    height: 96,
    anchorX: 60,
    anchorY: 48,
    mask: false,
  },
};

const unitShadowIcon = {
  url: svgIconUrl('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 128 64"><ellipse cx="64" cy="34" rx="47" ry="14" fill="#000" opacity=".42"/><ellipse cx="64" cy="34" rx="31" ry="8" fill="#000" opacity=".24"/></svg>'),
  width: 128,
  height: 64,
  anchorX: 64,
  anchorY: 35,
  mask: false,
};

function cityMarkerIcon(city) {
  return cityMarkerIcons[city.type] || cityMarkerIcons.city;
}

function cityIconColor(city) {
  if (city.type === "capital") return [245, 232, 172, 224];
  if ((city.priority || 5) <= 3) return [226, 232, 220, 184];
  if (city.type === "port") return [126, 196, 210, 176];
  if (city.type === "airbase") return [170, 198, 229, 168];
  return [225, 232, 220, 142];
}

function cityIconSize(city) {
  if (city.type === "capital") return city.tier === 1 ? 24 : city.tier === 2 ? 21 : 18;
  if ((city.priority || 5) <= 3) return 13;
  if (city.type === "port" || city.type === "airbase") return 12;
  return 8;
}

function cityLabelSize(city) {
  if (city.type === "capital") return city.tier === 1 ? 12.5 : city.tier === 2 ? 11 : 9.5;
  if ((city.priority || 5) <= 3) return 8.6;
  if (city.type === "port" || city.type === "airbase") return 7.4;
  return 7.1;
}

function cityLabelColor(city) {
  if (city.type === "capital") return [238, 242, 232, city.tier === 1 ? 184 : 166];
  if ((city.priority || 5) <= 3) return [220, 228, 220, 136];
  if (city.type === "port") return [170, 218, 224, 112];
  if (city.type === "airbase") return [190, 210, 232, 108];
  return [216, 226, 216, 96];
}

function unitVisualType(unit) {
  if (!unit) return "technical";
  if (unit.type === "infantry") return "infantry";
  if (unit.type === "tanks" || unit.type === "navy" || unit.type === "armor" || unit.type === "armoredVehicle") return "armor";
  if (unit.type === "recon" || unit.type === "reconVehicle" || unit.type === "technical" || unit.type === "lightVehicle") return "technical";
  return "technical";
}

function unitVisualIcon(unit) {
  return unitVisualIcons[unitVisualType(unit)] || unitVisualIcons.technical;
}

function unitUsesPngSprite(unit) {
  return Boolean(unitVisualIcon(unit));
}

function unitZoomSpriteScale() {
  const step = deckZoomStep();
  if (step === "tactical") return 1.14;
  if (step === "capitals") return 1.04;
  if (step === "countries") return 0.96;
  return 0.9;
}

function unitVisualSize(unit) {
  const type = unitVisualType(unit);
  const base = type === "armor" ? 38 : type === "infantry" ? 54 : 36;
  const pulse = unit && !unit.moving ? (unit.idlePulse || 0) * 1.2 : 0;
  return (base + pulse + (unit && unit.selected ? 5 : 0)) * unitZoomSpriteScale();
}

function unitMarkerRadius(unit) {
  const type = unitVisualType(unit);
  const base = type === "armor" ? 22000 : type === "infantry" ? 19000 : 20500;
  const pulse = unit && !unit.moving ? (unit.idlePulse || 0) * 1800 : 0;
  return base + pulse + (unit && unit.selected ? 7200 : 0);
}

function unitMarkerFill(unit) {
  const ownerId = unitOwnerId(unit);
  const selectedBoost = unit && unit.selected ? 22 : 0;
  if (appState.game && ownerId === appState.game.viewerCountryId) return [Math.min(141 + selectedBoost, 255), 218, 136, unit && unit.selected ? 242 : 224];
  const type = unitVisualType(unit);
  if (type === "armor") return [Math.min(204 + selectedBoost, 255), 183, 112, unit && unit.selected ? 236 : 218];
  if (type === "infantry") return [Math.min(174 + selectedBoost, 255), 206, 154, unit && unit.selected ? 232 : 214];
  return [Math.min(126 + selectedBoost, 255), 186, 196, unit && unit.selected ? 232 : 214];
}

function unitMarkerLine(unit) {
  return unit && unit.selected ? [255, 252, 218, 250] : [9, 15, 12, 235];
}

function unitMarkerGlyph(unit) {
  const type = unitVisualType(unit);
  if (type === "armor") return "■";
  if (type === "infantry") return "▲";
  return "◆";
}

function unitShadowSize(unit) {
  return unitVisualSize(unit) * (unit && unit.selected ? 1.22 : 1.08);
}

function bearingDegrees(from, to) {
  if (!Array.isArray(from) || !Array.isArray(to)) return 0;
  const avgLat = ((Number(from[1]) + Number(to[1])) / 2) * Math.PI / 180;
  const dx = (Number(to[0]) - Number(from[0])) * Math.cos(avgLat);
  const dy = Number(to[1]) - Number(from[1]);
  if (!Number.isFinite(dx) || !Number.isFinite(dy) || (Math.abs(dx) + Math.abs(dy)) <= 0.000001) return 0;
  return (Math.atan2(dx, dy) * 180) / Math.PI;
}

function headingFromPath(path, coords) {
  if (!Array.isArray(path) || path.length < 2) return null;
  let bestIndex = 1;
  let bestDistance = Infinity;
  for (let index = 1; index < path.length; index += 1) {
    const midpoint = [
      (path[index - 1][0] + path[index][0]) / 2,
      (path[index - 1][1] + path[index][1]) / 2,
    ];
    const distance = distanceLngLat(coords, midpoint);
    if (distance < bestDistance) {
      bestDistance = distance;
      bestIndex = index;
    }
  }
  return bearingDegrees(path[bestIndex - 1], path[bestIndex]);
}

function unitVisualHeading(unit, coords, order) {
  if (order && Array.isArray(order.segments) && order.segments.length) {
    const rawSegmentIndex = Number(order.currentSegmentIndex);
    const segmentIndex = Number.isFinite(rawSegmentIndex) ? rawSegmentIndex : 0;
    const segment = order.segments[Math.max(0, Math.min(order.segments.length - 1, segmentIndex))];
    const segmentHeading = headingFromPath(segment && segment.path, coords);
    if (Number.isFinite(segmentHeading)) return segmentHeading;
  }
  if (order && Array.isArray(order.path)) {
    const routeHeading = headingFromPath(order.path, coords);
    if (Number.isFinite(routeHeading)) return routeHeading;
  }
  return (stableHash(unit && unit.id) % 80) - 40;
}

function routeTierWeight(route) {
  if (route.tier === "primary") return 1;
  if (route.tier === "secondary") return 0.72;
  return 0.42;
}

function routeShadowColor(route) {
  if (route.tier === "primary") return [5, 10, 8, 20];
  if (route.tier === "secondary") return [5, 10, 8, 14];
  return [4, 8, 7, 9];
}

function routeLineColor(route) {
  if (route.tier === "primary") return [216, 224, 204, 48];
  if (route.tier === "secondary") return [190, 204, 186, 34];
  return [164, 184, 166, 24];
}

function routeShadowWidth(route) {
  if (route.tier === "primary") return 1.4;
  if (route.tier === "secondary") return 1.0;
  return 0.7;
}

function routeLineWidth(route) {
  if (route.tier === "primary") return 0.68;
  if (route.tier === "secondary") return 0.46;
  return 0.3;
}

function simplifyRingCoordinates(ring, interval) {
  if (!Array.isArray(ring) || ring.length <= interval * 4) return ring;
  const simplified = [];
  for (let index = 0; index < ring.length; index++) {
    if (index === 0 || index === ring.length - 1 || index % interval === 0) {
      simplified.push(ring[index]);
    }
  }
  const first = simplified[0];
  const last = simplified[simplified.length - 1];
  if (first && last && (first[0] !== last[0] || first[1] !== last[1])) simplified.push(first);
  return simplified.length >= 4 ? simplified : ring;
}

function simplifyPolygonCoordinates(polygon, interval) {
  return polygon.map((ring) => simplifyRingCoordinates(ring, interval));
}

function simplifyFeatureGeometry(feature, interval) {
  if (!feature || !feature.geometry || interval <= 1) return feature;
  if (feature.properties && feature.properties.macroProvince) return feature;
  const geometry = feature.geometry;
  let coordinates = geometry.coordinates;

  if (geometry.type === "Polygon") {
    coordinates = simplifyPolygonCoordinates(coordinates, interval);
  } else if (geometry.type === "MultiPolygon") {
    coordinates = coordinates.map((polygon) => simplifyPolygonCoordinates(polygon, interval));
  } else {
    return feature;
  }

  return {
    type: "Feature",
    properties: feature.properties,
    geometry: {
      type: geometry.type,
      coordinates,
    },
  };
}

function buildDeckFeatureCache(data) {
  if (appState.deckFeatureCache && appState.deckFeatureCache.source === data) {
    appState.provinceEngine = appState.deckFeatureCache.provinceEngine || appState.provinceEngine;
    applyProvinceOwnerOverrides(appState.provinceEngine);
    return appState.deckFeatureCache;
  }

  appState.deckFeatureBoundsCache = new WeakMap();
  appState.deckFeatureAreaCache = new WeakMap();

  const countriesFull = (data.countries.features || []).filter(featureIntersectsDebugBounds);
  const regionalFeatures = (data.provinces.features || []).filter(featureIntersectsDebugBounds);
  const macroProvinceCountrySources = countriesFull.map((feature) => simplifyFeatureGeometry(feature, 3));
  const provincesFull = buildCityCenteredMacroProvinceFeatures(macroProvinceCountrySources, regionalFeatures);
  const countriesFar = countriesFull.map((feature) => simplifyFeatureGeometry(feature, 7));
  const countriesMid = countriesFull.map((feature) => simplifyFeatureGeometry(feature, 4));
  const provincesFar = provincesFull.map((feature) => simplifyFeatureGeometry(feature, 6));
  const provincesMid = provincesFull.map((feature) => simplifyFeatureGeometry(feature, 4));
  const provincesClose = provincesFull.map((feature) => simplifyFeatureGeometry(feature, 2));
  const provinceCountryCounts = buildProvinceCountryCounts(provincesFull);
  const strategicRegionLines = [];
  const macroProvinceLines = [];
  const macroProvinceLabels = [];
  const provinceEngine = buildProvinceEngine(provincesFull);
  applyProvinceOwnerOverrides(provinceEngine);
  const countryLabels = {
    countries: deckCountryLabels(countriesFull, "countries"),
    capitals: deckCountryLabels(countriesFull, "capitals"),
    tactical: deckCountryLabels(countriesFull, "tactical"),
  };
  appState.provinceEngine = provinceEngine;

  appState.deckFeatureCache = {
    source: data,
    countriesFull,
    countriesFar,
    countriesMid,
    provincesFull,
    provincesFar,
    provincesMid,
    provincesClose,
    strategicRegionLines,
    macroProvinceLines,
    macroProvinceLabels,
    provinceEngine,
    countryLabels,
  };
  return appState.deckFeatureCache;
}

function deckCountriesForStep(cache, step) {
  if (step === "world") return cache.countriesFar;
  if (step === "countries" || step === "capitals") return cache.countriesMid;
  return cache.countriesFull;
}

function deckProvinceSourceForStep(cache, step) {
  if (step === "world") return cache.provincesFar;
  if (step === "countries") return cache.provincesFar;
  if (step === "capitals") return cache.provincesMid;
  if (step === "tactical") return cache.provincesFull;
  return [];
}

function isMacroProvinceCountryFeature(feature) {
  const props = feature.properties || {};
  if (props.macroProvince) return true;
  const countryKey = provinceCountryKey(feature);
  return Boolean(
    (countryKey && macroProvinceHubs[countryKey]) ||
    macroProvinceHubs[macroCountryKey(feature)] ||
    (props.admin && macroProvinceHubs[String(props.admin).toLowerCase()]) ||
    (props.ADMIN && macroProvinceHubs[String(props.ADMIN).toLowerCase()]) ||
    (props.geonunit && macroProvinceHubs[String(props.geonunit).toLowerCase()]) ||
    (props.GEONUNIT && macroProvinceHubs[String(props.GEONUNIT).toLowerCase()])
  );
}

function strategicRegionCap(totalArea) {
  if (totalArea > 76000) return 28;
  if (totalArea > 42000) return 22;
  if (totalArea > 18500) return 14;
  if (totalArea > 7600) return 10;
  if (totalArea > 2600) return 6;
  if (totalArea > 900) return 3;
  return 2;
}

function strategicRegionLineCount(totalArea) {
  if (totalArea > 76000) return { vertical: 5, horizontal: 3 }; // 24 macro regions
  if (totalArea > 42000) return { vertical: 4, horizontal: 3 }; // 20 macro regions
  if (totalArea > 18500) return { vertical: 3, horizontal: 2 }; // 12 macro regions
  if (totalArea > 7600) return { vertical: 2, horizontal: 2 }; // 9 macro regions
  if (totalArea > 2600) return { vertical: 2, horizontal: 1 }; // 6 macro regions
  if (totalArea > 900) return { vertical: 1, horizontal: 1 }; // 4 macro regions
  return { vertical: 1, horizontal: 0 }; // 2 macro regions minimum
}

function tuneStrategicRegionCounts(counts, bounds) {
  const centerLng = (bounds.minLng + bounds.maxLng) / 2;
  const centerLat = (bounds.minLat + bounds.maxLat) / 2;
  const isDesertInterior =
    (centerLat >= 17 && centerLat <= 34 && centerLng >= -18 && centerLng <= 58) ||
    (centerLat >= 35 && centerLat <= 52 && centerLng >= 45 && centerLng <= 86);
  const isDenseCoastalTheater =
    (centerLat >= 35 && centerLat <= 61 && centerLng >= -12 && centerLng <= 36) ||
    (centerLat >= 24 && centerLat <= 42 && centerLng >= 27 && centerLng <= 45) ||
    (centerLat >= -38 && centerLat <= 10 && centerLng >= -82 && centerLng <= -34);

  if (isDesertInterior) {
    return {
      vertical: Math.max(1, counts.vertical - 1),
      horizontal: Math.max(0, counts.horizontal - 1),
    };
  }

  if (isDenseCoastalTheater) {
    return {
      vertical: Math.min(counts.vertical + 1, 5),
      horizontal: Math.min(counts.horizontal + 1, 4),
    };
  }

  return counts;
}

function provinceCountryKey(feature) {
  const props = feature.properties || {};
  return props.ownerId || provinceCountryId(feature) || props.admin || props.ADMIN || props.geonunit || props.GEONUNIT || props.sovereignt || props.SOVEREIGNT || null;
}

function countryFeatureKey(feature) {
  const props = feature.properties || {};
  return countryIdFromFeature(feature) || props.NAME || props.ADMIN || props.NAME_LONG || props.SOVEREIGNT || props.name || null;
}

function buildProvinceCountryCounts(provinceFeatures) {
  const counts = new Map();
  for (const feature of provinceFeatures) {
    const key = provinceCountryKey(feature);
    if (!key) continue;
    counts.set(key, (counts.get(key) || 0) + 1);
  }
  return counts;
}

function countryDisplayNameFromFeature(feature) {
  const props = feature.properties || {};
  return props.NAME_LONG || props.ADMIN || props.NAME || props.SOVEREIGNT || props.name || "Unknown Country";
}

function macroCountryKeyCandidates(feature) {
  const props = feature.properties || {};
  return [
    props.ownerId,
    countryIdFromFeature(feature),
    props.iso_a3,
    props.ISO_A3,
    props.ADM0_A3,
    props.NAME,
    props.ADMIN,
    props.NAME_LONG,
    props.SOVEREIGNT,
    props.name,
  ]
    .filter(Boolean)
    .map((value) => slugId(value));
}

function macroCountryKey(feature) {
  const candidates = macroCountryKeyCandidates(feature);
  for (const key of candidates) {
    if (macroProvinceHubs[key] || macroProvinceCountOverrides[key]) return key;
  }
  return candidates[0] || slugId(countryDisplayNameFromFeature(feature));
}

function macroProvinceTargetCount(feature) {
  const key = macroCountryKey(feature);
  if (macroProvinceCountOverrides[key]) return macroProvinceCountOverrides[key];

  const project = createDebugProjection();
  const area = featureProjectedArea(feature, project);
  if (area > 76000) return 20;
  if (area > 42000) return 18;
  if (area > 18500) return 14;
  if (area > 7600) return 10;
  if (area > 2600) return 7;
  if (area > 900) return 4;
  if (area > 250) return 2;
  return 2;
}

function geoPolygonOuterRings(feature) {
  const geometry = feature && feature.geometry;
  if (!geometry) return [];
  if (geometry.type === "Polygon") return geometry.coordinates && geometry.coordinates[0] ? [geometry.coordinates[0]] : [];
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((polygon) => polygon && polygon[0])
      .filter((ring) => Array.isArray(ring) && ring.length >= 4);
  }
  return [];
}

function closeGeoRing(ring) {
  if (!ring || ring.length < 3) return [];
  const cleaned = ring.filter((point) => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1]));
  if (cleaned.length < 3) return [];
  const first = cleaned[0];
  const last = cleaned[cleaned.length - 1];
  if (first[0] !== last[0] || first[1] !== last[1]) cleaned.push([first[0], first[1]]);
  return cleaned;
}

function geoRingArea(ring) {
  const closed = closeGeoRing(ring);
  if (closed.length < 4) return 0;
  let area = 0;
  for (let index = 0; index < closed.length - 1; index += 1) {
    const current = closed[index];
    const next = closed[index + 1];
    area += current[0] * next[1] - next[0] * current[1];
  }
  return Math.abs(area) / 2;
}

function densifyGeoRing(ring, maxSegment = 0.85) {
  const closed = closeGeoRing(ring);
  if (closed.length < 4) return closed;
  const dense = [];

  for (let index = 0; index < closed.length - 1; index += 1) {
    const current = closed[index];
    const next = closed[index + 1];
    const distance = Math.hypot(next[0] - current[0], next[1] - current[1]);
    const steps = Math.max(1, Math.ceil(distance / maxSegment));
    for (let step = 0; step < steps; step += 1) {
      const t = step / steps;
      dense.push([
        current[0] + (next[0] - current[0]) * t,
        current[1] + (next[1] - current[1]) * t,
      ]);
    }
  }

  dense.push(dense[0]);
  return dense;
}

function pointSegmentDistance(point, start, end) {
  const dx = end[0] - start[0];
  const dy = end[1] - start[1];
  const lengthSquared = (dx * dx) + (dy * dy);
  if (!lengthSquared) return Math.hypot(point[0] - start[0], point[1] - start[1]);
  const t = Math.max(0, Math.min(1, (((point[0] - start[0]) * dx) + ((point[1] - start[1]) * dy)) / lengthSquared));
  return Math.hypot(point[0] - (start[0] + dx * t), point[1] - (start[1] + dy * t));
}

function pointNearCountryBoundary(point, countryRings, threshold = 0.05) {
  for (const ring of countryRings) {
    const closed = closeGeoRing(ring);
    for (let index = 0; index < closed.length - 1; index += 1) {
      if (pointSegmentDistance(point, closed[index], closed[index + 1]) <= threshold) return true;
    }
  }
  return false;
}

function pointInsideOrOnCountry(point, countryRings, countryFeature) {
  return pointInFeature(point, countryFeature) || pointNearCountryBoundary(point, countryRings, 0.08);
}

function ringStaysInsideCountry(ring, countryRings, countryFeature, maxSegment = 0.34) {
  const dense = densifyGeoRing(ring, maxSegment);
  if (dense.length < 4) return false;
  for (let index = 0; index < dense.length - 1; index += 1) {
    if (!pointInsideOrOnCountry(dense[index], countryRings, countryFeature)) return false;
  }
  return true;
}

function organicProvincePoint(point, amplitude) {
  const [lng, lat] = point;
  const waveA = Math.sin((lng * 1.73) + (lat * 0.91));
  const waveB = Math.sin((lng * -0.77) + (lat * 1.41) + 1.8);
  return [
    lng + (waveA * amplitude),
    lat + (waveB * amplitude * 0.62),
  ];
}

function organicizeMacroProvinceRing(ring, countryRings, countryFeature) {
  const dense = densifyGeoRing(ring, 0.62);
  if (dense.length < 4) return dense;
  if (!ringStaysInsideCountry(dense, countryRings, countryFeature)) return [];
  const bounds = featureBounds(countryFeature);
  const span = bounds ? Math.max(bounds.maxLng - bounds.minLng, bounds.maxLat - bounds.minLat) : 8;
  const amplitude = Math.max(0.025, Math.min(0.22, span * 0.006));
  const warped = dense.map((point, index) => {
    if (index === dense.length - 1) return null;
    if (pointNearCountryBoundary(point, countryRings)) return point;
    const organic = organicProvincePoint(point, amplitude);
    return pointInsideOrOnCountry(organic, countryRings, countryFeature) ? organic : point;
  });
  warped[warped.length - 1] = warped[0];
  const organicRing = closeGeoRing(warped);
  return ringStaysInsideCountry(organicRing, countryRings, countryFeature)
    ? organicRing
    : dense;
}

function clippedVoronoiValue(point, site, other, scale) {
  const px = point[0] * scale;
  const py = point[1];
  const sx = site.coords[0] * scale;
  const sy = site.coords[1];
  const ox = other.coords[0] * scale;
  const oy = other.coords[1];
  return (px - sx) ** 2 + (py - sy) ** 2 - ((px - ox) ** 2 + (py - oy) ** 2);
}

function clipRingToCloserHub(ring, site, other, scale) {
  const source = densifyGeoRing(closeGeoRing(ring), 0.9);
  if (source.length < 4) return [];
  const output = [];

  for (let index = 0; index < source.length - 1; index += 1) {
    const current = source[index];
    const next = source[index + 1];
    const currentValue = clippedVoronoiValue(current, site, other, scale);
    const nextValue = clippedVoronoiValue(next, site, other, scale);
    const currentInside = currentValue <= 1e-9;
    const nextInside = nextValue <= 1e-9;

    if (currentInside) output.push(current);
    if (currentInside !== nextInside) {
      const denominator = currentValue - nextValue;
      const t = Math.abs(denominator) < 1e-12 ? 0.5 : currentValue / denominator;
      output.push([
        current[0] + (next[0] - current[0]) * t,
        current[1] + (next[1] - current[1]) * t,
      ]);
    }
  }

  return closeGeoRing(output);
}

function clipRingToMacroProvince(ring, site, hubs, scale) {
  let clipped = closeGeoRing(ring);
  for (const other of hubs) {
    if (other === site) continue;
    clipped = clipRingToCloserHub(clipped, site, other, scale);
    if (clipped.length < 4 || geoRingArea(clipped) < 0.00001) return [];
  }
  return clipped;
}

function fallbackHubName(countryKey, countryName, index) {
  const countryPool = fallbackProvinceNamePools[countryKey] || fallbackProvinceNamePools[slugId(countryName)];
  if (countryPool && countryPool.length) return countryPool[index % countryPool.length];
  return index === 0 ? countryName : "";
}

function fallbackHubCandidates(feature, targetCount) {
  const bounds = featureBounds(feature);
  if (!bounds) return [];
  const width = bounds.maxLng - bounds.minLng;
  const height = bounds.maxLat - bounds.minLat;
  const columns = Math.max(4, Math.min(14, Math.ceil(Math.sqrt(targetCount) * 3)));
  const rows = Math.max(3, Math.min(12, Math.ceil(Math.sqrt(targetCount) * 2.4)));
  const candidates = [];

  for (let row = 0; row < rows; row += 1) {
    for (let column = 0; column < columns; column += 1) {
      const lng = bounds.minLng + (width * (column + 0.5)) / columns;
      const lat = bounds.minLat + (height * (row + 0.5)) / rows;
      if (pointInFeature([lng, lat], feature)) candidates.push([lng, lat]);
    }
  }

  if (!candidates.length) {
    const center = featureCenter(feature);
    const centerPoint = [center.lng, center.lat];
    if (pointInFeature(centerPoint, feature)) candidates.push(centerPoint);
  }

  if (!candidates.length) {
    const rings = geoPolygonOuterRings(feature);
    for (const ring of rings) {
      const point = ring[Math.floor(ring.length / 2)];
      if (point) {
        candidates.push(point);
        break;
      }
    }
  }

  return candidates;
}

function regionFeatureCountryKey(feature) {
  const props = feature.properties || {};
  return macroCountryKey(feature) || slugId(props.admin || props.ADMIN || props.geonunit || props.GEONUNIT || "");
}

function cleanRegionHubName(name) {
  return String(name || "")
    .replace(/\b(Province|Region|State|Governorate|Department|County|District|Prefecture)\b/gi, "")
    .replace(/\s+/g, " ")
    .trim();
}

function regionalHubCandidates(countryFeature, regionalFeatures, targetCount) {
  const countryKey = macroCountryKey(countryFeature);
  const project = createDebugProjection();
  return (regionalFeatures || [])
    .filter((feature) => regionFeatureCountryKey(feature) === countryKey)
    .map((feature) => {
      const center = featureCenter(feature);
      const coords = [center.lng, center.lat];
      const name = cleanRegionHubName(debugFeatureName(feature));
      return {
        name,
        coords,
        area: featureProjectedArea(feature, project),
      };
    })
    .filter((hub) => hub.name && pointInFeature(hub.coords, countryFeature))
    .sort((left, right) => right.area - left.area)
    .slice(0, Math.max(targetCount * 3, targetCount + 4));
}

function addSpacedHub(seeded, seenNames, hub, minDistance) {
  const nameKey = slugId(hub.name);
  if (!nameKey || seenNames.has(nameKey)) return false;
  if (minDistance > 0 && seeded.some((entry) => distanceLngLat(entry.coords, hub.coords) < minDistance)) return false;
  seenNames.add(nameKey);
  seeded.push({ name: hub.name, coords: hub.coords, type: hub.type || "regional hub" });
  return true;
}

function buildCountryMacroHubs(feature, regionalFeatures = []) {
  const countryKey = macroCountryKey(feature);
  const countryName = countryDisplayNameFromFeature(feature);
  const targetCount = macroProvinceTargetCount(feature);
  const seeded = [];
  const seenNames = new Set();
  const bounds = featureBounds(feature);
  const span = bounds ? Math.max(bounds.maxLng - bounds.minLng, bounds.maxLat - bounds.minLat) : 8;
  const minHubDistance = Math.max(0.18, Math.min(2.2, span / Math.max(5, targetCount * 1.4)));

  const explicitHubs = macroProvinceHubs[countryKey] || [];
  for (const hub of explicitHubs) {
    if (!hub || !Array.isArray(hub.coords) || !pointInFeature(hub.coords, feature)) continue;
    addSpacedHub(seeded, seenNames, { ...hub, type: hub.type || "city" }, 0);
    if (seeded.length >= targetCount) break;
  }

  for (const node of debugCities) {
    if (seeded.length >= targetCount) break;
    if (!node || !Array.isArray(node.coords) || !pointInFeature(node.coords, feature)) continue;
    const nodeCountryKey = node.country ? slugId(node.country) : null;
    if (nodeCountryKey && nodeCountryKey !== countryKey) continue;
    addSpacedHub(seeded, seenNames, { name: node.name.replace(/\s+(Port|Oil|Steel)$/i, ""), coords: node.coords, type: node.type || "city" }, minHubDistance * 0.55);
  }

  for (const hub of regionalHubCandidates(feature, regionalFeatures, targetCount)) {
    if (seeded.length >= targetCount) break;
    addSpacedHub(seeded, seenNames, hub, minHubDistance);
  }

  const candidates = fallbackHubCandidates(feature, targetCount);
  while (seeded.length < targetCount && candidates.length) {
    let bestIndex = -1;
    let bestDistance = -Infinity;

    for (let index = 0; index < candidates.length; index += 1) {
      const candidate = candidates[index];
      const distance = seeded.length
        ? Math.min(...seeded.map((hub) => distanceLngLat(candidate, hub.coords)))
        : 1;
      if (distance > bestDistance) {
        bestDistance = distance;
        bestIndex = index;
      }
    }

    if (bestIndex < 0) break;
    const [candidate] = candidates.splice(bestIndex, 1);
    const name = fallbackHubName(countryKey, countryName, seeded.length);
    if (!name) continue;
    const nameKey = slugId(name);
    if (seenNames.has(nameKey)) continue;
    seenNames.add(nameKey);
    seeded.push({ name, coords: candidate, type: "regional hub" });
  }

  return seeded.slice(0, Math.max(1, targetCount));
}

function macroProvinceFeatureProperties(countryFeature, hub, index, total) {
  const ownerName = countryDisplayNameFromFeature(countryFeature);
  const ownerId = macroCountryKey(countryFeature);
  const id = `macro-${ownerId}-${slugId(hub.name)}-${index}`;
  return {
    id,
    adm1_code: id,
    macroProvince: true,
    name: hub.name,
    NAME: hub.name,
    ownerName,
    ownerId,
    admin: ownerName,
    ADMIN: ownerName,
    countryKey: ownerId,
    hubName: hub.name,
    hubType: index === 0 || hub.type === "capital" ? "capital" : hub.type || "city",
    centerLng: hub.coords[0],
    centerLat: hub.coords[1],
    provinceIndex: index,
    provinceCount: total,
  };
}

function buildCityCenteredMacroProvinceFeatures(countryFeatures, regionalFeatures = []) {
  const features = [];

  for (const countryFeature of countryFeatures) {
    const rings = geoPolygonOuterRings(countryFeature);
    if (!rings.length) continue;

    const hubs = buildCountryMacroHubs(countryFeature, regionalFeatures);
    if (!hubs.length) continue;
    const countryCenter = featureCenter(countryFeature);
    const scale = Math.max(0.18, Math.cos((countryCenter.lat * Math.PI) / 180));

    if (hubs.length === 1) {
      features.push({
        type: "Feature",
        properties: macroProvinceFeatureProperties(countryFeature, hubs[0], 0, 1),
        geometry: countryFeature.geometry,
      });
      continue;
    }

    hubs.forEach((hub, index) => {
      const clippedPolygons = [];
      for (const ring of rings) {
        const clipped = clipRingToMacroProvince(ring, hub, hubs, scale);
        const organic = organicizeMacroProvinceRing(clipped, rings, countryFeature);
        if (organic.length >= 4 && geoRingArea(organic) > 0.00001) clippedPolygons.push([organic]);
      }
      if (!clippedPolygons.length) return;

      features.push({
        type: "Feature",
        properties: macroProvinceFeatureProperties(countryFeature, hub, index, hubs.length),
        geometry: clippedPolygons.length === 1
          ? { type: "Polygon", coordinates: clippedPolygons[0] }
          : { type: "MultiPolygon", coordinates: clippedPolygons },
      });
    });
  }

  return features;
}

function buildMacroProvinceLabelsFromFeatures(provinceFeatures) {
  return provinceFeatures.map((feature, index) => {
    const props = feature.properties || {};
    const center = props.macroProvince && Number.isFinite(props.centerLng) && Number.isFinite(props.centerLat)
      ? { lng: props.centerLng, lat: props.centerLat }
      : featureCenter(feature);
    return {
      id: props.id || debugFeatureId(feature, index),
      label: debugFeatureName(feature).toUpperCase(),
      position: [center.lng, center.lat],
      priority: 58 - (props.provinceIndex || 0),
    };
  });
}

function pointInRing(point, ring) {
  let inside = false;
  const [x, y] = point;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i, i += 1) {
    const [xi, yi] = ring[i];
    const [xj, yj] = ring[j];
    const intersects = ((yi > y) !== (yj > y)) && (x < ((xj - xi) * (y - yi)) / ((yj - yi) || 1e-9) + xi);
    if (intersects) inside = !inside;
  }
  return inside;
}

function pointInPolygon(point, polygon) {
  if (!Array.isArray(polygon) || !polygon.length || !pointInRing(point, polygon[0])) return false;
  for (let index = 1; index < polygon.length; index += 1) {
    if (pointInRing(point, polygon[index])) return false;
  }
  return true;
}

function pointInFeature(point, feature) {
  const geometry = feature && feature.geometry;
  if (!geometry) return false;
  if (geometry.type === "Polygon") return pointInPolygon(point, geometry.coordinates);
  if (geometry.type === "MultiPolygon") return geometry.coordinates.some((polygon) => pointInPolygon(point, polygon));
  return false;
}

function addClippedStrategicLine(lines, feature, id, path) {
  const samples = 72;
  let runStart = null;
  let previousPoint = null;
  let segmentIndex = 0;
  const [start, end] = path;
  const bounds = featureBounds(feature);
  const minSegmentSpan = bounds
    ? Math.max(0.08, Math.min(0.9, Math.max(bounds.maxLng - bounds.minLng, bounds.maxLat - bounds.minLat) * 0.08))
    : 0.12;

  for (let index = 0; index <= samples; index += 1) {
    const t = index / samples;
    const point = [
      start[0] + (end[0] - start[0]) * t,
      start[1] + (end[1] - start[1]) * t,
    ];
    const inside = pointInFeature(point, feature);
    if (inside && !runStart) runStart = point;
    if ((!inside || index === samples) && runStart && previousPoint) {
      const lngSpan = Math.abs(previousPoint[0] - runStart[0]);
      const latSpan = Math.abs(previousPoint[1] - runStart[1]);
      if (lngSpan + latSpan > minSegmentSpan) {
        lines.push({
          id: `${id}-${segmentIndex}`,
          path: [runStart, previousPoint],
        });
        segmentIndex += 1;
      }
      runStart = null;
    }
    previousPoint = point;
  }
}

function buildStrategicRegionLines(countryFeatures, provinceCountryCounts) {
  const project = createDebugProjection();
  const lines = [];

  for (const feature of countryFeatures) {
    const bounds = featureBounds(feature);
    if (!bounds) continue;
    const width = bounds.maxLng - bounds.minLng;
    const height = bounds.maxLat - bounds.minLat;
    if (width <= 0 || height <= 0) continue;

    const area = featureProjectedArea(feature, project);
    const existingProvinceCount = provinceCountryCounts.get(countryFeatureKey(feature)) || provinceCountryCounts.get(debugFeatureName(feature)) || 0;
    const counts = tuneStrategicRegionCounts(strategicRegionLineCount(area), bounds, existingProvinceCount);
    const lngInset = width * 0.14;
    const latInset = height * 0.14;
    const west = bounds.minLng + lngInset;
    const east = bounds.maxLng - lngInset;
    const south = bounds.minLat + latInset;
    const north = bounds.maxLat - latInset;
    if (east <= west || north <= south) continue;

    const id = countryFeatureKey(feature) || debugFeatureName(feature);
    for (let index = 1; index <= counts.vertical; index += 1) {
      const lng = west + ((east - west) * index) / (counts.vertical + 1);
      addClippedStrategicLine(lines, feature, `${id}-v-${index}`, [[lng, south], [lng, north]]);
    }

    for (let index = 1; index <= counts.horizontal; index += 1) {
      const lat = south + ((north - south) * index) / (counts.horizontal + 1);
      addClippedStrategicLine(lines, feature, `${id}-h-${index}`, [[west, lat], [east, lat]]);
    }

    if (!lines.some((line) => String(line.id).startsWith(`${id}-`))) {
      if (width >= height) {
        const lng = (west + east) / 2;
        addClippedStrategicLine(lines, feature, `${id}-fallback-v`, [[lng, bounds.minLat], [lng, bounds.maxLat]]);
      } else {
        const lat = (south + north) / 2;
        addClippedStrategicLine(lines, feature, `${id}-fallback-h`, [[bounds.minLng, lat], [bounds.maxLng, lat]]);
      }
    }
  }

  return lines;
}

function macroHubCountryKey(feature) {
  const key = macroCountryKey(feature);
  return macroProvinceHubs[key] ? key : null;
}

function buildMacroProvinceLines(countryFeatures) {
  const lines = [];

  for (const feature of countryFeatures) {
    const countryKey = macroHubCountryKey(feature);
    if (!countryKey) continue;
    const bounds = featureBounds(feature);
    if (!bounds) continue;
    const hubs = macroProvinceHubs[countryKey].filter((hub) => pointInFeature(hub.coords, feature));
    if (hubs.length < 2) continue;
    const pairs = [];

    for (let a = 0; a < hubs.length; a += 1) {
      for (let b = a + 1; b < hubs.length; b += 1) {
        const hubA = hubs[a];
        const hubB = hubs[b];
        const distance = Math.hypot(hubB.coords[0] - hubA.coords[0], hubB.coords[1] - hubA.coords[1]);
        pairs.push({ a, b, distance });
      }
    }

    const usedHubLinks = new Map();
    const chosenPairs = [];
    pairs
      .sort((left, right) => left.distance - right.distance)
      .forEach((pair) => {
        const aLinks = usedHubLinks.get(pair.a) || 0;
        const bLinks = usedHubLinks.get(pair.b) || 0;
        if (aLinks >= 2 && bLinks >= 2) return;
        chosenPairs.push(pair);
        usedHubLinks.set(pair.a, aLinks + 1);
        usedHubLinks.set(pair.b, bLinks + 1);
      });

    for (const pair of chosenPairs.slice(0, Math.max(hubs.length + 2, 4))) {
        const hubA = hubs[pair.a];
        const hubB = hubs[pair.b];
        const midLng = (hubA.coords[0] + hubB.coords[0]) / 2;
        const midLat = (hubA.coords[1] + hubB.coords[1]) / 2;
        const dx = hubB.coords[0] - hubA.coords[0];
        const dy = hubB.coords[1] - hubA.coords[1];
        const length = Math.hypot(dx, dy);
        if (!length) continue;

        const span = Math.max(bounds.maxLng - bounds.minLng, bounds.maxLat - bounds.minLat) * 0.95;
        const perpLng = (-dy / length) * span;
        const perpLat = (dx / length) * span;
        const path = [
          [midLng - perpLng, midLat - perpLat],
          [midLng + perpLng, midLat + perpLat],
        ];

        addClippedStrategicLine(lines, feature, `${countryKey}-${hubA.name}-${hubB.name}`, path);
    }
  }

  return lines;
}

function buildMacroProvinceLabels(countryFeatures) {
  const labels = [];

  for (const feature of countryFeatures) {
    const countryKey = macroHubCountryKey(feature);
    if (!countryKey) continue;
    const hubs = macroProvinceHubs[countryKey].filter((hub) => pointInFeature(hub.coords, feature));
    hubs.forEach((hub, index) => {
      labels.push({
        id: `${countryKey}-${hub.name}-${index}`,
        label: hub.name.toUpperCase(),
        position: hub.coords,
        priority: 58 - index,
      });
    });
  }

  return labels;
}

function strategicProvinceSubset(features, visibleBounds) {
  const project = createDebugProjection();
  const groups = new Map();

  for (const feature of features) {
    if (isMacroProvinceCountryFeature(feature)) continue;
    const bounds = featureBounds(feature);
    if (!bounds || !boundsIntersects(bounds, visibleBounds)) continue;
    const countryId = provinceCountryKey(feature) || "unknown";
    const area = featureProjectedArea(feature, project);
    if (!groups.has(countryId)) groups.set(countryId, { totalArea: 0, features: [] });
    const group = groups.get(countryId);
    group.totalArea += area;
    group.features.push({ feature, area });
  }

  const selected = [];
  for (const group of groups.values()) {
    const cap = strategicRegionCap(group.totalArea);
    group.features
      .sort((a, b) => b.area - a.area)
      .slice(0, cap)
      .forEach((entry) => selected.push(entry.feature));
  }

  return selected;
}

function provinceDensityCap(totalArea, step) {
  if (step === "tactical") {
    if (totalArea > 76000) return 34;
    if (totalArea > 42000) return 28;
    if (totalArea > 18500) return 18;
    if (totalArea > 7600) return 11;
    if (totalArea > 2600) return 7;
    if (totalArea > 900) return 4;
    return 2;
  }

  if (totalArea > 76000) return 22;
  if (totalArea > 42000) return 18;
  if (totalArea > 18500) return 12;
  if (totalArea > 7600) return 8;
  if (totalArea > 2600) return 5;
  if (totalArea > 900) return 3;
  return 2;
}

function balancedProvinceSubset(features, visibleBounds, step) {
  const project = createDebugProjection();
  const groups = new Map();

  for (const feature of features) {
    if (isMacroProvinceCountryFeature(feature)) continue;
    const bounds = featureBounds(feature);
    if (!bounds || !boundsIntersects(bounds, visibleBounds)) continue;
    const countryId = provinceCountryKey(feature) || "unknown";
    const area = featureProjectedArea(feature, project);
    if (!groups.has(countryId)) groups.set(countryId, { totalArea: 0, features: [] });
    const group = groups.get(countryId);
    group.totalArea += area;
    group.features.push({ feature, area });
  }

  const selected = [];
  for (const group of groups.values()) {
    const cap = provinceDensityCap(group.totalArea, step);
    group.features
      .sort((a, b) => b.area - a.area)
      .slice(0, cap)
      .forEach((entry) => selected.push(entry.feature));
  }

  return selected;
}

function mapLibreVisibleBounds(paddingDegrees = 6) {
  if (!appState.mapLibreMap) {
    return {
      minLng: debugProjectionBounds.minLng,
      maxLng: debugProjectionBounds.maxLng,
      minLat: debugProjectionBounds.minLat,
      maxLat: debugProjectionBounds.maxLat,
    };
  }
  const bounds = appState.mapLibreMap.getBounds();
  return {
    minLng: bounds.getWest() - paddingDegrees,
    maxLng: bounds.getEast() + paddingDegrees,
    minLat: bounds.getSouth() - paddingDegrees,
    maxLat: bounds.getNorth() + paddingDegrees,
  };
}

function lineIntersectsBounds(line, bounds) {
  if (!line || !Array.isArray(line.path)) return false;
  for (const [lng, lat] of line.path) {
    if (lng >= bounds.minLng && lng <= bounds.maxLng && lat >= bounds.minLat && lat <= bounds.maxLat) return true;
  }
  const lngs = line.path.map((point) => point[0]);
  const lats = line.path.map((point) => point[1]);
  return boundsIntersects(
    {
      minLng: Math.min(...lngs),
      maxLng: Math.max(...lngs),
      minLat: Math.min(...lats),
      maxLat: Math.max(...lats),
    },
    bounds
  );
}

function deckVisibleProvinceFeatures(allProvinceFeatures, step) {
  const visibleBounds = mapLibreVisibleBounds(step === "countries" ? 14 : step === "capitals" ? 8 : 4);
  const generatedMacroProvinces = allProvinceFeatures.some((feature) => feature && feature.properties && feature.properties.macroProvince);
  if (generatedMacroProvinces) {
    const visible = allProvinceFeatures.filter((feature) => {
      const bounds = featureBounds(feature);
      return bounds && boundsIntersects(bounds, visibleBounds);
    });
    if (step === "world") return visible.slice(0, 2200);
    if (step === "countries") return visible.slice(0, 2400);
    if (step === "capitals") return visible.slice(0, 2800);
    if (step === "tactical") return visible.slice(0, 3400);
  }
  if (step === "world") return strategicProvinceSubset(allProvinceFeatures, visibleBounds).slice(0, 1200);
  if (step === "countries") return strategicProvinceSubset(allProvinceFeatures, visibleBounds).slice(0, 900);
  if (step === "capitals") return balancedProvinceSubset(allProvinceFeatures, visibleBounds, step).slice(0, 1400);
  if (step === "tactical") return balancedProvinceSubset(allProvinceFeatures, visibleBounds, step).slice(0, 3000);

  const project = createDebugProjection();
  const areaThreshold = step === "capitals" ? 520 : 0;
  const maxFeatures = step === "capitals" ? 1600 : 4200;

  return allProvinceFeatures
    .filter((feature) => {
      const bounds = featureBounds(feature);
      if (!bounds || !boundsIntersects(bounds, visibleBounds)) return false;
      if (areaThreshold <= 0) return true;
      return featureProjectedArea(feature, project) >= areaThreshold;
    })
    .slice(0, maxFeatures);
}

function deckProvinceLabelData(provinceFeatures, step = "tactical") {
  const areaThreshold = step === "capitals" ? 2600 : 850;
  const maxLabels = step === "capitals" ? 160 : 450;
  return provinceFeatures
    .filter((feature) => featureProjectedArea(feature, createDebugProjection()) > areaThreshold)
    .slice(0, maxLabels)
    .map((feature, index) => {
      const center = featureCenter(feature);
      return {
        id: debugFeatureId(feature, index),
        label: debugFeatureName(feature).toUpperCase(),
        position: [center.lng, center.lat],
        priority: provinceLabelPriority(feature),
      };
    });
}

function setDeckFeatureSelection(info) {
  const feature = info && info.object;
  if (!feature) return;
  const province = provinceFromFeature(feature, info.index || 0);
  if (!province) return;
  if (appState.selectedMovementUnitId && appState.selectedUnitCommandMode === "attack") {
    logAttackTarget({ province });
    return;
  }
  if (appState.selectedMovementUnitId) {
    issueMoveOrderToProvince(province);
    appState.deckLayerSignature = "";
    updateDeckStrategyLayers();
    return;
  }
  const id = province ? province.id : debugFeatureId(feature, info.index || 0);
  const name = province ? province.name : debugFeatureName(feature);
  appState.selectedMovementUnitId = null;
  appState.selectedUnitCommandMode = null;
  appState.selectedUnitStackIds = [];
  appState.movementRoutePreview = null;
  if (appState.selectedProvince) appState.selectedProvince.selected = false;
  if (appState.provinceEngine) {
    appState.provinceEngine.provinces.forEach((entry) => { entry.selected = false; });
  }
  province.selected = true;
  appState.selectedProvince = province;
  appState.deckSelectedFeatureId = id;
  appState.debugSelectedProvinceId = id;
  appState.debugSelectedProvinceName = name;
  appState.deckLayerSignature = "";
  renderDebugProvinceCommand();
  updateDeckStrategyLayers();
}

function provinceTooltipElement() {
  if (appState.provinceTooltip) return appState.provinceTooltip;
  const tooltip = document.createElement("div");
  tooltip.className = "province-tooltip";
  tooltip.hidden = true;
  const parent = (mapLibreMapContainer && mapLibreMapContainer.closest(".map-shell")) || document.body;
  parent.appendChild(tooltip);
  appState.provinceTooltip = tooltip;
  return tooltip;
}

function showProvinceTooltip(province, point) {
  if (!province || !point) return;
  const tooltip = provinceTooltipElement();
  tooltip.innerHTML = `
    <strong>${province.name}</strong>
    <span>${province.ownerName} / ${province.terrain}</span>
    <small>${province.capital.name} / ${provinceResourceSummary(province.resources)}</small>
  `;
  tooltip.style.left = `${Math.round(point.x + 14)}px`;
  tooltip.style.top = `${Math.round(point.y + 14)}px`;
  tooltip.hidden = false;
}

function hideProvinceTooltip() {
  if (appState.provinceTooltip) appState.provinceTooltip.hidden = true;
  clearMovementRoutePreview();
  if (appState.mapLibreMap && appState.mapLibreMap.getCanvas()) {
    appState.mapLibreMap.getCanvas().style.cursor = "";
  }
  if (appState.deckHoveredFeatureId && appState.provinceEngine) {
    const previous = appState.provinceEngine.byId.get(appState.deckHoveredFeatureId);
    if (previous) previous.hovered = false;
  }
  appState.deckHoveredFeatureId = null;
}

function setDeckProvinceHover(info, point) {
  const feature = info && info.object;
  if (!feature) {
    hideProvinceTooltip();
    return;
  }
  const province = provinceFromFeature(feature, info.index || 0);
  if (!province) {
    hideProvinceTooltip();
    return;
  }
  if (appState.deckHoveredFeatureId && appState.deckHoveredFeatureId !== province.id && appState.provinceEngine) {
    const previous = appState.provinceEngine.byId.get(appState.deckHoveredFeatureId);
    if (previous) previous.hovered = false;
  }
  province.hovered = true;
  appState.deckHoveredFeatureId = province.id;
  if (appState.mapLibreMap && appState.mapLibreMap.getCanvas()) {
    appState.mapLibreMap.getCanvas().style.cursor = "pointer";
  }
  updateMovementRoutePreview(province);
  showProvinceTooltip(province, point);
}

function handleDeckMapHover(event) {
  if (!appState.deckInstance || !event || !event.point) return;
  appState.pendingProvinceHoverPoint = {
    x: event.point.x,
    y: event.point.y,
  };
  if (appState.provinceHoverFrame) return;
  appState.provinceHoverFrame = requestAnimationFrame(() => {
    appState.provinceHoverFrame = null;
    const point = appState.pendingProvinceHoverPoint;
    if (!point || !appState.deckInstance) return;
    const picked = appState.deckInstance.pickObject({
      x: point.x,
      y: point.y,
      radius: 4,
      layerIds: ["wm-province-borders"],
    });
    setDeckProvinceHover(picked, point);
  });
}

function deckVisibleUnitData(step) {
  const visibleBounds = mapLibreVisibleBounds(4);
  return deckUnitData(step)
    .filter((unit) => unit.coords[0] >= visibleBounds.minLng && unit.coords[0] <= visibleBounds.maxLng && unit.coords[1] >= visibleBounds.minLat && unit.coords[1] <= visibleBounds.maxLat);
}

function deckUnitDataSignature(unitData) {
  return unitData
    .map((unit) => [
      unit.id,
      unit.selected ? 1 : 0,
      unit.moving ? 1 : 0,
      unit.stackCount || 1,
      Math.round((unit.coords[0] || 0) * 10000),
      Math.round((unit.coords[1] || 0) * 10000),
      Math.round(unit.heading || 0),
    ].join(":"))
    .join("|");
}

function createDeckUnitLayers(unitData) {
  return [
    new deck.ScatterplotLayer({
      id: "wm-unit-selection-rings",
      data: unitData.filter((unit) => unit.selected),
      visible: true,
      getPosition: (unit) => unit.coords,
      getRadius: (unit) => 39000 + ((unit.idlePulse || 0) * 3200),
      radiusUnits: "meters",
      stroked: true,
      filled: true,
      getFillColor: [210, 246, 176, 28],
      getLineColor: [244, 255, 222, 248],
      getLineWidth: 2.6,
      lineWidthUnits: "pixels",
      pickable: false,
    }),
    new deck.IconLayer({
      id: "wm-unit-shadows",
      data: unitData,
      visible: true,
      getPosition: (unit) => unit.coords,
      getIcon: () => unitShadowIcon,
      getSize: unitShadowSize,
      getAngle: (unit) => unit.heading || 0,
      getPixelOffset: (unit) => [0, 7 + (unit.selected ? 1 : 0)],
      sizeUnits: "pixels",
      billboard: true,
      pickable: false,
    }),
    new deck.IconLayer({
      id: "wm-unit-icons",
      data: unitData,
      visible: true,
      getPosition: (unit) => unit.coords,
      getIcon: unitVisualIcon,
      getSize: unitVisualSize,
      getAngle: (unit) => unit.heading || 0,
      sizeUnits: "pixels",
      billboard: true,
      pickable: true,
      onClick: (info) => {
        if (info && info.object) handleUnitMapClick(info.object);
      },
    }),
    new deck.TextLayer({
      id: "wm-unit-stack-counts",
      data: unitData.filter((unit) => unit.stackCount > 1),
      visible: true,
      getPosition: (unit) => unit.coords,
      getText: (unit) => String(unit.stackCount),
      getSize: 11,
      getColor: [248, 252, 236, 245],
      sizeUnits: "pixels",
      fontFamily: "Inter, Rajdhani, sans-serif",
      fontWeight: 800,
      getPixelOffset: [13, -15],
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
      background: true,
      getBackgroundColor: [8, 13, 12, 214],
      backgroundPadding: [3, 2],
      outlineWidth: 1.5,
      outlineColor: [0, 0, 0, 220],
      pickable: false,
    }),
  ];
}

function updateDeckUnitLayers() {
  if (!appState.deckInstance || !appState.mapLibreMap || !appState.debugMapData || !appState.deckCurrentLayers.length) return false;
  const step = deckZoomStep();
  const unitData = deckVisibleUnitData(step);
  const signature = `${step}:${deckUnitDataSignature(unitData)}`;
  if (appState.deckUnitLayerSignature === signature) {
    syncDeckViewState();
    return false;
  }
  appState.deckUnitLayerSignature = signature;
  const unitLayers = createDeckUnitLayers(unitData);
  const unitLayerById = new Map(unitLayers.map((layer) => [layer.id, layer]));
  const nextLayers = appState.deckCurrentLayers.map((layer) => unitLayerById.get(layer.id) || layer);
  appState.deckCurrentLayers = nextLayers;
  appState.deckInstance.setProps({
    viewState: mapLibreDeckViewState(),
    layers: nextLayers,
  });
  return true;
}

function updateDeckStrategyLayers() {
  if (!appState.deckInstance || !appState.mapLibreMap || !appState.debugMapData) return;

  const data = appState.debugMapData;
  const step = deckZoomStep();
  const cache = buildDeckFeatureCache(data);
  const countryFeatures = deckCountriesForStep(cache, step);
  const provinceFeatures = deckVisibleProvinceFeatures(deckProvinceSourceForStep(cache, step), step);
  const visibleBounds = mapLibreVisibleBounds(step === "countries" ? 14 : step === "capitals" ? 8 : 4);
  const macroLabelData = (step === "capitals" || step === "tactical")
    ? cache.macroProvinceLabels.filter((label) => label.position[0] >= visibleBounds.minLng && label.position[0] <= visibleBounds.maxLng && label.position[1] >= visibleBounds.minLat && label.position[1] <= visibleBounds.maxLat)
    : [];
  const showCapitals = step !== "world";
  const showProvinces = true;
  const showProvinceLabels = step === "tactical";
  const movementPreviewRoutes = deckMovementRoutePreviewData()
    .filter((route) => lineIntersectsBounds(route, visibleBounds));
  const movementRoutes = deckMovementRouteData()
    .filter((route) => lineIntersectsBounds(route, visibleBounds));
  const unitData = deckUnitData(step)
    .filter((unit) => unit.coords[0] >= visibleBounds.minLng && unit.coords[0] <= visibleBounds.maxLng && unit.coords[1] >= visibleBounds.minLat && unit.coords[1] <= visibleBounds.maxLat);
  logRenderedUnits(unitData);
  ensureUnitVisualAnimation();
  const collisionExtensions = appState.deckCollisionExtension || [];
  const bounds = mapLibreVisibleBounds(0);
  const signature = `${step}:${appState.deckSelectedFeatureId || ""}:${provinceFeatures.length}:${macroLabelData.length}:${unitData.length}:${movementPreviewRoutes.length}:${movementRoutes.length}:${movementLayerSignature()}:${Math.round(bounds.minLng)}:${Math.round(bounds.maxLng)}:${Math.round(bounds.minLat)}:${Math.round(bounds.maxLat)}`;
  if (appState.deckLayerSignature === signature) {
    syncDeckViewState();
    return;
  }
  appState.deckLayerSignature = signature;

  const layers = [
    new deck.GeoJsonLayer({
      id: "wm-country-terrain",
      data: countryFeatures,
      stroked: false,
      filled: true,
      getFillColor: deckCountryColor,
      opacity: 0.44,
      pickable: true,
      autoHighlight: true,
      highlightColor: [240, 245, 230, 26],
      onClick: (info) => {
        if (!info.object) return;
        appState.deckSelectedFeatureId = deckFeatureId(info.object, info.index || 0);
        updateDeckStrategyLayers();
      },
    }),
    new deck.GeoJsonLayer({
      id: "wm-province-borders",
      data: provinceFeatures,
      stroked: showProvinces,
      filled: true,
      getFillColor: (feature, info) => provinceFillColor(feature, info && Number.isFinite(info.index) ? info.index : 0, step),
      getLineColor: (feature, info) => provinceLineColor(feature, info && Number.isFinite(info.index) ? info.index : 0, step),
      getLineWidth: (feature, info) => provinceLineWidth(feature, info && Number.isFinite(info.index) ? info.index : 0, step),
      lineWidthUnits: "pixels",
      pickable: true,
      autoHighlight: true,
      highlightColor: [235, 242, 224, 36],
      onClick: setDeckFeatureSelection,
      onHover: (info) => {
        if (!info || !info.object) return;
        setDeckProvinceHover(info, { x: info.x || 0, y: info.y || 0 });
      },
    }),
    new deck.PathLayer({
      id: "wm-movement-route-shadows",
      data: movementRoutes,
      getPath: (route) => route.path,
      getColor: [0, 0, 0, 72],
      getWidth: 3.2,
      widthUnits: "pixels",
      rounded: true,
      pickable: false,
    }),
    new deck.PathLayer({
      id: "wm-movement-route-preview",
      data: movementPreviewRoutes,
      getPath: (route) => route.path,
      getColor: [232, 238, 204, 116],
      getWidth: 1.05,
      widthUnits: "pixels",
      rounded: true,
      pickable: false,
    }),
    new deck.PathLayer({
      id: "wm-movement-routes",
      data: movementRoutes,
      getPath: (route) => route.path,
      getColor: [176, 228, 156, 172],
      getWidth: 1.35,
      widthUnits: "pixels",
      rounded: true,
      pickable: false,
    }),
    new deck.GeoJsonLayer({
      id: "wm-country-borders",
      data: countryFeatures,
      stroked: true,
      filled: false,
      getLineColor: (feature) => {
        const selected = appState.deckSelectedFeatureId && appState.deckSelectedFeatureId === deckFeatureId(feature, 0);
        return selected ? [255, 250, 222, 238] : deckRelationColor(feature, step === "world" ? 238 : 224);
      },
      getLineWidth: (feature) => {
        const selected = appState.deckSelectedFeatureId && appState.deckSelectedFeatureId === deckFeatureId(feature, 0);
        return selected ? 2.42 : step === "world" ? 2.06 : 1.76;
      },
      lineWidthUnits: "pixels",
      pickable: false,
    }),
    new deck.TextLayer({
      id: "wm-country-labels",
      data: cache.countryLabels[step] || cache.countryLabels.countries,
      getPosition: (item) => item.position,
      getText: (item) => item.label,
      getSize: (item) => item.size * (item.tier === 1 ? 1.1 : item.tier === 2 ? 1.08 : 0.9) * (step === "countries" ? 1.12 : 1.02),
      getColor: (item) => [248, 250, 243, item.tier === 1 ? 246 : item.tier === 2 ? 232 : 182],
      getAngle: 0,
      sizeUnits: "pixels",
      fontFamily: "Barlow Condensed, Rajdhani, Oswald, sans-serif",
      fontWeight: 800,
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
      outlineWidth: (item) => item.tier === 1 ? 3.5 : item.tier === 2 ? 2.7 : 1.9,
      outlineColor: [0, 3, 5, step === "countries" ? 232 : 210],
      background: false,
      collisionEnabled: true,
      getCollisionPriority: (item) => item.priority,
      extensions: collisionExtensions,
      pickable: false,
    }),
    new deck.ScatterplotLayer({
      id: "wm-city-glow",
      data: deckNodeData(step),
      visible: showCapitals,
      getPosition: (city) => city.coords,
      getRadius: (city) => cityMarkerRadius(city) * 0.62,
      radiusUnits: "meters",
      getFillColor: (city) => {
        const color = cityMarkerFill(city);
        return [color[0], color[1], color[2], Math.round(color[3] * 0.28)];
      },
      getLineColor: [0, 0, 0, 0],
      lineWidthUnits: "pixels",
      getLineWidth: 0,
      stroked: false,
      filled: true,
      pickable: false,
    }),
    new deck.IconLayer({
      id: "wm-city-icons",
      data: deckNodeData(step),
      visible: showCapitals,
      getPosition: (city) => city.coords,
      getIcon: cityMarkerIcon,
      getColor: cityIconColor,
      getSize: cityIconSize,
      sizeUnits: "pixels",
      pickable: false,
    }),
    new deck.TextLayer({
      id: "wm-city-labels",
      data: deckNodeData(step),
      visible: showCapitals,
      getPosition: (city) => city.coords,
      getText: (city) => city.name,
      getSize: cityLabelSize,
      getColor: cityLabelColor,
      sizeUnits: "pixels",
      fontFamily: "Inter, Rajdhani, sans-serif",
      fontWeight: 600,
      getPixelOffset: (city) => [city.label ? city.label.x : 10, city.label ? city.label.y : 6],
      getTextAnchor: (city) => city.label ? city.label.anchor : "start",
      getAlignmentBaseline: "center",
      outlineWidth: 2,
      outlineColor: [0, 0, 0, 190],
      collisionEnabled: true,
      getCollisionPriority: (city) => 44 - (city.priority || 4),
      extensions: collisionExtensions,
      pickable: false,
    }),
    new deck.ScatterplotLayer({
      id: "wm-unit-selection-rings",
      data: unitData.filter((unit) => unit.selected),
      visible: true,
      getPosition: (unit) => unit.coords,
      getRadius: (unit) => 39000 + ((unit.idlePulse || 0) * 3200),
      radiusUnits: "meters",
      stroked: true,
      filled: true,
      getFillColor: [210, 246, 176, 28],
      getLineColor: [244, 255, 222, 248],
      getLineWidth: 2.6,
      lineWidthUnits: "pixels",
      pickable: false,
    }),
    new deck.IconLayer({
      id: "wm-unit-shadows",
      data: unitData,
      visible: true,
      getPosition: (unit) => unit.coords,
      getIcon: () => unitShadowIcon,
      getSize: unitShadowSize,
      getAngle: (unit) => unit.heading || 0,
      getPixelOffset: (unit) => [0, 7 + (unit.selected ? 1 : 0)],
      sizeUnits: "pixels",
      billboard: true,
      pickable: false,
    }),
    new deck.IconLayer({
      id: "wm-unit-icons",
      data: unitData,
      visible: true,
      getPosition: (unit) => unit.coords,
      getIcon: unitVisualIcon,
      getSize: unitVisualSize,
      getAngle: (unit) => unit.heading || 0,
      sizeUnits: "pixels",
      billboard: true,
      pickable: true,
      onClick: (info) => {
        if (info && info.object) handleUnitMapClick(info.object);
      },
    }),
    new deck.TextLayer({
      id: "wm-unit-stack-counts",
      data: unitData.filter((unit) => unit.stackCount > 1),
      visible: true,
      getPosition: (unit) => unit.coords,
      getText: (unit) => String(unit.stackCount),
      getSize: 11,
      getColor: [248, 252, 236, 245],
      sizeUnits: "pixels",
      fontFamily: "Inter, Rajdhani, sans-serif",
      fontWeight: 800,
      getPixelOffset: [13, -15],
      getTextAnchor: "middle",
      getAlignmentBaseline: "center",
      background: true,
      getBackgroundColor: [8, 13, 12, 214],
      backgroundPadding: [3, 2],
      outlineWidth: 1.5,
      outlineColor: [0, 0, 0, 220],
      pickable: false,
    }),
    new deck.TextLayer({
      id: "wm-macro-province-labels",
      data: macroLabelData,
      getPosition: (item) => item.position,
      getText: (item) => item.label,
      getSize: step === "tactical" ? 9.5 : 8.2,
      getColor: [224, 231, 220, step === "tactical" ? 132 : 98],
      sizeUnits: "pixels",
      fontFamily: "Rajdhani, sans-serif",
      fontWeight: 700,
      outlineWidth: 2,
      outlineColor: [0, 0, 0, 168],
      collisionEnabled: true,
      getCollisionPriority: (item) => item.priority,
      extensions: collisionExtensions,
      pickable: false,
    }),
    new deck.TextLayer({
      id: "wm-province-labels",
      data: showProvinceLabels ? deckProvinceLabelData(provinceFeatures, step) : [],
      getPosition: (item) => item.position,
      getText: (item) => item.label,
      getSize: step === "capitals" ? 8 : 9,
      getColor: [220, 226, 216, step === "capitals" ? 92 : 120],
      sizeUnits: "pixels",
      fontFamily: "Rajdhani, sans-serif",
      fontWeight: 600,
      outlineWidth: 2,
      outlineColor: [0, 0, 0, 160],
      collisionEnabled: true,
      getCollisionPriority: (item) => item.priority,
      extensions: collisionExtensions,
      pickable: false,
    }),
  ];

  appState.deckInstance.setProps({
    viewState: mapLibreDeckViewState(),
    layers,
  });
  appState.deckCurrentLayers = layers;
  appState.deckUnitLayerSignature = `${step}:${deckUnitDataSignature(unitData)}`;
}

function loadProjectionDebugData() {
  if (appState.debugMapLoading) return;
  appState.debugMapLoading = true;

  Promise.all([
    fetch(mapSources.countries).then((response) => {
      if (!response.ok) throw new Error("Could not load country GeoJSON.");
      return response.json();
    }),
    fetch(mapSources.provinces).then((response) => {
      if (!response.ok) throw new Error("Could not load province GeoJSON.");
      return response.json();
    }),
  ])
    .then(([countries, provinces]) => {
      appState.debugMapData = { countries, provinces };
      appState.debugMapLoading = false;
      if (window.maplibregl && window.deck && mapLibreMapContainer && deckOverlayContainer) {
        renderMapLibreDeckMap();
      } else {
        renderMapError("Map engine did not load. Debug map fallback is disabled.");
      }
    })
    .catch((error) => {
      appState.debugMapError = `${error.message} Projection debug map cannot run.`;
      appState.debugMapLoading = false;
      renderProjectionDebugMap();
    });
}

function renderProjectionDebugLoading() {
  gameMap.innerHTML = `
    <rect class="map-status-bg" x="0" y="0" width="1000" height="620"></rect>
    <text class="map-status-title" x="500" y="300">Projection debug map</text>
    <text class="map-status-copy" x="500" y="330">Loading GeoJSON paths and six fixed city markers</text>
  `;
}

function buildProjectionDebugSvg() {
  const data = appState.debugMapData;
  if (!data) return;

  gameMap.innerHTML = "";
  gameMap.hidden = false;
  const project = createDebugProjection();
  const rootGroup = svgEl("g", { id: "debug-map-content", class: "debug-map-content" });
  const provinceGroup = svgEl("g", { class: "debug-provinces" });
  const countryGroup = svgEl("g", { class: "debug-countries" });
  const countryBorderGroup = svgEl("g", { class: "debug-country-borders" });
  const countryLabelGroup = svgEl("g", { class: "debug-country-labels" });
  const markerGroup = svgEl("g", { class: "debug-city-markers" });
  const panelGroup = svgEl("g", { class: "debug-panel" });

  const provinceFeatures = (data.provinces.features || []).filter(featureIntersectsDebugBounds);
  const countryFeatures = (data.countries.features || []).filter(featureIntersectsDebugBounds);
  const fragment = document.createDocumentFragment();
  drawTerrainCanvas(countryFeatures, project);

  provinceFeatures.forEach((feature, index) => {
    const path = featurePath(feature, project);
    if (!path) return;
    const id = debugFeatureId(feature, index);
    const name = debugFeatureName(feature);
    const area = featureProjectedArea(feature, project);
    const countryId = provinceCountryId(feature);
    const country = countryId && appState.game && appState.game.countries[countryId];
    const relation = country ? country.relation : "neutral";
    const provincePath = svgEl("path", {
      d: path,
      class: `debug-province-path relation-${relation}${area < 190 ? " tiny" : ""}`,
      "data-province-id": id,
      "data-province-name": name,
      tabindex: 0,
    });
    provincePath.addEventListener("click", (event) => {
      event.stopPropagation();
      setDebugProvinceSelection(provincePath, name, id);
    });
    provincePath.addEventListener("keydown", (event) => {
      if (event.key !== "Enter" && event.key !== " ") return;
      event.preventDefault();
      setDebugProvinceSelection(provincePath, name, id);
    });
    fragment.appendChild(provincePath);
  });
  provinceGroup.appendChild(fragment);

  for (const feature of countryFeatures) {
    const path = featurePath(feature, project);
    if (!path) continue;
    const countryId = countryIdFromFeature(feature);
    const country = countryId && appState.game && appState.game.countries[countryId];
    const relation = country ? country.relation : "neutral";
    countryGroup.appendChild(svgEl("path", { d: path, class: `debug-country-fill-path relation-${relation}` }));
    countryBorderGroup.appendChild(svgEl("path", { d: path, class: `debug-country-path relation-${relation}` }));

    const [labelX, labelY] = project(countryLabelAnchor(feature));
    const label = svgEl("text", {
      x: labelX.toFixed(2),
      y: labelY.toFixed(2),
      class: countryLabelClass(feature, project),
      style: countryLabelStyle(feature, project),
    });
    const lines = countryLabelLines(feature);
    if (lines.length === 1) {
      label.textContent = lines[0];
    } else {
      lines.forEach((line, index) => {
        const tspan = svgEl("tspan", {
          x: labelX.toFixed(2),
          dy: index === 0 ? `${(-0.52 * (lines.length - 1)).toFixed(2)}em` : "1.08em",
        });
        tspan.textContent = line;
        label.appendChild(tspan);
      });
    }
    countryLabelGroup.appendChild(label);
  }

  for (const city of debugCities) {
    const [x, y] = project(city.coords);
    const country = city.country && appState.game && appState.game.countries[city.country];
    const relation = country ? country.relation : "neutral";
    const group = svgEl("g", {
      class: `debug-city node-${city.type || "city"} relation-${relation}${city.tier ? ` capital-tier-${city.tier}` : ""} priority-${city.priority || 3}`,
      transform: `translate(${x.toFixed(2)} ${y.toFixed(2)})`,
    });
    const isCapital = city.type === "capital";
    const isResource = city.type === "resource";
    const tierBoost = isCapital ? Math.max(0, 4 - (city.tier || 3)) : 0;
    const labelOffset = city.label || { x: isCapital ? 13 : 10, y: 4, anchor: "start" };
    if (isCapital && city.tier === 1) {
      group.appendChild(svgEl("circle", { r: 10.8, class: "debug-influence-ring" }));
    }
    group.appendChild(svgEl("circle", { r: isCapital ? 5.4 + (tierBoost * 0.45) : isResource ? 4.5 : 4.1, class: "debug-city-aura" }));
    group.appendChild(svgEl("circle", { r: isCapital ? 2.35 + (tierBoost * 0.2) : isResource ? 2.35 : 2.2, class: "debug-city-dot" }));
    group.appendChild(svgEl("circle", { r: isCapital ? 5.4 + (tierBoost * 0.45) : isResource ? 4.7 : 4.3, class: "debug-city-ring" }));
    if (isCapital) {
      group.appendChild(svgEl("path", { d: "M0,-4.1 L3.35,0 L0,4.1 L-3.35,0 Z", class: "debug-capital-command-mark" }));
    }
    if (city.badge) {
      const badge = svgEl("text", { y: 2.3, class: "debug-city-badge" });
      badge.textContent = city.badge;
      group.appendChild(badge);
    }
    const label = svgEl("text", {
      x: labelOffset.x,
      y: labelOffset.y,
      class: "debug-city-label",
      "text-anchor": labelOffset.anchor,
    });
    label.textContent = city.name;
    group.appendChild(label);
    markerGroup.appendChild(group);
  }

  rootGroup.appendChild(countryGroup);
  rootGroup.appendChild(provinceGroup);
  rootGroup.appendChild(countryBorderGroup);
  rootGroup.appendChild(countryLabelGroup);
  rootGroup.appendChild(markerGroup);
  gameMap.appendChild(rootGroup);
  panelGroup.appendChild(svgEl("rect", { x: 14, y: 558, width: 300, height: 42, rx: 6, class: "debug-panel-bg" }));
  const selectedText = svgEl("text", { id: "debug-selected-province", x: 28, y: 584, class: "debug-panel-text" });
  selectedText.textContent = `Selected: ${appState.debugSelectedProvinceName}`;
  panelGroup.appendChild(selectedText);
  gameMap.appendChild(panelGroup);

  gameMap.dataset.zoomTier = appState.debugZoomTier;
  gameMap.dataset.zoomStep = appState.debugZoomStep;
  bindProjectionDebugZoom(rootGroup);
  appState.debugMapBuilt = true;
}

function bindProjectionDebugZoom(rootGroup) {
  if (!window.d3) {
    appState.debugMapError = "D3 zoom engine did not load.";
    renderProjectionDebugMap();
    return;
  }

  const svg = window.d3.select(gameMap);
  const content = window.d3.select(rootGroup);
  const initialTransform = debugInitialTheaterTransform();
  const zoom = window.d3.zoom()
    .scaleExtent([debugCamera.minZoom, debugCamera.maxZoom])
    .translateExtent([[-260, -180], [1260, 800]])
    .extent([[0, 0], [1000, 620]])
    .wheelDelta((event) => -event.deltaY * (event.deltaMode === 1 ? 0.014 : 0.00052))
    .filter((event) => {
      if (event.type === "dblclick") return false;
      if (event.type === "wheel") return true;
      return !event.button;
    })
    .on("zoom", (event) => {
      content.attr("transform", event.transform);
      syncTerrainCanvasTransform(event.transform);
      updateDebugZoomTier(event.transform);
    });

  svg.on(".zoom", null);
  svg.call(zoom);
  svg.on("dblclick.zoom", null);
  svg.call(zoom.transform, initialTransform);
  scheduleDebugLabelCollision();
  appState.debugZoom = zoom;
}

function debugInitialTheaterTransform() {
  const project = createDebugProjection();
  const [centerX, centerY] = project(debugCamera.theaterCenter);
  const k = debugCamera.minZoom;
  const [viewX, viewY] = debugCamera.viewportCenter;
  return window.d3.zoomIdentity
    .translate(viewX - (centerX * k), viewY - (centerY * k))
    .scale(k);
}

function relationColor(relation) {
  if (relation === "self") return "#8bd691";
  if (relation === "allied") return "#9fd48b";
  if (relation === "trade" || relation === "peace") return "#6ed3c1";
  if (relation === "war") return "#df6d64";
  return "#d8dfd8";
}

function terrainColorForFeature(feature, countryId) {
  if (countryId && countryTerrainTints[countryId]) return countryTerrainTints[countryId];

  const props = feature.properties || {};
  const continent = props.CONTINENT || props.REGION_UN || "";
  const subregion = props.SUBREGION || props.REGION_WB || "";

  if (/Africa|Middle East|Northern Africa|Western Asia/.test(`${continent} ${subregion}`)) return "#746644";
  if (/Europe/.test(continent)) return "#465b46";
  if (/Asia/.test(continent)) return "#566247";
  if (/North America|South America/.test(continent)) return "#4b6049";
  if (/Oceania/.test(continent)) return "#5c6248";
  return "#475846";
}

function fillColorForCountry(feature, country, relation, countryId) {
  if (!country) return terrainColorForFeature(feature, countryId);
  if (relation === "self") return "#4f8f55";
  if (relation === "allied") return "#667f4e";
  if (relation === "trade" || relation === "peace") return "#3f7773";
  if (relation === "war") return "#803f36";
  return terrainColorForFeature(feature, countryId);
}

function countryIdFromFeature(feature) {
  const props = feature.properties || {};
  const names = [
    props.NAME,
    props.ADMIN,
    props.NAME_LONG,
    props.SOVEREIGNT,
    props.name,
  ];

  for (const name of names) {
    if (countryNameToId[name]) return countryNameToId[name];
  }

  return null;
}

function provinceCountryId(feature) {
  const props = feature.properties || {};
  if (props.ownerId) return props.ownerId;
  const names = [
    props.admin,
    props.ADMIN,
    props.geonunit,
    props.GEONUNIT,
    props.sovereignt,
    props.SOVEREIGNT,
  ];

  for (const name of names) {
    if (countryNameToId[name]) return countryNameToId[name];
  }

  return null;
}

function featureName(feature) {
  const props = feature.properties || {};
  return props.name || props.NAME || props.name_en || props.NAME_EN || props.ADMIN || props.NAME_LONG || "Unknown";
}

function provinceId(feature) {
  const props = feature.properties || {};
  return props.adm1_code || props.ADM1_CODE || props.gn_id || props.name || props.NAME || featureName(feature);
}

function regionCenter(region) {
  if (!region || !region.bounds) return null;
  return [
    (region.bounds[0][0] + region.bounds[1][0]) / 2,
    (region.bounds[0][1] + region.bounds[1][1]) / 2,
  ];
}

function homeRegionForCountry(countryId) {
  if (!appState.game) return null;
  return appState.game.regions.find((region) => region.owner === countryId && region.type === "city") ||
    appState.game.regions.find((region) => region.owner === countryId) ||
    null;
}

function countryForProvince(feature) {
  const countryId = provinceCountryId(feature);
  if (!countryId || !appState.game) return null;
  return appState.game.countries.find((entry) => entry.id === countryId) || null;
}

function initLeafletMap() {
  if (appState.leafletMap || !window.L || !leafletMapContainer) return;

  gameMap.hidden = true;
  leafletMapContainer.hidden = false;
  appState.leafletMap = L.map(leafletMapContainer, {
    worldCopyJump: false,
    zoomControl: true,
    attributionControl: true,
    preferCanvas: true,
    zoomSnap: 0.25,
    zoomDelta: 0.5,
    wheelPxPerZoomLevel: 92,
    minZoom: cameraConfig.minZoom,
    maxZoom: cameraConfig.maxZoom,
    maxBounds: cameraConfig.bounds,
    maxBoundsViscosity: 1.0,
  }).setView(cameraConfig.home, cameraConfig.defaultZoom);

  ensureMapPanes();

  appState.leafletLayers = L.layerGroup().addTo(appState.leafletMap);
  appState.countryLabelLayer = L.layerGroup().addTo(appState.leafletMap);
  appState.provinceLabelLayer = L.layerGroup();
  appState.resourceNodeLayer = L.layerGroup().addTo(appState.leafletMap);
  appState.infrastructureLayer = L.layerGroup().addTo(appState.leafletMap);
  appState.unitLayer = L.layerGroup().addTo(appState.leafletMap);
  appState.cityLayer = L.layerGroup().addTo(appState.leafletMap);
  appState.leafletMap.on("zoomend", updateMapLod);
}

function ensureMapPanes() {
  const panes = {
    countryLabelPane: 610,
    infrastructurePane: 620,
    resourcePane: 630,
    cityPane: 650,
    unitPane: 670,
    debugPane: 690,
  };

  for (const [paneName, zIndex] of Object.entries(panes)) {
    const pane = appState.leafletMap.getPane(paneName) || appState.leafletMap.createPane(paneName);
    pane.style.zIndex = String(zIndex);
  }
}

function renderGeoMap() {
  if (!window.L || !leafletMapContainer) {
    renderMapError("Leaflet did not load. The map requires the Leaflet map engine.");
    return;
  }

  initLeafletMap();
  if (!appState.leafletMap) {
    renderMapError("Map could not initialize.");
    return;
  }

  if (appState.geoDataError) {
    renderMapError(appState.geoDataError);
    return;
  }

  if (!appState.geoDataLoaded) {
    loadGeoData();
    renderMapLoading();
    return;
  }

  gameMap.hidden = true;
  leafletMapContainer.hidden = false;
  updateCountryStyles();
  updateMapLod();
  setTimeout(() => appState.leafletMap.invalidateSize(), 0);
}

function loadGeoData() {
  if (appState.geoDataLoading) return;
  appState.geoDataLoading = true;

  Promise.all([
    fetch(mapSources.countries).then((response) => {
      if (!response.ok) throw new Error("Could not load Natural Earth country borders.");
      return response.json();
    }),
    fetch(mapSources.provinces).then((response) => {
      if (!response.ok) throw new Error("Could not load Natural Earth province borders.");
      return response.json();
    }),
  ])
    .then(([countries, provinces]) => {
      addGeoLayers(countries, provinces);
      appState.geoDataLoaded = true;
      appState.geoDataLoading = false;
      renderMap();
    })
    .catch((error) => {
      appState.geoDataLoading = false;
      appState.geoDataError = `${error.message} No fake polygon fallback will be shown.`;
      renderMap();
    });
}

function addGeoLayers(countries, provinces) {
  if (appState.provinceLayer) appState.provinceLayer.remove();
  if (appState.countryLayer) appState.countryLayer.remove();
  if (appState.countryBorderLayer) appState.countryBorderLayer.remove();
  if (appState.countryLabelLayer) appState.countryLabelLayer.clearLayers();
  if (appState.provinceLabelLayer) appState.provinceLabelLayer.clearLayers();

  appState.countryLayer = L.geoJSON(countries, {
    style: countryFeatureStyle,
    onEachFeature: (feature, layer) => {
      const countryId = countryIdFromFeature(feature);
      layer.on("click", () => {
        if (!countryId) return;
        const homeRegion = homeRegionForCountry(countryId);
        if (!homeRegion) return;
        appState.selectedProvince = null;
        appState.selectedNodeId = null;
        appState.selectedRegionId = homeRegion.id;
        renderSelectedRegion();
        renderMap();
      });

      layer.bindTooltip(() => {
        const country = countryId && appState.game.countries.find((entry) => entry.id === countryId);
        return country
          ? `<strong>${country.name}</strong><br>${country.claimed ? "Claimed" : "Open"} / ${country.relation}`
          : `<strong>${featureName(feature)}</strong>`;
      }, { sticky: true, direction: "top" });
    },
  }).addTo(appState.leafletMap);

  appState.provinceLayer = L.geoJSON(provinces, {
    filter: (feature) => Boolean(provinceCountryId(feature)),
    interactive: true,
    style: provinceFeatureStyle,
    onEachFeature: (feature, layer) => {
      const countryId = provinceCountryId(feature);
      const name = featureName(feature);

      layer.bindTooltip(() => {
        const country = countryForProvince(feature);
        return `<strong>${name}</strong><br>${country ? country.name : countryIdToGeoName[countryId]} province`;
      }, { sticky: true, direction: "top" });

      layer.on("mouseover", () => {
        layer.setStyle(provinceFeatureStyle(feature, true));
      });

      layer.on("mouseout", () => {
        layer.setStyle(provinceFeatureStyle(feature, false));
      });

      layer.on("click", () => {
        const country = countryForProvince(feature);
        appState.selectedProvince = {
          id: provinceId(feature),
          name,
          countryId,
          countryName: countryIdToGeoName[countryId] || countryId,
          country,
        };
        appState.selectedNodeId = null;
        appState.selectedRegionId = null;
        renderSelectedRegion();
        renderMap();
      });
    },
  }).addTo(appState.leafletMap);

  appState.countryBorderLayer = L.geoJSON(countries, {
    interactive: false,
    style: countryBorderStyle,
  }).addTo(appState.leafletMap);

  renderCountryLabels();
  appState.leafletMap.fitBounds(cameraConfig.bounds, { padding: [8, 8], maxZoom: cameraConfig.defaultZoom });
  appState.leafletMap.setMinZoom(cameraConfig.minZoom);
  appState.leafletMap.setMaxZoom(cameraConfig.maxZoom);
  appState.leafletMap.setView(cameraConfig.home, cameraConfig.defaultZoom);
  appState.leafletMap.panInsideBounds(cameraConfig.bounds);
}

function renderCountryLabels() {
  if (!appState.countryLabelLayer || !appState.game) return;
  appState.countryLabelLayer.clearLayers();

  for (const country of appState.game.countries) {
    const position = countryLabelPositions[country.id];
    if (!position) continue;
    L.marker(position, {
      interactive: false,
      pane: "countryLabelPane",
      icon: L.divIcon({
        className: `country-name-label ${country.relation || "neutral"}`,
        html: `<span>${country.name}</span>`,
        iconSize: [180, 28],
        iconAnchor: [90, 14],
      }),
    }).addTo(appState.countryLabelLayer);
  }
}

function renderProvinceLabels() {
  if (!appState.provinceLabelLayer || !appState.provinceLayer) return;
  appState.provinceLabelLayer.clearLayers();

  const candidates = [];
  appState.provinceLayer.eachLayer((layer) => {
    const feature = layer.feature;
    const countryId = feature && provinceCountryId(feature);
    if (!countryId) return;
    const point = provinceLabelPoint(feature);
    if (!point) return;
    const name = featureName(feature);
    const layerPoint = appState.leafletMap.latLngToLayerPoint(point);
    const width = Math.min(128, Math.max(52, (name.length * 6.1) + 12));
    const height = 18;
    candidates.push({
      name,
      point,
      priority: provinceLabelPriority(feature),
      box: {
        left: layerPoint.x - (width / 2) - 5,
        right: layerPoint.x + (width / 2) + 5,
        top: layerPoint.y - (height / 2) - 4,
        bottom: layerPoint.y + (height / 2) + 4,
      },
      width,
      height,
    });
  });

  const acceptedBoxes = [];
  candidates
    .sort((a, b) => b.priority - a.priority)
    .forEach((candidate) => {
      if (labelBoxesOverlap(candidate.box, acceptedBoxes)) return;
      acceptedBoxes.push(candidate.box);

      L.marker(candidate.point, {
        interactive: false,
        pane: "countryLabelPane",
        icon: L.divIcon({
          className: "province-name-label",
          html: `<span>${candidate.name}</span>`,
          iconSize: [candidate.width, candidate.height],
          iconAnchor: [candidate.width / 2, candidate.height / 2],
        }),
      }).addTo(appState.provinceLabelLayer);
    });
}

function countryFeatureStyle(feature) {
  const countryId = countryIdFromFeature(feature);
  const country = countryId && appState.game.countries.find((entry) => entry.id === countryId);
  const selectedRegion = regionById(appState.selectedRegionId);
  const selected = selectedRegion && selectedRegion.owner === countryId;
  const relation = country ? country.relation : "neutral";
  const borderColor = relationColor(relation);
  const fillColor = fillColorForCountry(feature, country, relation, countryId);
  const tier = cameraTier();

  return {
    color: selected ? "#ffffff" : borderColor,
    weight: selected ? 1.7 : country ? (tier === "world" ? 0.92 : 1.05) : 0.5,
    opacity: country ? (tier === "world" ? 0.82 : 0.7) : 0.34,
    fillColor,
    fillOpacity: country ? (selected ? 0.44 : tier === "world" ? 0.25 : 0.31) : 0.15,
    className: country ? "strategy-country selectable-country" : "strategy-country",
  };
}

function countryBorderStyle(feature) {
  const countryId = countryIdFromFeature(feature);
  const country = countryId && appState.game.countries.find((entry) => entry.id === countryId);
  const relation = country ? country.relation : "neutral";
  const selectedProvince = appState.selectedProvince;
  const selected = selectedProvince && selectedProvince.countryId === countryId;
  const tier = cameraTier();

  return {
    color: selected ? "#ffffff" : relationColor(relation),
    weight: selected ? 3.1 : country ? (tier === "world" ? 2.35 : 2.15) : 1.15,
    opacity: country ? (tier === "world" ? 0.98 : 0.96) : 0.42,
    fillOpacity: 0,
    className: "strategy-country-border",
  };
}

function updateCountryStyles() {
  if (appState.countryLayer) appState.countryLayer.setStyle(countryFeatureStyle);
  if (appState.countryBorderLayer) appState.countryBorderLayer.setStyle(countryBorderStyle);
}

function provinceFeatureStyle(feature, hover = false) {
  const zoom = currentZoom();
  const tier = cameraTier();
  const countryId = feature ? provinceCountryId(feature) : null;
  const country = feature ? countryForProvince(feature) : null;
  const selected = appState.selectedProvince && appState.selectedProvince.id === provinceId(feature);
  const relation = country ? country.relation : "neutral";
  const color = relationColor(relation);
  const strong = zoom >= 4;
  const visible = tier !== "world" || selected || hover;

  return {
    color: hover || selected ? "#ffffff" : "rgba(236, 241, 229, 0.42)",
    weight: hover || selected ? 1.25 : tier === "world" ? 0.28 : strong ? 0.72 : 0.58,
    opacity: hover || selected ? 0.96 : visible ? 0.74 : 0.0,
    fillColor: countryTerrainTints[countryId] || color,
    fillOpacity: selected ? 0.22 : hover ? 0.18 : tier === "world" ? 0.01 : 0.055,
    className: selected ? "strategy-province-border selected-province" : "strategy-province-border",
  };
}

function updateProvinceStyles() {
  if (appState.provinceLayer) appState.provinceLayer.setStyle(provinceFeatureStyle);
}

function updateMapLod() {
  const tier = cameraTier();
  if (leafletMapContainer) leafletMapContainer.dataset.zoomTier = tier;
  updateCountryStyles();
  updateProvinceStyles();
  if (tier === "province") renderProvinceLabels();
  if (tier !== "province" && appState.provinceLabelLayer) appState.provinceLabelLayer.clearLayers();
  setLayerVisible(appState.countryLabelLayer, tier === "world" || tier === "regional");
  setLayerVisible(appState.provinceLabelLayer, tier === "province");
  setLayerVisible(appState.cityLayer, true);
  setLayerVisible(appState.resourceNodeLayer, tier !== "world");
  setLayerVisible(appState.infrastructureLayer, tier === "province");
  setLayerVisible(appState.unitLayer, tier !== "world");
  renderGeoMarkers();
}

function renderGeoMarkers() {
  if (!appState.unitLayer || !appState.cityLayer || !appState.resourceNodeLayer || !appState.infrastructureLayer) return;
  const tier = cameraTier();
  appState.unitLayer.clearLayers();
  appState.cityLayer.clearLayers();
  appState.resourceNodeLayer.clearLayers();
  appState.infrastructureLayer.clearLayers();

  (appState.game.strategicNodes || []).forEach((node) => {
    const selected = appState.selectedNodeId === node.id;
    if (!selected && !nodeVisibleAtTier(node, tier)) return;
    const nodeFeature = nodeGeoJsonFeature(node);
    if (!nodeFeature) return;

    const label = nodeKindLabels[node.kind] || "Strategic Node";
    const badge = nodeKindBadges[node.kind] || "NODE";
    const markerClass = strategicNodeClass(node, selected, tier);
    const nodeLayer = ["capital", "city", "money"].includes(node.kind)
      ? appState.cityLayer
      : ["oil", "steel", "electronics", "rare"].includes(node.kind)
        ? appState.resourceNodeLayer
        : appState.infrastructureLayer;
    const markerPane = ["capital", "city", "money"].includes(node.kind)
      ? "cityPane"
      : ["oil", "steel", "electronics", "rare"].includes(node.kind)
        ? "resourcePane"
        : "infrastructurePane";
    const metrics = nodeIconMetrics(node, tier);

    L.geoJSON(nodeFeature, {
      pointToLayer: (feature, latLng) => L.marker(latLng, {
        interactive: true,
        pane: markerPane,
        icon: L.divIcon({
          className: markerClass,
          html: `<span>${badge}</span><strong>${node.name}</strong>`,
          iconSize: metrics.size,
          iconAnchor: metrics.anchor,
        }),
      }),
    })
        .bindTooltip(`<strong>${node.name}</strong><br>${label} / ${resourceOutputText(node.output)}`, { sticky: true, direction: "top" })
        .on("click", () => {
          appState.selectedProvince = null;
          appState.selectedRegionId = null;
          appState.selectedNodeId = node.id;
          renderSelectedRegion();
          renderMap();
        })
        .addTo(nodeLayer);
  });

  appState.game.units
    .filter((unit) => tier !== "world" && !unit.toRegionId)
    .forEach((unit) => {
      const region = regionById(unit.regionId);
      const center = regionCenter(region);
      if (!center) return;
      L.marker(center, {
        pane: "unitPane",
        icon: L.divIcon({
          className: `unit-marker ${unit.relation}`,
          html: unit.icon,
          iconSize: [30, 30],
          iconAnchor: [15, 15],
        }),
      }).addTo(appState.unitLayer);
    });
}

function renderMapLoading() {
  if (leafletMapContainer) leafletMapContainer.hidden = false;
  gameMap.hidden = false;
  gameMap.innerHTML = `
    <rect class="map-status-bg" x="0" y="0" width="1000" height="620"></rect>
    <text class="map-status-title" x="500" y="300">Loading real world borders</text>
    <text class="map-status-copy" x="500" y="330">Natural Earth countries and province boundaries</text>
  `;
}

function renderMapError(message) {
  if (leafletMapContainer) leafletMapContainer.hidden = true;
  gameMap.hidden = false;
  gameMap.innerHTML = `
    <rect class="map-status-bg error" x="0" y="0" width="1000" height="620"></rect>
    <text class="map-status-title" x="500" y="292">Real map data unavailable</text>
    <text class="map-status-copy" x="500" y="324">${message}</text>
  `;
}

function renderNews() {
  const articles = appState.game ? appState.game.news : [];
  newsCount.textContent = String(articles.length);
  newsFeed.innerHTML = articles
    .map(
      (article) => `
        <article class="news-item ${article.tone || "info"}">
          <h3>${article.headline}</h3>
          <p>${article.body}</p>
          <small>Tick ${String(article.tick).padStart(2, "0")}</small>
        </article>
      `
    )
    .join("");
}

function renderGame() {
  renderStats();
  renderPlayerCard();
  renderResources();
  renderSelectedRegion();
  renderDiplomacy();
  renderDecision();
  renderMilitary();
  renderMap();
  renderNews();
}

function showToast(message) {
  toast.textContent = message;
  toast.hidden = false;
  clearTimeout(appState.toastTimer);
  appState.toastTimer = setTimeout(() => {
    toast.hidden = true;
  }, 3200);
}

function render() {
  switchScreen();
  renderStatus();
  topPlayer.textContent = appState.accountName;
  if (appState.screen === "lobby") renderLobby();
  if (appState.screen === "game") renderGame();
}

render();

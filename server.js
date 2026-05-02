const crypto = require("crypto");
const fs = require("fs");
const http = require("http");
const path = require("path");

const HOST = "127.0.0.1";
const PORT = 4173;
const TICK_MS = 1200;

const staticRoot = __dirname;
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
};

const resources = ["steel", "oil", "electronics", "money"];

const serverTemplates = [
  { id: "flashpoint-europe", name: "Flashpoint Europe", map: "Europe Theatre", speed: "1x", maxPlayers: 6 },
  { id: "global-conflict", name: "Global Conflict", map: "World Map", speed: "1x", maxPlayers: 6 },
  { id: "blood-and-oil", name: "Blood & Oil", map: "Middle East Focus", speed: "1.5x", maxPlayers: 6 },
  { id: "northern-front", name: "Northern Front", map: "Baltic Theatre", speed: "1x", maxPlayers: 6 },
  { id: "pacific-rise", name: "Pacific Rise", map: "Pacific Theatre", speed: "2x", maxPlayers: 6 },
];

const buildingTypes = {
  factory: {
    name: "Factory",
    resource: "steel",
    cost: { steel: 70, money: 90 },
    output: { steel: 20 },
    turns: 3,
  },
  refinery: {
    name: "Refinery",
    resource: "oil",
    cost: { steel: 55, money: 90 },
    output: { oil: 18 },
    turns: 3,
  },
  techHub: {
    name: "Tech Hub",
    resource: "electronics",
    cost: { electronics: 45, money: 110 },
    output: { electronics: 16 },
    turns: 4,
  },
  financeCenter: {
    name: "Finance Center",
    resource: "money",
    cost: { steel: 40, electronics: 25, money: 80 },
    output: { money: 30 },
    turns: 3,
  },
  barracks: {
    name: "Barracks",
    cost: { steel: 45, money: 70 },
    output: {},
    turns: 2,
  },
  airbase: {
    name: "Airbase",
    cost: { steel: 80, electronics: 35, money: 100 },
    output: {},
    turns: 4,
  },
  navalPort: {
    name: "Naval Port",
    cost: { steel: 90, oil: 35, money: 120 },
    output: {},
    turns: 4,
  },
  defenseSystem: {
    name: "Defense System",
    cost: { steel: 70, electronics: 45, money: 90 },
    output: {},
    defenseBonus: 8,
    turns: 3,
  },
};

const unitTypes = {
  infantry: {
    name: "Infantry",
    icon: "INF",
    cost: { money: 55 },
    requires: null,
    health: 36,
    attack: 13,
    defense: 9,
    speed: 0.34,
    upkeep: { money: 2 },
  },
  tanks: {
    name: "Tanks",
    icon: "TNK",
    cost: { steel: 75, oil: 25, money: 35 },
    requires: "factory",
    health: 58,
    attack: 27,
    defense: 17,
    speed: 0.25,
    upkeep: { oil: 2, money: 3 },
  },
  jets: {
    name: "Jets",
    icon: "JET",
    cost: { oil: 70, electronics: 45, money: 60 },
    requires: "airbase",
    health: 44,
    attack: 34,
    defense: 12,
    speed: 0.5,
    upkeep: { oil: 4, electronics: 1, money: 4 },
  },
  navy: {
    name: "Navy",
    icon: "NAV",
    cost: { steel: 90, oil: 55, money: 85 },
    requires: "navalPort",
    health: 70,
    attack: 30,
    defense: 22,
    speed: 0.2,
    upkeep: { oil: 4, money: 5 },
  },
};

const countryTemplates = [
  {
    id: "germany",
    name: "Germany",
    playable: true,
    trait: "+20% steel production",
    bonus: { steelProduction: 1.2 },
    stockpile: { steel: 190, oil: 80, electronics: 80, money: 220 },
  },
  {
    id: "saudi",
    name: "Saudi Arabia",
    playable: true,
    trait: "+25% oil production",
    bonus: { oilProduction: 1.25 },
    stockpile: { steel: 110, oil: 240, electronics: 70, money: 210 },
  },
  {
    id: "sweden",
    name: "Sweden",
    playable: true,
    trait: "+25% electronics production",
    bonus: { electronicsProduction: 1.25 },
    stockpile: { steel: 120, oil: 90, electronics: 210, money: 200 },
  },
  {
    id: "usa",
    name: "USA",
    playable: true,
    trait: "+25% money production",
    bonus: { moneyProduction: 1.25 },
    stockpile: { steel: 160, oil: 150, electronics: 130, money: 300 },
  },
  {
    id: "russia",
    name: "Russia",
    playable: true,
    trait: "+20% ground combat",
    bonus: { groundCombat: 1.2 },
    stockpile: { steel: 210, oil: 170, electronics: 75, money: 180 },
  },
  {
    id: "china",
    name: "China",
    playable: true,
    trait: "+25% build speed",
    bonus: { buildSpeed: 1.25 },
    stockpile: { steel: 180, oil: 120, electronics: 145, money: 230 },
  },
  {
    id: "uk",
    name: "United Kingdom",
    playable: false,
    trait: "Naval AI",
    bonus: { moneyProduction: 1.1 },
    stockpile: { steel: 120, oil: 110, electronics: 100, money: 190 },
  },
  {
    id: "france",
    name: "France",
    playable: false,
    trait: "Diplomatic AI",
    bonus: { moneyProduction: 1.1 },
    stockpile: { steel: 135, oil: 100, electronics: 120, money: 210 },
  },
];

const regionTemplates = [
  {
    id: "stockholm",
    name: "Stockholm",
    owner: "sweden",
    type: "city",
    baseOutput: { electronics: 18, money: 16 },
    bounds: [[55.0, 10.0], [69.5, 24.5]],
    neighbors: ["berlin", "baltic"],
    points: "178,92 320,76 344,154 250,212 154,180 138,122",
    labelX: 190,
    labelY: 138,
    unitX: 294,
    unitY: 110,
  },
  {
    id: "london",
    name: "London",
    owner: "uk",
    type: "city",
    baseOutput: { money: 22, electronics: 8 },
    bounds: [[50.0, -8.5], [58.8, 2.0]],
    neighbors: ["paris", "atlantic"],
    points: "54,162 138,126 186,186 146,248 54,236 28,198",
    labelX: 70,
    labelY: 198,
    unitX: 142,
    unitY: 174,
  },
  {
    id: "paris",
    name: "Paris",
    owner: "france",
    type: "city",
    baseOutput: { money: 20, steel: 8 },
    bounds: [[43.3, -4.8], [50.7, 7.8]],
    neighbors: ["london", "berlin", "alps", "atlantic"],
    points: "118,278 278,246 334,332 238,430 102,392 72,320",
    labelX: 150,
    labelY: 334,
    unitX: 268,
    unitY: 304,
  },
  {
    id: "berlin",
    name: "Berlin",
    owner: "germany",
    type: "city",
    baseOutput: { steel: 22, money: 14 },
    bounds: [[47.0, 5.4], [55.3, 15.4]],
    neighbors: ["stockholm", "paris", "warsaw", "baltic", "alps"],
    points: "338,170 506,148 554,248 468,344 320,320 280,236",
    labelX: 358,
    labelY: 242,
    unitX: 492,
    unitY: 206,
  },
  {
    id: "warsaw",
    name: "Warsaw",
    owner: "russia",
    type: "city",
    baseOutput: { steel: 16, money: 12 },
    bounds: [[49.0, 14.0], [56.0, 25.0]],
    neighbors: ["berlin", "baltic", "kyiv"],
    points: "528,150 676,136 736,226 652,324 504,294 476,222",
    labelX: 550,
    labelY: 232,
    unitX: 672,
    unitY: 198,
  },
  {
    id: "baltic",
    name: "Baltic Corridor",
    owner: "russia",
    type: "province",
    baseOutput: { steel: 10, oil: 5 },
    bounds: [[54.0, 18.0], [60.4, 31.5]],
    neighbors: ["stockholm", "berlin", "warsaw"],
    points: "374,66 552,52 642,126 526,164 358,142 314,106",
    labelX: 400,
    labelY: 106,
    unitX: 530,
    unitY: 86,
  },
  {
    id: "alps",
    name: "Alpine Industry",
    owner: "germany",
    type: "province",
    baseOutput: { steel: 18 },
    bounds: [[44.0, 6.0], [48.5, 16.8]],
    neighbors: ["paris", "berlin", "kyiv", "med"],
    points: "302,346 500,332 598,426 496,530 308,516 234,428",
    labelX: 336,
    labelY: 430,
    unitX: 520,
    unitY: 394,
  },
  {
    id: "kyiv",
    name: "Kyiv Front",
    owner: "russia",
    type: "city",
    baseOutput: { steel: 14, money: 12 },
    bounds: [[45.0, 25.0], [53.8, 41.5]],
    neighbors: ["warsaw", "alps", "beijing"],
    points: "684,248 894,226 930,382 754,444 620,352 628,288",
    labelX: 712,
    labelY: 316,
    unitX: 874,
    unitY: 286,
  },
  {
    id: "riyadh",
    name: "Riyadh",
    owner: "saudi",
    type: "city",
    baseOutput: { oil: 30, money: 14 },
    bounds: [[16.0, 34.0], [31.8, 56.0]],
    neighbors: ["med", "beijing"],
    points: "576,456 730,430 816,520 748,604 574,588 520,516",
    labelX: 604,
    labelY: 520,
    unitX: 734,
    unitY: 492,
  },
  {
    id: "beijing",
    name: "Beijing",
    owner: "china",
    type: "city",
    baseOutput: { electronics: 18, steel: 16, money: 16 },
    bounds: [[22.0, 100.0], [42.5, 124.0]],
    neighbors: ["kyiv", "riyadh", "pacific"],
    points: "828,386 970,364 996,492 906,604 780,556 766,464",
    labelX: 842,
    labelY: 468,
    unitX: 930,
    unitY: 428,
  },
  {
    id: "washington",
    name: "Washington",
    owner: "usa",
    type: "city",
    baseOutput: { money: 30, electronics: 10 },
    bounds: [[25.0, -125.0], [49.5, -66.5]],
    neighbors: ["atlantic", "pacific"],
    points: "40,434 202,414 284,520 188,604 46,580 8,492",
    labelX: 60,
    labelY: 512,
    unitX: 218,
    unitY: 478,
  },
  {
    id: "atlantic",
    name: "Atlantic Route",
    owner: "usa",
    type: "sea",
    baseOutput: { oil: 8, money: 8 },
    bounds: [[18.0, -62.0], [55.0, -12.0]],
    neighbors: ["washington", "london", "paris", "med"],
    points: "14,258 102,248 94,412 18,430 0,368",
    labelX: 20,
    labelY: 338,
    unitX: 72,
    unitY: 296,
  },
  {
    id: "med",
    name: "Mediterranean",
    owner: "france",
    type: "sea",
    baseOutput: { oil: 8, money: 6 },
    bounds: [[30.0, -5.0], [43.5, 35.0]],
    neighbors: ["atlantic", "alps", "riyadh"],
    points: "338,536 510,532 548,608 344,616 248,586",
    labelX: 346,
    labelY: 576,
    unitX: 504,
    unitY: 568,
  },
  {
    id: "pacific",
    name: "Pacific Route",
    owner: "china",
    type: "sea",
    baseOutput: { money: 8, oil: 8 },
    bounds: [[-12.0, 128.0], [45.0, 180.0]],
    neighbors: ["washington", "beijing"],
    points: "278,548 490,546 748,618 272,620",
    labelX: 408,
    labelY: 596,
    unitX: 624,
    unitY: 586,
  },
];

const strategicNodeTemplates = [
  {
    id: "de-berlin",
    country: "germany",
    name: "Berlin",
    province: "Berlin",
    aliases: ["Berlin"],
    kind: "capital",
    lat: 52.52,
    lng: 13.405,
    population: 3.7,
    importance: 92,
    output: { money: 16, electronics: 8 },
    infrastructure: ["financeCenter", "airbase"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "de-hamburg",
    country: "germany",
    name: "Hamburg",
    province: "Hamburg",
    aliases: ["Hamburg"],
    kind: "naval",
    lat: 53.5511,
    lng: 9.9937,
    population: 1.9,
    importance: 72,
    output: { money: 10, steel: 4 },
    infrastructure: ["navalPort", "factory"],
    garrison: 1,
    slots: 3,
  },
  {
    id: "de-ruhr",
    country: "germany",
    name: "Ruhr Industry",
    province: "North Rhine-Westphalia",
    aliases: ["North Rhine-Westphalia", "Nordrhein-Westfalen"],
    kind: "steel",
    lat: 51.45,
    lng: 7.01,
    population: 5.1,
    importance: 86,
    output: { steel: 26, money: 8 },
    infrastructure: ["factory", "factory"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "de-munich",
    country: "germany",
    name: "Munich",
    province: "Bavaria",
    aliases: ["Bavaria", "Bayern"],
    kind: "electronics",
    lat: 48.1351,
    lng: 11.582,
    population: 1.5,
    importance: 76,
    output: { electronics: 14, money: 9 },
    infrastructure: ["techHub", "airbase"],
    garrison: 1,
    slots: 4,
  },
  {
    id: "sa-riyadh",
    country: "saudi",
    name: "Riyadh",
    province: "Riyadh",
    aliases: ["Riyadh", "Ar Riyad"],
    kind: "capital",
    lat: 24.7136,
    lng: 46.6753,
    population: 7.7,
    importance: 90,
    output: { money: 18, oil: 6 },
    infrastructure: ["financeCenter", "airbase"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "sa-jeddah",
    country: "saudi",
    name: "Jeddah",
    province: "Makkah",
    aliases: ["Makkah", "Mecca", "Jiddah"],
    kind: "naval",
    lat: 21.4858,
    lng: 39.1925,
    population: 4.7,
    importance: 72,
    output: { money: 12, oil: 4 },
    infrastructure: ["navalPort", "financeCenter"],
    garrison: 1,
    slots: 3,
  },
  {
    id: "sa-dammam",
    country: "saudi",
    name: "Dammam Oil Belt",
    province: "Eastern Province",
    aliases: ["Eastern Province", "Ash Sharqiyah"],
    kind: "oil",
    lat: 26.4207,
    lng: 50.0888,
    population: 1.5,
    importance: 88,
    output: { oil: 34, money: 8 },
    infrastructure: ["refinery", "navalPort"],
    garrison: 1,
    slots: 4,
  },
  {
    id: "sa-ghawar",
    country: "saudi",
    name: "Ghawar Fields",
    province: "Eastern Province",
    aliases: ["Eastern Province", "Ash Sharqiyah"],
    kind: "oil",
    lat: 25.35,
    lng: 49.6,
    population: 0.2,
    importance: 82,
    output: { oil: 38 },
    infrastructure: ["refinery"],
    garrison: 1,
    slots: 3,
  },
  {
    id: "se-stockholm",
    country: "sweden",
    name: "Stockholm",
    province: "Stockholm",
    aliases: ["Stockholm"],
    kind: "capital",
    lat: 59.3293,
    lng: 18.0686,
    population: 2.4,
    importance: 88,
    output: { electronics: 18, money: 16 },
    infrastructure: ["techHub", "financeCenter"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "se-gothenburg",
    country: "sweden",
    name: "Gothenburg",
    province: "Vastra Gotaland",
    aliases: ["Vastra Gotaland", "Västra Götaland"],
    kind: "naval",
    lat: 57.7089,
    lng: 11.9746,
    population: 1.1,
    importance: 68,
    output: { money: 9, steel: 6 },
    infrastructure: ["navalPort", "factory"],
    garrison: 1,
    slots: 3,
  },
  {
    id: "se-kiruna",
    country: "sweden",
    name: "Kiruna Ore",
    province: "Norrbotten",
    aliases: ["Norrbotten"],
    kind: "rare",
    lat: 67.855,
    lng: 20.225,
    population: 0.02,
    importance: 74,
    output: { steel: 20, electronics: 5 },
    infrastructure: ["factory"],
    garrison: 1,
    slots: 3,
  },
  {
    id: "us-washington",
    country: "usa",
    name: "Washington DC",
    province: "District of Columbia",
    aliases: ["District of Columbia", "Maryland", "Virginia"],
    kind: "capital",
    lat: 38.907,
    lng: -77.037,
    population: 6.4,
    importance: 94,
    output: { money: 24, electronics: 8 },
    infrastructure: ["financeCenter", "airbase"],
    garrison: 3,
    slots: 5,
  },
  {
    id: "us-new-york",
    country: "usa",
    name: "New York",
    province: "New York",
    aliases: ["New York"],
    kind: "money",
    lat: 40.713,
    lng: -74.006,
    population: 19.6,
    importance: 92,
    output: { money: 36, electronics: 8 },
    infrastructure: ["financeCenter", "navalPort"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "us-texas-oil",
    country: "usa",
    name: "Texas Oil Grid",
    province: "Texas",
    aliases: ["Texas"],
    kind: "oil",
    lat: 29.76,
    lng: -95.37,
    population: 7.1,
    importance: 88,
    output: { oil: 34, money: 12 },
    infrastructure: ["refinery", "navalPort"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "us-california-tech",
    country: "usa",
    name: "California Tech Belt",
    province: "California",
    aliases: ["California"],
    kind: "electronics",
    lat: 37.774,
    lng: -122.419,
    population: 18.8,
    importance: 90,
    output: { electronics: 30, money: 18 },
    infrastructure: ["techHub", "financeCenter", "airbase"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "ru-moscow",
    country: "russia",
    name: "Moscow",
    province: "Moscow",
    aliases: ["Moscow", "Moscow City", "Moskva"],
    kind: "capital",
    lat: 55.7558,
    lng: 37.6173,
    population: 12.6,
    importance: 92,
    output: { money: 20, electronics: 8 },
    infrastructure: ["financeCenter", "airbase"],
    garrison: 3,
    slots: 5,
  },
  {
    id: "ru-st-petersburg",
    country: "russia",
    name: "St Petersburg",
    province: "Saint Petersburg",
    aliases: ["Saint Petersburg", "St. Petersburg", "Leningrad"],
    kind: "naval",
    lat: 59.934,
    lng: 30.335,
    population: 5.4,
    importance: 76,
    output: { money: 11, steel: 8 },
    infrastructure: ["navalPort", "factory"],
    garrison: 2,
    slots: 4,
  },
  {
    id: "ru-urals",
    country: "russia",
    name: "Ural Steel Basin",
    province: "Sverdlovsk",
    aliases: ["Sverdlovsk", "Chelyabinsk", "Perm"],
    kind: "steel",
    lat: 56.838,
    lng: 60.605,
    population: 4.3,
    importance: 86,
    output: { steel: 34, oil: 5 },
    infrastructure: ["factory", "factory"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "ru-siberia-energy",
    country: "russia",
    name: "West Siberian Energy",
    province: "Tyumen",
    aliases: ["Tyumen", "Khanty-Mansi", "Yamal-Nenets"],
    kind: "oil",
    lat: 61.0,
    lng: 73.4,
    population: 1.9,
    importance: 84,
    output: { oil: 30, steel: 8 },
    infrastructure: ["refinery"],
    garrison: 1,
    slots: 4,
  },
  {
    id: "cn-beijing",
    country: "china",
    name: "Beijing",
    province: "Beijing",
    aliases: ["Beijing"],
    kind: "capital",
    lat: 39.904,
    lng: 116.407,
    population: 21.5,
    importance: 94,
    output: { money: 20, electronics: 12 },
    infrastructure: ["financeCenter", "airbase"],
    garrison: 3,
    slots: 5,
  },
  {
    id: "cn-shanghai",
    country: "china",
    name: "Shanghai",
    province: "Shanghai",
    aliases: ["Shanghai"],
    kind: "money",
    lat: 31.23,
    lng: 121.474,
    population: 24.9,
    importance: 92,
    output: { money: 28, electronics: 10 },
    infrastructure: ["financeCenter", "navalPort"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "cn-shenzhen",
    country: "china",
    name: "Shenzhen Electronics",
    province: "Guangdong",
    aliases: ["Guangdong"],
    kind: "electronics",
    lat: 22.543,
    lng: 114.058,
    population: 17.6,
    importance: 90,
    output: { electronics: 34, money: 16 },
    infrastructure: ["techHub", "navalPort"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "cn-wuhan",
    country: "china",
    name: "Wuhan Industry",
    province: "Hubei",
    aliases: ["Hubei"],
    kind: "steel",
    lat: 30.592,
    lng: 114.305,
    population: 11.2,
    importance: 78,
    output: { steel: 26, money: 8 },
    infrastructure: ["factory", "airbase"],
    garrison: 2,
    slots: 4,
  },
  {
    id: "uk-london",
    country: "uk",
    name: "London",
    province: "England",
    aliases: ["England", "Greater London"],
    kind: "capital",
    lat: 51.5072,
    lng: -0.1276,
    population: 14.8,
    importance: 90,
    output: { money: 26, electronics: 8 },
    infrastructure: ["financeCenter", "airbase"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "fr-paris",
    country: "france",
    name: "Paris",
    province: "Ile-de-France",
    aliases: ["Ile-de-France", "Île-de-France"],
    kind: "capital",
    lat: 48.8566,
    lng: 2.3522,
    population: 12.3,
    importance: 90,
    output: { money: 24, electronics: 8 },
    infrastructure: ["financeCenter", "airbase"],
    garrison: 2,
    slots: 5,
  },
  {
    id: "fr-marseille",
    country: "france",
    name: "Marseille Port",
    province: "Provence-Alpes-Cote d'Azur",
    aliases: ["Provence-Alpes-Cote d'Azur", "Provence-Alpes-Côte d'Azur"],
    kind: "naval",
    lat: 43.296,
    lng: 5.37,
    population: 1.8,
    importance: 70,
    output: { money: 10, oil: 5 },
    infrastructure: ["navalPort", "refinery"],
    garrison: 1,
    slots: 3,
  },
];

function makeInitialState(template = serverTemplates[0]) {
  const countries = {};
  for (const template of countryTemplates) {
    countries[template.id] = {
      ...template,
      stockpile: { ...template.stockpile },
      stability: 72,
      controlledBy: null,
      ai: !template.playable,
      pendingDecision: null,
      buildQueue: [],
      shortages: [],
      victory: null,
    };
  }

  const relations = {};
  for (const country of countryTemplates) {
    relations[country.id] = {};
    for (const other of countryTemplates) {
      relations[country.id][other.id] = country.id === other.id ? "self" : "neutral";
    }
  }

  const state = {
    tick: 0,
    serverId: template.id,
    serverName: template.name,
    mapName: template.map,
    speed: template.speed,
    maxPlayers: template.maxPlayers,
    countries,
    relations,
    regions: regionTemplates.map((region) => ({
      ...region,
      buildings: defaultBuildings(region),
      construction: null,
    })),
    units: [],
    news: [],
    nextUnitId: 1,
    nextNewsId: 1,
    nextDecisionId: 1,
  };

  for (const country of countryTemplates) {
    const homeCity = state.regions.find((region) => region.owner === country.id && region.type === "city");
    if (homeCity) {
      state.units.push(createUnit(state, country.id, homeCity.id, "infantry"));
      if (country.id === "germany") state.units.push(createUnit(state, country.id, homeCity.id, "tanks"));
      if (country.id === "russia") state.units.push(createUnit(state, country.id, homeCity.id, "tanks"));
      if (country.id === "usa") state.units.push(createUnit(state, country.id, homeCity.id, "jets"));
    }
  }

  addNews(
    state,
    "World Mandate server online",
    "Countries are mobilizing around steel, oil, electronics, and money. The first blocs will shape the round.",
    "info"
  );

  return state;
}

function defaultBuildings(region) {
  const buildings = [];
  if (region.type === "city") buildings.push("barracks");
  if ((region.baseOutput.steel || 0) >= 16) buildings.push("factory");
  if ((region.baseOutput.oil || 0) >= 18) buildings.push("refinery");
  if ((region.baseOutput.electronics || 0) >= 18) buildings.push("techHub");
  if ((region.baseOutput.money || 0) >= 22) buildings.push("financeCenter");
  if (region.type === "sea") buildings.push("navalPort");
  return buildings;
}

function createUnit(state, owner, regionId, type) {
  const template = unitTypes[type];
  const country = state.countries[owner];
  const groundBonus = country && country.bonus.groundCombat && ["infantry", "tanks"].includes(type)
    ? country.bonus.groundCombat
    : 1;

  return {
    id: `unit-${state.nextUnitId++}`,
    type,
    name: template.name,
    icon: template.icon,
    owner,
    regionId,
    fromRegionId: regionId,
    toRegionId: null,
    progress: 0,
    health: template.health,
    attack: Math.round(template.attack * groundBonus),
    defense: template.defense,
    movementSpeed: template.speed,
  };
}

const gameServers = serverTemplates.map((template) => ({
  ...template,
  state: makeInitialState(template),
}));
let game = gameServers[0].state;
const clients = new Map();

function addNews(state, headline, body, tone = "info") {
  state.news.unshift({
    id: `news-${state.nextNewsId++}`,
    tick: state.tick,
    headline,
    body,
    tone,
  });
  state.news = state.news.slice(0, 30);
}

function makeId(prefix) {
  return `${prefix}-${crypto.randomBytes(8).toString("hex")}`;
}

function getCountryName(countryId) {
  return (game.countries[countryId] && game.countries[countryId].name) || countryId;
}

function getRelation(sourceCountryId, targetCountryId) {
  if (!sourceCountryId || !targetCountryId) return "neutral";
  return (game.relations[sourceCountryId] && game.relations[sourceCountryId][targetCountryId]) || "neutral";
}

function setRelation(countryA, countryB, relation) {
  game.relations[countryA][countryB] = countryA === countryB ? "self" : relation;
  game.relations[countryB][countryA] = countryA === countryB ? "self" : relation;
}

function regionById(regionId) {
  return game.regions.find((region) => region.id === regionId);
}

function nodeCoordinates(node) {
  const lng = Number(node.lng);
  const lat = Number(node.lat);
  if (!Number.isFinite(lng) || !Number.isFinite(lat) || lng < -180 || lng > 180 || lat < -90 || lat > 90) {
    throw new Error(`Invalid strategic node coordinates for ${node.id}`);
  }
  return [lng, lat];
}

function serializeStrategicNode(node, viewerCountryId) {
  const { lat, lng, ...payload } = node;
  return {
    ...payload,
    coordinates: nodeCoordinates(node),
    ownerName: getCountryName(node.country),
    relation: viewerCountryId ? getRelation(viewerCountryId, node.country) : "neutral",
    stability: game.countries[node.country] ? game.countries[node.country].stability : 0,
  };
}

function unitsInRegion(regionId) {
  return game.units.filter((unit) => unit.regionId === regionId && !unit.toRegionId);
}

function regionsOwnedBy(countryId) {
  return game.regions.filter((region) => region.owner === countryId);
}

function humanControlled(countryId) {
  return Boolean(game.countries[countryId] && game.countries[countryId].controlledBy);
}

function hasResources(country, cost) {
  return resources.every((resource) => (country.stockpile[resource] || 0) >= (cost[resource] || 0));
}

function spendResources(country, cost) {
  if (!hasResources(country, cost)) return false;
  for (const resource of resources) {
    country.stockpile[resource] -= cost[resource] || 0;
  }
  return true;
}

function addResources(country, amount) {
  for (const resource of resources) {
    country.stockpile[resource] = Math.max(0, Math.round((country.stockpile[resource] || 0) + (amount[resource] || 0)));
  }
}

function costText(cost) {
  return resources
    .filter((resource) => cost[resource])
    .map((resource) => `${cost[resource]} ${resource}`)
    .join(", ");
}

function productionMultiplier(country, resource) {
  let multiplier = 1;
  if (country.stability >= 80) multiplier += 0.12;
  if (country.stability < 45) multiplier -= 0.18;
  if (country.bonus[`${resource}Production`]) multiplier *= country.bonus[`${resource}Production`];
  return multiplier;
}

function countryProduction(countryId) {
  const country = game.countries[countryId];
  const totals = { steel: 0, oil: 0, electronics: 0, money: 0 };

  for (const region of regionsOwnedBy(countryId)) {
    for (const resource of resources) {
      totals[resource] += region.baseOutput[resource] || 0;
    }

    for (const building of region.buildings) {
      const output = (buildingTypes[building] && buildingTypes[building].output) || {};
      for (const resource of resources) {
        totals[resource] += output[resource] || 0;
      }
    }
  }

  for (const resource of resources) {
    totals[resource] = Math.round(totals[resource] * productionMultiplier(country, resource));
  }

  return totals;
}

function countryUpkeep(countryId) {
  const totals = { steel: 0, oil: 0, electronics: 0, money: 0 };
  for (const unit of game.units.filter((entry) => entry.owner === countryId)) {
    const upkeep = unitTypes[unit.type].upkeep;
    for (const resource of resources) {
      totals[resource] += upkeep[resource] || 0;
    }
  }
  return totals;
}

function countryMilitary(countryId) {
  const counts = { infantry: 0, tanks: 0, jets: 0, navy: 0 };
  for (const unit of game.units.filter((entry) => entry.owner === countryId)) {
    counts[unit.type] += 1;
  }
  return counts;
}

function ownedBuildingCount(countryId) {
  return regionsOwnedBy(countryId).reduce((total, region) => total + region.buildings.length, 0);
}

function allianceSize(countryId) {
  return Object.entries(game.relations[countryId]).filter(([, relation]) => relation === "allied").length + 1;
}

function countrySummary(viewerCountryId) {
  return Object.values(game.countries).map((country) => ({
    id: country.id,
    name: country.name,
    trait: country.trait,
    stockpile: country.stockpile,
    production: countryProduction(country.id),
    upkeep: countryUpkeep(country.id),
    military: countryMilitary(country.id),
    stability: country.stability,
    playable: country.playable,
    ai: country.ai,
    claimed: humanControlled(country.id),
    regions: regionsOwnedBy(country.id).length,
    relation: viewerCountryId ? getRelation(viewerCountryId, country.id) : "neutral",
    victory: country.victory,
  }));
}

function serverById(serverId) {
  return gameServers.find((entry) => entry.id === serverId) || null;
}

function serverSummary() {
  return gameServers.map((entry) => {
    const previousGame = game;
    game = entry.state;
    const claimed = Object.values(game.countries).filter((country) => humanControlled(country.id)).length;
    const openCountries = Object.values(game.countries).filter((country) => country.playable && !humanControlled(country.id)).length;
    const wars = Object.values(game.relations).reduce(
      (count, row) => count + Object.values(row).filter((relation) => relation === "war").length,
      0
    ) / 2;
    game = previousGame;

    return {
      id: entry.id,
      name: entry.name,
      map: entry.map,
      speed: entry.speed,
      maxPlayers: entry.maxPlayers,
      tick: entry.state.tick,
      players: claimed,
      openCountries,
      wars,
    };
  });
}

function serializeState(viewerCountryId) {
  return {
    tick: game.tick,
    activeServerId: game.serverId,
    servers: serverSummary(),
    serverName: game.serverName,
    mapName: game.mapName,
    speed: game.speed,
    maxPlayers: game.maxPlayers,
    viewerCountryId,
    buildingTypes,
    unitTypes,
    countries: countrySummary(viewerCountryId),
    viewer: viewerCountryId
      ? {
          ...countrySummary(viewerCountryId).find((country) => country.id === viewerCountryId),
          pendingDecision: game.countries[viewerCountryId].pendingDecision,
        }
      : null,
    regions: game.regions.map((region) => ({
      ...region,
      relation: viewerCountryId ? getRelation(viewerCountryId, region.owner) : "neutral",
      ownerName: getCountryName(region.owner),
      units: unitsInRegion(region.id).map((unit) => unit.id),
    })),
    units: game.units.map((unit) => ({
      ...unit,
      ownerName: getCountryName(unit.owner),
      relation: viewerCountryId ? getRelation(viewerCountryId, unit.owner) : "neutral",
    })),
    strategicNodes: strategicNodeTemplates.map((node) => serializeStrategicNode(node, viewerCountryId)),
    news: game.news,
  };
}

function serializeClientState(client) {
  const active = serverById(client.serverId);
  if (!active) {
    return {
      tick: 0,
      activeServerId: null,
      servers: serverSummary(),
      serverName: "Select Server",
      mapName: "--",
      speed: "--",
      maxPlayers: 0,
      viewerCountryId: null,
      buildingTypes,
      unitTypes,
      countries: [],
      viewer: null,
      regions: [],
      units: [],
      strategicNodes: [],
      news: [],
    };
  }

  const previousGame = game;
  game = active.state;
  const payload = serializeState(client.countryId);
  game = previousGame;
  return payload;
}

function send(client, message) {
  if (client.socket.destroyed) return;
  const payload = Buffer.from(JSON.stringify(message));
  client.socket.write(buildFrame(payload));
}

function buildFrame(payload) {
  const length = payload.length;
  if (length < 126) return Buffer.concat([Buffer.from([0x81, length]), payload]);
  if (length < 65536) {
    const header = Buffer.alloc(4);
    header[0] = 0x81;
    header[1] = 126;
    header.writeUInt16BE(length, 2);
    return Buffer.concat([header, payload]);
  }

  const header = Buffer.alloc(10);
  header[0] = 0x81;
  header[1] = 127;
  header.writeBigUInt64BE(BigInt(length), 2);
  return Buffer.concat([header, payload]);
}

function broadcastState() {
  for (const client of clients.values()) {
    send(client, { type: "state", payload: serializeClientState(client) });
  }
}

function sendError(client, message) {
  send(client, { type: "error", message });
}

function releaseCountry(countryId) {
  if (!countryId || !game.countries[countryId]) return;
  game.countries[countryId].controlledBy = null;
  game.countries[countryId].ai = true;
}

function releaseClientCountry(client) {
  const active = serverById(client.serverId);
  if (!active || !client.countryId) return;
  const previousGame = game;
  game = active.state;
  releaseCountry(client.countryId);
  game = previousGame;
  client.countryId = null;
}

function joinServer(client, serverId) {
  const target = serverById(serverId);
  if (!target) {
    sendError(client, "Server not found.");
    return;
  }

  releaseClientCountry(client);
  client.serverId = serverId;
  client.countryId = null;
  send(client, { type: "state", payload: serializeClientState(client) });
}

function claimCountry(client, countryId, playerName) {
  const country = game.countries[countryId];
  if (!country || !country.playable) return sendError(client, "That country is not available.");
  if (humanControlled(countryId) && country.controlledBy !== client.id) {
    return sendError(client, "That country is already controlled by another player.");
  }

  if (client.countryId && client.countryId !== countryId) releaseCountry(client.countryId);

  client.name = playerName || client.name;
  client.countryId = countryId;
  country.controlledBy = client.id;
  country.ai = false;

  addNews(game, `${country.name} has entered the war room`, `${client.name} is now commanding ${country.name}.`, "positive");
  broadcastState();
}

function buildStructure(countryId, regionId, buildingId) {
  const country = game.countries[countryId];
  const region = regionById(regionId);
  const building = buildingTypes[buildingId];
  if (!country || !region || !building) return { ok: false, message: "Building order not found." };
  if (region.owner !== countryId) return { ok: false, message: "You can only build in your own regions." };
  if (region.buildings.includes(buildingId)) return { ok: false, message: "That structure already exists here." };
  if (region.construction) return { ok: false, message: "This region is already building something." };
  if (buildingId === "navalPort" && region.type !== "sea" && !region.neighbors.some((id) => {
    const neighbor = regionById(id);
    return neighbor && neighbor.type === "sea";
  })) {
    return { ok: false, message: "Naval ports need a coastal or sea region." };
  }
  if (!spendResources(country, building.cost)) return { ok: false, message: `Need ${costText(building.cost)}.` };

  const speed = country.bonus.buildSpeed || 1;
  region.construction = {
    buildingId,
    name: building.name,
    remaining: Math.max(1, Math.ceil(building.turns / speed)),
  };
  addNews(game, `${country.name} begins ${building.name} construction`, `${region.name} is expanding its infrastructure.`, "info");
  return { ok: true };
}

function recruitUnit(countryId, regionId, unitType) {
  const country = game.countries[countryId];
  const region = regionById(regionId);
  const template = unitTypes[unitType];
  if (!country || !region || !template) return { ok: false, message: "Recruitment order not found." };
  if (region.owner !== countryId) return { ok: false, message: "You can only recruit in your own regions." };
  if (template.requires && !region.buildings.includes(template.requires)) {
    return { ok: false, message: `${template.name} require ${buildingTypes[template.requires].name}.` };
  }
  if (unitType === "navy" && region.type !== "sea" && !region.buildings.includes("navalPort")) {
    return { ok: false, message: "Navy requires a naval port or sea region." };
  }
  if (!spendResources(country, template.cost)) return { ok: false, message: `Need ${costText(template.cost)}.` };

  game.units.push(createUnit(game, countryId, regionId, unitType));
  addNews(game, `${country.name} deploys ${template.name}`, `${template.name} forces are now active around ${region.name}.`, "info");
  return { ok: true };
}

function declareWar(countryId, targetCountryId) {
  if (countryId === targetCountryId) return { ok: false, message: "You cannot declare war on yourself." };
  if (!game.countries[targetCountryId]) return { ok: false, message: "Target country not found." };
  if (getRelation(countryId, targetCountryId) === "war") return { ok: false, message: "War is already active." };

  setRelation(countryId, targetCountryId, "war");
  game.countries[countryId].stability = Math.max(0, game.countries[countryId].stability - 3);
  addNews(
    game,
    `${getCountryName(countryId)} declares war on ${getCountryName(targetCountryId)}`,
    "Border tensions have turned into open conflict. Markets are already reacting.",
    "danger"
  );
  return { ok: true };
}

function createAlliance(countryId, targetCountryId) {
  if (countryId === targetCountryId) return { ok: false, message: "You are already allied with yourself." };
  if (!game.countries[targetCountryId]) return { ok: false, message: "Target country not found." };
  if (getRelation(countryId, targetCountryId) === "war") return { ok: false, message: "Make peace before creating an alliance." };

  setRelation(countryId, targetCountryId, "allied");
  game.countries[countryId].stability = Math.min(100, game.countries[countryId].stability + 2);
  addNews(game, `${getCountryName(countryId)} and ${getCountryName(targetCountryId)} form an alliance`, "A new diplomatic bloc is taking shape.", "positive");
  return { ok: true };
}

function createTradeDeal(countryId, targetCountryId) {
  if (countryId === targetCountryId) return { ok: false, message: "You already trade internally." };
  if (!game.countries[targetCountryId]) return { ok: false, message: "Target country not found." };
  if (getRelation(countryId, targetCountryId) === "war") return { ok: false, message: "You cannot trade while at war." };

  setRelation(countryId, targetCountryId, "trade");
  addResources(game.countries[countryId], { money: 35 });
  addResources(game.countries[targetCountryId], { money: 25 });
  addNews(
    game,
    `${getCountryName(countryId)} signs trade deal with ${getCountryName(targetCountryId)}`,
    "Fresh capital and resource access are flowing through the new route.",
    "positive"
  );
  return { ok: true };
}

function peaceTreaty(countryId, targetCountryId) {
  if (countryId === targetCountryId) return { ok: false, message: "Peace at home is assumed." };
  if (!game.countries[targetCountryId]) return { ok: false, message: "Target country not found." };
  if (getRelation(countryId, targetCountryId) !== "war") return { ok: false, message: "You are not at war." };

  setRelation(countryId, targetCountryId, "peace");
  game.countries[countryId].stability = Math.min(100, game.countries[countryId].stability + 5);
  game.countries[targetCountryId].stability = Math.min(100, game.countries[targetCountryId].stability + 3);
  addNews(game, `${getCountryName(countryId)} and ${getCountryName(targetCountryId)} sign a peace treaty`, "Military commanders have been ordered to stand down.", "positive");
  return { ok: true };
}

function moveUnit(countryId, fromRegionId, toRegionId, unitType = "any") {
  const fromRegion = regionById(fromRegionId);
  const toRegion = regionById(toRegionId);
  if (!fromRegion || !toRegion) return { ok: false, message: "Movement route not found." };
  if (!fromRegion.neighbors.includes(toRegionId)) return { ok: false, message: "Regions are not connected." };

  const relation = getRelation(countryId, toRegion.owner);
  if (!["self", "allied", "war", "trade", "peace"].includes(relation)) {
    return { ok: false, message: "Declare war, ally, or sign a treaty before moving there." };
  }

  const unit = game.units.find(
    (entry) => entry.owner === countryId && entry.regionId === fromRegionId && !entry.toRegionId && (unitType === "any" || entry.type === unitType)
  );
  if (!unit) return { ok: false, message: "No idle matching unit available in that region." };

  unit.fromRegionId = fromRegionId;
  unit.toRegionId = toRegionId;
  unit.progress = 0;
  return { ok: true };
}

function generateDecision(countryId) {
  const country = game.countries[countryId];
  if (!country || country.pendingDecision) return;

  const options = [
    {
      title: "Your military demands more budget.",
      body: "Commanders say nearby rivals are moving faster than your army can answer.",
      choices: [
        { id: "fund", label: "Fund them", effect: { units: "infantry", money: -70, stability: 2 } },
        { id: "refuse", label: "Refuse", effect: { money: 55, stability: -7 } },
      ],
    },
    {
      title: "Economic corruption scandal.",
      body: "Investigators found missing construction funds inside a major city project.",
      choices: [
        { id: "cover", label: "Cover it up", effect: { money: 45, stability: -8 } },
        { id: "expose", label: "Expose it", effect: { money: -35, stability: 8 } },
      ],
    },
    {
      title: "Border officers report escalating tensions.",
      body: "A neighboring patrol crossed too close to a strategic road.",
      choices: [
        { id: "mobilize", label: "Mobilize armor", effect: { units: "tanks", steel: -55, oil: -20, stability: -2 } },
        { id: "deescalate", label: "De-escalate", effect: { money: 30, stability: 5 } },
      ],
    },
    {
      title: "Tech firms request military contracts.",
      body: "Drone and missile suppliers want guaranteed electronics allocations.",
      choices: [
        { id: "approve", label: "Approve contracts", effect: { electronics: -45, money: -35, stability: 2, research: true } },
        { id: "delay", label: "Delay", effect: { electronics: 35, stability: -3 } },
      ],
    },
  ];

  const event = options[(game.tick + countryId.length) % options.length];
  country.pendingDecision = {
    id: `decision-${game.nextDecisionId++}`,
    ...event,
  };
}

function chooseDecision(countryId, choiceId) {
  const country = game.countries[countryId];
  const decision = country && country.pendingDecision;
  if (!decision) return { ok: false, message: "No active decision." };
  const choice = decision.choices.find((entry) => entry.id === choiceId);
  if (!choice) return { ok: false, message: "Decision choice not found." };

  const effect = choice.effect;
  addResources(country, {
    steel: effect.steel || 0,
    oil: effect.oil || 0,
    electronics: effect.electronics || 0,
    money: effect.money || 0,
  });
  country.stability = Math.max(0, Math.min(100, country.stability + (effect.stability || 0)));

  if (effect.units) {
    const home = regionsOwnedBy(countryId).find((region) => region.type === "city") || regionsOwnedBy(countryId)[0];
    if (home) game.units.push(createUnit(game, countryId, home.id, effect.units));
  }
  if (effect.research) country.stability = Math.min(100, country.stability + 2);

  addNews(game, `${country.name}: ${choice.label}`, decision.title, "info");
  country.pendingDecision = null;
  return { ok: true };
}

function processConstruction() {
  for (const region of game.regions) {
    if (!region.construction) continue;
    region.construction.remaining -= 1;
    if (region.construction.remaining > 0) continue;
    region.buildings.push(region.construction.buildingId);
    addNews(game, `${region.construction.name} completed in ${region.name}`, `${getCountryName(region.owner)} gains new strategic capacity.`, "positive");
    region.construction = null;
  }
}

function processEconomy() {
  for (const country of Object.values(game.countries)) {
    const production = countryProduction(country.id);
    const upkeep = countryUpkeep(country.id);
    const net = {};
    country.shortages = [];

    for (const resource of resources) {
      net[resource] = production[resource] - upkeep[resource];
      country.stockpile[resource] = Math.max(0, Math.round(country.stockpile[resource] + net[resource]));
      if (country.stockpile[resource] === 0 && upkeep[resource] > production[resource]) {
        country.shortages.push(resource);
      }
    }

    if (country.shortages.length > 0) {
      country.stability = Math.max(0, country.stability - 2);
      if (game.tick % 6 === 0) {
        addNews(game, `${country.name} faces ${country.shortages.join(" and ")} shortages`, "Military readiness is being strained by weak supply lines.", "warning");
      }
    } else if (country.stability < 92) {
      country.stability += 1;
    }
  }
}

function processMovement() {
  for (const unit of game.units) {
    if (!unit.toRegionId) continue;
    unit.progress += unit.movementSpeed;
    if (unit.progress < 1) continue;
    unit.regionId = unit.toRegionId;
    unit.fromRegionId = unit.toRegionId;
    unit.toRegionId = null;
    unit.progress = 0;
  }
}

function processCombat() {
  const casualties = new Set();

  for (const region of game.regions) {
    const regionalUnits = unitsInRegion(region.id);
    if (regionalUnits.length < 2) continue;

    for (const attacker of regionalUnits) {
      const enemy = regionalUnits.find(
        (unit) => unit.id !== attacker.id && getRelation(attacker.owner, unit.owner) === "war" && !casualties.has(unit.id)
      );
      if (!enemy) continue;

      const defenseBonus = region.owner === enemy.owner && region.buildings.includes("defenseSystem") ? 8 : 0;
      const damage = Math.max(1, attacker.attack - enemy.defense - defenseBonus);
      enemy.health -= damage;
      if (enemy.health <= 0) casualties.add(enemy.id);
    }
  }

  if (casualties.size === 0) return;

  for (const unitId of casualties) {
    const unit = game.units.find((entry) => entry.id === unitId);
    if (!unit) continue;
    addNews(game, `${getCountryName(unit.owner)} lost ${unit.name}`, `${unit.name} forces were destroyed near ${regionById(unit.regionId).name}.`, "danger");
  }
  game.units = game.units.filter((unit) => !casualties.has(unit.id));
}

function processCaptures() {
  for (const region of game.regions) {
    const regionalUnits = unitsInRegion(region.id);
    if (regionalUnits.length === 0) continue;

    const owners = [...new Set(regionalUnits.map((unit) => unit.owner))];
    if (owners.length !== 1) continue;

    const occupier = owners[0];
    if (occupier === region.owner) continue;
    if (getRelation(occupier, region.owner) !== "war") continue;

    const previousOwner = region.owner;
    region.owner = occupier;
    region.construction = null;
    addNews(game, `${getCountryName(occupier)} captured ${region.name}`, `${region.name} changed hands from ${getCountryName(previousOwner)} to ${getCountryName(occupier)}.`, "danger");
  }
}

function generateWorldHeadline() {
  const countries = Object.values(game.countries);
  const country = countries[game.tick % countries.length];
  const prod = countryProduction(country.id);
  const strongestResource = resources.reduce((best, resource) => (prod[resource] > prod[best] ? resource : best), "steel");
  const headlines = [
    [`${country.name} expands ${strongestResource} capacity`, "Analysts say the move could shift regional bargaining power."],
    [`${country.name} reviews military readiness`, "Command staff are comparing reserves, industry, and border pressure."],
    [`Trade envoys circle ${country.name}`, "Diplomats are looking for new resource deals before shortages bite."],
    [`Border tension rises near ${(regionsOwnedBy(country.id)[0] && regionsOwnedBy(country.id)[0].name) || country.name}`, "Local commanders report more patrols and faster mobilization."],
  ];
  const [headline, body] = headlines[(game.tick / 5) % headlines.length | 0];
  addNews(game, headline, body, "info");
}

function aiBuild(countryId) {
  const country = game.countries[countryId];
  const regions = regionsOwnedBy(countryId).filter((region) => !region.construction);
  const desired = ["factory", "refinery", "techHub", "financeCenter", "barracks", "airbase", "defenseSystem"];
  for (const buildingId of desired) {
    const region = regions.find((entry) => !entry.buildings.includes(buildingId));
    if (region && hasResources(country, buildingTypes[buildingId].cost)) {
      buildStructure(countryId, region.id, buildingId);
      return;
    }
  }
}

function aiRecruit(countryId) {
  const country = game.countries[countryId];
  const regions = regionsOwnedBy(countryId);
  const priority = country.id === "russia" ? ["tanks", "infantry"] : ["infantry", "tanks", "jets"];
  for (const type of priority) {
    const region = regions.find((entry) => !unitTypes[type].requires || entry.buildings.includes(unitTypes[type].requires));
    if (region && hasResources(country, unitTypes[type].cost) && Math.random() < 0.58) {
      recruitUnit(countryId, region.id, type);
      return;
    }
  }
}

function neighborsOwnedBy(regionId, predicate) {
  const region = regionById(regionId);
  return region.neighbors.map((neighborId) => regionById(neighborId)).filter(Boolean).filter(predicate);
}

function startAiWar(countryId) {
  const ownedRegions = regionsOwnedBy(countryId);
  for (const region of ownedRegions) {
    const targets = neighborsOwnedBy(
      region.id,
      (neighbor) => neighbor.owner !== countryId && getRelation(countryId, neighbor.owner) === "neutral"
    );
    if (targets.length > 0 && Math.random() < 0.12) {
      declareWar(countryId, targets[0].owner);
      return;
    }
  }
}

function shortestStepTowardEnemy(countryId, startRegionId) {
  const queue = [[startRegionId]];
  const visited = new Set([startRegionId]);

  while (queue.length > 0) {
    const currentPath = queue.shift();
    const region = regionById(currentPath[currentPath.length - 1]);
    if (region.owner !== countryId && getRelation(countryId, region.owner) === "war") {
      return currentPath[1] || region.id;
    }

    for (const neighborId of region.neighbors) {
      if (visited.has(neighborId)) continue;
      const neighbor = regionById(neighborId);
      const relation = getRelation(countryId, neighbor.owner);
      if (!["self", "allied", "war", "trade", "peace"].includes(relation)) continue;
      visited.add(neighborId);
      queue.push([...currentPath, neighborId]);
    }
  }

  return null;
}

function processAi() {
  if (game.tick % 3 !== 0) return;

  for (const country of Object.values(game.countries)) {
    if (!country.ai) continue;
    if (Math.random() < 0.38) aiBuild(country.id);
    aiRecruit(country.id);
    startAiWar(country.id);

    const units = game.units.filter((unit) => unit.owner === country.id && !unit.toRegionId);
    for (const unit of units) {
      const nextStep = shortestStepTowardEnemy(country.id, unit.regionId);
      if (nextStep && nextStep !== unit.regionId && Math.random() < 0.7) {
        moveUnit(country.id, unit.regionId, nextStep, unit.type);
      }
    }
  }
}

function processDecisions() {
  if (game.tick % 10 !== 0) return;
  for (const country of Object.values(game.countries)) {
    if (!country.ai && humanControlled(country.id)) generateDecision(country.id);
  }
}

function processInstability() {
  for (const country of Object.values(game.countries)) {
    if (country.stability >= 25 || game.tick % 8 !== 0) continue;
    const owned = regionsOwnedBy(country.id);
    const target = owned.find((region) => region.type !== "city") || owned[0];
    if (!target) continue;
    country.stockpile.money = Math.max(0, country.stockpile.money - 40);
    addNews(game, `Unrest spreads in ${country.name}`, `${target.name} is losing output after weeks of low stability.`, "warning");
  }
}

function checkVictories() {
  const totalRegions = game.regions.length;
  for (const country of Object.values(game.countries)) {
    if (country.victory) continue;
    const owned = regionsOwnedBy(country.id).length;
    const economy = resources.reduce((sum, resource) => sum + country.stockpile[resource], 0);
    if (owned >= Math.ceil(totalRegions * 0.55)) {
      country.victory = "Military domination";
      addNews(game, `${country.name} claims military domination`, "Its forces now control the decisive share of the world map.", "positive");
    } else if (economy >= 2800) {
      country.victory = "Economic supremacy";
      addNews(game, `${country.name} reaches economic supremacy`, "Resource reserves and capital markets now dwarf rival economies.", "positive");
    } else if (allianceSize(country.id) >= 4) {
      country.victory = "Alliance victory";
      addNews(game, `${country.name} leads an alliance victory`, "A diplomatic bloc has become too powerful to ignore.", "positive");
    }
  }
}

function gameTick() {
  game.tick += 1;
  processEconomy();
  processConstruction();
  processMovement();
  processCombat();
  processCaptures();
  processAi();
  processDecisions();
  processInstability();
  if (game.tick % 5 === 0) generateWorldHeadline();
  checkVictories();
}

function tickAllServers() {
  for (const entry of gameServers) {
    game = entry.state;
    gameTick();
  }
  broadcastState();
}

function handleMessage(client, rawMessage) {
  let message;
  try {
    message = JSON.parse(rawMessage);
  } catch (error) {
    sendError(client, "Invalid message payload.");
    return;
  }

  if (message.type === "joinServer") {
    joinServer(client, message.serverId);
    broadcastState();
    return;
  }

  const active = serverById(client.serverId);
  if (!active) {
    sendError(client, "Choose a server first.");
    return;
  }

  game = active.state;

  const requireCountry = () => {
    if (!client.countryId) {
      sendError(client, "Join a country first.");
      return false;
    }
    return true;
  };

  let result = { ok: true };
  switch (message.type) {
    case "join":
      claimCountry(client, message.countryId, message.name);
      return;
    case "recruit":
      if (!requireCountry()) return;
      result = recruitUnit(client.countryId, message.regionId, message.unitType);
      break;
    case "build":
      if (!requireCountry()) return;
      result = buildStructure(client.countryId, message.regionId, message.buildingId);
      break;
    case "move":
      if (!requireCountry()) return;
      result = moveUnit(client.countryId, message.fromRegionId, message.toRegionId, message.unitType || "any");
      break;
    case "declareWar":
      if (!requireCountry()) return;
      result = declareWar(client.countryId, message.targetCountryId);
      break;
    case "createAlliance":
      if (!requireCountry()) return;
      result = createAlliance(client.countryId, message.targetCountryId);
      break;
    case "tradeDeal":
      if (!requireCountry()) return;
      result = createTradeDeal(client.countryId, message.targetCountryId);
      break;
    case "peaceTreaty":
      if (!requireCountry()) return;
      result = peaceTreaty(client.countryId, message.targetCountryId);
      break;
    case "decision":
      if (!requireCountry()) return;
      result = chooseDecision(client.countryId, message.choiceId);
      break;
    default:
      sendError(client, `Unknown action: ${message.type}`);
      return;
  }

  if (!result.ok) return sendError(client, result.message);
  broadcastState();
}

function parseFrames(client) {
  let buffer = client.buffer;

  while (buffer.length >= 2) {
    const first = buffer[0];
    const second = buffer[1];
    const opcode = first & 0x0f;
    const masked = (second & 0x80) === 0x80;
    let length = second & 0x7f;
    let offset = 2;

    if (length === 126) {
      if (buffer.length < 4) break;
      length = buffer.readUInt16BE(2);
      offset = 4;
    } else if (length === 127) {
      if (buffer.length < 10) break;
      length = Number(buffer.readBigUInt64BE(2));
      offset = 10;
    }

    const maskBytesLength = masked ? 4 : 0;
    if (buffer.length < offset + maskBytesLength + length) break;

    let payload = buffer.slice(offset + maskBytesLength, offset + maskBytesLength + length);
    if (masked) {
      const mask = buffer.slice(offset, offset + 4);
      const unmasked = Buffer.alloc(length);
      for (let index = 0; index < length; index += 1) {
        unmasked[index] = payload[index] ^ mask[index % 4];
      }
      payload = unmasked;
    }

    buffer = buffer.slice(offset + maskBytesLength + length);
    if (opcode === 0x8) {
      client.socket.end();
      break;
    }
    if (opcode === 0x1) handleMessage(client, payload.toString("utf8"));
  }

  client.buffer = buffer;
}

function serveFile(req, res) {
  const cleanPath = (req.url || "/").split("?")[0];
  const requested = cleanPath === "/" ? "/index.html" : cleanPath;
  const safePath = path.normalize(path.join(staticRoot, requested));

  if (!safePath.startsWith(staticRoot)) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(safePath, (error, file) => {
    if (error) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Not found");
      return;
    }

    res.writeHead(200, {
      "Content-Type": mimeTypes[path.extname(safePath)] || "application/octet-stream",
      "Cache-Control": "no-store",
    });
    res.end(file);
  });
}

const server = http.createServer(serveFile);

server.on("upgrade", (req, socket) => {
  if ((req.headers.upgrade || "").toLowerCase() !== "websocket") {
    socket.destroy();
    return;
  }

  const key = req.headers["sec-websocket-key"];
  if (!key) {
    socket.destroy();
    return;
  }

  const accept = crypto
    .createHash("sha1")
    .update(`${key}258EAFA5-E914-47DA-95CA-C5AB0DC85B11`)
    .digest("base64");

  socket.write(
    [
      "HTTP/1.1 101 Switching Protocols",
      "Upgrade: websocket",
      "Connection: Upgrade",
      `Sec-WebSocket-Accept: ${accept}`,
      "",
      "",
    ].join("\r\n")
  );

  const client = {
    id: makeId("client"),
    name: "Guest",
    serverId: null,
    countryId: null,
    socket,
    buffer: Buffer.alloc(0),
  };

  clients.set(client.id, client);
  send(client, { type: "state", payload: serializeClientState(client) });

  socket.on("data", (chunk) => {
    client.buffer = Buffer.concat([client.buffer, chunk]);
    parseFrames(client);
  });

  socket.on("error", () => socket.destroy());
  socket.on("close", () => {
    releaseClientCountry(client);
    clients.delete(client.id);
    broadcastState();
  });
  socket.on("end", () => {
    releaseClientCountry(client);
    clients.delete(client.id);
    broadcastState();
  });
});

setInterval(tickAllServers, TICK_MS);

server.listen(PORT, HOST, () => {
  console.log(`World Mandate server running at http://${HOST}:${PORT}`);
});

// Garden Tracker — Bella Vista, AR
// Updated: 2026-03-14 with complete corrected plant inventory

const LOCATION = {
  name: 'Bella Vista, AR',
  zone: '6b',
  lat: 36.4812,
  lon: -94.2724,
  lastFrost: '2026-04-15',
  safePlant:  '2026-04-27'
};

const STAGE_OPTIONS = [
  'Seeds — not yet sown',
  'Seeds — sown, not sprouted',
  'Just germinated / sprouted',
  'Seedling (cotyledons)',
  'Seedling (true leaves emerging)',
  'Early vegetative',
  'Vegetative',
  'Pre-flowering',
  'Flowering',
  'Fruiting',
  'Ready to harvest',
  'Hardening off',
  'Transplanted outdoors',
  'DWC — net pot placed',
  'DWC — roots reaching water',
  'DWC — established'
];

const HARDEN_SCHEDULE = [
  { day:1,  hours:1,  shade:true,  notes:'Dappled shade only — no direct sun' },
  { day:2,  hours:2,  shade:true,  notes:'Dappled shade; bring in if wind > 10 mph' },
  { day:3,  hours:3,  shade:false, notes:'Morning sun OK, avoid afternoon direct' },
  { day:4,  hours:4,  shade:false, notes:'Morning sun + 1h afternoon max' },
  { day:5,  hours:5,  shade:false, notes:'Increasing direct sun' },
  { day:6,  hours:6,  shade:false, notes:'Half-day sun' },
  { day:7,  hours:8,  shade:false, notes:'Full day OK if overnight lows > 50°F' },
  { day:8,  hours:10, shade:false, notes:'Near-full outdoor exposure' },
  { day:9,  hours:12, shade:false, notes:'Full sun — check frost forecast' },
  { day:10, hours:14, shade:false, notes:'Full outdoor — ready to transplant if frost-free' }
];

// Cold tolerance for hardening tab
const COLD_TOLERANCE = {
  'Lettuce':         { level:'HIGH',   min:28, note:'Tolerates light frost once hardened. Can start hardening now.' },
  'Tomato':          { level:'MEDIUM', min:50, note:'Cold-sensitive below 50°F. Wilting on days 1–2 is normal.' },
  'Pepper':          { level:'LOW',    min:55, note:'Very cold-sensitive. Do not expose below 55°F. Start after Apr 27.' },
  'Herb':            { level:'MEDIUM', min:40, note:'Most herbs tolerate 40°F+ once established.' },
  'Bonsai':          { level:'HIGH',   min:32, note:'These species are cold-hardy — no hardening needed for temps above freezing.' },
  'Uncertain Seed':  { level:'N/A',    min:80, note:'Germination focus — heat mat at 80–90°F for Capsicum chinense.' },
};

// Complete plant inventory
const PLANT_DATA = [

  // ── DWC ────────────────────────────────────────────────────
  {
    id:'bell-dwc', name:'California Wonder Bell', variety:'Capsicum annuum', method:'DWC',
    category:'Pepper', location:'Left DWC bucket', dest:'Indoor — DWC permanent',
    hardenOff:false, startDate:'2026-03-14',
    stage:'DWC — net pot placed', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    info:'California Wonder is a classic thick-walled sweet bell pepper. DWC will produce large yields with proper nutrient management.'
  },
  {
    id:'hab-dwc', name:'Habanero', variety:'Capsicum chinense (hydro clone)', method:'DWC',
    category:'Pepper', location:'Right DWC bucket', dest:'Indoor — DWC permanent',
    hardenOff:false, startDate:null,
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    info:'Clone from an existing hydro-grown habanero plant. Strong genetic start. Capsicum chinense prefers slightly higher temps than annuum.'
  },

  // ── PEPPERS — SOIL ──────────────────────────────────────────
  {
    id:'grand-bell', name:'Grand Bell Mix', variety:'Capsicum annuum', method:'Soil',
    category:'Pepper', location:'Seedling tray — middle shelf', dest:'Outdoor transplant',
    hardenOff:true, startDate:null,
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    info:'Mixed color bell pepper variety. Produces red, yellow, and orange bells. Wait until after Apr 27 to harden off.'
  },
  {
    id:'jalapeno', name:'Jalapeño Early', variety:'Capsicum annuum', method:'Soil',
    category:'Pepper', location:'Seedling tray — middle shelf', dest:'Outdoor transplant',
    hardenOff:true, startDate:null,
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    info:'Early maturing jalapeño. Good producer. 2,500–8,000 SHU. Wait until overnight lows stay above 55°F to harden.'
  },
  {
    id:'poblano', name:'Poblano', variety:'Capsicum annuum', method:'Soil',
    category:'Pepper', location:'Seedling tray — middle shelf', dest:'Outdoor transplant',
    hardenOff:true, startDate:null,
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    info:'Mild pepper used for chiles rellenos. 1,000–2,000 SHU. Large plant — give plenty of space outdoors.'
  },
  {
    id:'serrano', name:'Serrano', variety:'Capsicum annuum', method:'Soil',
    category:'Pepper', location:'Seedling tray — middle shelf', dest:'Outdoor transplant',
    hardenOff:true, startDate:null,
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    info:'Hotter than jalapeño at 10,000–23,000 SHU. Thinner walls, great for fresh salsas. Very productive plant.'
  },
  {
    id:'sweet-banana', name:'Sweet Banana Pepper', variety:'Capsicum annuum', method:'Soil',
    category:'Pepper', location:'Seedling tray — middle shelf', dest:'Outdoor transplant',
    hardenOff:true, startDate:null,
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    info:'Sweet, mild banana-shaped pepper. 0–500 SHU. Prolific producer. Yellow to red when fully ripe.'
  },
  {
    id:'choc-reaper', name:'Chocolate Reaper', variety:'Capsicum chinense (non-isolated)', method:'Soil',
    category:'Pepper', location:'To be sown today — 03/14/2026', dest:'Soil permanent — indoor',
    hardenOff:false, startDate:'2026-03-14',
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    info:'Non-isolated Chocolate Reaper — seeds arrived today. Capsicum chinense: needs 80–90°F for germination. 1.5–2M+ SHU. May show trait variation due to non-isolation.'
  },

  // ── TOMATOES ────────────────────────────────────────────────
  {
    id:'tom-culinary', name:'Tomato — Culinary Blend', variety:'Solanum lycopersicum', method:'Soil',
    category:'Tomato', location:'Window station — fabric bag', dest:'Outdoor transplant',
    hardenOff:true, startDate:null,
    stage:'Early vegetative', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:16, hardenStart:null,
    info:'Culinary blend mix. Diverse fruit types and colors. Needs staking outdoors. Begin hardening ~Apr 7–10.'
  },
  {
    id:'tom-cherry', name:'Tomato — Cherry', variety:'Solanum lycopersicum var. cerasiforme', method:'Soil',
    category:'Tomato', location:'Window station — fabric bag', dest:'Outdoor transplant',
    hardenOff:true, startDate:null,
    stage:'Early vegetative', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:16, hardenStart:null,
    info:'Cherry tomato — high yield, sweet fruit. Indeterminate — will need support. Very heat-tolerant for AR summers.'
  },

  // ── LETTUCE ─────────────────────────────────────────────────
  {
    id:'lettuce-bibb', name:'Lettuce — Bibb', variety:'Lactuca sativa (Bibb)', method:'Soil',
    category:'Lettuce', location:'Green tray — top shelf', dest:'Outdoor transplant',
    hardenOff:true, startDate:null,
    stage:'Seedling (true leaves emerging)', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:16, hardenStart:null,
    info:'Butter / Bibb lettuce. Loose head, tender leaves. Bolt-resistant. Can begin hardening NOW — tolerates light frost.'
  },
  {
    id:'lettuce-iceberg', name:'Lettuce — Iceberg', variety:'Lactuca sativa (Iceberg)', method:'Soil',
    category:'Lettuce', location:'Green tray — top shelf', dest:'Outdoor transplant',
    hardenOff:true, startDate:null,
    stage:'Seedling (true leaves emerging)', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:16, hardenStart:null,
    info:'Classic crisphead lettuce. Needs cool weather to form heads. Harvest before temps exceed 75°F consistently.'
  },

  // ── HERBS ───────────────────────────────────────────────────
  {
    id:'basil', name:'Basil', variety:'Ocimum basilicum', method:'Soil',
    category:'Herb', location:'Terracotta bowl — top shelf', dest:'Indoor permanent',
    hardenOff:false, startDate:null,
    stage:'Just germinated / sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:16, hardenStart:null,
    info:'Sweet basil. Very cold-sensitive — keep indoors above 60°F. Pinch flowers to maintain leaf production.'
  },
  {
    id:'thyme', name:'Thyme', variety:'Thymus vulgaris', method:'Soil',
    category:'Herb', location:'Terracotta bowl — top shelf', dest:'Indoor permanent',
    hardenOff:false, startDate:null,
    stage:'Just germinated / sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:16, hardenStart:null,
    info:'Common thyme. Drought-tolerant once established. Slow germinator — be patient (14–28 days is normal).'
  },
  {
    id:'oregano', name:'Oregano', variety:'Origanum vulgare', method:'Soil',
    category:'Herb', location:'Terracotta bowl — top shelf', dest:'Indoor permanent',
    hardenOff:false, startDate:null,
    stage:'Just germinated / sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:16, hardenStart:null,
    info:'Italian oregano. Very easy to grow. Can become aggressive — consider potting separately as it matures.'
  },
  {
    id:'rosemary', name:'Rosemary', variety:'Salvia rosmarinus', method:'Soil',
    category:'Herb', location:'Seedling tray — fresh seeds', dest:'Indoor permanent',
    hardenOff:false, startDate:null,
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:16, hardenStart:null,
    info:'Fresh seeds — good viability. Slow germinator (14–21 days). Needs excellent drainage. Do not overwater.'
  },

  // ── BONSAI ──────────────────────────────────────────────────
  {
    id:'siberian-elm', name:'Siberian Elm', variety:'Ulmus pumila', method:'Bonsai',
    category:'Bonsai', location:'Garden Republic box — top shelf', dest:'Bonsai training',
    hardenOff:false, startDate:'2026-02-16',
    stage:'Just germinated / sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:14, hardenStart:null,
    nickname:'Freddy',
    info:'Fast-growing deciduous elm. One of the easiest bonsai species to start from seed. First styling possible at 2–3 years. Needs winter dormancy.'
  },
  {
    id:'blue-spruce', name:'Colorado Blue Spruce', variety:'Picea pungens', method:'Bonsai',
    category:'Bonsai', location:'Garden Republic box — top shelf', dest:'Bonsai training',
    hardenOff:false, startDate:'2026-02-16',
    stage:'Just germinated / sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:14, hardenStart:null,
    nickname:'Ochitsuki',
    info:'Slow-growing conifer with striking blue-silver needles. Prefers cooler temps and slightly acidic soil (pH 5.5–6.5). Very sensitive to overwatering.'
  },
  {
    id:'jpine', name:'Japanese Black Pine', variety:'Pinus thunbergii', method:'Bonsai',
    category:'Bonsai', location:'Garden Republic box — top shelf', dest:'Bonsai training',
    hardenOff:false, startDate:'2026-02-16',
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:14, hardenStart:null,
    nickname:'Shizuku',
    info:'Classic bonsai species. Slowest of the three. Well-draining gritty soil essential. Long-term project — first major styling at 3–5 years.'
  },

  // ── UNCERTAIN / OLD SEEDS (Low viability) ───────────────────
  {
    id:'choc-ghost', name:'Chocolate Ghost', variety:'Capsicum chinense', method:'Soil',
    category:'Uncertain Seed', location:'Seedling tray — heat mat', dest:'Soil permanent if germinates',
    hardenOff:false, startDate:'2026-03-14',
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    viability:'LOW — old seeds (~20–40%)',
    info:'Old seeds. Bhut jolokia chocolate variant. ~1M SHU. Keep at 85–90°F on heat mat. May take 3–5 weeks. Do not discard before 6 weeks.'
  },
  {
    id:'choc-primo', name:'Chocolate Primo Reaper', variety:'Capsicum chinense', method:'Soil',
    category:'Uncertain Seed', location:'Seedling tray — heat mat', dest:'Soil permanent if germinates',
    hardenOff:false, startDate:'2026-03-14',
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    viability:'LOW — old seeds (~20–40%)',
    info:'Old seeds. Cross between Primo and Reaper genetics. Extreme heat. Capsicum chinense demands 85–90°F soil temp for germination.'
  },
  {
    id:'tas-hab', name:'Tasmanian Habanero', variety:'Capsicum chinense', method:'Soil',
    category:'Uncertain Seed', location:'Seedling tray — heat mat', dest:'Soil permanent if germinates',
    hardenOff:false, startDate:'2026-03-14',
    stage:'Seeds — sown, not sprouted', notes:[], feeds:[], phLog:[], ecLog:[],
    lightHours:18, hardenStart:null,
    viability:'LOW — old seeds (~20–40%)',
    info:'Old seeds. Rare habanero variety from Tasmania. Unusual fruity flavor profile. Same germination needs as other Capsicum chinense.'
  }
];

# 🌱 Garden Tracker — Bella Vista, AR

Indoor seed starting + DWC hydroponic plant tracker with live weather-based hardening off guidance.

**Zone 6b · Last frost ~Apr 15 · Safe outdoor planting ~Apr 27**

---

## Complete Plant Inventory

### DWC (Deep Water Culture)
| Plant | Variety | Bucket | Notes |
|-------|---------|--------|-------|
| California Wonder Bell | *Capsicum annuum* | Left | In net pot as of Mar 14 |
| Habanero | *Capsicum chinense* (hydro clone) | Right | Clone from existing hydro plant |

### Peppers — Soil
| Plant | Variety |
|-------|---------|
| Grand Bell Mix | *Capsicum annuum* |
| Jalapeño Early | *Capsicum annuum* |
| Poblano | *Capsicum annuum* |
| Serrano | *Capsicum annuum* |
| Sweet Banana Pepper | *Capsicum annuum* |
| Chocolate Reaper (non-isolated) | *Capsicum chinense* — sown Mar 14 |

### Tomatoes
| Plant | Variety |
|-------|---------|
| Culinary Blend | *Solanum lycopersicum* |
| Cherry | *Solanum lycopersicum var. cerasiforme* |

### Lettuce
| Plant | Variety |
|-------|---------|
| Bibb | *Lactuca sativa* (Bibb type) |
| Iceberg | *Lactuca sativa* (Iceberg type) |

### Herbs
| Plant | Variety | Notes |
|-------|---------|-------|
| Basil | *Ocimum basilicum* | Just germinated |
| Thyme | *Thymus vulgaris* | Just germinated |
| Oregano | *Origanum vulgare* | Just germinated |
| Rosemary | *Salvia rosmarinus* | Fresh seeds — good viability |

### Bonsai
| Nickname | Species | Common Name | Sown |
|----------|---------|-------------|------|
| Freddy | *Ulmus pumila* | Siberian Elm | Feb 16, 2026 |
| Ochitsuki | *Picea pungens* | Colorado Blue Spruce | Feb 16, 2026 |
| Shizuku | *Pinus thunbergii* | Japanese Black Pine | Feb 16, 2026 |

### Uncertain / Low-Viability Seeds (old seeds)
| Plant | Variety | Viability | Notes |
|-------|---------|-----------|-------|
| Chocolate Ghost | *Capsicum chinense* | Low ~20–40% | Heat mat 85–90°F |
| Chocolate Primo Reaper | *Capsicum chinense* | Low ~20–40% | Heat mat 85–90°F |
| Tasmanian Habanero | *Capsicum chinense* | Low ~20–40% | Heat mat 85–90°F |

---

## Features

- **22 plants pre-loaded** with correct taxonomy, locations, and start dates
- **Filter sidebar** — All, DWC, Soil, Bonsai, Uncertain, Harden Off
- **Per-plant tabs** — Overview, Log, Feed, Light, DWC (pH/EC logging), Harden Off
- **Live 10-day weather** via [Open-Meteo](https://open-meteo.com/) (no API key needed)
- **Hardening off planner** — 10-day protocol with frost countdown, per-plant cold tolerance, live forecast overlay
- **pH/EC logging** with color-coded status against target ranges
- **Plant info cards** — species notes, SHU ranges, care tips per plant
- **Export/Import JSON** — portable backup, works across devices
- **localStorage** — all data auto-saved in your browser

---

## Deploying to GitHub Pages

### Step 1 — Create a new repository
1. Go to [github.com/new](https://github.com/new)
2. Name it `garden-tracker` (or anything you like)
3. Set visibility to **Public**
4. Click **Create repository** (do NOT initialize with README)

### Step 2 — Upload files
On your new empty repo page, click **"uploading an existing file"**

Drag in the contents of this folder — the structure must be:
```
index.html
README.md
css/
  style.css
js/
  app.js
data/
  plants.js
```
> ⚠️ Drag the **contents** of the garden-tracker folder, not the folder itself.

Click **Commit changes**.

### Step 3 — Enable GitHub Pages
1. In your repo, click **Settings**
2. In the left sidebar, click **Pages**
3. Under **Source**, select **Deploy from a branch**
4. Set Branch to `main`, folder to `/ (root)`
5. Click **Save**

### Step 4 — Visit your live URL
After about 60 seconds your tracker will be live at:
```
https://YOUR_USERNAME.github.io/garden-tracker/
```
Bookmark it on your phone, tablet, and computer. The URL is permanent.

---

## Git CLI alternative (if you prefer terminal)

```bash
# Unzip and enter the folder
cd garden-tracker

# Initialize and push to GitHub
git init
git add .
git commit -m "Initial garden tracker"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/garden-tracker.git
git push -u origin main
```
Then follow Step 3 above to enable Pages.

---

## Adding new plants

Open `data/plants.js` and add an entry to `PLANT_DATA`:

```js
{
  id: 'unique-id',          // lowercase, no spaces
  name: 'Display Name',
  variety: 'Genus species', // used for cold tolerance lookup
  method: 'Soil',           // 'Soil', 'DWC', or 'Bonsai'
  category: 'Pepper',       // 'Pepper','Tomato','Lettuce','Herb','Bonsai','Uncertain Seed'
  location: 'Where it lives',
  dest: 'Outdoor transplant',
  hardenOff: true,          // true shows Harden Off tab
  startDate: '2026-03-14',  // or null
  stage: 'Seeds — sown, not sprouted',
  notes: [], feeds: [], phLog: [], ecLog: [],
  lightHours: 18,
  hardenStart: null,
  info: 'Optional care notes shown on overview tab.',
  viability: null,          // Set to string for old/uncertain seeds
  nickname: null            // Set for bonsai (e.g. 'Freddy')
}
```

---

## Data & Privacy

- All plant data lives in **your browser's localStorage only** — nothing sent to any server
- Weather pulled from [Open-Meteo](https://open-meteo.com/) (open-source, no account required)
- Use **Export** any time to download a `.json` backup
- Use **Import** to restore on a new device or browser

---

## Equipment shown in photos

- Spider Farmer bar light — middle shelf seedling propagation
- Spider Farmer panel — DWC bottom shelf
- LED strip bar lights — top shelf (herbs, bonsai)
- VIVOSUN temperature controller — reads 77.3°F
- Two DWC buckets with hydroton clay pebbles and air stones
- Black wire shelving unit with mylar reflective backing
- Spider Farmer seedling heat mat

---

## Location

**Bella Vista, Arkansas · USDA Zone 6b**
- Coordinates: 36.4812°N, 94.2724°W
- Last frost: ~April 15
- Safe outdoor planting: ~April 27
- First fall frost: ~October 15

To change location, edit the `LOCATION` object at the top of `data/plants.js`.

# ⚡ VOLTCAST — Electricity Outage Predictor (Sokoto Region)

> A modern, machine-learning-driven power outage prediction system designed for Sokoto State, Nigeria. Predicts power outage probabilities based on historical patterns, diurnal load curves, national grid supply status, transformer health, and extreme weather events.

---

## ✨ Features & Modules

### 🔮 1. Outage Predictor Engine
- **District & Feeder Selection**: Select from 10 Sokoto LGAs (*Sokoto North, Sokoto South, Wamako, Dange Shuni, Bodinga, Kware, Gwadabawa, Tambuwal, Illela, Silame*) and key transmission lines (*33kV Wamako Trunk, Arkilla 11kV, Central Market 11kV*).
- **Multi-Factor Input Scoring**: Incorporates diurnal hour slider (00:00 to 23:00), seasonal context, weather conditions (*Extreme Heat >40°C, Severe Thunderstorm, Harmattan Dust*), grid supply deficit, and transformer condition.
- **Dynamic Probability Gauge**: Animated 0-100% SVG risk meter with liquid color tiering.
- **⚔️ Dual District Side-by-Side Comparison Mode**: Compare outage risk between 2 districts simultaneously under identical environmental conditions.
- **📥 Advisory Export**: Instant export of timestamped advisory reports in JSON format.

### 🗺️ 2. Sokoto District Heatmap
- Live status monitor across 10 Sokoto LGAs with baseline vulnerability indicators and quick-select buttons.

### 📈 3. Historical Trend Analytics
- 24-hour diurnal risk distribution charts identifying peak outage hours (14:00 - 18:00).
- Monthly and seasonal outage frequencies (Peak Dry Heat vs. Harmattan vs. Rainy Season).
- Feeder MTBF (Mean Time Between Failures) and MTTR (Mean Time To Repair) benchmarking.
- Outage root cause donut chart breakdown.

### 🧪 4. Machine Learning Model Evaluation
- Validation metrics (*Accuracy 91.4%, Precision 88.7%, Recall 93.2%, F1-Score 90.9%, AUC-ROC 0.946*).
- 2x2 Confusion Matrix grid with dynamic decision threshold slider (0.10 to 0.90).
- ROC Curve visualization & Feature Importance weights.
- 30-day historical backtesting timeline.

### 📋 5. Outage Logs & Emergency Simulator
- Searchable and filterable past incident logs table.
- Interactive Grid Anomaly Simulator (Heatwave shock, National Grid drop, Optimal state).

---

## 🛠️ Technology Stack

- **Frontend**: React (Vite)
- **Styling**: Custom Light Glass Water Liquid CSS Design System
- **Visualization**: Recharts & Lucide Icons
- **Mock Engine**: Custom Sokoto Power Grid Machine Learning Scoring Algorithm

---

## 🚀 Quick Start & Local Setup

```bash
# 1. Clone repository
git clone <your-repo-url>
cd "Power outage"

# 2. Install dependencies
npm install

# 3. Launch dev server
npm run dev

# 4. Production build
npm run build
```

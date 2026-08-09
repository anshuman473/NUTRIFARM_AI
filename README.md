# 🌾 NutriFarm AI (Agri-Smart)

> **Bridging the gap between rural wisdom and modern technology.**

NutriFarm AI is a comprehensive web-based AgriTech & Health ecosystem designed to empower farmers, consumers, and non-governmental organizations (NGOs). By combining AI-driven analytics, soil profiling, personalized nutrition planning, and multilingual accessibility, NutriFarm AI promotes sustainable agriculture, food security, and community health[cite: 3, 6, 7].

---

🚀 Key Features

👨‍🌾 **1. Farmer Portal & Insight**
- **Soil & Land Profiling:** Interactive form to submit details such as land area, soil type, pH level, water sources, irrigation availability, and current/previous crop data[cite: 2, 7].
- **Voice & Image Support:** Voice-to-text notes for describing land issues and an image upload preview feature for soil inspection.
- **AI Crop Recommendations:** Data-driven crop matching percentages (e.g., Green Gram, Basmati Rice, Sunflower) based on land data and season (Kharif, Rabi, Zaid).
- **Soil Health Score:** Automated calculation of soil health percentages based on parameters like pH level[cite: 2].
- **Farmer Community Hub:** Local discussion groups (e.g., Rice Pests, Organic Farming) connecting over 5,000+ local farmers[cite: 2].

🥗 **2. Consumer & Personal Nutrition Architect**
- **Health-Aware Profiles:** Personalized health tracking supporting conditions like Diabetes, Hypertension (BP), Anemia, and Thyroid, alongside life-stage tracking (Pregnancy/Lactation)[cite: 5].
- **Personalized "Best Local Thali":** Recommendations tailored to regional preferences (North Indian, South Indian, Local) and budget levels[cite: 5].
- **Dynamic Weekly Meal Plans & Alternatives:** AI-driven daily meal schedules and low-cost healthy substitute recommendations.
- **Nutrition Score:** Detailed scoring evaluating health profiles against dietary preferences[cite: 5, 10].

🤝 **3. NGO Monitoring Command Center**
- **Regional Insights:** Filter options by village/block and farming seasons.
- **Health Indicators:** Monitor community-level metrics such as Diet Diversity scores and Anemia risk[cite: 8].
- **Initiative Management:** Track and launch upcoming agricultural projects and initiatives[cite: 8].

### 🌐 4. Accessibility & Multilingual Support
- Built-in multi-language switcher supporting **10+ Indian regional languages**: English, Odia (ଓଡ଼ିଆ), Hindi (हिन्दी), Marathi (मराठी), Bengali (বাংলা), Telugu (తెలుగు), Tamil (தமிழ்), Kannada (ಕನ್ನಡ), Gujarati (ગુજરાતી), and Punjabi (ਪੰਜਾਬੀ)[cite: 3, 6, 7].

---
🛠️ **Tech Stack**

- **Frontend:** HTML5, CSS3 (Modern Flexbox/Grid, Custom Neon/Glassmorphism themes)[cite: 2, 6, 10], Vanilla JavaScript[cite: 1, 3, 5]
- **Web APIs:** Web Speech API (`webkitSpeechRecognition`), FileReader API[cite: 7], LocalStorage API[cite: 2, 10]
- **Backend Services:** Firebase Firestore (v10.7.1) for database management
- **Typography & Icons:** Google Fonts (Poppins, Inter, Segoe UI)[cite: 2, 3, 5]

---
📂 **Project Structure**

```text
├── index.html            # Main Landing / AgriTech Command Center Page[cite: 6]
├── farmer-login.html     # Farmer Registration & Authentication Page[cite: 3]
├── land-profiling.html   # Land & Farming Data Collection (Voice/Image inputs)[cite: 7]
├── farmer-dashboard.html # Farmer Insights & AI Recommendations Dashboard[cite: 1, 2]
├── person-login.html     # Consumer Health & Nutrition Profile Form
├── nutri-dashboard.html   # Personalized Diet Plan & Healthy Thali Guide[cite: 10]
├── ngo-dashboard.html    # NGO Monitoring & Regional Insights Command Center[cite: 8]
├── style.css             # Main stylesheet[cite: 1, 3, 6]
├── script.js            # Core application logic & multi-language handling[cite: 1, 3, 5]
└── firebase-config.js    # Firebase initialization & Firestore database export[cite: 4]

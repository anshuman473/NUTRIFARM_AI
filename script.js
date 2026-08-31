/* ============================================================
   0. SUPABASE CONFIGURATION
   ============================================================ */
const SUPABASE_URL = "https://cjuxhwshdxyquiizyfjs.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNqdXhod3NoZHh5cXVpaXp5ZmpzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA4OTAyNTAsImV4cCI6MjA4NjQ2NjI1MH0.5tCe2vtpHpr34U9qFKT8zgt9-4cueDyaoM014elr6vM";

// Initialize Supabase
const { createClient } = supabase;
const sb = createClient(SUPABASE_URL, SUPABASE_KEY);

/* ============================================================
   1. GLOBAL DICTIONARY (ALL 10 LANGUAGES)
   ============================================================ */
const translations = {
    en: { 
        heroBadge: "Consumer Portal · Live Access", heroLine1: "Eat Smart.", heroLine2: "Grow Nourished.",
        tagline: "Track your home garden, log daily nutrition, and get AI-driven insights tailored to what you grow and eat.",
        cardTitleFarmer: "Farmer Portal", cardDescFarmer: "Soil health tracking and advisory.", exploreFarmer: "Explore →",
        cardTitlePerson: "Consumer Portal", cardDescPerson: "Manage gardens and track nutrition.", explorePerson: "Explore →",
        cardTitleNgo: "NGO Portal", cardDescNgo: "Support farmers and manage projects.", exploreNgo: "Explore →",
        aboutTitle: "Our Mission & Vision", aboutText: "Nutri-FarmAI harmonizes traditional agricultural wisdom with cutting-edge AI. For the modern consumer, we bring the farm to the doorstep.",
        formTitle: "Registration / Login", loginTitle: "Consumer Login", regTitle: "Consumer Registration",
        namePH: "Full Name", phonePH: "Phone Number", statePH: "State", cityPH: "City", villagePH: "Village", passPH: "Password", emailPH: "Email Address", agePH: "Age",
        landDetailsTitle: "Land & Farming Details", areaLabel: "Land Area (Acres)", soilLabel: "Soil Type", waterLabel: "Water Source",
        irrigationLabel: "Irrigation Availability", seasonLabel: "Current Season", fertilizerLabel: "Fertilizer Usage", investmentLabel: "Expected Investment",
        prevCropLabel: "Previous Crop", currCropLabel: "Current Crop", saveLandBtn: "Get AI Prediction →",
        landAreaPH: "Enter Acres", fertilizerPH: "e.g. Urea, NPK", investmentPH: "Enter Amount (₹)",
        optClay: "Clay", optSandy: "Sandy", optLoamy: "Loamy", optSilt: "Silt",
        optRainfed: "Rainfed", optBorewell: "Borewell", optCanal: "Canal", optPond: "Pond",
        optIrrigYes: "Available", optIrrigPartial: "Partial", optIrrigNo: "Not Available",
        optKharif: "Kharif (Monsoon)", optRabi: "Rabi (Winter)", optZaid: "Zaid (Summer)",
        welcomeUser: "Welcome", soilScoreTitle: "Soil Health Score", landSummaryTitle: "Land Summary", aiSuggestionsTitle: "AI Crop Suggestions",
        loginBtn: "LOGIN →", regBtn: "CREATE ACCOUNT & REGISTER →"
    },
    or: { 
        heroBadge: "ଉପଭୋକ୍ତା ପୋର୍ଟାଲ୍ · ଲାଇଭ୍ ଆକ୍ସେସ୍", heroLine1: "ବୁଦ୍ଧିମାନ ଭୋଜନ।", heroLine2: "ପୋଷଣ ସହିତ ବଢ଼।",
        tagline: "ନିଜ ବଗିଚା ଟ୍ରାକ୍ କରନ୍ତୁ, ଭୋଜନ ଲଗ୍ କରନ୍ତୁ ଓ AI ଚାଳିତ ପରାମର୍ଶ ପାଆନ୍ତୁ।",
        cardTitleFarmer: "କୃଷକ ପୋର୍ଟାଲ୍", cardDescFarmer: "ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ ଟ୍ରାକିଂ |", exploreFarmer: "ଅନ୍ୱେଷଣ କରନ୍ତୁ →",
        cardTitlePerson: "ଉପଭୋକ୍ତା ପୋର୍ଟାଲ୍", cardDescPerson: "ବଗିଚା ପରିଚାଳନା ଏବଂ ପୋଷଣ ଟ୍ରାକିଂ |", explorePerson: "ଅନ୍ୱେଷଣ କରନ୍ତୁ →",
        cardTitleNgo: "NGO ପୋର୍ଟାଲ୍", cardDescNgo: "କୃଷକମାନଙ୍କୁ ସହାୟତା ଏବଂ ପ୍ରକଳ୍ପ ପରିଚାଳନା |", exploreNgo: "ଅନ୍ୱେଷଣ କରନ୍ତୁ →",
        aboutTitle: "ଆମର ଲକ୍ଷ୍ୟ ଏବଂ ଦୃଷ୍ଟିକୋଣ", aboutText: "ନ୍ୟୁଟ୍ରି-ଫାର୍ମାଏଆଇ କେବଳ ଏକ ଉପକରଣ ନୁହେଁ; ଏହା ପାରମ୍ପରିକ କୃଷି ଜ୍ଞାନକୁ ଅତ୍ୟାଧୁନିକ କୃତ୍ରିମ ବୁଦ୍ଧିମତ୍ତା ସହିତ ସମନ୍ୱିତ କରିବା ପାଇଁ ଏକ ଆନ୍ଦୋଳନ।",
        formTitle: "ପଞ୍ଜୀକରଣ / ଲଗଇନ୍", loginTitle: "ଉପଭୋକ୍ତା ଲଗଇନ", regTitle: "ଉପଭୋକ୍ତା ପଞ୍ଜିକରଣ",
        namePH: "ପୂରା ନାମ", phonePH: "ଫୋନ୍ ନମ୍ବର", statePH: "ରାଜ୍ୟ", cityPH: "ସହର", villagePH: "ଗ୍ରାମ", passPH: "ପାସୱାର୍ଡ", emailPH: "ଇମେଲ୍", agePH: "ବୟସ",
        landDetailsTitle: "ଜମି ଏବଂ ଚାଷର ବିବରଣୀ", areaLabel: "ଜମି କ୍ଷେତ୍ରଫଳ (ଏକର)", soilLabel: "ମୃତ୍ତିକା ପ୍ରକାର", waterLabel: "ଜଳ ଉତ୍ସ",
        irrigationLabel: "ଜଳସେଚନ ଉପଲବ୍ଧତା", seasonLabel: "ବର୍ତ୍ତମାନର ଋତୁ", fertilizerLabel: "ସାର ବ୍ୟବହାର", investmentLabel: "ଆନୁମାନିକ ପୁଞ୍ଜି ବିନିଯୋଗ",
        prevCropLabel: "ପୂର୍ବ ଶସ୍ୟ", currCropLabel: "ବର୍ତ୍ତମାନର ଶସ୍ୟ", saveLandBtn: "AI ପୂର୍ବାନୁମାନ ପାଆନ୍ତୁ →",
        landAreaPH: "ଏକର ଲେଖନ୍ତୁ", fertilizerPH: "ଯଥା: ୟୁରିଆ, NPK", investmentPH: "ଟଙ୍କା ଲେଖନ୍ତୁ (₹)",
        optClay: "କାଦୁଅ ମାଟି", optSandy: "ବାଲିଆ ମାଟି", optLoamy: "ଦୋରସା ମାଟି", optSilt: "ପଟୁ ମାଟି",
        optRainfed: "ବର୍ଷା ନିର୍ଭରଶୀଳ", optBorewell: "ନଳକୂପ", optCanal: "କେନାଲ୍", optPond: "ପୋଖରୀ",
        optIrrigYes: "ଉପଲବ୍ଧ", optIrrigPartial: "ଆଂଶିକ", optIrrigNo: "ଉପଲବ୍ଧ ନାହିଁ",
        optKharif: "ଖରିଫ (ବର୍ଷା ଦିନିଆ)", optRabi: "ରବି (ଶୀତ ଦିନିଆ)", optZaid: "ଜାଏଦ (ଖରା ଦିନିଆ)",
        welcomeUser: "ସ୍ୱାଗତ", soilScoreTitle: "ମୃତ୍ତିକା ସ୍ୱାସ୍ଥ୍ୟ ସ୍କୋର", landSummaryTitle: "ଜମି ବିବରଣୀ", aiSuggestionsTitle: "AI ଶସ୍ୟ ପରାମର୍ଶ",
        loginBtn: "ଲଗଇନ୍ →", regBtn: "ଖାତା ତିଆରି କରନ୍ତୁ →"
    },
    hi: { 
        heroBadge: "उपभोक्ता पोर्टल · लाइव एक्सेस", heroLine1: "समझदारी से खाएं।", heroLine2: "पोषण से बढ़ें।",
        tagline: "घर का बगीचा ट्रैक करें, पोषण लॉग करें और अपनी भाषा में AI अंतर्दृष्टि पाएं।",
        cardTitleFarmer: "किसान पोर्टल", cardDescFarmer: "मिट्टी स्वास्थ्य और सलाह।", exploreFarmer: "खोजें →",
        cardTitlePerson: "उपभोक्ता पोर्टल", cardDescPerson: "बगीचे का प्रबंधन और पोषण ट्रैक करें।", explorePerson: "खोजें →",
        cardTitleNgo: "एनजीओ पोर्टल", cardDescNgo: "किसानों का समर्थन और परियोजनाओं का प्रबंधन।", exploreNgo: "खोजें →",
        aboutTitle: "हमारा मिशन और विजन", aboutText: "न्यूट्री-फार्मएआई पारंपरिक कृषि ज्ञान को एआई के साथ जोड़ता है।",
        formTitle: "पंजीकरण / लॉगिन", loginTitle: "उपभोक्ता लॉगिन", regTitle: "उपभोक्ता पंजीकरण",
        namePH: "पूरा नाम", phonePH: "फ़ोन नंबर", statePH: "राज्य", cityPH: "शहर", villagePH: "गाँव", passPH: "पासवर्ड", emailPH: "ईमेल पता", agePH: "आयु",
        landDetailsTitle: "भूमि और कृषि विवरण", areaLabel: "भूमि क्षेत्र (एकड़)", soilLabel: "मिट्टी का प्रकार", waterLabel: "जल स्रोत",
        irrigationLabel: "सिंचाई उपलब्धता", seasonLabel: "वर्तमान सीजन", fertilizerLabel: "उर्वरक का उपयोग", investmentLabel: "अपेक्षित निवेश",
        prevCropLabel: "पिछली फसल", currCropLabel: "वर्तमान फसल", saveLandBtn: "भविष्यवाणी प्राप्त करें →",
        landAreaPH: "एकड़ दर्ज करें", fertilizerPH: "जैसे यूरिया, NPK", investmentPH: "राशि दर्ज करें (₹)",
        optClay: "चिकनी मिट्टी", optSandy: "रेतीली मिट्टी", optLoamy: "दोमट मिट्टी", optSilt: "गाद मिट्टी",
        optRainfed: "वर्षा आधारित", optBorewell: "बोरवेल", optCanal: "नहर", optPond: "तालाब",
        optIrrigYes: "उपलब्ध", optIrrigPartial: "आंशिक", optIrrigNo: "उपलब्ध नहीं",
        optKharif: "खरीफ", optRabi: "रबी", optZaid: "जायद",
        welcomeUser: "स्वागत है", loginBtn: "लॉगिन →", regBtn: "खाता बनाएँ →"
    },
    bn: { 
        heroBadge: "ভোক্তা পোর্টাল", heroLine1: "বুদ্ধিমানের মতো খান।", heroLine2: "পুষ্টির সাথে বাড়ুন।", tagline: "বাড়ির বাগান ট্র্যাক করুন, পুষ্টি লগ করুন এবং AI অন্তর্দৃষ্টি পান।",
        cardTitleFarmer: "কৃষক পোর্টাল", cardDescFarmer: "মাটির স্বাস্থ্য এবং পরামর্শ।", exploreFarmer: "অন্বেষণ →",
        cardTitlePerson: "ভোক্তা পোর্টাল", cardDescPerson: "বাগান পরিচালনা এবং পুষ্টি পর্যবেক্ষণ।", explorePerson: "অন্বেষণ →",
        cardTitleNgo: "এনজিও পোর্টাল", cardDescNgo: "কৃষক সহায়তা এবং প্রকল্প পরিচালনা।", exploreNgo: "অন্বেষণ →",
        aboutTitle: "আমাদের লক্ষ্য ও দৃষ্টিভঙ্গি", aboutText: "নিউট্রি-ফার্মএআই কৃষি জ্ঞানকে এআই-এর সাথে যুক্ত করে।",
        formTitle: "নিবন্ধন / লগইন", loginTitle: "ভোক্তা লগইন", regTitle: "ভোক্তা নিবন্ধন",
        namePH: "পুরো নাম", phonePH: "ফোন নম্বর", statePH: "রাজ্য", cityPH: "শহর", villagePH: "গ্রাম", passPH: "পাসওয়ার্ড", emailPH: "ইমেল", agePH: "বয়স",
        landDetailsTitle: "জমি এবং চাষের বিবরণ", saveLandBtn: "পূর্বাভাস পান →", loginBtn: "লগইন →", regBtn: "অ্যাকাউন্ট তৈরি করুন →", welcomeUser: "স্বাগত"
    },
    mr: { 
        heroBadge: "ग्राहक पोर्टल", heroLine1: "हुशारीने खा.", heroLine2: "पोषणासह वाढा.", tagline: "घराचे बाग ट्रॅक करा, पोषण लॉग करा आणि AI सल्ला मिळवा.",
        cardTitleFarmer: "शेतकरी पोर्टल", cardDescFarmer: "माती आरोग्य आणि सल्ला.", exploreFarmer: "शोधा →",
        cardTitlePerson: "ग्राहक पोर्टल", cardDescPerson: "बागांचे व्यवस्थापन आणि पोषण ट्रॅकिंग।", explorePerson: "शोधा →",
        cardTitleNgo: "एनजीओ पोर्टल", cardDescNgo: "शेतकरी समर्थन आणि प्रकल्प व्यवस्थापन।", exploreNgo: "शोधा →",
        aboutTitle: "आमचे ध्येय आणि दृष्टी", aboutText: "न्यूट्री-फार्मएआय हे कृषी ज्ञान आणि एआय चा मेळ आहे.",
        formTitle: "नोंधणी / लॉगिन", loginTitle: "ग्राहक लॉगिन", regTitle: "ग्राहक नोंदणी",
        namePH: "पूर्ण नाव", phonePH: "फोन नंबर", statePH: "राज्य", cityPH: "शहर", villagePH: "गाव", passPH: "पासवर्ड", emailPH: "ईमेल", agePH: "वय",
        landDetailsTitle: "जमीन आणि शेती तपशील", saveLandBtn: "अंदाज मिळवा →", loginBtn: "लॉगिन →", regBtn: "खाते तयार करा →", welcomeUser: "स्वागत आहे"
    },
    te: { 
        heroBadge: "వినియోగదారు పోర్టల్", heroLine1: "తెలివిగా తినండి.", heroLine2: "పోషణతో పెరగండి.", tagline: "ఇంటి తోటను ట్రాక్ చేయండి, పోషకాహారాన్ని లాగ్ చేయండి & AI సలహాలు పొందండి.",
        cardTitleFarmer: "రైతు పోర్టల్", cardDescFarmer: "నేల ఆరోగ్యం మరియు సలహా.", exploreFarmer: "అన్వేషించండి →",
        cardTitlePerson: "వినియోగదారు పోర్టల్", cardDescPerson: "తోటల నిర్వహణ మరియు పోషకాహార ట్రాకింగ్।", explorePerson: "అన్వేషించండి →",
        cardTitleNgo: "NGO పోర్టల్", cardDescNgo: "రైతులకు మద్దతు మరియు ప్రాజెక్టుల నిర్వహణ।", exploreNgo: "అన్వేషించండి →",
        aboutTitle: "మా లక్ష్యం & దృష్టి", aboutText: "న్యూట్రి-ఫామ్AI వ్యవసాయ జ్ఞానాన్ని AI తో కలుపుతుంది.",
        formTitle: "నమోదు / లాగిన్", loginTitle: "వినియోగదారు లాగిన్", regTitle: "వినియోగదారు నమోదు",
        namePH: "పూర్తి పేరు", phonePH: "ఫోన్ నంబర్", statePH: "రాష్ట్రం", cityPH: "నగరం", villagePH: "గ్రామం", passPH: "పాస్‌వర్డ్", emailPH: "ఇమెయిల్", agePH: "వయస్సు",
        landDetailsTitle: "భూమి మరియు వ్యవసాయ వివరాలు", saveLandBtn: "అంచనా పొందండి →", loginBtn: "లాగిన్ →", regBtn: "ఖాతా సృష్టించండి →", welcomeUser: "స్వాగతం"
    },
    ta: { 
        heroBadge: "நுகர்வோர் போர்டல்", heroLine1: "புத்திசாலியாக சாப்பிடுங்கள்.", heroLine2: "ஊட்டமுடன் வளருங்கள்.", tagline: "உங்கள் வீட்டுத் தோட்டத்தைக் கண்காணியுங்கள், ஊட்டச்சத்தை பதிவு செய்யுங்கள்.",
        cardTitleFarmer: "விவசாயி போர்டல்", cardDescFarmer: "மண் ஆரோக்கியம் மற்றும் ஆலோசனை.", exploreFarmer: "ஆராயுங்கள் →",
        cardTitlePerson: "நுகர்வோர் போர்டல்", cardDescPerson: "தோட்ட மேலாண்மை மற்றும் ஊட்டச்சத்து கண்காணிப்பு।", explorePerson: "ஆராயுங்கள் →",
        cardTitleNgo: "NGO போர்டல்", cardDescNgo: "விவசாயிகளுக்கு ஆதரவு மற்றும் திட்ட மேலாண்மை।", exploreNgo: "ஆராயுங்கள் →",
        aboutTitle: "எங்கள் நோக்கம் மற்றும் பார்வை", aboutText: "நியூட்ரி-ஃபார்ம்ஏஐ விவசாயத்தை AI உடன் இணைக்கிறது.",
        formTitle: "பதிவு / உள்நுழைவு", loginTitle: "நுகர்வோர் உள்நுழைவு", regTitle: "நுகர்வோர் பதிவு",
        namePH: "முழு பெயர்", phonePH: "தொலைபேசி எண்", statePH: "மாநிலம்", cityPH: "நகரம்", villagePH: "கிராமம்", passPH: "கடவுச்சொல்", emailPH: "மின்னஞ்சல்", agePH: "வயது",
        landDetailsTitle: "நிலம் மற்றும் விவசாய விவரங்கள்", saveLandBtn: "கணிப்பைப் பெறுங்கள் →", loginBtn: "உள்நுழைவு →", regBtn: "கணக்கை உருவாக்கு →", welcomeUser: "வரவேற்பு"
    },
    kn: { 
        heroBadge: "ಗ್ರಾಹಕ ಪೋರ್ಟಲ್", heroLine1: "ಬುದ್ಧಿವಂತಿಕೆಯಿಂದ ತಿನ್ನಿ.", heroLine2: "ಪೋಷಣೆಯೊಂದಿಗೆ ಬೆಳೆಯಿರಿ.", tagline: "ಮನೆ ತೋಟವನ್ನು ಟ್ರ್ಯಾಕ್ ಮಾಡಿ, ಪೋಷಣೆಯನ್ನು ಲಾಗ್ ಮಾಡಿ & AI ಒಳನೋಟಗಳನ್ನು ಪಡೆಯಿರಿ.",
        cardTitleFarmer: "ರೈತ ಪೋರ್ಟಲ್", cardDescFarmer: "ಮಣ್ಣಿನ ಆರೋಗ್ಯ ಮತ್ತು ಸಲಹೆ.", exploreFarmer: "ಅನ್ವೇಷಿಸಿ →",
        cardTitlePerson: "ಗ್ರಾಹಕ ಪೋರ್ಟಲ್", cardDescPerson: "ತೋಟದ ನಿರ್ವಹಣೆ ಮತ್ತು ಪೌಷ್ಟಿಕಾಂಶ ಟ್ರ್ಯಾಕಿಂಗ್।", explorePerson: "ಅನ್ವೇಷಿಸಿ →",
        cardTitleNgo: "NGO ಪೋರ್ಟಲ್", cardDescNgo: "ರೈತರಿಗೆ ಬೆಂಬಲ ಮತ್ತು ಯೋಜನೆಗಳ ನಿರ್ವಹಣೆ।", exploreNgo: "ಅನ್ವೇಷಿಸಿ →",
        aboutTitle: "ನಮ್ಮ ಧ್ಯೇಯ ಮತ್ತು ದೃಷ್ಟಿಕೋನ", aboutText: "ನ್ಯೂಟ್ರಿ-ಫಾರ್ಮ್‌ಎಐ ಕೃಷಿಯನ್ನು AI ನೊಂದಿಗೆ ಸಂಯೋಜಿಸುತ್ತದೆ.",
        formTitle: "ನೋಂದಣಿ / ಲಾಗಿನ್", loginTitle: "ಗ್ರಾಹಕ ಲಾಗಿನ್", regTitle: "ಗ್ರಾಹಕ ನೋಂದಣಿ",
        namePH: "ಪೂರ್ಣ ಹೆಸರು", phonePH: "ಫೋನ್ ಸಂಖ್ಯೆ", statePH: "ರಾಜ್ಯ", cityPH: "ನಗರ", villagePH: "ಹಳ್ಳಿ", passPH: "ಪಾಸ್‌ವರ್ಡ್", emailPH: "ಇಮೇಲ್", agePH: "ವಯಸ್ಸು",
        landDetailsTitle: "ಭೂಮಿ ಮತ್ತು ಕೃಷಿ ವಿವರಗಳು", saveLandBtn: "ಮುನ್ಸೂಚನೆ ಪಡೆಯಿರಿ →", loginBtn: "ಲಾಗಿನ್ →", regBtn: "ಖಾತೆ ರಚಿಸಿ →", welcomeUser: "ಸ್ವಾಗತ"
    },
    gu: { 
        heroBadge: "ગ્રાહક પોર્ટલ", heroLine1: "સ્માર્ટ ખાઓ.", heroLine2: "પોષણ સાથે વધો.", tagline: "ઘરના બગીચાને ટ્રેક કરો, પોષણ લોગ કરો અને AI અંતર્દૃષ્ટિ મેળવો.",
        cardTitleFarmer: "ખેડૂત પોર્ટલ", cardDescFarmer: "જમીન આરોગ્ય અને સલાહ.", exploreFarmer: "શોધો →",
        cardTitlePerson: "ગ્રાહક પોર્ટલ", cardDescPerson: "બગીચાનું સંચાલન અને પોષણ ટ્રેકિંગ।", explorePerson: "શોધો →",
        cardTitleNgo: "NGO પોર્ટલ", cardDescNgo: "ખેડૂતોને સહાય અને પ્રોજેક્ટ મેનેજમેન્ટ।", exploreNgo: "શોધો →",
        aboutTitle: "અમારું લક્ષ્ય અને દ્રષ્ટિકોણ", aboutText: "ન્યુટ્રી-ફાર્મએઆઈ કૃષિને AI સાથે જોડે છે.",
        formTitle: "નોંધણી / લોગિન", loginTitle: "ગ્રાહક લોગિન", regTitle: "ગ્રાહક નોંધણી",
        namePH: "પૂરું નામ", phonePH: "ફોન નંબર", statePH: "રાજ્ય", cityPH: "શહેર", villagePH: "ગામ", passPH: "પાસવર્ડ", emailPH: "ઈમેલ", agePH: "ઉંમર",
        landDetailsTitle: "જમીન અને ખેતીની વિગતો", saveLandBtn: "આગાહી મેળવો →", loginBtn: "લોગિન →", regBtn: "ખાતું બનાવો →", welcomeUser: "સ્વાગત"
    },
    pa: { 
        heroBadge: "ਖਪਤਕਾਰ ਪੋਰਟਲ", heroLine1: "ਸਮਝਦਾਰੀ ਨਾਲ ਖਾਓ.", heroLine2: "ਪੋਸ਼ਣ ਨਾਲ ਵਧੋ.", tagline: "ਆਪਣੇ ਘਰ ਦੇ ਬਾਗ਼ ਨੂੰ ਟਰੈਕ ਕਰੋ, ਪੋਸ਼ਣ ਲਾੱਗ ਕਰੋ ਅਤੇ AI ਸਲਾਹ ਪਾਓ.",
        cardTitleFarmer: "ਕਿਸਾਨ ਪੋਰਟਲ", cardDescFarmer: "ਮਿੱਟੀ ਦੀ ਸਿਹਤ ਅਤੇ ਸਲਾਹ।", exploreFarmer: "ਖੋਜੋ →",
        cardTitlePerson: "ਖਪਤਕਾਰ ਪੋਰਟਲ", cardDescPerson: "ਬਗੀਚੇ ਦਾ ਪ੍ਰਬੰਧਨ ਅਤੇ ਪੋਸ਼ਣ ਟਰੈਕਿੰਗ।", explorePerson: "ਖੋਜੋ →",
        cardTitleNgo: "NGO ਪੋਰਟਲ", cardDescNgo: "ਕਿਸਾਨਾਂ ਦੀ ਸਹਾਇਤਾ ਅਤੇ ਪ੍ਰੋਜੈਕਟ ਪ੍ਰਬੰਧਨ।", exploreNgo: "ਖੋਜੋ →",
        aboutTitle: "ਸਾਡਾ ਮਿਸ਼ਨ ਅਤੇ ਵਿਜ਼ਨ", aboutText: "ਨਿਊਟ੍ਰੀ-ਫਾਰਮਏਆਈ ਖੇਤੀਬਾੜੀ ਨੂੰ AI ਨਾਲ ਜੋੜਦਾ ਹੈ।",
        formTitle: "ਰਜਿਸਟਰ / ਲੌਗਇਨ", loginTitle: "ਖਪਤਕਾਰ ਲੌਗਿਨ", regTitle: "ਖਪਤਕਾਰ ਰਜਿਸਟ੍ਰੇਸ਼ਨ",
        namePH: "ਪੂਰਾ ਨਾਮ", phonePH: "ਫੋਨ ਨੰਬਰ", statePH: "ਰਾਜ", cityPH: "ਸ਼ਹਿਰ", villagePH: "ਪਿੰਡ", passPH: "ਪਾਸਵਰਡ", emailPH: "ਈਮੇਲ", agePH: "ਉਮર",
        landDetailsTitle: "ਜ਼ਮੀਨ ਅਤੇ ਖੇਤੀ ਦਾ ਵੇਰਵਾ", saveLandBtn: "ਭਵਿੱਖਬାਣੀ ਪ੍ਰਾਪਤ ਕਰੋ →", loginBtn: "ਲੌਗਇਨ →", regBtn: "ਖਾਤਾ ਬਣਾਓ →", welcomeUser: "ਜੀ ਆਇਆਂ ਨੂੰ"
    }
};

/* ============================================================
   2. LANGUAGE ENGINE
   ============================================================ */
function changeLanguage(lang) {
    console.log("Language changed to:", lang); 
    localStorage.setItem("userLang", lang);
    applyTranslations();
}

function applyTranslations() {
    const lang = localStorage.getItem("userLang") || "en";
    const t = translations[lang] || translations.en;

    // 1. TEXT CONTENT (Labels, Titles, etc.)
    const textIds = [
        "heroBadge", "heroLine1", "heroLine2", "greetingText", "formTitle", "welcomeUser",
        "cardTitleFarmer", "cardDescFarmer", "exploreFarmer", "cardTitlePerson", "cardDescPerson", "explorePerson",
        "cardTitleNgo", "cardDescNgo", "exploreNgo", "aboutTitle", "aboutText",
        "landDetailsTitle", "areaLabel", "soilLabel", "waterLabel", "irrigationLabel", 
        "seasonLabel", "fertilizerLabel", "investmentLabel", "prevCropLabel",
        "currCropLabel", "saveLandBtn", "optClay", "optSandy", "optLoamy", 
        "optSilt", "optRainfed", "optBorewell", "optCanal", "optPond",
        "optIrrigYes", "optIrrigPartial", "optIrrigNo", "optKharif", "optRabi", "optZaid"
    ];

    textIds.forEach(id => {
        const el = document.getElementById(id);
        if (el && t[id]) { el.innerText = t[id]; }
    });

    // Handle Auth Page specific titles if they exist
    if (document.getElementById("formTitle")) {
        // If login is currently showing (based on URL or class), use loginTitle, else regTitle or generic formTitle
        const isLoginShowing = document.getElementById("loginForm") && document.getElementById("loginForm").style.display !== "none";
        document.getElementById("formTitle").innerText = isLoginShowing ? (t.loginTitle || t.formTitle) : (t.regTitle || t.formTitle);
    }

    // 2. INPUT PLACEHOLDERS
    const inputs = {
        "fName": "namePH", "fPhone": "phonePH", "fState": "statePH", 
        "fCity": "cityPH", "fVillage": "villagePH", "fPass": "passPH", "fAge": "agePH",
        "loginPhone": "phonePH", "loginPass": "passPH",
        "cName": "namePH", "cState": "statePH", "cEmail": "emailPH", "cPass": "passPH",
        "loginEmailConsumer": "emailPH", "loginPassConsumer": "passPH",
        "landArea": "landAreaPH", "fertilizerUsage": "fertilizerPH", 
        "expectedInvestment": "investmentPH", "prevCrop": "cropPH", "currCrop": "cropPH"
    };

    for (let id in inputs) {
        let el = document.getElementById(id);
        let key = inputs[id];
        if (el && t[key]) { el.placeholder = t[key]; }
    }

    // 3. BUTTON TRANSLATIONS
    const buttons = document.querySelectorAll('button[type="submit"], .btn-join, .btn-logout');
    buttons.forEach(btn => {
        if (t.loginBtn && btn.innerText.includes("Login")) btn.innerText = t.loginBtn;
        if (t.regBtn && (btn.innerText.includes("Register") || btn.innerText.includes("CREATE"))) btn.innerText = t.regBtn;
    });
}

/* ============================================================
   3. UI NAVIGATION & LOADERS
   ============================================================ */
function goToFarmer() { window.location.href = "farmer-login.html"; }
function goToConsumer() { window.location.href = "person-login.html"; }

function showLoader(message) {
    const loader = document.getElementById("loaderOverlay");
    const text = document.getElementById("loaderText");
    if (loader) {
        if (text) text.innerText = message;
        loader.style.display = "flex";
    }
}

function hideLoader() {
    const loader = document.getElementById("loaderOverlay");
    if (loader) loader.style.display = "none";
}

/* ============================================================
   4. CONSUMER (PERSON) AUTHENTICATION
   ============================================================ */
async function handleConsumerRegister(event) {
    event.preventDefault();
    const name = document.getElementById("cName").value;
    const state = document.getElementById("cState").value;
    const email = document.getElementById("cEmail").value;
    const password = document.getElementById("cPass").value;

    showLoader("Creating Consumer Account...");

    const { data, error } = await sb.auth.signUp({
        email,
        password,
        options: { data: { full_name: name, state: state, role: 'consumer' } }
    });

    if (error) {
        hideLoader();
        alert("Registration Error: " + error.message);
    } else {
        const { error: dbError } = await sb.from('consumers').insert([
            { id: data.user.id, name: name, state: state, email: email }
        ]);
        
        hideLoader();
        if (dbError) {
             console.error("Profile saving error:", dbError);
        }
        alert("Account Created! Redirecting to Health Profile...");
        window.location.href = "health-profile.html";
    }
}

async function handleConsumerLogin(event) {
    event.preventDefault();
    const email = document.getElementById("loginEmailConsumer").value;
    const password = document.getElementById("loginPassConsumer").value;

    showLoader("Logging in...");

    const { data, error } = await sb.auth.signInWithPassword({ email, password });

    if (error) {
        hideLoader();
        alert("Login Failed: " + error.message);
    } else {
        hideLoader();
        window.location.href = "health-profile.html";
    }
}

/* ============================================================
   5. FARMER AUTHENTICATION
   ============================================================ */
async function handleFarmerSubmit(event) {
    event.preventDefault(); 
    const nameVal = document.getElementById("fName")?.value;
    const stateVal = document.getElementById("fState")?.value || "NA";
    const phoneVal = document.getElementById("fPhone")?.value;
    const password = document.getElementById("fPass")?.value;
    const email = phoneVal + "@nutrifarm.com"; 

    const statePart = stateVal.substring(0, 2).toUpperCase();
    const randomPart = Math.floor(10000 + Math.random() * 90000);
    const uniqueFarmerID = statePart + randomPart;

    showLoader("Registering...");

    const { data, error } = await sb.auth.signUp({ email, password });

    if (error) {
        hideLoader();
        alert("Registration Failed: " + error.message);
        return;
    } 

    showLoader("GENERATING UNIQUE ID: " + uniqueFarmerID + "...");

    const { error: dbError } = await sb.from('farmers').insert([
        { 
            id: data.user.id, 
            farmer_custom_id: uniqueFarmerID,
            name: nameVal, 
            phone: phoneVal, 
            state: stateVal,
            district: document.getElementById("fCity")?.value,
            village: document.getElementById("fVillage")?.value,
            age: document.getElementById("fAge")?.value
        }
    ]);

    if(dbError) {
        hideLoader(); 
        console.error("Supabase Error:", dbError);
        alert("Real Error: " + dbError.message);
    } else {
        setTimeout(() => {
            window.location.href = "land-details.html"; 
        }, 3000);
    }
}

async function handlePhoneLogin(event) {
    event.preventDefault(); 
    const phone = document.getElementById("loginPhone").value;
    const pass = document.getElementById("loginPass").value;
    const email = phone + "@nutrifarm.com";

    showLoader("Authenticating...");

    const { data, error } = await sb.auth.signInWithPassword({ email, password: pass });
    
    if (error) {
        hideLoader();
        alert("Login Error: " + error.message);
    } else {
        showLoader("Fetching Land Analytics...");
        setTimeout(() => {
            window.location.href = "farmer-dashboard.html"; 
        }, 1500);
    }
}

/* ============================================================
   6. LAND SUBMISSION & ML-BACKED CROP PREDICTION
   ============================================================ */
// Same-origin Flask backend (app.py serves this frontend directly).
// If you deploy the frontend separately, point this at the backend's URL.
const API_BASE = "https://nutrifarm-ai.vercel.app";

async function handleLandSubmit(event) {
    event.preventDefault();
    console.log("Land Submit Button Clicked!");

    const getVal = (id) => document.getElementById(id)?.value || "";

    if (typeof sb === 'undefined') {
        alert("Supabase is not loaded! Please check your script tags.");
        return;
    }
    const { data: { user }, error: authError } = await sb.auth.getUser();

    if (authError || !user) {
        alert("Session lost! Please log in again to save your land details.");
        window.location.href = "farmer-login.html";
        return;
    }

    const payload = {
        landArea: getVal("landArea"),
        soilType: getVal("soilType"),
        soilPH: getVal("soilPH"),
        waterSource: getVal("waterSource"),
        irrigationAvail: getVal("irrigationAvail"),
        season: getVal("season"),
        investment: getVal("investment"),
        fertilizer: getVal("fertilizer"),
        prevCrop: getVal("prevCrop"),
        currCrop: getVal("currCrop"),
    };

    let prediction = null;
    try {
        const response = await fetch(`${API_BASE}/predict_crop`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            prediction = await response.json();
            const topList = prediction.top_matches
                .map(m => `${m.crop} (${m.match_percentage}%)`)
                .join("\n");
            alert(`📊 AI PREDICTION COMPLETE!\n\n🏆 Top Recommendation: ${prediction.recommended_crop} (${prediction.match_percentage}% match)\n\nOther good options:\n${topList}\n\nSoil Health Score: ${prediction.soil_health_score}/100`);
        } else {
            console.warn("Prediction API returned an error", await response.text());
            alert("Prediction engine returned an error. Saving profile anyway...");
        }
    } catch (error) {
        console.error("Prediction API Error:", error);
        alert("Prediction engine offline (is the Flask backend running?). Saving profile anyway...");
    }

    try {
        const landData = {
            area: getVal("landArea"),
            soil: getVal("soilType") || "N/A",
            ph: getVal("soilPH") || "N/A",
            water: getVal("waterSource"),
            season: getVal("season") || "N/A",
            ai_recommended_crop: prediction ? prediction.recommended_crop : "Unavailable",
            ai_match_percentage: prediction ? prediction.match_percentage : null,
            ai_top_matches: prediction ? prediction.top_matches : null,
            lastUpdated: new Date(),
        };

        console.log("Saving to Supabase...", landData);

        const { error } = await sb.from('farmers').update({ land_details: landData }).eq('id', user.id);

        if (!error) {
            window.location.href = "farmer-dashboard.html";
        } else {
            alert("Error saving data to database: " + error.message);
        }
    } catch (err) {
        console.error("Unexpected DB Error:", err);
    }
}

/* ─── LOCATION CAPTURE (for "find this dish near me" feature) ─── */
function captureLocation() {
    const statusEl = document.getElementById("locStatus");
    const btnEl = document.getElementById("detectLocBtn");
    if (!statusEl) return;

    if (!navigator.geolocation) {
        statusEl.textContent = "Geolocation not supported on this browser.";
        return;
    }

    statusEl.textContent = "Detecting...";
    if (btnEl) btnEl.disabled = true;

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            document.getElementById("userLat").value = pos.coords.latitude;
            document.getElementById("userLng").value = pos.coords.longitude;
            statusEl.textContent = "✓ Location captured";
            if (btnEl) btnEl.disabled = false;
        },
        (err) => {
            console.warn("Geolocation error:", err);
            statusEl.textContent = "Permission denied — you can still continue without it.";
            if (btnEl) btnEl.disabled = false;
        },
        { enableHighAccuracy: false, timeout: 8000 }
    );
}
window.captureLocation = captureLocation;

async function handleHealthSubmit(event) {
    event.preventDefault();
    const getVal = (id) => document.getElementById(id)?.value || "";
    const { data: { user } } = await sb.auth.getUser();

    if (!user) {
        alert("Session lost! Please log in again.");
        window.location.href = "person-login.html";
        return;
    }

    const payload = {
        healthCondition: getVal("healthCondition") || "none",
        allergies: getVal("allergies"),
        foodPreference: getVal("foodPreference") || "veg",
        mealType: getVal("mealType") || "North Indian",
        budgetPref: getVal("budgetPref") || "medium",
        lifeStage: getVal("lifeStage") || "standard",
    };

    let thali = null;
    try {
        const response = await fetch(`${API_BASE}/recommend_thali`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
        });
        if (response.ok) {
            thali = await response.json();
            const plan = thali.thali_plan;
            let msg = `🍽️ YOUR RECOMMENDED THALI (${thali.region_style})\n\n`;
            msg += `Grain: ${plan.grain}\nDal/Curry: ${plan.dal_or_curry}\nVegetable: ${plan.vegetable}\nProtein: ${plan.protein}\nSide: ${plan.side}\n\n`;
            msg += `Health note: ${thali.health_note}\n`;
            if (thali.life_stage_note) msg += `${thali.life_stage_note}\n`;
            if (thali.allergy_warnings.length) msg += `\n⚠️ ${thali.allergy_warnings.join(" ")}`;
            alert(msg);
        } else {
            console.warn("Thali API returned an error", await response.text());
        }
    } catch (error) {
        console.error("Thali API Error:", error);
        alert("Recommendation engine offline (is the Flask backend running?). Saving profile anyway...");
    }

    const healthData = {
        condition: payload.healthCondition,
        allergies: payload.allergies,
        foodPreference: payload.foodPreference,
        mealType: payload.mealType,
        budgetPref: payload.budgetPref,
        lifeStage: payload.lifeStage,
        recommended_thali: thali ? thali.thali_plan : null,
        latitude: getVal("userLat") || null,
        longitude: getVal("userLng") || null,
        submissionDate: new Date(),
    };
    const { error } = await sb.from('consumers').update({ health_profile: healthData }).eq('id', user.id);
    if (!error) { window.location.href = "person-dashboard.html"; }
    else { alert("Error saving profile: " + error.message); }
}

/* ============================================================
   7. APP INITIALIZATION & LOGOUT
   ============================================================ */
async function logout() { await sb.auth.signOut(); window.location.href = "index.html"; }

document.addEventListener("DOMContentLoaded", function() {
    applyTranslations();

    // Bind Consumer Forms
    const regForm = document.getElementById("regForm");
    const loginForm = document.getElementById("loginForm");
    if (regForm) regForm.addEventListener("submit", handleConsumerRegister);
    if (loginForm) loginForm.addEventListener("submit", handleConsumerLogin);

    // Bind Farmer Forms
    const farmerReg = document.getElementById("farmerRegForm");
    const farmerLog = document.getElementById("loginPhoneForm");
    if (farmerReg) farmerReg.addEventListener("submit", handleFarmerSubmit);
    if (farmerLog) farmerLog.addEventListener("submit", handlePhoneLogin);
    
    // Bind Land Form
    const landForm = document.getElementById("landForm");
    if(landForm) landForm.addEventListener("submit", handleLandSubmit);
});

window.onload = async function() {
    const savedLang = localStorage.getItem("userLang") || "en";
    if (document.getElementById("homeLangSelect")) document.getElementById("homeLangSelect").value = savedLang;
    applyTranslations();

    const { data: { user } } = await sb.auth.getUser();
    if (user && document.getElementById("welcomeUser")) {
        const { data } = await sb.from('farmers').select('*').eq('id', user.id).single();
        if (data) document.getElementById("welcomeUser").innerText = "Welcome, " + data.name;
    }
    const greetingEl = document.getElementById("greetingText");
    if (greetingEl) {
        const hour = new Date().getHours();
        if (hour < 12) greetingEl.innerText = "Good Morning! Ready to check your dashboard?";
        else if (hour < 18) greetingEl.innerText = "Good Afternoon! Optimization is just a click away.";
        else greetingEl.innerText = "Good Evening! Planning for tomorrow?";
    }
};

/* ============================================================
   8. NGO & AI LOGIC
   ============================================================ */
function showUpcoming() {
    const section = document.getElementById("upcomingSection");
    const list = document.getElementById("upcomingList");
    const projects = [ { title: "Millet Mission Workshop", date: "Oct 15, 2025", goal: "Increase iron intake" } ];
    list.innerHTML = "";
    projects.forEach(proj => { list.innerHTML += `<div style="padding:10px; border-bottom:1px solid #444;"><strong>${proj.title}</strong><br>📅 ${proj.date}</div>`; });
    section.style.display = section.style.display === "none" ? "block" : "none";
}

/* ============================================================
   9. CSV DATABASE ENGINE (SEASON & SOIL ONLY) - Legacy support
   ============================================================ */
async function farmerOutput() {
    const userSeason = document.getElementById("season").value;
    const userSoil = document.getElementById("soil").value;

    try {
        const response = await fetch('mock_data.csv');
        if (!response.ok) throw new Error("Could not find mock_data.csv");
        
        const csvText = await response.text();
        const rows = csvText.split('\n'); 
        
        let matchCount = 0;
        let cropCounts = {};

        for (let i = 1; i < rows.length; i++) {
            const columns = rows[i].split(',');

            if (columns.length >= 3) {
                const rowSeason = columns[0].trim();
                const rowSoil = columns[1].trim();
                const rowCrop = columns[2].trim();

                if (rowSeason === userSeason && rowSoil === userSoil) {
                    matchCount++;
                    cropCounts[rowCrop] = (cropCounts[rowCrop] || 0) + 1;
                }
            }
        }

        let bestCrop = "Millets (Drought Resistant)";
        let maxCount = 0;

        for (const crop in cropCounts) {
            if (cropCounts[crop] > maxCount) {
                maxCount = cropCounts[crop];
                bestCrop = crop;
            }
        }

        if (matchCount === 0) {
            alert(`No historical data found for ${userSoil} soil during ${userSeason}. We recommend Millets.`);
        } else {
            alert(`📊 Scanned Database...\n\n🌱 Condition: ${userSoil} soil during ${userSeason}\n\n🏆 Top Recommendation: ${bestCrop}\n(Based on ${matchCount} successful local farms)`);
        }

    } catch (error) {
        console.error("CSV Loading Error:", error);
        alert("Error loading data. Are you running this via VS Code Live Server?");
    }
}

// ==========================================
// GLOBAL BINDINGS
// ==========================================
window.handleFarmerSubmit = handleFarmerSubmit;
window.handlePhoneLogin = handlePhoneLogin;
window.handleLandSubmit = handleLandSubmit;
window.handleHealthSubmit = handleHealthSubmit;
window.changeLanguage = changeLanguage;
window.goToFarmer = goToFarmer;
window.goToConsumer = goToConsumer;
window.logout = logout;
window.showUpcoming = showUpcoming;
window.farmerOutput = farmerOutput;

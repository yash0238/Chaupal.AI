/**
 * Self-contained i18n for the landing page.
 * Real UI translations (not a translate widget) for the 5 supported languages.
 * The page keeps icons/colors/links in code and pulls text from here by index.
 */

export type Locale = "en" | "hi" | "mr" | "ta" | "te";

export const LANGS: { code: Locale; label: string; flag: string }[] = [
  { code: "en", label: "English", flag: "🇬🇧" },
  { code: "hi", label: "हिंदी", flag: "🇮🇳" },
  { code: "mr", label: "मराठी", flag: "🇮🇳" },
  { code: "ta", label: "தமிழ்", flag: "🇮🇳" },
  { code: "te", label: "తెలుగు", flag: "🇮🇳" },
];

export interface Item {
  title: string;
  desc: string;
}

export interface Copy {
  eyebrow: string;
  tagline: string;
  subtitle: string;
  getStarted: string;
  watchDemo: string;
  statLabels: [string, string, string, string];
  featuresHeading: string;
  features: Item[];
  problemHeading: string;
  problems: Item[];
  solutionHeading: string;
  solutions: Item[];
  techHeading: string;
  tech: Item[];
  ctaHeading: string;
  ctaSubtitle: string;
  ctaButton: string;
  footerTagline: string;
  footerPowered: string;
  live: string;
  comingSoon: string;
  docs: string;
}

export const COPY: Record<Locale, Copy> = {
  en: {
    eyebrow: "HACKHAZARDS '26 · Climate & Sustainability Systems",
    tagline: "Climate-Resilient Farm Decision Intelligence",
    subtitle:
      "AI for sustainable agriculture. Diagnose crop disease, cut water and input waste, and build climate resilience — one platform, every decision.",
    getStarted: "Launch Platform",
    watchDemo: "Watch Demo",
    statLabels: ["Farm records analyzed", "Faster insights (GPU)", "UN SDGs advanced", "Languages supported"],
    featuresHeading: "Climate-Smart Tools, One Platform",
    features: [
      { title: "AI Crop Diagnosis", desc: "Snap a leaf photo for instant disease detection — and cut pesticide overuse with precise, targeted treatment. Powered by Gemini Vision." },
      { title: "Climate Risk Score", desc: "A live 0–100 score fusing weather, disease, and crop-health signals — so you act before climate shocks cause losses." },
      { title: "Water-Smart Weather", desc: "7-day forecast with disease-risk windows and resource-efficient irrigation guidance that reduces water waste." },
      { title: "Multilingual AI Assistant", desc: "Ask any sustainable-farming question in your own language and get an instant, explainable answer." },
      { title: "Scheme & Subsidy Finder", desc: "Match to government support you're eligible for — PM-KISAN, crop insurance, green subsidies — all in one place." },
      { title: "Environmental Analytics", desc: "Disease trends and risk patterns across 500K farms for real-time environmental monitoring and data-driven insight." },
      { title: "Voice Assistant", desc: "Speak your question and hear the answer read aloud in 5 languages — hands-free and built for low-literacy access. Powered by Sarvam AI." },
    ],
    problemHeading: "Farming in a Changing Climate",
    problems: [
      { title: "Volatile Weather", desc: "Unseasonal rain and heat stress hit without warning — farmers have no actionable early signal." },
      { title: "Wasted Resources", desc: "Over-irrigation and excess chemical use drain water tables, raise emissions, and cut margins." },
      { title: "Undiagnosed Disease", desc: "Crop disease spreads undetected until it destroys up to 40% of yield." },
      { title: "Excluded by Language", desc: "Most agri-tools are English-only, locking out the farmers who need them most." },
    ],
    solutionHeading: "A Climate-Resilient Solution",
    solutions: [
      { title: "Unified & Actionable", desc: "Diagnosis, weather, risk, schemes, and chat in one place — with clear yes/no decisions, not just raw data." },
      { title: "Resource Efficiency", desc: "Guidance that reduces water, pesticide, and input waste — sustainability that also saves money." },
      { title: "Inclusive & Multilingual", desc: "Fully usable in 5 Indian languages, switchable anytime. Voice support is next." },
      { title: "Built for the Last Mile", desc: "Offline-first Progressive Web App with cached data for low-connectivity rural areas — planned next." },
    ],
    techHeading: "Powered by Cutting-Edge Technology",
    tech: [
      { title: "Google Gemini 2.5", desc: "Multimodal vision + reasoning at the core of every diagnosis and decision." },
      { title: "Multi-Agent AI", desc: "Six specialized, durable AI agents orchestrate every recommendation." },
      { title: "NVIDIA RAPIDS", desc: "22.58× average GPU speedup (cuDF) for real-time, scalable analytics." },
      { title: "BigQuery", desc: "500K-record climate & farm analytics warehouse, queried in real time." },
      { title: "Looker Studio", desc: "Interactive sustainability dashboards built directly on BigQuery." },
      { title: "Next.js + FastAPI", desc: "Modern, fast, production-ready full-stack architecture on Vercel + Render." },
    ],
    ctaHeading: "Farm Smarter. Farm Greener.",
    ctaSubtitle: "Join farmers using AI to boost yields, cut waste, and build climate resilience.",
    ctaButton: "Launch Platform",
    footerTagline: "Built for HACKHAZARDS '26 — Climate & Sustainability Systems",
    footerPowered: "Google Gemini • NVIDIA RAPIDS • BigQuery • Looker • Next.js • FastAPI",
    live: "Live",
    comingSoon: "Coming soon",
    docs: "Documentation",
  },

  hi: {
    eyebrow: "HACKHAZARDS '26 · जलवायु और स्थिरता",
    tagline: "जलवायु-सक्षम कृषि निर्णय बुद्धिमत्ता",
    subtitle:
      "टिकाऊ खेती के लिए AI। फसल रोग पहचानें, पानी और इनपुट की बर्बादी घटाएँ, और जलवायु सहनशीलता बनाएँ — एक मंच, हर निर्णय।",
    getStarted: "प्लेटफ़ॉर्म खोलें",
    watchDemo: "डेमो देखें",
    statLabels: ["विश्लेषित कृषि रिकॉर्ड", "तेज़ अंतर्दृष्टि (GPU)", "समर्थित UN SDG", "समर्थित भाषाएँ"],
    featuresHeading: "एक ही मंच पर वह सब जो आपको चाहिए",
    features: [
      { title: "फसल निदान", desc: "फसल की तस्वीर अपलोड करें। Gemini Vision से तुरंत रोग पहचान और उपचार पाएं।" },
      { title: "फार्म जोखिम स्कोर", desc: "0 से 100 तक रीयल-टाइम जोखिम आकलन। सेकंडों में अपने खेत की सेहत जानें।" },
      { title: "मौसम बुद्धिमत्ता", desc: "7-दिन का पूर्वानुमान और रोग-जोखिम भविष्यवाणी। आज सिंचाई करें या नहीं? हम बताते हैं।" },
      { title: "Krishivaani से पूछें", desc: "किसी भी कृषि प्रश्न के लिए AI सहायक। अपनी भाषा में पूछें, तुरंत उत्तर पाएं।" },
      { title: "सरकारी योजनाएँ", desc: "जिन योजनाओं के आप पात्र हैं उन्हें खोजें — पीएम-किसान, बीमा, ऋण — सब एक जगह।" },
      { title: "एनालिटिक्स डैशबोर्ड", desc: "500K रिकॉर्ड से रोग रुझान और जोखिम पैटर्न। बेहतर खेती के लिए डेटा-आधारित अंतर्दृष्टि।" },
      { title: "वॉइस असिस्टेंट", desc: "अपना सवाल बोलें और जवाब 5 भाषाओं में सुनें — बिना हाथ लगाए और कम पढ़े-लिखे किसानों के लिए। Sarvam AI द्वारा संचालित।" },
    ],
    problemHeading: "जिस समस्या को हम हल करते हैं",
    problems: [
      { title: "बिखरी हुई जानकारी", desc: "मौसम ऐप, यूट्यूब, व्हाट्सएप समूह, विक्रेता — बहुत सारे बिखरे स्रोत।" },
      { title: "गलत निर्णय", desc: "गलत कीटनाशक समय। अधिक सिंचाई। छूटे हुए रोग। आय की हानि।" },
      { title: "भाषा की बाधाएँ", desc: "अधिकांश ऐप केवल अंग्रेज़ी में। अधिकांश किसान अपनी स्थानीय भाषा पसंद करते हैं।" },
      { title: "कोई व्यावहारिक सलाह नहीं", desc: "ऐप डेटा दिखाते हैं। किसानों को निर्णय चाहिए: 'आज मुझे क्या करना चाहिए?'" },
    ],
    solutionHeading: "Krishivaani समाधान",
    solutions: [
      { title: "एक मंच", desc: "सभी जानकारी एकीकृत — निदान, मौसम, जोखिम, योजनाएँ और चैट।" },
      { title: "व्यावहारिक निर्णय", desc: "सिर्फ डेटा नहीं। स्पष्ट हाँ/नहीं उत्तर: 'कल सुबह छिड़काव करें।'" },
      { title: "बहुभाषी", desc: "पेज के ऊपर से कभी भी 5 भारतीय भाषाओं में उपयोग करें। आवाज़ समर्थन अगला।" },
      { title: "ऑफ़लाइन-प्रथम", desc: "कम कनेक्टिविटी वाले क्षेत्रों के लिए कैश्ड डेटा के साथ प्रोग्रेसिव वेब ऐप — अगला नियोजित।" },
    ],
    techHeading: "अत्याधुनिक तकनीक द्वारा संचालित",
    tech: [
      { title: "Google Gemini", desc: "मल्टीमॉडल टेक्स्ट और विज़न बुद्धिमत्ता के लिए Gemini 2.5।" },
      { title: "मल्टी-एजेंट बैकएंड", desc: "छह विशेष AI एजेंट हर निर्णय का संचालन करते हैं।" },
      { title: "NVIDIA RAPIDS", desc: "जीपीयू त्वरण (cuDF) के साथ एनालिटिक्स पर औसतन 22.58× तेज़।" },
      { title: "BigQuery", desc: "500K-रिकॉर्ड एनालिटिक्स वेयरहाउस, रीयल-टाइम में क्वेरी।" },
      { title: "Looker Studio", desc: "सीधे BigQuery पर बने इंटरैक्टिव डैशबोर्ड।" },
      { title: "Next.js + FastAPI", desc: "आधुनिक, तेज़, उत्पादन-तैयार फुल-स्टैक आर्किटेक्चर।" },
    ],
    ctaHeading: "स्मार्ट निर्णय लेने के लिए तैयार हैं?",
    ctaSubtitle: "उपज बढ़ाने और नुकसान कम करने के लिए AI का उपयोग करने वाले किसानों से जुड़ें।",
    ctaButton: "मुफ़्त शुरू करें",
    footerTagline: "HACKHAZARDS '26 — Climate & Sustainability Systems के लिए निर्मित",
    footerPowered: "संचालित: Google Gemini • NVIDIA RAPIDS • BigQuery • Looker",
    live: "लाइव",
    comingSoon: "जल्द आ रहा है",
    docs: "दस्तावेज़",
  },

  mr: {
    eyebrow: "HACKHAZARDS '26 · हवामान आणि शाश्वतता",
    tagline: "हवामान-सक्षम शेती निर्णय बुद्धिमत्ता",
    subtitle:
      "शाश्वत शेतीसाठी AI. पीक रोग ओळखा, पाणी व निविष्ठांची नासाडी कमी करा, आणि हवामान सहनशीलता निर्माण करा — एकच व्यासपीठ, प्रत्येक निर्णय.",
    getStarted: "प्लॅटफॉर्म उघडा",
    watchDemo: "डेमो पहा",
    statLabels: ["विश्लेषित शेती नोंदी", "जलद अंतर्दृष्टी (GPU)", "समर्थित UN SDG", "समर्थित भाषा"],
    featuresHeading: "एकाच व्यासपीठावर आवश्यक ते सर्व",
    features: [
      { title: "पीक निदान", desc: "पिकाचा फोटो अपलोड करा. Gemini Vision कडून त्वरित रोग ओळख आणि उपचार मिळवा." },
      { title: "शेती जोखीम स्कोअर", desc: "0 ते 100 पर्यंत रिअल-टाइम जोखीम मूल्यांकन. काही सेकंदात तुमच्या शेताचे आरोग्य जाणून घ्या." },
      { title: "हवामान बुद्धिमत्ता", desc: "7-दिवसांचा अंदाज आणि रोग-जोखीम भाकीत. आज पाणी द्यावे का? आम्ही सांगतो." },
      { title: "Krishivaani ला विचारा", desc: "कोणत्याही शेती प्रश्नासाठी AI सहाय्यक. तुमच्या भाषेत विचारा, त्वरित उत्तर मिळवा." },
      { title: "सरकारी योजना", desc: "तुम्ही पात्र असलेल्या योजना शोधा — पीएम-किसान, विमा, कर्ज — सर्व एका ठिकाणी." },
      { title: "अ‍ॅनालिटिक्स डॅशबोर्ड", desc: "500K नोंदींमधून रोग कल आणि जोखीम नमुने. उत्तम शेतीसाठी डेटा-आधारित अंतर्दृष्टी." },
      { title: "व्हॉइस असिस्टंट", desc: "तुमचा प्रश्न बोला आणि उत्तर 5 भाषांमध्ये ऐका — हात न लावता आणि कमी साक्षर शेतकऱ्यांसाठी. Sarvam AI द्वारे समर्थित." },
    ],
    problemHeading: "आम्ही सोडवत असलेली समस्या",
    problems: [
      { title: "विखुरलेली माहिती", desc: "हवामान अ‍ॅप्स, यूट्यूब, व्हॉट्सअ‍ॅप गट, विक्रेते — खूप विखुरलेले स्रोत." },
      { title: "चुकीचे निर्णय", desc: "चुकीची कीटकनाशक वेळ. अति सिंचन. चुकलेले रोग. उत्पन्नाचे नुकसान." },
      { title: "भाषेचे अडथळे", desc: "बहुतेक अ‍ॅप्स फक्त इंग्रजीत. बहुतेक शेतकरी त्यांची स्थानिक भाषा पसंत करतात." },
      { title: "कृतीयोग्य सल्ला नाही", desc: "अ‍ॅप्स डेटा दाखवतात. शेतकऱ्यांना निर्णय हवेत: 'आज मी काय करावे?'" },
    ],
    solutionHeading: "Krishivaani उपाय",
    solutions: [
      { title: "एकच व्यासपीठ", desc: "सर्व माहिती एकत्रित — निदान, हवामान, जोखीम, योजना आणि चॅट." },
      { title: "कृतीयोग्य निर्णय", desc: "फक्त डेटा नाही. स्पष्ट होय/नाही उत्तरे: 'उद्या सकाळी फवारणी करा.'" },
      { title: "बहुभाषिक", desc: "पेजच्या वरून कधीही 5 भारतीय भाषांमध्ये वापरा. आवाज समर्थन पुढील." },
      { title: "ऑफलाइन-प्रथम", desc: "कमी कनेक्टिव्हिटी भागांसाठी कॅश्ड डेटासह प्रोग्रेसिव्ह वेब अ‍ॅप — पुढील नियोजित." },
    ],
    techHeading: "अत्याधुनिक तंत्रज्ञानाने सज्ज",
    tech: [
      { title: "Google Gemini", desc: "मल्टीमॉडल मजकूर आणि व्हिजन बुद्धिमत्तेसाठी Gemini 2.5." },
      { title: "मल्टी-एजंट बॅकएंड", desc: "सहा विशेष AI एजंट प्रत्येक निर्णय हाताळतात." },
      { title: "NVIDIA RAPIDS", desc: "जीपीयू प्रवेग (cuDF) सह अ‍ॅनालिटिक्सवर सरासरी 22.58× वेगवान." },
      { title: "BigQuery", desc: "500K-नोंदी अ‍ॅनालिटिक्स वेअरहाऊस, रिअल-टाइममध्ये क्वेरी." },
      { title: "Looker Studio", desc: "थेट BigQuery वर तयार केलेले इंटरॅक्टिव्ह डॅशबोर्ड." },
      { title: "Next.js + FastAPI", desc: "आधुनिक, वेगवान, उत्पादन-सज्ज फुल-स्टॅक आर्किटेक्चर." },
    ],
    ctaHeading: "हुशार निर्णय घेण्यास तयार आहात?",
    ctaSubtitle: "उत्पादन वाढवण्यासाठी आणि नुकसान कमी करण्यासाठी AI वापरणाऱ्या शेतकऱ्यांमध्ये सामील व्हा.",
    ctaButton: "विनामूल्य सुरू करा",
    footerTagline: "HACKHAZARDS '26 — Climate & Sustainability Systems साठी तयार",
    footerPowered: "समर्थित: Google Gemini • NVIDIA RAPIDS • BigQuery • Looker",
    live: "लाइव्ह",
    comingSoon: "लवकरच येत आहे",
    docs: "दस्तऐवज",
  },

  ta: {
    eyebrow: "HACKHAZARDS '26 · காலநிலை & நிலைத்தன்மை",
    tagline: "காலநிலை-தாங்கு வேளாண் முடிவு நுண்ணறிவு",
    subtitle:
      "நிலையான வேளாண்மைக்கான AI. பயிர் நோயைக் கண்டறியுங்கள், நீர் மற்றும் இடுபொருள் விரயத்தைக் குறையுங்கள், காலநிலை தாங்குதிறனை உருவாக்குங்கள் — ஒரே தளம், ஒவ்வொரு முடிவும்.",
    getStarted: "தளத்தைத் தொடங்கு",
    watchDemo: "டெமோவைப் பார்க்கவும்",
    statLabels: ["பகுப்பாய்வு பதிவுகள்", "வேகமான நுண்ணறிவு (GPU)", "முன்னேற்றிய UN SDGs", "ஆதரிக்கப்படும் மொழிகள்"],
    featuresHeading: "ஒரே தளத்தில் உங்களுக்குத் தேவையான அனைத்தும்",
    features: [
      { title: "பயிர் நோய் கண்டறிதல்", desc: "பயிர் புகைப்படத்தைப் பதிவேற்றவும். Gemini Vision மூலம் உடனடி நோய் கண்டறிதல் மற்றும் சிகிச்சை பெறவும்." },
      { title: "பண்ணை ஆபத்து மதிப்பெண்", desc: "0 முதல் 100 வரை நிகழ்நேர ஆபத்து மதிப்பீடு. நொடிகளில் உங்கள் பண்ணையின் ஆரோக்கியத்தை அறியவும்." },
      { title: "வானிலை நுண்ணறிவு", desc: "7-நாள் முன்னறிவிப்பு மற்றும் நோய்-ஆபத்து கணிப்பு. இன்று பாசனம் செய்யலாமா? நாங்கள் சொல்கிறோம்." },
      { title: "Krishivaani-ஐக் கேளுங்கள்", desc: "எந்த வேளாண் கேள்விக்கும் AI உதவியாளர். உங்கள் மொழியில் கேளுங்கள், உடனடி பதில் பெறுங்கள்." },
      { title: "அரசு திட்டங்கள்", desc: "நீங்கள் தகுதியுள்ள திட்டங்களைக் கண்டறியவும் — PM-KISAN, காப்பீடு, கடன் — அனைத்தும் ஒரே இடத்தில்." },
      { title: "பகுப்பாய்வு டாஷ்போர்டு", desc: "500K பதிவுகளிலிருந்து நோய் போக்குகள் மற்றும் ஆபத்து வடிவங்கள். சிறந்த வேளாண்மைக்கான தரவு சார்ந்த நுண்ணறிவு." },
      { title: "குரல் உதவியாளர்", desc: "உங்கள் கேள்வியைப் பேசுங்கள், பதிலை 5 மொழிகளில் கேளுங்கள் — கை பயன்படுத்தாமல், படிப்பறிவு குறைந்த விவசாயிகளுக்காக. Sarvam AI மூலம் இயக்கப்படுகிறது." },
    ],
    problemHeading: "நாங்கள் தீர்க்கும் பிரச்சனை",
    problems: [
      { title: "சிதறிய தகவல்", desc: "வானிலை செயலிகள், யூட்யூப், வாட்ஸ்அப் குழுக்கள், விற்பனையாளர்கள் — பல சிதறிய ஆதாரங்கள்." },
      { title: "தவறான முடிவுகள்", desc: "தவறான பூச்சிக்கொல்லி நேரம். அதிக பாசனம். தவறவிட்ட நோய்கள். வருமான இழப்பு." },
      { title: "மொழித் தடைகள்", desc: "பெரும்பாலான செயலிகள் ஆங்கிலத்தில் மட்டுமே. பெரும்பாலான விவசாயிகள் தங்கள் உள்ளூர் மொழியை விரும்புகிறார்கள்." },
      { title: "செயல்படுத்தக்கூடிய ஆலோசனை இல்லை", desc: "செயலிகள் தரவைக் காட்டுகின்றன. விவசாயிகளுக்கு முடிவுகள் தேவை: 'இன்று நான் என்ன செய்ய வேண்டும்?'" },
    ],
    solutionHeading: "Krishivaani தீர்வு",
    solutions: [
      { title: "ஒரே தளம்", desc: "அனைத்து தகவலும் ஒருங்கிணைக்கப்பட்டது — நோய் கண்டறிதல், வானிலை, ஆபத்து, திட்டங்கள் மற்றும் அரட்டை." },
      { title: "செயல்படுத்தக்கூடிய முடிவுகள்", desc: "வெறும் தரவு அல்ல. தெளிவான ஆம்/இல்லை பதில்கள்: 'நாளை காலை தெளிக்கவும்.'" },
      { title: "பன்மொழி", desc: "பக்கத்தின் மேலிருந்து எப்போது வேண்டுமானாலும் 5 இந்திய மொழிகளில் பயன்படுத்தவும். குரல் ஆதரவு அடுத்தது." },
      { title: "ஆஃப்லைன்-முதல்", desc: "குறைந்த இணைப்புள்ள பகுதிகளுக்கு தேக்ககப்பட்ட தரவுடன் Progressive Web App — அடுத்ததாக திட்டமிடப்பட்டுள்ளது." },
    ],
    techHeading: "அதிநவீன தொழில்நுட்பத்தால் இயக்கப்படுகிறது",
    tech: [
      { title: "Google Gemini", desc: "பன்முக உரை மற்றும் பார்வை நுண்ணறிவுக்கான Gemini 2.5." },
      { title: "மல்டி-ஏஜென்ட் பேக்கெண்ட்", desc: "ஆறு சிறப்பு AI ஏஜென்டுகள் ஒவ்வொரு முடிவையும் நிர்வகிக்கின்றன." },
      { title: "NVIDIA RAPIDS", desc: "GPU முடுக்கம் (cuDF) மூலம் பகுப்பாய்வில் சராசரியாக 22.58× வேகம்." },
      { title: "BigQuery", desc: "500K-பதிவு பகுப்பாய்வு கிடங்கு, நிகழ்நேரத்தில் வினவப்படுகிறது." },
      { title: "Looker Studio", desc: "நேரடியாக BigQuery மீது உருவாக்கப்பட்ட ஊடாடும் டாஷ்போர்டுகள்." },
      { title: "Next.js + FastAPI", desc: "நவீன, வேகமான, உற்பத்திக்குத் தயார் ஃபுல்-ஸ்டேக் கட்டமைப்பு." },
    ],
    ctaHeading: "புத்திசாலித்தனமான முடிவுகளை எடுக்கத் தயாரா?",
    ctaSubtitle: "விளைச்சலை அதிகரிக்கவும் இழப்புகளைக் குறைக்கவும் AI-ஐப் பயன்படுத்தும் விவசாயிகளுடன் இணையுங்கள்.",
    ctaButton: "இலவசமாகத் தொடங்குங்கள்",
    footerTagline: "HACKHAZARDS '26 — Climate & Sustainability Systems-க்காக உருவாக்கப்பட்டது",
    footerPowered: "இயக்குபவை: Google Gemini • NVIDIA RAPIDS • BigQuery • Looker",
    live: "லைவ்",
    comingSoon: "விரைவில் வருகிறது",
    docs: "ஆவணங்கள்",
  },

  te: {
    eyebrow: "HACKHAZARDS '26 · వాతావరణం & సుస్థిరత",
    tagline: "వాతావరణ-తట్టుకునే వ్యవసాయ నిర్ణయ విజ్ఞానం",
    subtitle:
      "సుస్థిర వ్యవసాయం కోసం AI. పంట వ్యాధిని గుర్తించండి, నీరు మరియు ఇన్‌పుట్ వృథాను తగ్గించండి, వాతావరణ నిరోధకతను పెంచండి — ఒకే వేదిక, ప్రతి నిర్ణయం.",
    getStarted: "ప్లాట్‌ఫారమ్ తెరవండి",
    watchDemo: "డెమో చూడండి",
    statLabels: ["విశ్లేషించిన రికార్డులు", "వేగవంతమైన అంతర్దృష్టులు (GPU)", "ముందుకు తీసిన UN SDGs", "మద్దతు ఉన్న భాషలు"],
    featuresHeading: "ఒకే వేదికపై మీకు కావలసినదంతా",
    features: [
      { title: "పంట నిర్ధారణ", desc: "పంట ఫోటోను అప్‌లోడ్ చేయండి. Gemini Vision ద్వారా తక్షణ వ్యాధి గుర్తింపు మరియు చికిత్స పొందండి." },
      { title: "వ్యవసాయ ప్రమాద స్కోరు", desc: "0 నుండి 100 వరకు రియల్-టైమ్ ప్రమాద అంచనా. సెకన్లలో మీ పొలం ఆరోగ్యాన్ని తెలుసుకోండి." },
      { title: "వాతావరణ విజ్ఞానం", desc: "7-రోజుల అంచనా మరియు వ్యాధి-ప్రమాద అంచనా. ఈరోజు నీరు పెట్టాలా? మేము చెబుతాము." },
      { title: "Krishivaani ను అడగండి", desc: "ఏ వ్యవసాయ ప్రశ్నకైనా AI సహాయకుడు. మీ భాషలో అడగండి, తక్షణ సమాధానం పొందండి." },
      { title: "ప్రభుత్వ పథకాలు", desc: "మీరు అర్హులైన పథకాలను కనుగొనండి — PM-KISAN, బీమా, రుణాలు — అన్నీ ఒకే చోట." },
      { title: "అనలిటిక్స్ డాష్‌బోర్డ్", desc: "500K రికార్డుల నుండి వ్యాధి ధోరణులు మరియు ప్రమాద నమూనాలు. మెరుగైన వ్యవసాయానికి డేటా-ఆధారిత అంతర్దృష్టులు." },
      { title: "వాయిస్ అసిస్టెంట్", desc: "మీ ప్రశ్నను మాట్లాడండి, సమాధానాన్ని 5 భాషల్లో వినండి — చేతులు లేకుండా, తక్కువ అక్షరాస్యత ఉన్న రైతుల కోసం. Sarvam AI ద్వారా ఆధారితం." },
    ],
    problemHeading: "మేము పరిష్కరించే సమస్య",
    problems: [
      { title: "చెల్లాచెదురైన సమాచారం", desc: "వాతావరణ యాప్‌లు, యూట్యూబ్, వాట్సాప్ గ్రూపులు, డీలర్లు — చాలా చెల్లాచెదురైన మూలాలు." },
      { title: "తప్పు నిర్ణయాలు", desc: "తప్పు పురుగుమందు సమయం. అధిక నీటిపారుదల. తప్పిన వ్యాధులు. ఆదాయ నష్టం." },
      { title: "భాషా అడ్డంకులు", desc: "చాలా యాప్‌లు ఇంగ్లీష్‌లో మాత్రమే. చాలా మంది రైతులు తమ స్థానిక భాషను ఇష్టపడతారు." },
      { title: "ఆచరణాత్మక సలహా లేదు", desc: "యాప్‌లు డేటాను చూపుతాయి. రైతులకు నిర్ణయాలు కావాలి: 'ఈరోజు నేను ఏమి చేయాలి?'" },
    ],
    solutionHeading: "Krishivaani పరిష్కారం",
    solutions: [
      { title: "ఒకే వేదిక", desc: "మొత్తం సమాచారం ఏకీకృతం — నిర్ధారణ, వాతావరణం, ప్రమాదం, పథకాలు మరియు చాట్." },
      { title: "ఆచరణాత్మక నిర్ణయాలు", desc: "కేవలం డేటా కాదు. స్పష్టమైన అవును/కాదు సమాధానాలు: 'రేపు ఉదయం పిచికారీ చేయండి.'" },
      { title: "బహుభాషా", desc: "పేజీ పైభాగం నుండి ఎప్పుడైనా 5 భారతీయ భాషల్లో ఉపయోగించండి. వాయిస్ మద్దతు తదుపరి." },
      { title: "ఆఫ్‌లైన్-ఫస్ట్", desc: "తక్కువ కనెక్టివిటీ ప్రాంతాలకు కాష్ చేసిన డేటాతో ప్రోగ్రెసివ్ వెబ్ యాప్ — తదుపరి ప్రణాళిక." },
    ],
    techHeading: "అత్యాధునిక సాంకేతికతతో నడుస్తుంది",
    tech: [
      { title: "Google Gemini", desc: "బహుళరూప టెక్స్ట్ మరియు విజన్ విజ్ఞానం కోసం Gemini 2.5." },
      { title: "మల్టీ-ఏజెంట్ బ్యాకెండ్", desc: "ఆరు ప్రత్యేక AI ఏజెంట్లు ప్రతి నిర్ణయాన్ని నిర్వహిస్తాయి." },
      { title: "NVIDIA RAPIDS", desc: "GPU త్వరణం (cuDF) తో అనలిటిక్స్‌పై సగటున 22.58× వేగం." },
      { title: "BigQuery", desc: "500K-రికార్డ్ అనలిటిక్స్ వేర్‌హౌస్, రియల్-టైమ్‌లో ప్రశ్నించబడుతుంది." },
      { title: "Looker Studio", desc: "నేరుగా BigQuery పై నిర్మించిన ఇంటరాక్టివ్ డాష్‌బోర్డ్‌లు." },
      { title: "Next.js + FastAPI", desc: "ఆధునిక, వేగవంతమైన, ఉత్పత్తికి సిద్ధమైన ఫుల్-స్టాక్ ఆర్కిటెక్చర్." },
    ],
    ctaHeading: "తెలివైన నిర్ణయాలు తీసుకోవడానికి సిద్ధంగా ఉన్నారా?",
    ctaSubtitle: "దిగుబడిని పెంచడానికి మరియు నష్టాలను తగ్గించడానికి AI ను ఉపయోగించే రైతులతో చేరండి.",
    ctaButton: "ఉచితంగా ప్రారంభించండి",
    footerTagline: "HACKHAZARDS '26 — Climate & Sustainability Systems కోసం రూపొందించబడింది",
    footerPowered: "శక్తినిచ్చేవి: Google Gemini • NVIDIA RAPIDS • BigQuery • Looker",
    live: "లైవ్",
    comingSoon: "త్వరలో వస్తుంది",
    docs: "డాక్యుమెంటేషన్",
  },
};

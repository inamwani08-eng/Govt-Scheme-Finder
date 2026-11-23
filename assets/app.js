/* Yojana Saathi: find and shortlist government schemes. No build step, no dependencies. */
(function () {
  "use strict";

  /* ------------------------------------------------------------------ */
  /* Reference data                                                      */
  /* ------------------------------------------------------------------ */
  var STATES = {
    AN: ["Andaman & Nicobar Islands", "अंडमान और निकोबार द्वीप समूह"], AP: ["Andhra Pradesh", "आंध्र प्रदेश"],
    AR: ["Arunachal Pradesh", "अरुणाचल प्रदेश"], AS: ["Assam", "असम"], BR: ["Bihar", "बिहार"], CH: ["Chandigarh", "चंडीगढ़"],
    CG: ["Chhattisgarh", "छत्तीसगढ़"], DN: ["Dadra & Nagar Haveli and Daman & Diu", "दादरा और नगर हवेली और दमन और दीव"],
    DL: ["Delhi", "दिल्ली"], GA: ["Goa", "गोवा"], GJ: ["Gujarat", "गुजरात"], HR: ["Haryana", "हरियाणा"],
    HP: ["Himachal Pradesh", "हिमाचल प्रदेश"], JK: ["Jammu & Kashmir", "जम्मू और कश्मीर"], JH: ["Jharkhand", "झारखंड"],
    KA: ["Karnataka", "कर्नाटक"], KL: ["Kerala", "केरल"], LA: ["Ladakh", "लद्दाख"], LD: ["Lakshadweep", "लक्षद्वीप"],
    MP: ["Madhya Pradesh", "मध्य प्रदेश"], MH: ["Maharashtra", "महाराष्ट्र"], MN: ["Manipur", "मणिपुर"],
    ML: ["Meghalaya", "मेघालय"], MZ: ["Mizoram", "मिज़ोरम"], NL: ["Nagaland", "नागालैंड"], OD: ["Odisha", "ओडिशा"],
    PY: ["Puducherry", "पुडुचेरी"], PB: ["Punjab", "पंजाब"], RJ: ["Rajasthan", "राजस्थान"], SK: ["Sikkim", "सिक्किम"],
    TN: ["Tamil Nadu", "तमिलनाडु"], TS: ["Telangana", "तेलंगाना"], TR: ["Tripura", "त्रिपुरा"],
    UP: ["Uttar Pradesh", "उत्तर प्रदेश"], UK: ["Uttarakhand", "उत्तराखंड"], WB: ["West Bengal", "पश्चिम बंगाल"]
  };
  var SECTORS = {
    agri: ["Agriculture", "कृषि"], edu: ["Education", "शिक्षा"], health: ["Health", "स्वास्थ्य"],
    women: ["Women & child", "महिला एवं बाल"], social: ["Pension & insurance", "पेंशन एवं बीमा"],
    jobs: ["Jobs & skills", "रोज़गार एवं कौशल"], biz: ["Business & loans", "व्यवसाय एवं ऋण"],
    finance: ["Banking & savings", "बैंकिंग एवं बचत"], housing: ["Housing", "आवास"],
    disability: ["Disability", "दिव्यांगजन"], food: ["Food security", "खाद्य सुरक्षा"], energy: ["Energy", "ऊर्जा"]
  };
  var OCC = {
    student: ["Student", "विद्यार्थी"], farmer: ["Farmer / agricultural worker", "किसान / खेतिहर"],
    fisher: ["Fisher", "मछुआरा"], artisan: ["Artisan / craftsperson", "कारीगर / शिल्पकार"],
    street_vendor: ["Street vendor", "रेहड़ी-पटरी विक्रेता"], unorganised: ["Daily-wage / unorganised worker", "दिहाड़ी / असंगठित श्रमिक"],
    salaried: ["Salaried employee", "वेतनभोगी कर्मचारी"], business: ["Self-employed / business", "स्वरोज़गार / व्यवसाय"],
    unemployed: ["Looking for work", "बेरोज़गार"], homemaker: ["Homemaker", "गृहिणी"], retired: ["Retired", "सेवानिवृत्त"]
  };
  var EDU = {
    school: ["Class 1–8", "कक्षा 1–8"], "9-10": ["Class 9–10", "कक्षा 9–10"], "11-12": ["Class 11–12", "कक्षा 11–12"],
    ug: ["Graduation / diploma", "स्नातक / डिप्लोमा"], pg: ["Post-graduation / PhD", "स्नातकोत्तर / पीएचडी"]
  };
  var CATS = { GEN: ["General", "सामान्य"], EWS: ["EWS", "ईडब्ल्यूएस"], OBC: ["OBC", "ओबीसी"], SC: ["SC", "अनुसूचित जाति"], ST: ["ST", "अनुसूचित जनजाति"] };

  var T = {
    en: {
      sub: "Government schemes, matched to you", tabFor: "For you", tabBrowse: "Browse", tabAll: "All schemes", tabShort: "Shortlist",
      browseTitle: "Browse schemes by group", browseP: "Pick who the scheme is for. The green number shows how many you qualify for with your current profile.",
      secProf: "By profession", secCat: "By caste category and community", secLife: "By life situation",
      nSchemes: "{n} schemes", nQualify: "{n} you qualify for", backBrowse: "All groups",
      introH: "Find the government schemes you can apply for",
      introP: "Tell us a little about yourself. We check your profile against the rules of {n} central and state schemes and show what you qualify for, what you need to apply, and where.",
      profile: "Your profile", edit: "Edit", done: "Done", exampleNote: "This is an example profile. Change any answer to see your own matches.",
      state: "State / UT", choose: "Choose…", age: "Age", gender: "Gender", female: "Female", male: "Male", genderOther: "Other",
      income: "Annual family income (₹)", incomeHint: "Total yearly income of everyone in the household",
      category: "Category", area: "Where you live", rural: "Village", urban: "Town / city",
      occ: "What do you do?", edu: "Currently studying in", situation: "Applies to you",
      bpl: "BPL / Antyodaya / priority ration card", dis: "Person with disability (40%+)", widow: "Widow",
      preg: "Pregnant or mother of a child under 1", daughter: "Have a daughter under 10", minority: "Minority community (Muslim, Christian, Sikh, Buddhist, Jain, Parsi)",
      tax: "Someone in the family pays income tax", reset: "Clear profile", search: "Search schemes, e.g. pension, scholarship, loan",
      allSectors: "All", level: "Show", lvlAll: "Central + my state", lvlC: "Central only", lvlS: "My state only",
      hideNo: "Hide schemes I don't qualify for",
      recTitle: "Recommended for you", recMeta: "{a} you qualify for · {b} to check",
      gYes: "You qualify", gMaybe: "You might qualify. Add the missing details to confirm",
      allTitle: "All schemes", allMeta: "{n} schemes",
      yes: "Eligible", maybe: "Check", no: "Not eligible", central: "Central",
      save: "Shortlist", saved: "Shortlisted", details: "Details",
      matches: "Matches: ", missing: "Add your {f} to confirm", only: "Needs: ",
      noResults: "No schemes match these filters. Try a different search or sector.",
      noRec: "No exact matches yet. Fill in more of your profile, or browse all schemes.",
      back: "Back", benefit: "Key benefit", about: "About this scheme", elig: "Your eligibility",
      eligNone: "Open to all citizens. Check the conditions below.",
      other: "Also required", docs: "Documents you'll usually need", how: "How to apply", dept: "Run by",
      apply: "Open official website", verify: "Verify on myScheme",
      hiNote: "",
      shortTitle: "Your shortlist", shortEmpty: "Your shortlist is empty. Tap Shortlist on any scheme to keep it here.",
      shortMeta: "{n} saved on this device", docsAll: "Documents to keep ready", docsFor: "for {n} schemes",
      copy: "Copy list", copied: "Copied to clipboard", copyFail: "Couldn't copy. Select the text below instead.",
      clear: "Clear shortlist", clearConfirm: "Tap again to clear", addedToast: "Added to shortlist", removedToast: "Removed from shortlist",
      foot1: "Yojana Saathi is an independent guide and is not a government website. Rules and amounts change: always confirm on the official portal before applying.",
      foot2: "Sources: official scheme portals linked on each scheme, and myScheme (myscheme.gov.in). Data last reviewed November 2026.",
      lakh: "lakh",
      fState: "state", fAge: "age", fGender: "gender", fIncome: "income", fCat: "category", fOcc: "occupation", fEdu: "class / course", fArea: "village or town",
      cSt: "Resident of {v}", cF: "Women only", cM: "Men only", cAge: "Age {v}", cInc: "Family income up to {v}", cCat: "Category: {v}",
      cMin: "Minority community", cOcc: "Occupation: {v}", cEdu: "Studying: {v}", cRural: "Lives in a village", cUrban: "Lives in a town or city",
      cDis: "Person with disability", cBpl: "BPL / priority ration card", cWidow: "Widow", cPreg: "Pregnant or new mother",
      cDau: "Has a daughter under 10", cTax: "No income-tax payer in family", cOr: "Any one of: {v}", or: " or ",
      ageRange: "{a}–{b}", agePlus: "{a}+", ageUnder: "under {b}"
    },
    hi: {
      sub: "सरकारी योजनाएँ, आपके लिए", tabFor: "आपके लिए", tabBrowse: "श्रेणियाँ", tabAll: "सभी योजनाएँ", tabShort: "चुनी हुई",
      browseTitle: "समूह के अनुसार योजनाएँ देखें", browseP: "चुनें कि योजना किसके लिए है। हरी संख्या बताती है कि आपकी मौजूदा प्रोफ़ाइल से आप कितनी योजनाओं के पात्र हैं।",
      secProf: "व्यवसाय के अनुसार", secCat: "जाति वर्ग और समुदाय के अनुसार", secLife: "जीवन परिस्थिति के अनुसार",
      nSchemes: "{n} योजनाएँ", nQualify: "{n} के लिए पात्र", backBrowse: "सभी समूह",
      introH: "जानिए आप किन सरकारी योजनाओं के लिए आवेदन कर सकते हैं",
      introP: "अपने बारे में थोड़ी जानकारी दें। हम {n} केंद्रीय और राज्य योजनाओं के नियमों से आपकी प्रोफ़ाइल मिलाकर बताते हैं कि आप किसके पात्र हैं, क्या दस्तावेज़ चाहिए और कहाँ आवेदन करें।",
      profile: "आपकी प्रोफ़ाइल", edit: "बदलें", done: "हो गया", exampleNote: "यह एक उदाहरण प्रोफ़ाइल है। अपनी जानकारी भरें और अपने लिए योजनाएँ देखें।",
      state: "राज्य / केंद्र शासित प्रदेश", choose: "चुनें…", age: "आयु", gender: "लिंग", female: "महिला", male: "पुरुष", genderOther: "अन्य",
      income: "परिवार की वार्षिक आय (₹)", incomeHint: "घर के सभी सदस्यों की कुल सालाना आय",
      category: "वर्ग", area: "आप कहाँ रहते हैं", rural: "गाँव", urban: "शहर / कस्बा",
      occ: "आप क्या करते हैं?", edu: "अभी किस कक्षा में", situation: "आप पर लागू",
      bpl: "बीपीएल / अंत्योदय / प्राथमिकता राशन कार्ड", dis: "दिव्यांग (40% या अधिक)", widow: "विधवा",
      preg: "गर्भवती या 1 वर्ष से छोटे बच्चे की माँ", daughter: "10 वर्ष से छोटी बेटी है", minority: "अल्पसंख्यक समुदाय (मुस्लिम, ईसाई, सिख, बौद्ध, जैन, पारसी)",
      tax: "परिवार में कोई आयकर देता है", reset: "प्रोफ़ाइल साफ़ करें", search: "योजना खोजें, जैसे पेंशन, छात्रवृत्ति, ऋण",
      allSectors: "सभी", level: "दिखाएँ", lvlAll: "केंद्र + मेरा राज्य", lvlC: "केवल केंद्र", lvlS: "केवल मेरा राज्य",
      hideNo: "जिनके लिए मैं पात्र नहीं, उन्हें छिपाएँ",
      recTitle: "आपके लिए सुझाई गई योजनाएँ", recMeta: "{a} के लिए पात्र · {b} जाँचें",
      gYes: "आप पात्र हैं", gMaybe: "आप पात्र हो सकते हैं। पुष्टि के लिए बाकी जानकारी भरें",
      allTitle: "सभी योजनाएँ", allMeta: "{n} योजनाएँ",
      yes: "पात्र", maybe: "जाँचें", no: "पात्र नहीं", central: "केंद्र",
      save: "चुनें", saved: "चुनी गई", details: "विवरण",
      matches: "मेल: ", missing: "पुष्टि के लिए {f} भरें", only: "ज़रूरी: ",
      noResults: "इन फ़िल्टर से कोई योजना नहीं मिली। कुछ और खोजें या दूसरा क्षेत्र चुनें।",
      noRec: "अभी कोई सटीक मेल नहीं। प्रोफ़ाइल में और जानकारी भरें या सभी योजनाएँ देखें।",
      back: "वापस", benefit: "मुख्य लाभ", about: "योजना के बारे में", elig: "आपकी पात्रता",
      eligNone: "सभी नागरिकों के लिए। नीचे दी गई शर्तें देखें।",
      other: "अन्य शर्तें", docs: "आम तौर पर ज़रूरी दस्तावेज़", how: "आवेदन कैसे करें", dept: "संचालक विभाग",
      apply: "आधिकारिक वेबसाइट खोलें", verify: "myScheme पर जाँचें",
      hiNote: "योजना का विस्तृत विवरण अभी अंग्रेज़ी में है।",
      shortTitle: "आपकी चुनी हुई योजनाएँ", shortEmpty: "अभी कोई योजना नहीं चुनी गई। किसी भी योजना पर \"चुनें\" दबाएँ।",
      shortMeta: "इस डिवाइस पर {n} सहेजी गईं", docsAll: "ये दस्तावेज़ तैयार रखें", docsFor: "{n} योजनाओं के लिए",
      copy: "सूची कॉपी करें", copied: "कॉपी हो गया", copyFail: "कॉपी नहीं हो सका। नीचे का टेक्स्ट चुनें।",
      clear: "सूची साफ़ करें", clearConfirm: "साफ़ करने के लिए फिर दबाएँ", addedToast: "सूची में जोड़ा गया", removedToast: "सूची से हटाया गया",
      foot1: "योजना साथी एक स्वतंत्र मार्गदर्शिका है, सरकारी वेबसाइट नहीं। नियम और राशि बदलती रहती है, आवेदन से पहले आधिकारिक पोर्टल पर ज़रूर जाँचें।",
      foot2: "स्रोत: हर योजना पर दिए गए आधिकारिक पोर्टल और myScheme (myscheme.gov.in)। डेटा की अंतिम समीक्षा: नवंबर 2026।",
      lakh: "लाख",
      fState: "राज्य", fAge: "आयु", fGender: "लिंग", fIncome: "आय", fCat: "वर्ग", fOcc: "व्यवसाय", fEdu: "कक्षा / कोर्स", fArea: "गाँव या शहर",
      cSt: "{v} के निवासी", cF: "केवल महिलाएँ", cM: "केवल पुरुष", cAge: "आयु {v}", cInc: "पारिवारिक आय {v} तक", cCat: "वर्ग: {v}",
      cMin: "अल्पसंख्यक समुदाय", cOcc: "व्यवसाय: {v}", cEdu: "पढ़ाई: {v}", cRural: "गाँव में निवास", cUrban: "शहर में निवास",
      cDis: "दिव्यांग व्यक्ति", cBpl: "बीपीएल / प्राथमिकता राशन कार्ड", cWidow: "विधवा", cPreg: "गर्भवती या नई माँ",
      cDau: "10 वर्ष से छोटी बेटी", cTax: "परिवार में कोई आयकरदाता नहीं", cOr: "इनमें से कोई एक: {v}", or: " या ",
      ageRange: "{a}–{b} वर्ष", agePlus: "{a} वर्ष या अधिक", ageUnder: "{b} वर्ष से कम"
    }
  };

  function has(arr, v) { return !!arr && arr.indexOf(v) >= 0; }
  function hasCat(e, c) { return has(e.cat, c) || (e.or || []).some(function (o) { return has(o.cat, c); }); }
  var GROUPS = [
    { k: "students", sec: "secProf", n: ["Students", "विद्यार्थी"], d: ["Scholarships, fellowships, coaching and education loans", "छात्रवृत्ति, फ़ेलोशिप, कोचिंग और शिक्षा ऋण"],
      f: function (s) { return s.s === "edu" || has(s.e.occ, "student") && s.s !== "jobs" && s.s !== "biz"; } },
    { k: "farmers", sec: "secProf", n: ["Farmers & fishers", "किसान और मछुआरे"], d: ["Income support, crop insurance, credit, irrigation and machinery", "आय सहायता, फसल बीमा, ऋण, सिंचाई और कृषि यंत्र"],
      f: function (s) { return s.s === "agri" || has(s.e.occ, "farmer") || has(s.e.occ, "fisher"); } },
    { k: "jobseekers", sec: "secProf", n: ["Job seekers & unemployed", "नौकरी ढूँढने वाले और बेरोज़गार"], d: ["Skill training, apprenticeships, internships and unemployment allowance", "कौशल प्रशिक्षण, अप्रेंटिसशिप, इंटर्नशिप और बेरोज़गारी भत्ता"],
      f: function (s) { return s.s === "jobs" || has(s.e.occ, "unemployed"); } },
    { k: "workers", sec: "secProf", n: ["Workers, artisans & vendors", "श्रमिक, कारीगर और विक्रेता"], d: ["Pensions, e-Shram, toolkits and small loans", "पेंशन, ई-श्रम, टूलकिट और छोटे ऋण"],
      f: function (s) { return ["unorganised", "street_vendor", "artisan"].some(function (o) { return has(s.e.occ, o); }); } },
    { k: "business", sec: "secProf", n: ["Business & self-employed", "व्यवसाय और स्वरोज़गार"], d: ["Loans, subsidies and startup support", "ऋण, सब्सिडी और स्टार्टअप सहायता"],
      f: function (s) { return s.s === "biz"; } },
    { k: "sc", sec: "secCat", n: ["Scheduled Castes (SC)", "अनुसूचित जाति (एससी)"], d: ["Scholarships, coaching, fellowships and business loans", "छात्रवृत्ति, कोचिंग, फ़ेलोशिप और व्यवसाय ऋण"],
      f: function (s) { return hasCat(s.e, "SC"); } },
    { k: "st", sec: "secCat", n: ["Scheduled Tribes (ST)", "अनुसूचित जनजाति (एसटी)"], d: ["Residential schools, scholarships and loans", "आवासीय स्कूल, छात्रवृत्ति और ऋण"],
      f: function (s) { return hasCat(s.e, "ST"); } },
    { k: "obc", sec: "secCat", n: ["Other Backward Classes (OBC)", "अन्य पिछड़ा वर्ग (ओबीसी)"], d: ["PM YASASVI, free coaching, fellowships and loans", "पीएम यशस्वी, मुफ़्त कोचिंग, फ़ेलोशिप और ऋण"],
      f: function (s) { return hasCat(s.e, "OBC"); } },
    { k: "minority", sec: "secCat", n: ["Minorities", "अल्पसंख्यक"], d: ["Muslim, Christian, Sikh, Buddhist, Jain and Parsi communities: scholarships and loans", "मुस्लिम, ईसाई, सिख, बौद्ध, जैन और पारसी समुदाय: छात्रवृत्ति और ऋण"],
      f: function (s) { return !!s.e.minority; } },
    { k: "low-income", sec: "secCat", n: ["General & EWS (low income)", "सामान्य और ईडब्ल्यूएस (कम आय)"], d: ["Schemes open to every category, based on income or a BPL card", "हर वर्ग के लिए खुली योजनाएँ, आय या बीपीएल कार्ड के आधार पर"],
      f: function (s) { return !s.e.cat && !s.e.minority && !s.e.or && (!!s.e.bpl || (s.e.inc != null && s.e.inc <= 300000)); } },
    { k: "women", sec: "secLife", n: ["Women & girls", "महिलाएँ और बालिकाएँ"], d: ["Monthly support, maternity benefits and girls' savings", "मासिक सहायता, मातृत्व लाभ और बेटियों की बचत"],
      f: function (s) { return s.e.g === "F" || s.s === "women" || !!s.e.daughter; } },
    { k: "seniors", sec: "secLife", n: ["Senior citizens", "वरिष्ठ नागरिक"], d: ["Pensions, health cover and savings for 60+", "60+ के लिए पेंशन, स्वास्थ्य बीमा और बचत"],
      f: function (s) { return !!s.e.a && s.e.a[0] >= 60; } },
    { k: "disability", sec: "secLife", n: ["Persons with disability", "दिव्यांगजन"], d: ["UDID card, pensions, aids and scholarships", "यूडीआईडी कार्ड, पेंशन, उपकरण और छात्रवृत्ति"],
      f: function (s) { return !!s.e.dis || s.s === "disability"; } },
    { k: "bpl", sec: "secLife", n: ["BPL / ration card holders", "बीपीएल / राशन कार्ड धारक"], d: ["Free food grains, housing, health cover and gas", "मुफ़्त अनाज, आवास, स्वास्थ्य बीमा और गैस"],
      f: function (s) { return !!s.e.bpl; } }
  ];
  var GROUP = {};
  GROUPS.forEach(function (g) { GROUP[g.k] = g; });

  var SCHEMES = window.SCHEMES || [];
  var SCHEMES_HI = window.SCHEMES_HI || {};
  SCHEMES.forEach(function (s) { s.e = s.e || {}; });
  var BY_ID = {};
  SCHEMES.forEach(function (s) { BY_ID[s.id] = s; });

  /* ------------------------------------------------------------------ */
  /* State + storage (per-device convenience only)                       */
  /* ------------------------------------------------------------------ */
  var EXAMPLE = { state: "MH", age: 34, gender: "F", income: 180000, cat: "OBC", area: "rural", occ: "farmer", edu: "",
    bpl: true, dis: false, widow: false, preg: false, daughter: true, minority: false, tax: false };
  var BLANK = { state: "", age: null, gender: "", income: null, cat: "", area: "", occ: "", edu: "",
    bpl: false, dis: false, widow: false, preg: false, daughter: false, minority: false, tax: false };

  function load(key, fallback) {
    try { var v = localStorage.getItem("ys:" + key); return v ? JSON.parse(v) : fallback; } catch (e) { return fallback; }
  }
  function store(key, val) { try { localStorage.setItem("ys:" + key, JSON.stringify(val)); } catch (e) { /* storage unavailable */ } }

  var saved = load("profile", null);
  var S = {
    lang: load("lang", "en"),
    profile: saved || Object.assign({}, EXAMPLE),
    isExample: !saved,
    shortlist: load("shortlist", []).filter(function (id) { return BY_ID[id]; }),
    q: "", sector: "", level: "all", hideNo: true,
    profileOpen: false, clearArmed: false
  };

  /* ------------------------------------------------------------------ */
  /* Helpers                                                             */
  /* ------------------------------------------------------------------ */
  function t(key, vars) {
    var s = (T[S.lang] && T[S.lang][key]) != null ? T[S.lang][key] : T.en[key];
    if (vars) Object.keys(vars).forEach(function (k) { s = s.split("{" + k + "}").join(vars[k]); });
    return s;
  }
  function L(pair) { return pair ? pair[S.lang === "hi" ? 1 : 0] : ""; }
  function esc(s) {
    return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) {
      return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c];
    });
  }
  function rupees(n) {
    if (n >= 100000) { var l = n / 100000; return "₹" + (Math.round(l * 100) / 100).toString() + " " + t("lakh"); }
    return "₹" + n.toLocaleString("en-IN");
  }
  function name(s) { return S.lang === "hi" && s.hi ? s.hi : s.n; }
  function benefit(s) { return S.lang === "hi" && SCHEMES_HI[s.id] ? SCHEMES_HI[s.id] : s.b; }
  function levelLabel(s) { return s.lvl === "C" ? t("central") : L(STATES[s.lvl]); }

  /* ------------------------------------------------------------------ */
  /* Eligibility engine                                                  */
  /* ------------------------------------------------------------------ */
  var WEIGHT = { st: 3, occ: 3, cat: 3, dis: 3, preg: 3, widow: 3, edu: 2, daughter: 2, minority: 2, or: 2, g: 1, a: 1, inc: 1, area: 1, bpl: 1, notax: 0 };

  function ageText(a) {
    if (a[0] <= 0) return t("ageUnder", { b: a[1] + 1 });
    if (a[1] >= 120) return t("agePlus", { a: a[0] });
    return t("ageRange", { a: a[0], b: a[1] });
  }

  // Each check returns { key, ok: true|false|null, label, field } where null means "we don't know yet".
  function checks(e, p) {
    var out = [];
    function add(key, ok, label, field, short) { out.push({ key: key, ok: ok, label: label, field: field, short: short || label }); }
    if (e.st) add("st", p.state ? e.st.indexOf(p.state) >= 0 : null, t("cSt", { v: e.st.map(function (c) { return L(STATES[c]); }).join(", ") }), "fState", p.state && L(STATES[p.state]));
    if (e.g) add("g", p.gender ? p.gender === e.g : null, e.g === "F" ? t("cF") : t("cM"), "fGender");
    if (e.a) add("a", p.age == null ? null : (p.age >= e.a[0] && p.age <= e.a[1]), t("cAge", { v: ageText(e.a) }), "fAge");
    if (e.inc != null) add("inc", p.income == null ? null : p.income <= e.inc, t("cInc", { v: rupees(e.inc) }), "fIncome");
    if (e.cat) add("cat", p.cat ? e.cat.indexOf(p.cat) >= 0 : null, t("cCat", { v: e.cat.map(function (c) { return L(CATS[c]); }).join(", ") }), "fCat", p.cat && L(CATS[p.cat]));
    if (e.minority) add("minority", !!p.minority, t("cMin"));
    if (e.occ) add("occ", p.occ ? e.occ.indexOf(p.occ) >= 0 : null, t("cOcc", { v: e.occ.map(function (o) { return L(OCC[o]); }).join(", ") }), "fOcc", p.occ && L(OCC[p.occ]));
    if (e.edu) {
      var eduOk = !p.occ ? null : (p.occ !== "student" ? false : (p.edu ? e.edu.indexOf(p.edu) >= 0 : null));
      add("edu", eduOk, t("cEdu", { v: e.edu.map(function (x) { return L(EDU[x]); }).join(", ") }), "fEdu", p.edu && L(EDU[p.edu]));
    }
    if (e.area) add("area", p.area ? p.area === e.area : null, e.area === "rural" ? t("cRural") : t("cUrban"), "fArea");
    if (e.dis) add("dis", !!p.dis, t("cDis"));
    if (e.bpl) add("bpl", !!p.bpl, t("cBpl"));
    if (e.widow) add("widow", !!p.widow, t("cWidow"));
    if (e.preg) add("preg", !!p.preg, t("cPreg"));
    if (e.daughter) add("daughter", !!p.daughter, t("cDau"));
    if (e.notax) add("notax", !p.tax, t("cTax"));
    if (e.or) {
      var subs = e.or.map(function (sub) { return summarise(checks(sub, p)); });
      var ok = subs.some(function (r) { return r.status === "yes"; }) ? true :
        subs.some(function (r) { return r.status === "maybe"; }) ? null : false;
      var labels = e.or.map(function (sub) { return checks(sub, p).map(function (c) { return c.label; }).join(", "); });
      add("or", ok, t("cOr", { v: labels.join(t("or")) }));
    }
    return out;
  }
  function summarise(cs) {
    var status = cs.some(function (c) { return c.ok === false; }) ? "no" : cs.some(function (c) { return c.ok === null; }) ? "maybe" : "yes";
    return { status: status, checks: cs };
  }
  function evaluate(s) {
    var r = summarise(checks(s.e || {}, S.profile));
    r.score = r.checks.reduce(function (n, c) { return n + (c.ok ? (WEIGHT[c.key] || 0) : 0); }, 0) + (s.lvl !== "C" ? 1 : 0);
    return r;
  }

  /* ------------------------------------------------------------------ */
  /* Filtering                                                           */
  /* ------------------------------------------------------------------ */
  function matchesFilters(s) {
    if (S.group && !GROUP[S.group].f(s)) return false;
    if (S.sector && s.s !== S.sector) return false;
    var st = S.profile.state;
    if (S.level === "C" && s.lvl !== "C") return false;
    if (S.level === "S" && (s.lvl === "C" || s.lvl !== st)) return false;
    if (S.level === "all" && s.lvl !== "C" && st && s.lvl !== st) return false;
    if (S.q) {
      var hay = (s.n + " " + s.hi + " " + s.b + " " + s.d + " " + s.m + " " + L(SECTORS[s.s]) + " " + SECTORS[s.s][0] + " " + (s.lvl === "C" ? "central" : STATES[s.lvl][0])).toLowerCase();
      var words = S.q.toLowerCase().split(/\s+/).filter(Boolean);
      if (!words.every(function (w) { return hay.indexOf(w) >= 0; })) return false;
    }
    return true;
  }

  /* ------------------------------------------------------------------ */
  /* Rendering                                                           */
  /* ------------------------------------------------------------------ */
  var app = document.getElementById("app");
  var ICON_STAR = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="currentColor" d="M12 3.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.8 6.6 19.8l1.2-6.1-4.5-4.2 6.1-.7z"/></svg>';
  var ICON_STAR_O = '<svg viewBox="0 0 24 24" aria-hidden="true"><path fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round" d="M12 3.2l2.6 5.6 6.1.7-4.5 4.2 1.2 6.1L12 16.8 6.6 19.8l1.2-6.1-4.5-4.2 6.1-.7z"/></svg>';

  function route() {
    var h = (location.hash || "").replace(/^#/, "");
    if (h.indexOf("s-") === 0 && BY_ID[h.slice(2)]) return { view: "detail", id: h.slice(2) };
    if (h === "all") return { view: "all" };
    if (h === "browse") return { view: "browse" };
    if (h.indexOf("g-") === 0 && GROUP[h.slice(2)]) return { view: "group", key: h.slice(2) };
    if (h === "shortlist") return { view: "shortlist" };
    return { view: "for-you" };
  }

  function renderShell() {
    document.documentElement.lang = S.lang === "hi" ? "hi" : "en";
    app.innerHTML =
      '<header class="top"><div class="wrap">' +
        '<a class="brand" href="#for-you">' +
          '<svg class="brand-mark" viewBox="0 0 34 34" aria-hidden="true"><rect x="1" y="1" width="32" height="32" rx="9" fill="var(--accent)"/>' +
          '<path d="M10 8h10l5 5v13H10z" fill="var(--surface)"/><path d="M13.5 19l3 3 5-6" fill="none" stroke="var(--saffron)" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/></svg>' +
          '<span><span class="brand-name">' + (S.lang === "hi" ? "योजना साथी" : "Yojana Saathi") + '</span><br><span class="brand-sub">' + esc(t("sub")) + '</span></span>' +
        '</a>' +
        '<nav class="tabs" aria-label="Views" id="tabs"></nav>' +
        '<button class="lang" id="lang-toggle" type="button" aria-label="Switch language">' + (S.lang === "hi" ? "English" : "हिंदी") + '</button>' +
      '</div></header>' +
      '<section class="wrap intro" id="intro"></section>' +
      '<div class="wrap main"><aside class="panel profile" id="profile" aria-label="' + esc(t("profile")) + '"></aside><main id="content" tabindex="-1"></main></div>' +
      '<footer class="footer"><div class="wrap"><span>' + esc(t("foot1")) + '</span><span>' + esc(t("foot2")) + '</span></div></footer>';
    renderProfile();
    renderAll();
  }

  function renderTabs(view) {
    var n = S.shortlist.length;
    document.getElementById("tabs").innerHTML =
      tab("for-you", t("tabFor"), view === "for-you") +
      tab("browse", t("tabBrowse"), view === "browse" || view === "group") +
      tab("all", t("tabAll"), view === "all") +
      tab("shortlist", t("tabShort") + (n ? ' <span class="count">' + n + "</span>" : ""), view === "shortlist");
    function tab(h, label, on) { return '<a class="tab" href="#' + h + '"' + (on ? ' aria-current="page"' : "") + ">" + label + "</a>"; }
  }

  function seg(nameAttr, val, opts) {
    return '<div class="seg" role="radiogroup">' + opts.map(function (o) {
      var id = "p-" + nameAttr + "-" + o[0];
      return '<input type="radio" name="' + nameAttr + '" id="' + id + '" value="' + o[0] + '"' + (val === o[0] ? " checked" : "") + '><label for="' + id + '">' + esc(o[1]) + "</label>";
    }).join("") + "</div>";
  }
  function options(map, val, placeholder) {
    var html = placeholder ? '<option value="">' + esc(placeholder) + "</option>" : "";
    Object.keys(map).forEach(function (k) { html += '<option value="' + k + '"' + (val === k ? " selected" : "") + ">" + esc(L(map[k])) + "</option>"; });
    return html;
  }
  function check(key, label) {
    return '<label class="check" id="row-' + key + '"><input type="checkbox" id="p-' + key + '" name="' + key + '"' + (S.profile[key] ? " checked" : "") + "><span>" + esc(label) + "</span></label>";
  }

  function profileSummary() {
    var p = S.profile, bits = [];
    if (p.state) bits.push(L(STATES[p.state]));
    if (p.age != null) bits.push(p.age + (S.lang === "hi" ? " वर्ष" : " yrs"));
    if (p.gender) bits.push(p.gender === "F" ? t("female") : p.gender === "M" ? t("male") : t("genderOther"));
    if (p.occ) bits.push(L(OCC[p.occ]));
    if (p.cat) bits.push(L(CATS[p.cat]));
    if (p.income != null) bits.push(rupees(p.income));
    return bits.join(" · ") || "—";
  }

  function renderProfile() {
    var p = S.profile;
    var el = document.getElementById("profile");
    var stateMap = {};
    Object.keys(STATES).sort(function (a, b) { return STATES[a][0].localeCompare(STATES[b][0]); }).forEach(function (k) { stateMap[k] = STATES[k]; });
    el.className = "panel profile" + (S.profileOpen ? "" : " collapsed");
    el.innerHTML =
      '<div class="profile-head"><h2>' + esc(t("profile")) + '</h2>' +
        '<button type="button" class="btn small profile-toggle" id="profile-toggle" aria-expanded="' + S.profileOpen + '">' + esc(S.profileOpen ? t("done") : t("edit")) + "</button></div>" +
      '<div class="summary" id="profile-summary">' + esc(profileSummary()) + "</div>" +
      '<form class="profile-body" id="profile-form" autocomplete="off">' +
        (S.isExample ? '<div class="example-note" id="example-note">' + esc(t("exampleNote")) + "</div>" : "") +
        '<div class="field"><label for="p-state">' + esc(t("state")) + '</label><select id="p-state" name="state">' + options(stateMap, p.state, t("choose")) + "</select></div>" +
        '<div class="row2">' +
          '<div class="field"><label for="p-age">' + esc(t("age")) + '</label><input id="p-age" name="age" type="number" inputmode="numeric" min="0" max="120" value="' + (p.age == null ? "" : p.age) + '"></div>' +
          '<div class="field"><label for="p-cat">' + esc(t("category")) + '</label><select id="p-cat" name="cat">' + options(CATS, p.cat, t("choose")) + "</select></div>" +
        "</div>" +
        '<div class="field"><span class="fieldset-label">' + esc(t("gender")) + "</span>" + seg("gender", p.gender, [["F", t("female")], ["M", t("male")], ["O", t("genderOther")]]) + "</div>" +
        '<div class="field"><label for="p-income">' + esc(t("income")) + '</label><input id="p-income" name="income" type="number" inputmode="numeric" min="0" step="1000" value="' + (p.income == null ? "" : p.income) + '">' +
          '<span class="hint" id="income-hint">' + esc(p.income != null ? "= " + rupees(p.income) + " · " + t("incomeHint") : t("incomeHint")) + "</span></div>" +
        '<div class="field"><span class="fieldset-label">' + esc(t("area")) + "</span>" + seg("area", p.area, [["rural", t("rural")], ["urban", t("urban")]]) + "</div>" +
        '<div class="field"><label for="p-occ">' + esc(t("occ")) + '</label><select id="p-occ" name="occ">' + options(OCC, p.occ, t("choose")) + "</select></div>" +
        '<div class="field" id="edu-field"' + (p.occ === "student" ? "" : " hidden") + '><label for="p-edu">' + esc(t("edu")) + '</label><select id="p-edu" name="edu">' + options(EDU, p.edu, t("choose")) + "</select></div>" +
        '<div class="field"><span class="fieldset-label">' + esc(t("situation")) + '</span><div class="checks">' +
          check("bpl", t("bpl")) + check("dis", t("dis")) + check("widow", t("widow")) + check("preg", t("preg")) +
          check("daughter", t("daughter")) + check("minority", t("minority")) + check("tax", t("tax")) +
        "</div></div>" +
        '<div><button type="button" class="btn small" id="reset-profile">' + esc(t("reset")) + "</button></div>" +
      "</form>";
    syncGenderRows();
  }
  function syncGenderRows() {
    var f = S.profile.gender === "F";
    ["widow", "preg"].forEach(function (k) { var r = document.getElementById("row-" + k); if (r) r.hidden = !f; });
  }

  function renderAll() {
    var r = route();
    S.group = r.view === "group" ? r.key : "";
    renderTabs(r.view);
    var intro = document.getElementById("intro");
    intro.hidden = r.view !== "for-you" && r.view !== "all";
    intro.innerHTML = "<h1>" + esc(t("introH")) + "</h1><p>" + esc(t("introP", { n: SCHEMES.length })) + "</p>";
    var c = document.getElementById("content");
    if (r.view === "detail") c.innerHTML = detailView(BY_ID[r.id]);
    else if (r.view === "shortlist") c.innerHTML = shortlistView();
    else if (r.view === "browse") c.innerHTML = browseView();
    else if (r.view === "group") c.innerHTML = groupHead(GROUP[r.key]) + toolbar() + '<div id="results">' + allView() + "</div>";
    else c.innerHTML = toolbar() + '<div id="results">' + (r.view === "all" ? allView() : forYouView()) + "</div>";
  }
  function renderResults() {
    var r = route(), box = document.getElementById("results");
    if (box) box.innerHTML = r.view === "for-you" ? forYouView() : allView();
    else renderAll();
  }

  function toolbar() {
    var r = route();
    var chips = '<button type="button" class="chip" data-sector="" aria-pressed="' + (!S.sector) + '">' + esc(t("allSectors")) + "</button>" +
      Object.keys(SECTORS).map(function (k) {
        return '<button type="button" class="chip" data-sector="' + k + '" aria-pressed="' + (S.sector === k) + '">' + esc(L(SECTORS[k])) + "</button>";
      }).join("");
    return '<div class="toolbar">' +
      '<div class="search"><svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7" fill="none" stroke="currentColor" stroke-width="2"/><path d="M20 20l-4-4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>' +
        '<label class="sr-only" for="q">' + esc(t("search")) + '</label><input id="q" type="search" placeholder="' + esc(t("search")) + '" value="' + esc(S.q) + '"></div>' +
      '<div class="chips" role="group" aria-label="Sector">' + chips + "</div>" +
      '<div class="filter-row"><label for="level">' + esc(t("level")) + '</label><select id="level">' +
        '<option value="all"' + (S.level === "all" ? " selected" : "") + ">" + esc(t("lvlAll")) + "</option>" +
        '<option value="C"' + (S.level === "C" ? " selected" : "") + ">" + esc(t("lvlC")) + "</option>" +
        '<option value="S"' + (S.level === "S" ? " selected" : "") + ">" + esc(t("lvlS")) + "</option></select>" +
        (r.view === "all" ? '<label class="check"><input type="checkbox" id="hide-no"' + (S.hideNo ? " checked" : "") + "><span>" + esc(t("hideNo")) + "</span></label>" : "") +
      "</div></div>";
  }

  function card(s, r) {
    r = r || evaluate(s);
    var on = S.shortlist.indexOf(s.id) >= 0;
    var why = "";
    if (r.status === "yes") {
      var good = r.checks.filter(function (c) { return c.ok && WEIGHT[c.key] >= 2; }).slice(0, 3).map(function (c) { return c.short; });
      why = good.length ? t("matches") + good.join(" · ") : "";
    } else if (r.status === "maybe") {
      var miss = r.checks.filter(function (c) { return c.ok === null; }).map(function (c) { return c.field ? t(c.field) : c.label; });
      why = t("missing", { f: miss.slice(0, 2).join(", ") });
    } else {
      var bad = r.checks.filter(function (c) { return c.ok === false; })[0];
      why = bad ? t("only") + bad.label : "";
    }
    return '<article class="card">' +
      '<div class="card-top"><span class="status ' + r.status + '">' + esc(t(r.status)) + '</span><span class="badge level">' + esc(levelLabel(s)) + '</span><span class="badge sector">' + esc(L(SECTORS[s.s])) + "</span></div>" +
      '<h3><a href="#s-' + s.id + '">' + esc(name(s)) + "</a>" + (S.lang === "hi" ? '<span class="hi-name">' + esc(s.n) + "</span>" : "") + "</h3>" +
      '<p class="benefit">' + esc(benefit(s)) + "</p>" +
      (why ? '<p class="why">' + esc(why) + "</p>" : "") +
      '<div class="card-actions"><a class="btn link" href="#s-' + s.id + '">' + esc(t("details")) + ' →</a>' +
        '<button type="button" class="star" data-star="' + s.id + '" aria-pressed="' + on + '">' + (on ? ICON_STAR : ICON_STAR_O) + esc(on ? t("saved") : t("save")) + "</button></div>" +
      "</article>";
  }

  function evaluated(list) {
    return list.map(function (s) { return { s: s, r: evaluate(s) }; });
  }
  function byScore(a, b) { return b.r.score - a.r.score || a.s.n.localeCompare(b.s.n); }

  function forYouView() {
    var list = evaluated(SCHEMES.filter(matchesFilters));
    var yes = list.filter(function (x) { return x.r.status === "yes"; }).sort(byScore);
    var maybe = list.filter(function (x) { return x.r.status === "maybe"; }).sort(byScore);
    var html = '<div class="result-head"><h2>' + esc(t("recTitle")) + '</h2><span class="meta">' + esc(t("recMeta", { a: yes.length, b: maybe.length })) + "</span></div>";
    if (!yes.length && !maybe.length) return html + '<div class="empty">' + esc(S.q || S.sector ? t("noResults") : t("noRec")) + "</div>";
    if (yes.length) html += '<div class="group-title"><span class="status yes">' + yes.length + "</span>" + esc(t("gYes")) + '</div><div class="cards">' + yes.map(function (x) { return card(x.s, x.r); }).join("") + "</div>";
    if (maybe.length) html += '<div class="group-title"><span class="status maybe">' + maybe.length + "</span>" + esc(t("gMaybe")) + '</div><div class="cards">' + maybe.map(function (x) { return card(x.s, x.r); }).join("") + "</div>";
    return html;
  }

  function allView() {
    var order = { yes: 0, maybe: 1, no: 2 };
    var list = evaluated(SCHEMES.filter(matchesFilters)).filter(function (x) { return S.group || !S.hideNo || x.r.status !== "no"; })
      .sort(function (a, b) { return order[a.r.status] - order[b.r.status] || byScore(a, b); });
    var html = '<div class="result-head"><h2>' + esc(S.group ? L(GROUP[S.group].n) : t("allTitle")) + '</h2><span class="meta">' + esc(t("allMeta", { n: list.length })) + "</span></div>";
    if (!list.length) return html + '<div class="empty">' + esc(t("noResults")) + "</div>";
    return html + '<div class="cards">' + list.map(function (x) { return card(x.s, x.r); }).join("") + "</div>";
  }

  function browseView() {
    var html = '<div class="result-head"><h2>' + esc(t("browseTitle")) + '</h2></div><p class="note" style="margin:0 0 6px;max-width:65ch">' + esc(t("browseP")) + "</p>";
    ["secProf", "secCat", "secLife"].forEach(function (sec) {
      html += '<div class="group-title">' + esc(t(sec)) + '</div><div class="tiles">';
      GROUPS.filter(function (g) { return g.sec === sec; }).forEach(function (g) {
        var st = S.profile.state;
        var inGroup = SCHEMES.filter(function (s) { return g.f(s) && (s.lvl === "C" || !st || s.lvl === st); });
        var yes = inGroup.filter(function (s) { return evaluate(s).status === "yes"; }).length;
        html += '<a class="tile" href="#g-' + g.k + '"><span class="tile-name">' + esc(L(g.n)) + "</span>" +
          '<span class="tile-desc">' + esc(L(g.d)) + "</span>" +
          '<span class="tile-meta"><span>' + esc(t("nSchemes", { n: inGroup.length })) + "</span>" +
          (yes ? '<span class="status yes">' + esc(t("nQualify", { n: yes })) + "</span>" : "") + "</span></a>";
      });
      html += "</div>";
    });
    return html;
  }

  function groupHead(g) {
    return '<a class="btn small back" href="#browse" style="margin-bottom:12px">← ' + esc(t("backBrowse")) + "</a>" +
      '<p class="note" style="margin:0 0 12px;max-width:65ch">' + esc(L(g.d)) + "</p>";
  }

  function detailView(s) {
    var r = evaluate(s), on = S.shortlist.indexOf(s.id) >= 0;
    var marks = { "true": ["yes", "✓"], "false": ["no", "✕"], "null": ["maybe", "?"] };
    var checklist = r.checks.length ? '<ul class="checklist">' + r.checks.map(function (c) {
      var m = marks[String(c.ok)];
      return '<li><span class="mark ' + m[0] + '" aria-label="' + esc(t(m[0])) + '">' + m[1] + "</span><span>" + esc(c.label) + "</span></li>";
    }).join("") + "</ul>" : '<p class="note">' + esc(t("eligNone")) + "</p>";
    return '<div class="detail">' +
      '<button type="button" class="btn small back" id="back">← ' + esc(t("back")) + "</button>" +
      '<div class="panel detail-head">' +
        '<div class="card-top"><span class="status ' + r.status + '">' + esc(t(r.status)) + '</span><span class="badge level">' + esc(levelLabel(s)) + '</span><span class="badge sector">' + esc(L(SECTORS[s.s])) + "</span></div>" +
        "<h1>" + esc(name(s)) + "</h1>" +
        '<div class="hi-name">' + esc(S.lang === "hi" ? s.n : s.hi) + "</div>" +
        '<div class="benefit-box">' + esc(benefit(s)) + "</div>" +
        '<div class="actions">' +
          '<button type="button" class="star" data-star="' + s.id + '" aria-pressed="' + on + '">' + (on ? ICON_STAR : ICON_STAR_O) + esc(on ? t("saved") : t("save")) + "</button>" +
          '<a class="btn primary" href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(t("apply")) + " ↗</a>" +
          '<a class="btn" href="https://www.myscheme.gov.in" target="_blank" rel="noopener">' + esc(t("verify")) + " ↗</a>" +
        "</div>" +
      "</div>" +
      '<div class="detail-grid">' +
        '<div style="display:grid;gap:16px;min-width:0">' +
          '<section class="panel section"><h2>' + esc(t("about")) + "</h2><p>" + esc(s.d) + "</p>" + (t("hiNote") ? '<p class="note">' + esc(t("hiNote")) + "</p>" : "") + "</section>" +
          '<section class="panel section"><h2>' + esc(t("how")) + "</h2><p>" + esc(s.how) + '</p><p class="note">' + esc(t("dept")) + ": " + esc(s.m) + "</p></section>" +
        "</div>" +
        '<div style="display:grid;gap:16px;min-width:0">' +
          '<section class="panel section"><h2>' + esc(t("elig")) + "</h2>" + checklist +
            (s.x ? '<p class="note"><strong>' + esc(t("other")) + ":</strong> " + esc(s.x) + "</p>" : "") + "</section>" +
          '<section class="panel section"><h2>' + esc(t("docs")) + "</h2><ul>" + s.docs.map(function (d) { return "<li>" + esc(d) + "</li>"; }).join("") + "</ul></section>" +
        "</div>" +
      "</div></div>";
  }

  function shortlistText() {
    return S.shortlist.map(function (id, i) {
      var s = BY_ID[id];
      return (i + 1) + ". " + s.n + " (" + (s.lvl === "C" ? "Central" : STATES[s.lvl][0]) + ")\n   " + s.b + "\n   " + s.url;
    }).join("\n\n");
  }

  function shortlistView() {
    var ids = S.shortlist;
    var html = '<div class="result-head"><h2>' + esc(t("shortTitle")) + '</h2><span class="meta">' + esc(t("shortMeta", { n: ids.length })) + "</span></div>";
    if (!ids.length) return html + '<div class="empty">' + esc(t("shortEmpty")) + "</div>";
    var docs = {};
    ids.forEach(function (id) { BY_ID[id].docs.forEach(function (d) { docs[d] = (docs[d] || 0) + 1; }); });
    var docList = Object.keys(docs).sort(function (a, b) { return docs[b] - docs[a] || a.localeCompare(b); });
    html += '<div class="cards">' + ids.map(function (id) { return card(BY_ID[id]); }).join("") + "</div>";
    html += '<section class="panel section" style="margin-top:16px"><h2>' + esc(t("docsAll")) + '</h2><ul class="docs-list">' +
      docList.map(function (d) { return "<li>" + esc(d) + (docs[d] > 1 ? ' <span class="note">(' + esc(t("docsFor", { n: docs[d] })) + ")</span>" : "") + "</li>"; }).join("") +
      '</ul><div class="actions" style="margin-top:8px"><button type="button" class="btn primary" id="copy-list">' + esc(t("copy")) + "</button>" +
      '<button type="button" class="btn" id="clear-list">' + esc(S.clearArmed ? t("clearConfirm") : t("clear")) + "</button></div>" +
      '<textarea id="copy-fallback" readonly hidden rows="8" style="width:100%;margin-top:8px;border:1px solid var(--line);border-radius:8px;background:var(--bg);padding:8px"></textarea></section>';
    return html;
  }

  /* ------------------------------------------------------------------ */
  /* Events                                                              */
  /* ------------------------------------------------------------------ */
  var toastTimer;
  function toast(msg) {
    var el = document.getElementById("toast");
    if (!el) { el = document.createElement("div"); el.id = "toast"; el.className = "toast"; el.setAttribute("role", "status"); document.body.appendChild(el); }
    el.textContent = msg; el.hidden = false;
    clearTimeout(toastTimer); toastTimer = setTimeout(function () { el.hidden = true; }, 1800);
  }

  function updateProfile(fromEl) {
    var f = document.getElementById("profile-form");
    if (!f) return;
    var p = S.profile;
    p.state = f.state.value;
    p.age = f.age.value === "" ? null : Math.max(0, Math.min(120, parseInt(f.age.value, 10)));
    var g = f.querySelector('input[name="gender"]:checked'); p.gender = g ? g.value : "";
    p.income = f.income.value === "" ? null : Math.max(0, parseInt(f.income.value, 10));
    p.cat = f.cat.value;
    var a = f.querySelector('input[name="area"]:checked'); p.area = a ? a.value : "";
    p.occ = f.occ.value;
    p.edu = p.occ === "student" ? f.edu.value : "";
    ["bpl", "dis", "widow", "preg", "daughter", "minority", "tax"].forEach(function (k) { p[k] = f[k].checked; });
    if (p.gender !== "F") { p.widow = false; p.preg = false; }
    S.isExample = false;
    store("profile", p);
    var note = document.getElementById("example-note"); if (note) note.remove();
    document.getElementById("edu-field").hidden = p.occ !== "student";
    document.getElementById("income-hint").textContent = p.income != null ? "= " + rupees(p.income) + " · " + t("incomeHint") : t("incomeHint");
    document.getElementById("profile-summary").textContent = profileSummary();
    syncGenderRows();
    if (route().view === "detail" || route().view === "shortlist") renderAll(); else renderResults();
  }

  function toggleStar(id) {
    var i = S.shortlist.indexOf(id);
    if (i >= 0) S.shortlist.splice(i, 1); else S.shortlist.push(id);
    store("shortlist", S.shortlist);
    toast(i >= 0 ? t("removedToast") : t("addedToast"));
    var y = window.scrollY;
    if (route().view === "for-you" || route().view === "all") { renderTabs(route().view); renderResults(); } else renderAll();
    window.scrollTo(0, y);
  }

  document.addEventListener("input", function (ev) {
    if (ev.target.closest("#profile-form")) { updateProfile(ev.target); return; }
    if (ev.target.id === "q") { S.q = ev.target.value.trim(); renderResults(); }
  });
  document.addEventListener("change", function (ev) {
    if (ev.target.closest("#profile-form")) { updateProfile(ev.target); return; }
    if (ev.target.id === "level") { S.level = ev.target.value; renderResults(); }
    if (ev.target.id === "hide-no") { S.hideNo = ev.target.checked; renderResults(); }
  });
  document.addEventListener("submit", function (ev) { ev.preventDefault(); });
  document.addEventListener("click", function (ev) {
    var el = ev.target.closest("button");
    if (!el) return;
    if (el.dataset.star) { toggleStar(el.dataset.star); return; }
    if (el.dataset.sector != null && el.classList.contains("chip")) {
      S.sector = el.dataset.sector;
      document.querySelectorAll(".chip").forEach(function (c) { c.setAttribute("aria-pressed", String(c.dataset.sector === S.sector)); });
      renderResults(); return;
    }
    switch (el.id) {
      case "lang-toggle": S.lang = S.lang === "hi" ? "en" : "hi"; store("lang", S.lang); renderShell(); break;
      case "profile-toggle": S.profileOpen = !S.profileOpen; renderProfile(); break;
      case "reset-profile":
        S.profile = Object.assign({}, BLANK); S.isExample = false; store("profile", S.profile); S.profileOpen = true; renderProfile(); renderAll(); break;
      case "back":
        if (navCount > 0) history.back(); else location.hash = "for-you";
        break;
      case "copy-list": copyList(); break;
      case "clear-list":
        if (S.clearArmed) { S.shortlist = []; store("shortlist", []); S.clearArmed = false; }
        else { S.clearArmed = true; setTimeout(function () { S.clearArmed = false; }, 4000); }
        renderAll(); break;
    }
  });
  var navCount = 0;

  function copyList() {
    var text = shortlistText();
    function fallback() {
      var ta = document.getElementById("copy-fallback");
      ta.hidden = false; ta.value = text; ta.focus(); ta.select();
      toast(t("copyFail"));
    }
    try {
      navigator.clipboard.writeText(text).then(function () { toast(t("copied")); }, fallback);
    } catch (e) { fallback(); }
  }

  window.addEventListener("hashchange", function () {
    navCount++;
    S.clearArmed = false;
    renderAll();
    if (route().view === "detail") { window.scrollTo(0, 0); var c = document.getElementById("content"); if (c) c.focus({ preventScroll: true }); }
  });

  // Open the profile panel by default on wide screens (it is always visible there anyway).
  S.profileOpen = window.matchMedia("(min-width: 881px)").matches || false;
  renderShell();
})();

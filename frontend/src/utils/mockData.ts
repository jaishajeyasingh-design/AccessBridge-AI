import { LanguageOption, MockAnalysisData } from '../types';

export const SUPPORTED_LANGUAGES: LanguageOption[] = [
  { code: 'en', name: 'English', localName: 'English', voiceLang: 'en-IN' },
  { code: 'ta', name: 'Tamil', localName: 'தமிழ்', voiceLang: 'ta-IN' },
  { code: 'hi', name: 'Hindi', localName: 'हिन्दी', voiceLang: 'hi-IN' },
  { code: 'te', name: 'Telugu', localName: 'తెలుగు', voiceLang: 'te-IN' },
  { code: 'ml', name: 'Malayalam', localName: 'മലയാളം', voiceLang: 'ml-IN' },
];

export const MOCK_SCHOLARSHIP_ANALYSIS: MockAnalysisData = {
  title: "Scholarship Application Notice",
  documentType: "Education / Scholarship",
  simpleExplanation: "This document explains how eligible students can apply for a scholarship. You need to check the eligibility requirements, collect the required documents and submit the application before the deadline.",
  eligibility: [
    "Currently enrolled students",
    "Students who satisfy the stated income requirement",
    "Students with valid identity and residence documents"
  ],
  deadline: "30 September 2026",
  deadlineWarning: "Make sure your application is submitted before this date.",
  requiredDocuments: [
    { id: "doc-1", label: "Aadhaar / Identity Proof", completed: false },
    { id: "doc-2", label: "Income Certificate", completed: false },
    { id: "doc-3", label: "Residence Proof", completed: false },
    { id: "doc-4", label: "College Verification", completed: false }
  ],
  actionSteps: [
    { id: "act-1", label: "Check your eligibility", completed: false },
    { id: "act-2", label: "Collect the required documents", completed: false },
    { id: "act-3", label: "Complete the application", completed: false },
    { id: "act-4", label: "Verify your information", completed: false },
    { id: "act-5", label: "Submit before 30 September 2026", completed: false }
  ],
  importantPoints: [
    "Applications must be submitted before the deadline.",
    "Required documents must be valid.",
    "Check eligibility before applying."
  ],
  warnings: "Make sure all required documents are available before submission.",
  translations: {
    en: {
      title: "Scholarship Application Notice",
      simpleExplanation: "This document explains how eligible students can apply for a scholarship. You need to check the eligibility requirements, collect the required documents and submit the application before the deadline.",
      actionStepsSummary: "Check eligibility, gather valid documents (Aadhaar, Income, Residence, College Verification), complete form, and submit prior to 30 September 2026.",
      warnings: "Make sure all required documents are available before submission."
    },
    ta: {
      title: "உதவித்தொகை விண்ணப்ப அறிவிப்பு",
      simpleExplanation: "இந்த ஆவணம் தகுதியுள்ள மாணவர்கள் எவ்வாறு உதவித்தொகைக்கு விண்ணப்பிக்கலாம் என்பதை விளக்குகிறது. தகுதித் தேவைகளைச் சரிபார்த்து, தேவையான ஆவணங்களைச் சேகரித்து, கடைசி தேதிக்கு முன் விண்ணப்பத்தைச் சமர்ப்பிக்க வேண்டும்.",
      actionStepsSummary: "தகுதியை சரிபார்க்கவும், தேவையான ஆவணங்களை (ஆதார், வருமான சான்றிதழ், இருப்பிட சான்றிதழ்) சேகரித்து 30 செப்டம்பர் 2026க்குள் சமர்ப்பிக்கவும்.",
      warnings: "சமர்ப்பிப்பதற்கு முன் தேவையான அனைத்து ஆவணங்களும் தயாராக உள்ளதை உறுதிசெய்யவும்."
    },
    hi: {
      title: "छात्रवृत्ति आवेदन सूचना",
      simpleExplanation: "यह दस्तावेज बताता है कि पात्र छात्र छात्रवृत्ति के लिए कैसे आवेदन कर सकते हैं। आपको पात्रता की जांच करनी होगी, आवश्यक दस्तावेज एकत्र करने होंगे और अंतिम तिथि से पहले आवेदन जमा करना होगा।",
      actionStepsSummary: "पात्रता जांचें, आवश्यक दस्तावेज एकत्र करें और 30 सितंबर 2026 से पहले जमा करें।",
      warnings: "सबमिशन से पहले सुनिश्चित करें कि सभी आवश्यक दस्तावेज उपलब्ध हैं।"
    },
    te: {
      title: "స్కాలర్‌షిప్ దరఖాస్తు నోటీసు",
      simpleExplanation: "అర్హులైన విద్యార్థులు స్కాలర్‌షిప్ కోసం ఎలా దరఖాస్తు చేసుకోవచ్చో ఈ పత్రం వివరిస్తుంది. మీరు అర్హత అవసరాలను తనిఖీ చేయాలి, అవసరమైన పత్రాలను సేకరించి గడువు కంటే ముందు దరఖాస్తు సమర్పించాలి.",
      actionStepsSummary: "అర్హతను సరిచూసుకోండి, అవసరమైన పత్రాలను సేకరించి 30 సెప్టెంబర్ 2026 లోపు సమర్పించండి.",
      warnings: "సమర్పణకు ముందు అవసరమైన అన్ని పత్రాలు అందుబాటులో ఉన్నాయని నిర్ధారించుకోండి."
    },
    ml: {
      title: "സ്കോളർഷിപ്പ് അപേക്ഷാ നോട്ടീസ്",
      simpleExplanation: "അർഹരായ വിദ്യാർത്ഥികൾക്ക് സ്കോളർഷിപ്പിനായി എങ്ങനെ അപേക്ഷിക്കാമെന്ന് ഈ രേഖ വിശദീകരിക്കുന്നു. യോഗ്യതാ മാനദണ്ഡങ്ങൾ പരിശോധിച്ച്, ആവശ്യമായ രേഖകൾ ശേഖരിച്ച് അവസാന തീയതിക്ക് മുമ്പ് അപേക്ഷ സമർപ്പിക്കേണ്ടതാണ്.",
      actionStepsSummary: "യോഗ്യത പരിശോധിക്കുക, രേഖകൾ ശേഖരിക്കുക, 2026 സെപ്റ്റംബർ 30-ന് മുമ്പ് സമർപ്പിക്കുക.",
      warnings: "സമർപ്പിക്കുന്നതിന് മുമ്പ് ആവശ്യമായ എല്ലാ രേഖകളും ലഭ്യമാണെന്ന് ഉറപ്പാക്കുക."
    }
  }
};

export const DEMO_GATE_PAYMENT_TEXT = `Graduate Aptitude Test in Engineering (GATE) 2027 Payment Confirmation
Enrollment ID: M241PS0
Candidate Name: Sample Candidate
Payment Status: Payment Received Successfully
Amount Paid: ₹1000
Transaction Number: 114831134087
Payment Date: 24 September 2026
Description: This document confirms that the GATE 2027 application payment was successfully completed.
Action Steps:
1. Keep this payment receipt and transaction number for your records.
2. Use your enrollment ID or transaction number to verify your application status on the official GATE portal if needed.
No deadline was found in the uploaded document.
No specific documents are listed in this document.`;

export const DEMO_GATE_PAYMENT_ANALYSIS: MockAnalysisData = {
  title: "Graduate Aptitude Test in Engineering (GATE) 2027 Payment Confirmation",
  documentType: "Education / Payment Confirmation",
  simpleExplanation: "This document confirms that the GATE 2027 application payment was successfully completed.",
  eligibility: [],
  deadline: "Not specified in document",
  deadlineWarning: "No deadline was found in the uploaded document.",
  requiredDocuments: [],
  actionSteps: [
    {
      id: "demo-act-1",
      label: "Keep this payment receipt and transaction number for your records.",
      completed: false
    },
    {
      id: "demo-act-2",
      label: "Use your enrollment ID or transaction number to verify your application status on the official GATE portal if needed.",
      completed: false
    }
  ],
  importantPoints: [
    "Payment Status: Payment Received Successfully",
    "Amount Paid: ₹1000",
    "Transaction Number: 114831134087",
    "Enrollment ID: M241PS0"
  ],
  warnings: "",
  translations: {
    en: {
      title: "Graduate Aptitude Test in Engineering (GATE) 2027 Payment Confirmation",
      simpleExplanation: "This document confirms that the GATE 2027 application payment was successfully completed.",
      actionStepsSummary: "Keep this payment receipt and transaction number for your records; Use your enrollment ID or transaction number to verify your application status on the official GATE portal if needed.",
      warnings: ""
    },
    ta: {
      title: "GATE 2027 கட்டண உறுதிப்படுத்தல்",
      simpleExplanation: "GATE 2027 விண்ணப்பக் கட்டணம் வெற்றிகரமாகச் செலுத்தப்பட்டதை இந்த ஆவணம் உறுதிப்படுத்துகிறது.",
      actionStepsSummary: "கட்டண ரசீது மற்றும் பரிவர்த்தனை எண்ணைப் பதிவுகளுக்கு வைத்துக்கொள்ளவும்; தேவைப்பட்டால் GATE போர்ட்டலில் சரிபார்க்கவும்.",
      warnings: ""
    },
    hi: {
      title: "गेट (GATE) 2027 भुगतान पुष्टि",
      simpleExplanation: "यह दस्तावेज पुष्टि करता है कि गेट 2027 आवेदन का भुगतान सफलतापूर्वक पूरा हो गया है।",
      actionStepsSummary: "भुगतान रसीद और लेनदेन संख्या को रिकॉर्ड के लिए रखें; आवश्यकता पड़ने पर आधिकारिक पोर्टल पर जांच करें।",
      warnings: ""
    },
    te: {
      title: "గేట్ (GATE) 2027 చెల్లింపు ధృవీకరణ",
      simpleExplanation: "GATE 2027 దరఖాస్తు చెల్లింపు విజయవంతంగా పూర్తయిందని ఈ పత్రం ధృవీకరిస్తుంది.",
      actionStepsSummary: "రసీదు మరియు లావాదేవీ సంఖ్యను మీ వద్ద ఉంచుకోండి; అవసరమైతే అధికారిక పోర్టల్‌లో సరిచూసుకోండి.",
      warnings: ""
    },
    ml: {
      title: "ഗേറ്റ് (GATE) 2027 പേയ്‌മെന്റ് സ്ഥിരീകരണം",
      simpleExplanation: "GATE 2027 അപേക്ഷ പേയ്‌മെന്റ് വിജയകരമായി പൂർത്തിയായെന്ന് ഈ രേഖ സ്ഥിരീകരിക്കുന്നു.",
      actionStepsSummary: "പേയ്‌മെന്റ് രസീതും ട്രാൻസാക്ഷൻ നമ്പറും സൂക്ഷിക്കുക; ആവശ്യമെങ്കിൽ ഒഫീഷ്യൽ പോർട്ടലിൽ പരിശോധിക്കുക.",
      warnings: ""
    }
  }
};

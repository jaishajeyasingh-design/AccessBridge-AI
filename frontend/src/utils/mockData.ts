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

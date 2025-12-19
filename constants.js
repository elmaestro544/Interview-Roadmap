
export const AppView = Object.freeze({
  Setup: 'setup',
  Questions: 'questions',
  MockInterview: 'mock_interview',
  Review: 'review',
  History: 'history',
});

export const Language = Object.freeze({
  EN: 'en',
  AR: 'ar',
});

export const i18n = {
  [Language.EN]: {
    title: "Interview Roadmap",
    navSetup: "Prepare",
    navQuestions: "Questions",
    navMock: "Mock Interview",
    navReview: "Performance Review",
    navHistory: "My History",
    // Setup
    setupTitle: "Interview Preparation",
    setupDesc: "Upload your resume and the job description to generate tailored assessment content.",
    jobDescriptionLabel: "Job Description",
    jobPlaceholder: "Paste the job description here...",
    resumeLabel: "Your Resume",
    resumePlaceholder: "Paste your resume text or upload a file...",
    generateBtn: "Generate Assessment",
    // Questions
    questionsTitle: "Tailored Interview Questions",
    questionsDesc: "Based on your background and the role, here are the most likely questions you will face.",
    starMethod: "STAR Method Tip",
    starDesc: "Structure your answers using Situation, Task, Action, and Result.",
    // Mock Interview
    mockTitle: "AI Mock Interview",
    startMock: "Start Interview Session",
    endMock: "End Interview",
    listening: "Listening...",
    speaking: "Interviewer is speaking...",
    suggestedAnswer: "AI Suggested Answer",
    generatingAnswer: "Generating ideal response...",
    // Review
    reviewTitle: "Performance Analysis",
    scoreLabel: "Overall Readiness",
    feedbackLabel: "Detailed Feedback",
    strengths: "Strengths",
    improvements: "Areas for Improvement",
    saveSuccess: "Session saved to your profile!",
    // History
    historyTitle: "Interview History",
    noHistory: "No past interviews found. Start your first assessment!",
    viewDetails: "View Details",
    // Auth
    login: "Login",
    register: "Register",
    logout: "Logout",
    emailAddress: "Email Address",
    password: "Password",
    fullName: "Full Name",
    forgotPassword: "Forgot Password?",
    dontHaveAccount: "Don't have an account?",
    alreadyHaveAccount: "Already have an account?",
    createAccount: "Create Account",
    // Shared
    loading: "Processing with AI...",
    error: "An error occurred. Please try again.",
    back: "Back",
    next: "Next",
  },
  [Language.AR]: {
    title: "خارطة طريق المقابلة",
    navSetup: "تجهيز",
    navQuestions: "الأسئلة",
    navMock: "مقابلة تجريبية",
    navReview: "تقييم الأداء",
    navHistory: "تاريخي",
    // Setup
    setupTitle: "التحضير للمقابلة",
    setupDesc: "قم برفع سيرتك الذاتية ووصف الوظيفة لإنشاء محتوى تقييم مخصص.",
    jobDescriptionLabel: "وصف الوظيفة",
    jobPlaceholder: "الصق وصف الوظيفة هنا...",
    resumeLabel: "سيرتك الذاتية",
    resumePlaceholder: "الصق نص سيرتك الذاتية أو ارفع ملفاً...",
    generateBtn: "إنشاء التقييم",
    // Questions
    questionsTitle: "أسئلة مقابلة مخصصة",
    questionsDesc: "بناءً على خلفيتك والدور الوظيفي، إليك الأسئلة الأكثر احتمالاً.",
    starMethod: "نصيحة أسلوب STAR",
    starDesc: "قم بتنظيم إجاباتك باستخدام الموقف، المهمة، الإجراء، والنتيجة.",
    // Mock Interview
    mockTitle: "مقابلة تجريبية بالذكاء الاصطناعي",
    startMock: "بدء جلسة المقابلة",
    endMock: "إنهاء المقابلة",
    listening: "جاري الاستماع...",
    speaking: "المحاور يتحدث...",
    suggestedAnswer: "الإجابة المقترحة من الذكاء الاصطناعي",
    generatingAnswer: "جاري إنشاء الإجابة المثالية...",
    // Review
    reviewTitle: "تحليل الأداء",
    scoreLabel: "الجاهزية العامة",
    feedbackLabel: "ملاحظات مفصلة",
    strengths: "نقاط القوة",
    improvements: "مجالات التحسين",
    saveSuccess: "تم حفظ الجلسة في ملفك الشخصي!",
    // History
    historyTitle: "سجل المقابلات",
    noHistory: "لم يتم العثور على مقابلات سابقة. ابدأ تقييمك الأول!",
    viewDetails: "عرض التفاصيل",
    // Auth
    login: "تسجيل الدخول",
    register: "إنشاء حساب",
    logout: "تسجيل الخروج",
    emailAddress: "البريد الإلكتروني",
    password: "كلمة المرور",
    fullName: "الاسم الكامل",
    forgotPassword: "نسيت كلمة المرور؟",
    dontHaveAccount: "ليس لديك حساب؟",
    alreadyHaveAccount: "لديك حساب بالفعل؟",
    createAccount: "إنشاء حساب جديد",
    // Shared
    loading: "جاري المعالجة بالذكاء الاصطناعي...",
    error: "حدث خطأ. يرجى المحاولة مرة أخرى.",
    back: "رجوع",
    next: "التالي",
  }
};
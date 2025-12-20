
export const AppView = Object.freeze({
  Setup: 'setup',
  Questions: 'questions',
  MockInterview: 'mock_interview',
  Review: 'review',
  History: 'history',
  HowItWorks: 'how_it_works',
});

export const Language = Object.freeze({
  EN: 'en',
  AR: 'ar',
});

export const JOB_TEMPLATES = [
  {
    id: 'planning_manager',
    title: { en: 'Planning Manager', ar: 'مدير تخطيط' },
    icon: '📅',
    content: {
      en: "We are seeking an experienced Planning Manager to oversee project schedules.\n\nKey Responsibilities:\n- Develop and maintain integrated project master schedules.\n- Monitor project progress and identify potential delays.\n- Coordinate with engineering and construction teams for resource optimization.\n- Provide regular progress reports and delay analysis (EOT).\n\nRequirements:\n- Proficiency in Primavera P6 and MS Project.\n- Strong background in project controls and scheduling techniques.\n- Leadership skills to manage a planning team.",
      ar: "نحن نبحث عن مدير تخطيط ذو خبرة للإشراف على جداول المشاريع.\n\nالمسؤوليات الرئيسية:\n- تطوير وصيانة الجداول الزمنية الرئيسية المتكاملة للمشروع.\n- مراقبة تقدم المشروع وتحديد التأخيرات المحتملة.\n- التنسيق مع الفرق الهندسية والإنشائية لتحسين الموارد.\n- تقديم تقارير تقدم دورية وتحليل التأخيرات (EOT).\n\nالمتطلبات:\n- إتقان برنامج Primavera P6 و MS Project.\n- خلفية قوية في ضوابط المشروع وتقنيات الجدولة.\n- مهارات قيادية لإدارة فريق التخطيط."
    }
  },
  {
    id: 'project_control_manager',
    title: { en: 'Project Control Manager', ar: 'مدير ضوابط المشروع' },
    icon: '📊',
    content: {
      en: "Seeking a Project Control Manager to lead cost and schedule monitoring.\n\nResponsibilities:\n- Oversee cost estimation, budgeting, and financial reporting.\n- Manage project performance metrics (Earned Value Management).\n- Implement risk management and mitigation strategies.\n- Ensure accurate progress measurement and variance analysis.\n\nRequirements:\n- Extensive experience in project controls and cost engineering.\n- Analytical mindset for complex data interpretation.\n- Certification in PMP or CCP is a plus.",
      ar: "نبحث عن مدير ضوابط المشروع لقيادة مراقبة التكاليف والجداول الزمنية.\n\nالمسؤوليات:\n- الإشراف على تقدير التكاليف والميزانية والتقارير المالية.\n- إدارة مقاييس أداء المشروع (إدارة القيمة المكتسبة).\n- تنفيذ استراتيجيات إدارة المخاطر والتخفيف منها.\n- ضمان دقة قياس التقدم وتحليل الانحرافات.\n\nالمتطلبات:\n- خبرة واسعة في ضوابط المشروع وهندسة التكاليف.\n- عقلية تحليلية لتفسير البيانات المعقدة.\n- شهادة PMP أو CCP هي ميزة إضافية."
    }
  },
  {
    id: 'risk_manager',
    title: { en: 'Risk Manager', ar: 'مدير مخاطر' },
    icon: '🛡️',
    content: {
      en: "We are seeking a proactive Risk Manager to lead our risk identification and mitigation efforts.\n\nKey Responsibilities:\n- Perform comprehensive risk assessments and qualitative/quantitative analysis.\n- Develop and implement robust risk mitigation strategies and contingency plans.\n- Establish risk monitoring protocols and reporting frameworks for senior management.\n- Evaluate the effectiveness of internal controls and compliance procedures.\n\nRequirements:\n- Extensive experience in risk management or project controls.\n- Proficiency in risk analysis tools and methodologies (e.g., Monte Carlo simulation).\n- Strong communication and stakeholder management skills.",
      ar: "نحن نبحث عن مدير مخاطر استباقي لقيادة جهود تحديد المخاطر والتخفيف منها.\n\nالمسؤوليات الرئيسية:\n- إجراء تقييمات شاملة للمخاطر والتحليل النوعي والكمي.\n- تطوير وتنفيذ استراتيجيات قوية للتخفيف من المخاطر وخطط الطوارئ.\n- وضع بروتوكولات لمراقبة المخاطر وأطر إعداد التقارير للإدارة العليا.\n- تقييم فعالية الضوابط الداخلية وإجراءات الامتثال.\n\nالمتطلبات:\n- خبرة واسعة في إدارة المخاطر أو ضوابط المشروع.\n- إتقان أدوات ومنهجيات تحليل المخاطر (مثل محاكاة مونت كارلو).\n- مهارات تواصل قوية وإدارة أصحاب المصلحة."
    }
  },
  {
    id: 'software_engineer',
    title: { en: 'Software Engineer', ar: 'مهندس برمجيات' },
    icon: '💻',
    content: {
      en: "We are looking for a Software Engineer to join our team. \n\nKey Responsibilities:\n- Design and develop high-quality software solutions.\n- Collaborate with cross-functional teams to define and ship new features.\n- Write clean, maintainable, and efficient code.\n- Participate in code reviews and architectural discussions.\n\nRequirements:\n- Proficiency in modern programming languages (React, Node.js, Python).\n- Strong understanding of data structures and algorithms.\n- Experience with cloud platforms (AWS, GCP).\n- Excellent problem-solving skills.",
      ar: "نحن نبحث عن مهندس برمجيات للانضمام إلى فريقنا.\n\nالمسؤوليات الرئيسية:\n- تصميم وتطوير حلول برمجية عالية الجودة.\n- التعاون مع فرق العمل المختلفة لتحديد وإطلاق ميزات جديدة.\n- كتابة كود نظيف وقابل للصيانة وفعال.\n- المشاركة في مراجعة الكود ومناقشات التصميم المعماري.\n\nالمتطلبات:\n- إتقان لغات البرمجة الحديثة (React, Node.js, Python).\n- فهم قوي لهياكل البيانات والخوارزميات.\n- خبرة في المنصات السحابية (AWS, GCP).\n- مهارات ممتازة في حل المشكلات."
    }
  },
  {
    id: 'project_manager',
    title: { en: 'Project Manager', ar: 'مدير مشروع' },
    icon: '🏗️',
    content: {
      en: "Seeking a result-oriented Project Manager.\n\nResponsibilities:\n- Plan, execute, and finalize projects according to strict deadlines.\n- Coordinate between internal resources and third parties/vendors.\n- Manage project scope, schedule, and costs.\n- Track progress and report results to senior management.\n\nRequirements:\n- Proven experience in project management.\n- Strong leadership and communication skills.\n- Knowledge of Agile and Scrum methodologies.\n- Ability to work under pressure.",
      ar: "نبحث عن مدير مشروع يركز على النتائج.\n\nالمسؤوليات:\n- تخطيط وتنفيذ وإنهاء المشاريع وفقًا لمواعيد نهائية صارمة.\n- التنسيق بين الموارد الداخلية والأطراف الثالثة/البائعين.\n- إدارة نطاق المشروع والجدول الزمني والتكاليف.\n- تتبع التقدم وتقديم تقارير النتائج للإدارة العليا.\n\nالمتطلبات:\n- خبرة مثبتة في إدارة المشاريع.\n- مهارات قيادية وتواصل قوية.\n- معرفة بمنهجيات Agile و Scrum.\n- القدرة على العمل تحت الضغط."
    }
  },
  {
    id: 'marketing_specialist',
    title: { en: 'Marketing Specialist', ar: 'أخصائي تسويق' },
    icon: '📈',
    content: {
      en: "Join us as a Marketing Specialist to drive our brand growth.\n\nResponsibilities:\n- Develop and implement marketing campaigns across multiple channels.\n- Analyze market trends and competitor activities.\n- Manage social media presence and content strategy.\n- Generate leads and improve conversion rates.\n\nRequirements:\n- Bachelor's degree in Marketing or related field.\n- Excellent creative and analytical skills.\n- Experience with digital marketing tools (Google Analytics, SEO).\n- Strong copywriting abilities.",
      ar: "انضم إلينا كأخصائي تسويق لتعزيز نمو علامتنا التجارية.\n\nالمسؤوليات:\n- تطوير وتنفيذ حملات تسويقية عبر قنوات متعددة.\n- تحليل اتجاهات السوق وأنشطة المنافسين.\n- إدارة التواجد على وسائل التواصل الاجتماعي واستراتيجية المحتوى.\n- جذب العملاء المحتملين وتحسين معدلات التحويل.\n\nالمتطلبات:\n- درجة البكالوريوس في التسويق أو مجال ذي صلة.\n- مهارات إبداعية وتحليلية ممتازة.\n- خبرة في أدوات التسويق الرقمي (Google Analytics, SEO).\n- قدرات قوية في كتابة المحتوى الإعلاني."
    }
  }
];

export const i18n = {
  [Language.EN]: {
    title: "Interview Roadmap",
    navSetup: "Prepare",
    navQuestions: "Questions",
    navMock: "Mock Interview",
    navReview: "Performance Review",
    navHistory: "My History",
    navHowItWorks: "How It Works",
    // Setup
    setupTitle: "Interview Preparation",
    setupDesc: "Upload your resume and the job description to generate tailored assessment content.",
    jobDescriptionLabel: "Job Description",
    jobPlaceholder: "Paste the job description here...",
    selectTemplate: "Quick Templates",
    resumeLabel: "Your Resume",
    resumePlaceholder: "Paste your resume text or upload a file...",
    generateBtn: "Generate Assessment",
    templatesHeader: "Ready-made Templates",
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
    duration: "Duration",
    // Review
    reviewTitle: "Performance Analysis",
    scoreLabel: "Overall Readiness",
    feedbackLabel: "Detailed Feedback",
    strengths: "Strengths",
    improvements: "Areas for Improvement",
    saveSuccess: "Session saved to your profile!",
    sessionDuration: "Session Duration",
    // History
    historyTitle: "Interview History",
    noHistory: "No past interviews found. Start your first assessment!",
    viewDetails: "View Details",
    // How It Works
    howItWorksTitle: "How It Works",
    howItWorksDesc: "Master your next interview in four simple steps powered by advanced AI.",
    step1Title: "1. Upload & Analyze",
    step1Desc: "Provide your resume and the job you're aiming for. Our AI dissects the requirements to find the perfect overlap.",
    step2Title: "2. Custom Questions",
    step2Desc: "Receive a curated list of high-probability questions specifically tailored to your experience and the target role.",
    step3Title: "3. Interactive Practice",
    step3Desc: "Engage in a live, voice-to-voice mock interview with our AI recruiter. Experience the pressure of a real session.",
    step4Title: "4. Detailed Feedback",
    step4Desc: "Get an instant score, breakdown of strengths, and areas for improvement with ideal sample answers.",
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
    navHowItWorks: "كيف يعمل",
    // Setup
    setupTitle: "التحضير للمقابلة",
    setupDesc: "قم برفع سيرتك الذاتية ووصف الوظيفة لإنشاء محتوى تقييم مخصص.",
    jobDescriptionLabel: "وصف الوظيفة",
    jobPlaceholder: "الصق وصف الوظيفة هنا...",
    selectTemplate: "نماذج سريعة",
    resumeLabel: "سيرتك الذاتية",
    resumePlaceholder: "الصق نص سيرتك الذاتية أو ارفع ملفاً...",
    generateBtn: "إنشاء التقييم",
    templatesHeader: "قوالب جاهزة",
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
    duration: "المدة",
    // Review
    reviewTitle: "تحليل الأداء",
    scoreLabel: "الجاهزية العامة",
    feedbackLabel: "ملاحظات مفصلة",
    strengths: "نقاط القوة",
    improvements: "مجالات التحسين",
    saveSuccess: "تم حفظ الجلسة في ملفك الشخصي!",
    sessionDuration: "مدة الجلسة",
    // History
    historyTitle: "سجل المقابلات",
    noHistory: "لم يتم العثور على مقابلات سابقة. ابدأ تقييمك الأول!",
    viewDetails: "عرض التفاصيل",
    // How It Works
    howItWorksTitle: "كيف يعمل",
    howItWorksDesc: "اتقن مقابلتك القادمة في أربع خطوات بسيطة مدعومة بالذكاء الاصطناعي المتقدم.",
    step1Title: "1. الرفع والتحليل",
    step1Desc: "قدم سيرتك الذاتية والوظيفة التي تطمح إليها. يقوم ذكاؤنا الاصطناعي بتحليل المتطلبات للعثور على التداخل المثالي.",
    step2Title: "2. أسئلة مخصصة",
    step2Desc: "احصل على قائمة منسقة من الأسئلة عالية الاحتمالية والمصممة خصيصًا لخبرتك والدور المستهدف.",
    step3Title: "3. ممارسة تفاعلية",
    step3Desc: "شارك في مقابلة تجريبية مباشرة صوتية مع مسؤول التوظيف بالذكاء الاصطناعي. جرب ضغط الجلسة الحقيقية.",
    step4Title: "4. تعليقات مفصلة",
    step4Desc: "احصل على درجة فورية، وتوزيع لنقاط القوة، ومجالات التحسين مع إجابات نموذجية مثالية.",
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


import React from 'react';
import { i18n, AppView } from '../constants.js';

const StepCard = ({ title, description, icon, isLast, language }) => (
    React.createElement('div', { className: "relative flex flex-col items-center p-8 bg-white dark:bg-dark-card rounded-[2.5rem] border border-slate-200 dark:border-white/5 shadow-xl transition-all hover:scale-[1.02] hover:shadow-green-500/10 group" },
        React.createElement('div', { className: "w-20 h-20 rounded-full bg-brand-green/10 flex items-center justify-center text-4xl mb-6 group-hover:scale-110 transition-transform" },
            icon
        ),
        React.createElement('h3', { className: "text-xl font-black mb-4 text-slate-900 dark:text-white text-center" }, title),
        React.createElement('p', { className: "text-slate-500 dark:text-slate-400 text-center font-medium leading-relaxed" }, description),
        
        !isLast && React.createElement('div', { className: `hidden lg:block absolute top-1/2 -translate-y-1/2 ${language === 'ar' ? '-left-6 rotate-180' : '-right-6'} z-10 text-brand-green opacity-50` },
            React.createElement('svg', { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", stroke: "currentColor", strokeWidth: "3", strokeLinecap: "round", strokeLinejoin: "round" },
                React.createElement('path', { d: "M5 12h14M12 5l7 7-7 7" })
            )
        )
    )
);

const HowItWorks = ({ language, setView }) => {
    const t = i18n[language];

    const steps = [
        { title: t.step1Title, desc: t.step1Desc, icon: "📄" },
        { title: t.step2Title, desc: t.step2Desc, icon: "🎯" },
        { title: t.step3Title, desc: t.step3Desc, icon: "🎙️" },
        { title: t.step4Title, desc: t.step4Desc, icon: "🏆" }
    ];

    return React.createElement('div', { className: "animate-fade-in-up w-full px-4 md:px-12 max-w-7xl mx-auto py-12" },
        React.createElement('div', { className: "text-center mb-16" },
            React.createElement('h2', { className: "text-4xl md:text-6xl font-black mb-6 text-slate-900 dark:text-white" }, t.howItWorksTitle),
            React.createElement('p', { className: "text-slate-500 dark:text-slate-400 text-xl max-w-3xl mx-auto font-medium" }, t.howItWorksDesc)
        ),
        React.createElement('div', { className: "grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20" },
            steps.map((step, i) => React.createElement(StepCard, { 
                key: i, 
                title: step.title, 
                description: step.desc, 
                icon: step.icon, 
                isLast: i === steps.length - 1,
                language: language
            }))
        ),
        React.createElement('div', { className: "bg-gradient-to-br from-brand-green/20 to-brand-blue/20 dark:from-brand-green/5 dark:to-brand-blue/5 rounded-[3rem] p-12 text-center border border-brand-green/20" },
            React.createElement('h3', { className: "text-3xl font-black mb-6 text-slate-900 dark:text-white" }, "Ready to dominate your next interview?"),
            React.createElement('button', { 
                onClick: () => setView(AppView.Setup),
                className: "bg-brand-green hover:bg-green-600 text-white font-black py-5 px-12 rounded-full transition-all shadow-xl shadow-green-500/20 hover:scale-105 active:scale-95 text-xl"
            }, "Get Started Free")
        )
    );
};

export default HowItWorks;

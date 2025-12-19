
import React, { useState, useEffect } from 'react';
import { AppView, Language, i18n } from './constants.js';
import SetupView from './components/SetupView.js';
import QuestionsView from './components/QuestionsView.js';
import MockInterviewView from './components/MockInterviewView.js';
import ReviewView from './components/ReviewView.js';
import HistoryView from './components/HistoryView.js';
import HowItWorks from './components/HowItWorks.js';
import AuthModal from './components/AuthModal.js';
import { Logo, SunIcon, MoonIcon, UserIcon, TextSizeIcon } from './components/Shared.js';
import * as supabase from './services/supabaseService.js';

const App = () => {
    const [view, setView] = useState(AppView.Setup);
    const [language, setLanguage] = useState(Language.EN);
    const [theme, setTheme] = useState('dark');
    const [fontSize, setFontSize] = useState(100); // Percentage
    const [user, setUser] = useState(null);
    const [isAuthModalOpen, setAuthModalOpen] = useState(false);
    const [interviewData, setInterviewData] = useState({
        jobDesc: '',
        resume: '',
        questions: [],
        history: [],
        analysis: null
    });

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
        document.documentElement.dir = language === Language.AR ? 'rtl' : 'ltr';
    }, [theme, language]);

    useEffect(() => {
        const { data: authListener } = supabase.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email,
                    fullName: session.user.user_metadata.full_name
                });
            } else {
                setUser(null);
            }
        });
        return () => authListener.subscription.unsubscribe();
    }, []);

    const t = i18n[language];

    const changeFontSize = (delta) => {
        setFontSize(prev => Math.min(150, Math.max(80, prev + delta)));
    };

    const renderView = () => {
        const props = { language, setView, interviewData, setInterviewData, user };
        switch (view) {
            case AppView.Setup: return React.createElement(SetupView, props);
            case AppView.Questions: return React.createElement(QuestionsView, props);
            case AppView.MockInterview: return React.createElement(MockInterviewView, props);
            case AppView.Review: return React.createElement(ReviewView, props);
            case AppView.History: return React.createElement(HistoryView, props);
            case AppView.HowItWorks: return React.createElement(HowItWorks, props);
            default: return React.createElement(SetupView, props);
        }
    };

    // Make some views full width for maximum workspace
    const isFullWidthView = [AppView.MockInterview, AppView.Setup, AppView.HowItWorks].includes(view);

    return React.createElement('div', {
        className: "min-h-screen text-slate-900 dark:text-white font-sans transition-colors duration-300 bg-transparent",
        style: { fontSize: `${fontSize}%` }
    },
        React.createElement('header', {
            className: "sticky top-0 z-50 bg-white/70 dark:bg-dark-bg/60 backdrop-blur-2xl border-b border-slate-200 dark:border-white/10"
        },
            React.createElement('nav', { className: "container mx-auto px-6 py-4 flex justify-between items-center" },
                React.createElement('div', { className: "flex items-center gap-6" },
                    React.createElement('div', { 
                        className: "flex items-center gap-3 cursor-pointer",
                        onClick: () => setView(AppView.Setup)
                    },
                        React.createElement(Logo, null),
                        React.createElement('h1', { className: "text-xl font-bold tracking-tight text-slate-900 dark:text-white" }, t.title)
                    ),
                    React.createElement('div', { className: "hidden md:flex items-center gap-6" },
                        React.createElement('button', {
                            onClick: () => setView(AppView.HowItWorks),
                            className: `text-sm font-medium hover:text-brand-green transition-colors ${view === AppView.HowItWorks ? 'text-brand-green' : 'text-slate-500'}`
                        }, t.navHowItWorks),
                        user && React.createElement('button', {
                            onClick: () => setView(AppView.History),
                            className: `text-sm font-medium hover:text-brand-green transition-colors ${view === AppView.History ? 'text-brand-green' : 'text-slate-500'}`
                        }, t.navHistory)
                    )
                ),
                React.createElement('div', { className: "flex items-center gap-3 md:gap-4" },
                    // Font Size Controls
                    React.createElement('div', { className: "hidden sm:flex items-center bg-slate-200/50 dark:bg-white/10 rounded-full px-2 py-1" },
                        React.createElement('button', {
                            onClick: () => changeFontSize(-10),
                            className: "p-1.5 hover:text-brand-green transition-colors",
                            title: "Decrease Font"
                        }, "A-"),
                        React.createElement('div', { className: "mx-1 text-slate-400" }, React.createElement(TextSizeIcon, { className: "w-4 h-4" })),
                        React.createElement('button', {
                            onClick: () => changeFontSize(10),
                            className: "p-1.5 hover:text-brand-green transition-colors",
                            title: "Increase Font"
                        }, "A+")
                    ),
                    React.createElement('button', {
                        onClick: () => setLanguage(l => l === Language.EN ? Language.AR : Language.EN),
                        className: "text-sm font-semibold hover:text-brand-green transition-colors px-2 text-slate-600 dark:text-slate-300"
                    }, language === Language.EN ? 'العربية' : 'English'),
                    React.createElement('button', {
                        onClick: () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
                        className: "p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors text-slate-600 dark:text-slate-300"
                    }, theme === 'dark' ? React.createElement(SunIcon, null) : React.createElement(MoonIcon, null)),
                    user ? React.createElement('button', {
                        onClick: () => supabase.signOut(),
                        className: "text-xs font-bold bg-slate-200/50 dark:bg-white/10 py-2 px-4 rounded-full hover:bg-red-500 hover:text-white transition-all text-slate-600 dark:text-white"
                    }, t.logout) : React.createElement('button', {
                        onClick: () => setAuthModalOpen(true),
                        className: "flex items-center gap-2 text-xs font-bold bg-brand-green text-white py-2 px-4 rounded-full transition-all shadow-md hover:scale-105"
                    }, React.createElement(UserIcon, { className: "w-3 h-3" }), t.login)
                )
            )
        ),
        React.createElement('main', { className: `px-6 py-8 ${isFullWidthView ? 'w-full max-w-[100vw]' : 'container mx-auto'}` },
            React.createElement('div', { className: isFullWidthView ? 'w-full' : 'max-w-5xl mx-auto' },
                (view !== AppView.History && view !== AppView.HowItWorks) && React.createElement('div', { className: "flex justify-center items-center gap-4 mb-12" },
                    [AppView.Setup, AppView.Questions, AppView.MockInterview, AppView.Review].map((v, i) => (
                        React.createElement(React.Fragment, { key: v },
                            React.createElement('div', {
                                className: `flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                                    view === v 
                                    ? 'bg-brand-green text-white scale-110 shadow-[0_0_15px_rgba(118,218,42,0.4)]' 
                                    : 'bg-slate-200 dark:bg-white/10 text-slate-500'
                                }`
                            }, i + 1),
                            i < 3 && React.createElement('div', { className: "w-8 h-px bg-slate-300 dark:bg-white/20" })
                        )
                    ))
                ),
                renderView()
            )
        ),
        React.createElement(AuthModal, {
            isOpen: isAuthModalOpen,
            onClose: () => setAuthModalOpen(false),
            onLoginSuccess: () => setAuthModalOpen(false),
            language: language,
            setView: setView
        })
    );
};

export default App;

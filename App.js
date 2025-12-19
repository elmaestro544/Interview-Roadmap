
import React, { useState, useEffect } from 'react';
import { AppView, Language, i18n } from './constants.js';
import SetupView from './components/SetupView.js';
import QuestionsView from './components/QuestionsView.js';
import MockInterviewView from './components/MockInterviewView.js';
import ReviewView from './components/ReviewView.js';
import HistoryView from './components/HistoryView.js';
import AuthModal from './components/AuthModal.js';
import { Logo, SunIcon, MoonIcon, UserIcon } from './components/Shared.js';
import * as supabase from './services/supabaseService.js';

const App = () => {
    const [view, setView] = useState(AppView.Setup);
    const [language, setLanguage] = useState(Language.EN);
    const [theme, setTheme] = useState('dark');
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

    const renderView = () => {
        const props = { language, setView, interviewData, setInterviewData, user };
        switch (view) {
            case AppView.Setup: return React.createElement(SetupView, props);
            case AppView.Questions: return React.createElement(QuestionsView, props);
            case AppView.MockInterview: return React.createElement(MockInterviewView, props);
            case AppView.Review: return React.createElement(ReviewView, props);
            case AppView.History: return React.createElement(HistoryView, props);
            default: return React.createElement(SetupView, props);
        }
    };

    const isFullWidthView = view === AppView.MockInterview;

    return React.createElement('div', {
        className: "min-h-screen text-slate-900 dark:text-white font-sans transition-colors duration-300 bg-transparent"
    },
        React.createElement('header', {
            className: "sticky top-0 z-50 bg-white/40 dark:bg-dark-bg/40 backdrop-blur-xl border-b border-slate-200/50 dark:border-white/5"
        },
            React.createElement('nav', { className: "container mx-auto px-6 py-4 flex justify-between items-center" },
                React.createElement('div', { className: "flex items-center gap-6" },
                    React.createElement('div', { 
                        className: "flex items-center gap-3 cursor-pointer",
                        onClick: () => setView(AppView.Setup)
                    },
                        React.createElement(Logo, null),
                        React.createElement('h1', { className: "text-xl font-bold tracking-tight" }, t.title)
                    ),
                    user && React.createElement('button', {
                        onClick: () => setView(AppView.History),
                        className: `text-sm font-medium hover:text-brand-red transition-colors ${view === AppView.History ? 'text-brand-red' : 'text-slate-500'}`
                    }, t.navHistory)
                ),
                React.createElement('div', { className: "flex items-center gap-4" },
                    React.createElement('button', {
                        onClick: () => setLanguage(l => l === Language.EN ? Language.AR : Language.EN),
                        className: "text-sm font-semibold hover:text-brand-red transition-colors"
                    }, language === Language.EN ? 'العربية' : 'English'),
                    React.createElement('button', {
                        onClick: () => setTheme(t => t === 'dark' ? 'light' : 'dark'),
                        className: "p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 transition-colors"
                    }, theme === 'dark' ? React.createElement(SunIcon, null) : React.createElement(MoonIcon, null)),
                    user ? React.createElement('button', {
                        onClick: () => supabase.signOut(),
                        className: "text-xs font-bold bg-slate-200/50 dark:bg-white/10 py-2 px-4 rounded-full hover:bg-red-500 hover:text-white transition-all"
                    }, t.logout) : React.createElement('button', {
                        onClick: () => setAuthModalOpen(true),
                        className: "flex items-center gap-2 text-xs font-bold bg-brand-red text-white py-2 px-4 rounded-full transition-all shadow-md"
                    }, React.createElement(UserIcon, { className: "w-3 h-3" }), t.login)
                )
            )
        ),
        React.createElement('main', { className: `px-6 py-8 ${isFullWidthView ? 'w-full max-w-[100vw]' : 'container mx-auto'}` },
            React.createElement('div', { className: isFullWidthView ? 'w-full' : 'max-w-5xl mx-auto' },
                view !== AppView.History && React.createElement('div', { className: "flex justify-center items-center gap-4 mb-12" },
                    [AppView.Setup, AppView.Questions, AppView.MockInterview, AppView.Review].map((v, i) => (
                        React.createElement(React.Fragment, { key: v },
                            React.createElement('div', {
                                className: `flex items-center justify-center w-10 h-10 rounded-full font-bold transition-all ${
                                    view === v ? 'bg-brand-red text-white scale-110 shadow-lg' : 'bg-slate-200 dark:bg-white/10 text-slate-500'
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

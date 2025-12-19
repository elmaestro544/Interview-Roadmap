
import React from 'react';
import { i18n, AppView } from '../constants.js';

const QuestionsView = ({ language, setView, interviewData }) => {
    const t = i18n[language];

    return React.createElement('div', { className: "animate-fade-in-up" },
        React.createElement('div', { className: "text-center mb-12" },
            React.createElement('h2', { className: "text-3xl font-bold mb-2" }, t.questionsTitle),
            React.createElement('p', { className: "text-slate-500 dark:text-brand-text-light" }, t.questionsDesc)
        ),
        React.createElement('div', { className: "grid gap-6" },
            interviewData.questions.map((q, i) => (
                React.createElement('div', {
                    key: i,
                    className: "group bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-md hover:border-brand-red transition-all"
                },
                    React.createElement('div', { className: "flex items-start gap-4" },
                        React.createElement('span', {
                            className: "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-brand-red/10 text-brand-red font-bold"
                        }, i + 1),
                        React.createElement('div', { className: "flex-grow" },
                            React.createElement('h3', { className: "text-xl font-bold mb-3" }, q.question),
                            React.createElement('div', { className: "bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border-l-4 border-brand-red" },
                                React.createElement('p', { className: "text-sm font-bold text-brand-red uppercase mb-1" }, t.starMethod),
                                React.createElement('p', { className: "text-slate-600 dark:text-brand-text-light" }, q.tip)
                            )
                        )
                    )
                )
            ))
        ),
        React.createElement('div', { className: "flex justify-between mt-12" },
            React.createElement('button', {
                onClick: () => setView(AppView.Setup),
                className: "text-slate-500 hover:text-brand-red font-bold px-8 py-3 transition-colors"
            }, t.back),
            React.createElement('button', {
                onClick: () => setView(AppView.MockInterview),
                className: "bg-brand-red hover:bg-red-600 text-white font-bold px-12 py-3 rounded-full transition-all shadow-lg hover:shadow-brand-red/30"
            }, t.navMock)
        )
    );
};

export default QuestionsView;

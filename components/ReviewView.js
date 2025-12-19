
import React, { useState, useEffect } from 'react';
import { i18n, AppView } from '../constants.js';
import * as api from '../services/geminiService.js';
import * as supabase from '../services/supabaseService.js';
import { Spinner, CheckIcon } from './Shared.js';

const ReviewView = ({ language, setView, interviewData, setInterviewData, user }) => {
    const t = i18n[language];
    const [loading, setLoading] = useState(!interviewData.analysis);
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        if (!interviewData.analysis) {
            const analyze = async () => {
                try {
                    const result = await api.analyzePerformance(interviewData.history, language);
                    setInterviewData(prev => ({ ...prev, analysis: result }));
                    
                    // Auto-save if user is logged in
                    if (user) {
                        await supabase.saveInterview(user.id, {
                            ...interviewData,
                            analysis: result
                        });
                        setSaved(true);
                    }
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            analyze();
        }
    }, [interviewData.history, interviewData.analysis, language, setInterviewData, user]);

    if (loading) {
        return React.createElement('div', { className: "flex flex-col items-center justify-center py-20 text-center space-y-4" },
            React.createElement(Spinner, { size: "12" }),
            React.createElement('p', { className: "text-xl font-bold" }, t.loading)
        );
    }

    const formatTime = (seconds) => {
        if (!seconds) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const { analysis } = interviewData;

    return React.createElement('div', { className: "animate-fade-in-up space-y-8" },
        React.createElement('div', { className: "text-center mb-8" },
            React.createElement('h2', { className: "text-3xl font-bold mb-2" }, t.reviewTitle),
            React.createElement('p', { className: "text-slate-500 dark:text-brand-text-light" }, "AI assessment based on your mock session performance.")
        ),

        saved && React.createElement('div', { className: "bg-green-500/10 border border-green-500/30 text-green-600 dark:text-green-400 p-4 rounded-xl text-center font-bold animate-fade-in-up" },
            t.saveSuccess
        ),

        React.createElement('div', { className: "grid md:grid-cols-3 gap-6" },
            React.createElement('div', { className: "bg-white dark:bg-dark-card p-8 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl flex flex-col items-center justify-center text-center space-y-6" },
                React.createElement('div', { className: "w-full" },
                    React.createElement('h3', { className: "text-sm font-bold text-brand-green uppercase mb-4" }, t.scoreLabel),
                    React.createElement('div', { className: "relative w-40 h-40 mx-auto flex items-center justify-center" },
                        React.createElement('svg', { className: "w-full h-full transform -rotate-90" },
                            React.createElement('circle', { cx: "80", cy: "80", r: "70", fill: "transparent", stroke: "currentColor", strokeWidth: "8", className: "text-slate-100 dark:text-white/5" }),
                            React.createElement('circle', {
                                cx: "80", cy: "80", r: "70", fill: "transparent", stroke: "currentColor", strokeWidth: "8",
                                strokeDasharray: 440,
                                strokeDashoffset: 440 - (440 * analysis.score) / 100,
                                className: "text-brand-green transition-all duration-1000"
                            })
                        ),
                        React.createElement('span', { className: "absolute text-4xl font-extrabold" }, `${analysis.score}%`)
                    )
                ),
                React.createElement('div', { className: "w-full pt-6 border-t border-slate-100 dark:border-white/5" },
                    React.createElement('h3', { className: "text-xs font-bold text-slate-400 uppercase mb-2" }, t.sessionDuration),
                    React.createElement('p', { className: "text-2xl font-mono font-bold text-brand-green" }, formatTime(interviewData.duration))
                )
            ),
            React.createElement('div', { className: "md:col-span-2 space-y-6" },
                React.createElement('div', { className: "bg-white dark:bg-dark-card p-6 rounded-3xl border border-slate-200 dark:border-white/10 shadow-xl" },
                    React.createElement('h3', { className: "text-xl font-bold mb-4 flex items-center gap-2" },
                        React.createElement(CheckIcon, { className: "text-brand-green" }), t.feedbackLabel
                    ),
                    React.createElement('p', { className: "text-slate-600 dark:text-brand-text-light leading-relaxed whitespace-pre-wrap" }, analysis.feedback)
                ),
                React.createElement('div', { className: "grid sm:grid-cols-2 gap-4" },
                    React.createElement('div', { className: "bg-green-50 dark:bg-green-900/10 p-6 rounded-2xl border border-green-200 dark:border-green-800/30" },
                        React.createElement('h4', { className: "font-bold text-green-700 dark:text-green-400 mb-3 uppercase text-xs tracking-widest" }, t.strengths),
                        React.createElement('ul', { className: "space-y-2" },
                            analysis.strengths.map((s, i) => React.createElement('li', { key: i, className: "text-sm flex items-start gap-2" },
                                React.createElement('div', { className: "w-1.5 h-1.5 rounded-full bg-green-500 mt-1.5 flex-shrink-0" }),
                                s
                            ))
                        )
                    ),
                    React.createElement('div', { className: "bg-orange-50 dark:bg-orange-900/10 p-6 rounded-2xl border border-orange-200 dark:border-orange-800/30" },
                        React.createElement('h4', { className: "font-bold text-orange-700 dark:text-orange-400 mb-3 uppercase text-xs tracking-widest" }, t.improvements),
                        React.createElement('ul', { className: "space-y-2" },
                            analysis.improvements.map((s, i) => React.createElement('li', { key: i, className: "text-sm flex items-start gap-2" },
                                React.createElement('div', { className: "w-1.5 h-1.5 rounded-full bg-orange-500 mt-1.5 flex-shrink-0" }),
                                s
                            ))
                        )
                    )
                )
            )
        ),
        React.createElement('div', { className: "flex justify-center pt-8" },
            React.createElement('button', {
                onClick: () => setView(AppView.Setup),
                className: "bg-brand-green hover:bg-green-600 text-white font-bold py-4 px-12 rounded-full transition-all shadow-lg hover:shadow-green-500/30"
            }, "Start New Assessment")
        )
    );
};

export default ReviewView;

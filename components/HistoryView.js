
import React, { useState, useEffect } from 'react';
import { i18n, AppView } from '../constants.js';
import * as supabase from '../services/supabaseService.js';
import { Spinner } from './Shared.js';

const HistoryView = ({ language, setView, setInterviewData, user }) => {
    const t = i18n[language];
    const [interviews, setInterviews] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            const fetchHistory = async () => {
                try {
                    const data = await supabase.getInterviews(user.id);
                    setInterviews(data);
                } catch (err) {
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            };
            fetchHistory();
        }
    }, [user]);

    const formatTime = (seconds) => {
        if (!seconds) return "00:00";
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleViewDetails = (item) => {
        setInterviewData({
            jobDesc: item.job_desc,
            resume: item.resume,
            history: item.transcript,
            analysis: item.analysis,
            duration: item.duration || (item.analysis?.duration), // Fallback if stored differently
            questions: []
        });
        setView(AppView.Review);
    };

    if (loading) {
        return React.createElement('div', { className: "flex justify-center py-20" }, React.createElement(Spinner, { size: "12" }));
    }

    return React.createElement('div', { className: "animate-fade-in-up" },
        React.createElement('div', { className: "text-center mb-12" },
            React.createElement('h2', { className: "text-3xl font-bold mb-2" }, t.historyTitle),
            React.createElement('p', { className: "text-slate-500 dark:text-brand-text-light" }, "Track your progress across all practice sessions.")
        ),
        interviews.length === 0 ? React.createElement('div', { className: "text-center py-20 text-slate-400" }, t.noHistory) :
        React.createElement('div', { className: "grid gap-4" },
            interviews.map((item) => (
                React.createElement('div', {
                    key: item.id,
                    className: "bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-white/10 flex justify-between items-center shadow-md hover:border-brand-green transition-all"
                },
                    React.createElement('div', { className: "flex-grow pr-4" },
                        React.createElement('p', { className: "text-xs font-bold text-brand-green uppercase mb-1" }, new Date(item.created_at).toLocaleDateString(language, { dateStyle: 'long' })),
                        React.createElement('h3', { className: "text-xl font-bold truncate max-w-md" }, item.job_desc.substring(0, 60) + '...'),
                        React.createElement('div', { className: "flex items-center gap-4 mt-1" },
                            React.createElement('p', { className: "text-sm text-slate-500 font-semibold" }, `Score: ${item.analysis?.score}%`),
                            item.duration && React.createElement('p', { className: "text-sm text-slate-400" }, `⏱ ${formatTime(item.duration)}`)
                        )
                    ),
                    React.createElement('button', {
                        onClick: () => handleViewDetails(item),
                        className: "bg-slate-200 dark:bg-white/5 py-2 px-6 rounded-full font-bold text-sm hover:bg-brand-green hover:text-white transition-all flex-shrink-0"
                    }, t.viewDetails)
                )
            ))
        )
    );
};

export default HistoryView;

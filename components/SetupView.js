
import React, { useState, useRef } from 'react';
import { i18n, AppView } from '../constants.js';
import { generateInterviewQuestions, extractTextFromFile } from '../services/geminiService.js';
import { Spinner, UploadIcon } from './Shared.js';

const SetupView = ({ language, setView, interviewData, setInterviewData }) => {
    const t = i18n[language];
    const [loading, setLoading] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const resumeFileInputRef = useRef(null);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const questions = await generateInterviewQuestions(interviewData.jobDesc, interviewData.resume, language);
            setInterviewData(prev => ({ ...prev, questions }));
            setView(AppView.Questions);
        } catch (err) {
            console.error(err);
            alert(t.error);
        } finally {
            setLoading(false);
        }
    };

    const handleFileUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setIsExtracting(true);
        try {
            const text = await extractTextFromFile(file);
            setInterviewData({ ...interviewData, resume: text });
        } catch (err) {
            console.error("Error extracting text:", err);
            alert("Could not extract text from this file. Please try pasting the text manually.");
        } finally {
            setIsExtracting(false);
            if (resumeFileInputRef.current) resumeFileInputRef.current.value = '';
        }
    };

    return React.createElement('div', { className: "animate-fade-in-up" },
        React.createElement('div', { className: "text-center mb-8" },
            React.createElement('h2', { className: "text-3xl font-bold mb-2" }, t.setupTitle),
            React.createElement('p', { className: "text-slate-500 dark:text-brand-text-light" }, t.setupDesc)
        ),
        React.createElement('form', {
            onSubmit: handleSubmit,
            className: "space-y-6 bg-white dark:bg-dark-card p-8 rounded-2xl shadow-xl border border-slate-200 dark:border-white/10"
        },
            React.createElement('div', { className: "grid md:grid-cols-2 gap-6" },
                React.createElement('div', { className: "space-y-2" },
                    React.createElement('label', { className: "block text-sm font-bold text-brand-red uppercase tracking-wider" }, t.jobDescriptionLabel),
                    React.createElement('textarea', {
                        required: true,
                        value: interviewData.jobDesc,
                        onChange: (e) => setInterviewData({ ...interviewData, jobDesc: e.target.value }),
                        className: "w-full h-80 p-4 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-red outline-none resize-none transition-all",
                        placeholder: t.jobPlaceholder
                    })
                ),
                React.createElement('div', { className: "space-y-2" },
                    React.createElement('div', { className: "flex justify-between items-center" },
                        React.createElement('label', { className: "block text-sm font-bold text-brand-red uppercase tracking-wider" }, t.resumeLabel),
                        React.createElement('button', {
                            type: "button",
                            onClick: () => resumeFileInputRef.current?.click(),
                            disabled: isExtracting,
                            className: "text-xs flex items-center gap-1.5 text-slate-500 hover:text-brand-red transition-colors font-semibold"
                        }, 
                            isExtracting ? React.createElement(Spinner, { size: "3" }) : React.createElement(UploadIcon, { className: "h-4 w-4" }),
                            isExtracting ? "Extracting..." : "Upload PDF/TXT"
                        )
                    ),
                    React.createElement('input', {
                        type: "file",
                        ref: resumeFileInputRef,
                        onChange: handleFileUpload,
                        className: "hidden",
                        accept: ".pdf,.txt,.doc,.docx"
                    }),
                    React.createElement('textarea', {
                        required: true,
                        value: interviewData.resume,
                        onChange: (e) => setInterviewData({ ...interviewData, resume: e.target.value }),
                        className: "w-full h-80 p-4 bg-slate-50 dark:bg-dark-bg border border-slate-200 dark:border-white/10 rounded-xl focus:ring-2 focus:ring-brand-red outline-none resize-none transition-all",
                        placeholder: t.resumePlaceholder
                    })
                )
            ),
            React.createElement('div', { className: "flex justify-center pt-4" },
                React.createElement('button', {
                    type: "submit",
                    disabled: loading || isExtracting,
                    className: "flex items-center justify-center gap-3 bg-brand-red hover:bg-red-600 disabled:bg-slate-400 text-white font-bold py-4 px-12 rounded-full transition-all shadow-lg hover:shadow-brand-red/30"
                }, loading ? React.createElement(Spinner, { size: "6" }) : t.generateBtn)
            )
        )
    );
};

export default SetupView;

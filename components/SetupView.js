
import React, { useState, useRef } from 'react';
import { i18n, AppView, JOB_TEMPLATES } from '../constants.js';
import { generateInterviewQuestions, extractTextFromFile } from '../services/geminiService.js';
import { Spinner, UploadIcon } from './Shared.js';

const SetupView = ({ language, setView, interviewData, setInterviewData }) => {
    const t = i18n[language];
    const [loading, setLoading] = useState(false);
    const [isExtracting, setIsExtracting] = useState(false);
    const [activeTemplate, setActiveTemplate] = useState(null);
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

    const applyTemplate = (template) => {
        setActiveTemplate(template.id);
        setInterviewData({ ...interviewData, jobDesc: template.content[language] });
    };

    return React.createElement('div', { className: "animate-fade-in-up w-full px-4 md:px-8 lg:px-12" },
        React.createElement('div', { className: "text-center mb-10" },
            React.createElement('h2', { className: "text-4xl md:text-6xl font-black mb-3 text-slate-900 dark:text-white" }, t.setupTitle),
            React.createElement('p', { className: "text-slate-500 dark:text-slate-400 font-medium max-w-3xl mx-auto text-lg" }, t.setupDesc)
        ),
        
        React.createElement('form', {
            onSubmit: handleSubmit,
            className: "space-y-12 w-full"
        },
            // Grid Container for Side-by-Side Layout
            React.createElement('div', { className: "grid lg:grid-cols-2 gap-8 items-stretch" },
                
                // LEFT: Job Description Section with Side Menu
                React.createElement('div', { className: "bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-[650px] flex flex-col" },
                    React.createElement('div', { className: "flex flex-grow overflow-hidden" },
                        // Templates Menu
                        React.createElement('div', { className: "w-24 md:w-64 flex-shrink-0 bg-slate-50 dark:bg-dark-sidebar border-r border-slate-200 dark:border-white/5 flex flex-col" },
                            React.createElement('div', { className: "p-4 border-b border-slate-200 dark:border-white/5" },
                                React.createElement('h3', { className: "text-[10px] font-black text-brand-green uppercase tracking-widest text-center md:text-left" }, t.templatesHeader)
                            ),
                            React.createElement('div', { className: "flex-grow overflow-y-auto custom-scrollbar px-2 py-4 space-y-1.5" },
                                JOB_TEMPLATES.map((tmpl) => (
                                    React.createElement('button', {
                                        key: tmpl.id,
                                        type: "button",
                                        onClick: () => applyTemplate(tmpl),
                                        className: `w-full flex flex-col md:flex-row items-center gap-2 md:gap-4 px-3 py-3 rounded-2xl text-[10px] md:text-sm font-bold transition-all ${
                                            activeTemplate === tmpl.id 
                                            ? 'bg-brand-green text-white shadow-lg shadow-green-500/20' 
                                            : 'text-slate-600 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-white/5'
                                        }`
                                    },
                                        React.createElement('span', { className: "text-xl" }, tmpl.icon),
                                        React.createElement('span', { className: "hidden md:inline truncate" }, tmpl.title[language])
                                    )
                                ))
                            )
                        ),
                        
                        // JD Editor
                        React.createElement('div', { className: "flex-grow flex flex-col bg-transparent" },
                            React.createElement('div', { className: "p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between" },
                                React.createElement('label', { className: "block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest" }, t.jobDescriptionLabel),
                                activeTemplate && React.createElement('span', { className: "text-[10px] font-black bg-brand-green/10 text-brand-green px-2 py-1 rounded-md uppercase" }, "Active")
                            ),
                            React.createElement('textarea', {
                                required: true,
                                value: interviewData.jobDesc,
                                onChange: (e) => {
                                    setInterviewData({ ...interviewData, jobDesc: e.target.value });
                                    setActiveTemplate(null);
                                },
                                className: "flex-grow w-full p-8 bg-transparent outline-none resize-none transition-all text-base md:text-lg font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-700 custom-scrollbar",
                                placeholder: t.jobPlaceholder
                            })
                        )
                    )
                ),

                // RIGHT: Resume Section
                React.createElement('div', { className: "bg-white dark:bg-dark-card rounded-3xl shadow-2xl border border-slate-200 dark:border-white/5 overflow-hidden h-[650px] flex flex-col" },
                    React.createElement('div', { className: "p-6 border-b border-slate-200 dark:border-white/5 flex items-center justify-between" },
                        React.createElement('label', { className: "block text-sm font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest" }, t.resumeLabel),
                        React.createElement('button', {
                            type: "button",
                            onClick: () => resumeFileInputRef.current?.click(),
                            disabled: isExtracting,
                            className: "text-[10px] flex items-center gap-2 bg-slate-100 dark:bg-white/10 hover:bg-brand-green/10 hover:text-brand-green px-5 py-2 rounded-full border border-slate-200 dark:border-white/10 transition-all font-black uppercase tracking-tighter text-slate-600 dark:text-slate-300"
                        }, 
                            isExtracting ? React.createElement(Spinner, { size: "4" }) : React.createElement(UploadIcon, { className: "h-3 w-3" }),
                            isExtracting ? "Extracting..." : "Upload File"
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
                        className: "flex-grow w-full p-8 bg-slate-50 dark:bg-dark-bg/40 border-none outline-none resize-none transition-all text-base md:text-lg font-medium text-slate-700 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-700 custom-scrollbar",
                        placeholder: t.resumePlaceholder
                    })
                )
            ),

            // Submit Button
            React.createElement('div', { className: "flex justify-center pb-12" },
                React.createElement('button', {
                    type: "submit",
                    disabled: loading || isExtracting,
                    className: "flex items-center justify-center gap-4 bg-brand-green hover:bg-green-600 disabled:bg-slate-400 text-white font-black py-6 px-24 rounded-full transition-all shadow-2xl shadow-green-500/30 hover:shadow-green-500/50 hover:scale-105 active:scale-95 text-xl"
                }, loading ? React.createElement(Spinner, { size: "8" }) : t.generateBtn)
            )
        )
    );
};

export default SetupView;

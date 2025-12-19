
import React, { useState, useRef, useEffect } from 'react';
import { i18n, AppView } from '../constants.js';
import { SpeakerIcon, StopIcon, Spinner, HighlightText } from './Shared.js';
import * as api from '../services/geminiService.js';

const QuestionsView = ({ language, setView, interviewData }) => {
    const t = i18n[language];
    // tracking state using a string key like 'q-0', 't-0', or 'a-0'
    const [playingKey, setPlayingKey] = useState(null);
    const [loadingKey, setLoadingKey] = useState(null);
    
    const audioCtxRef = useRef(null);
    const currentSourceRef = useRef(null);

    useEffect(() => {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        return () => {
            if (currentSourceRef.current) currentSourceRef.current.stop();
        };
    }, []);

    const handleListen = async (text, key) => {
        if (loadingKey !== null) return;

        if (playingKey === key) {
            if (currentSourceRef.current) {
                currentSourceRef.current.stop();
            }
            setPlayingKey(null);
            return;
        }

        // Stop any currently playing audio
        if (currentSourceRef.current) {
            currentSourceRef.current.stop();
        }

        setLoadingKey(key);
        try {
            const base64Audio = await api.generateSpeech(text);
            const audioData = api.decodeAudio(base64Audio);
            
            if (audioCtxRef.current.state === 'suspended') {
                await audioCtxRef.current.resume();
            }

            const buffer = await api.decodeAudioData(audioData, audioCtxRef.current);
            const source = audioCtxRef.current.createBufferSource();
            source.buffer = buffer;
            source.connect(audioCtxRef.current.destination);
            
            source.onended = () => {
                setPlayingKey(null);
                currentSourceRef.current = null;
            };

            setPlayingKey(key);
            source.start(0);
            currentSourceRef.current = source;
        } catch (err) {
            console.error("Speech generation error:", err);
            alert(t.error);
        } finally {
            setLoadingKey(null);
        }
    };

    return React.createElement('div', { className: "animate-fade-in-up" },
        React.createElement('div', { className: "text-center mb-12" },
            React.createElement('h2', { className: "text-3xl font-bold mb-2" }, t.questionsTitle),
            React.createElement('p', { className: "text-slate-500 dark:text-brand-text-light" }, t.questionsDesc)
        ),
        React.createElement('div', { className: "grid gap-6" },
            interviewData.questions.map((q, i) => {
                const qKey = `q-${i}`;
                const tKey = `t-${i}`;
                const aKey = `a-${i}`;
                
                return React.createElement('div', {
                    key: i,
                    className: "group bg-white dark:bg-dark-card p-6 rounded-2xl border border-slate-200 dark:border-white/10 shadow-md hover:border-brand-red transition-all"
                },
                    React.createElement('div', { className: "flex items-start gap-4" },
                        React.createElement('span', {
                            className: "flex-shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-brand-red/10 text-brand-red font-bold"
                        }, i + 1),
                        React.createElement('div', { className: "flex-grow" },
                            React.createElement('div', { className: "flex justify-between items-start mb-4 gap-4" },
                                React.createElement('h3', { className: "text-xl font-bold leading-tight" }, q.question),
                                React.createElement('button', {
                                    onClick: () => handleListen(q.question, qKey),
                                    className: `p-2 rounded-full transition-all flex-shrink-0 ${
                                        playingKey === qKey 
                                        ? 'bg-brand-red text-white scale-110' 
                                        : 'bg-slate-100 dark:bg-white/5 text-slate-400 hover:text-brand-red'
                                    }`
                                }, 
                                    loadingKey === qKey ? React.createElement(Spinner, { size: "4" }) :
                                    (playingKey === qKey ? React.createElement(StopIcon, { className: "w-4 h-4" }) : React.createElement(SpeakerIcon, { className: "w-4 h-4" }))
                                )
                            ),
                            
                            React.createElement('div', { className: "grid grid-cols-1 md:grid-cols-2 gap-4" },
                                // STAR Tip
                                React.createElement('div', { className: "bg-slate-50 dark:bg-dark-bg p-4 rounded-xl border-l-4 border-brand-red relative" },
                                    React.createElement('div', { className: "flex justify-between items-start mb-1" },
                                        React.createElement('p', { className: "text-[10px] font-black text-brand-red uppercase tracking-widest" }, t.starMethod),
                                        React.createElement('button', {
                                            onClick: () => handleListen(q.tip, tKey),
                                            className: `p-1.5 rounded-full transition-all ${
                                                playingKey === tKey 
                                                ? 'bg-brand-red text-white' 
                                                : 'text-slate-400 hover:text-brand-red'
                                            }`
                                        }, 
                                            loadingKey === tKey ? React.createElement(Spinner, { size: "3" }) :
                                            (playingKey === tKey ? React.createElement(StopIcon, { className: "w-3 h-3" }) : React.createElement(SpeakerIcon, { className: "w-3 h-3" }))
                                        )
                                    ),
                                    React.createElement('p', { className: "text-sm text-slate-600 dark:text-brand-text-light leading-relaxed" }, q.tip)
                                ),

                                // Suggested Answer
                                React.createElement('div', { className: "bg-orange-50 dark:bg-orange-950/20 p-4 rounded-xl border-l-4 border-orange-400 relative" },
                                    React.createElement('div', { className: "flex justify-between items-start mb-1" },
                                        React.createElement('p', { className: "text-[10px] font-black text-orange-500 uppercase tracking-widest" }, t.suggestedAnswer),
                                        React.createElement('button', {
                                            onClick: () => handleListen(q.suggestedAnswer, aKey),
                                            className: `p-1.5 rounded-full transition-all ${
                                                playingKey === aKey 
                                                ? 'bg-orange-500 text-white' 
                                                : 'text-slate-400 hover:text-orange-500'
                                            }`
                                        }, 
                                            loadingKey === aKey ? React.createElement(Spinner, { size: "3" }) :
                                            (playingKey === aKey ? React.createElement(StopIcon, { className: "w-3 h-3" }) : React.createElement(SpeakerIcon, { className: "w-3 h-3" }))
                                        )
                                    ),
                                    React.createElement(HighlightText, { 
                                        text: q.suggestedAnswer, 
                                        className: "text-sm text-slate-700 dark:text-slate-300 leading-relaxed italic" 
                                    })
                                )
                            )
                        )
                    )
                );
            })
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

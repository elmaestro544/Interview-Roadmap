
import React, { useState, useRef, useEffect, useCallback } from 'react';
import { i18n, AppView } from '../constants.js';
import * as api from '../services/geminiService.js';
import { Spinner, StopIcon, MicrophoneIcon, CheckIcon, HighlightText } from './Shared.js';

const MockInterviewView = ({ language, setView, interviewData, setInterviewData }) => {
    const t = i18n[language];
    const [isActive, setIsActive] = useState(false);
    const [isInterviewerSpeaking, setIsInterviewerSpeaking] = useState(false);
    const [transcript, setTranscript] = useState([]);
    const [suggestedAnswer, setSuggestedAnswer] = useState('');
    const [isGeneratingAnswer, setIsGeneratingAnswer] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0);
    
    const sessionRef = useRef(null);
    const audioCtxRef = useRef(null);
    const micStreamRef = useRef(null);
    const nextStartTimeRef = useRef(0);
    const playbackSources = useRef(new Set());
    
    // Accumulators for live streaming text
    const interviewerAccRef = useRef('');
    const candidateAccRef = useRef('');
    const lastFinalizedQuestionRef = useRef('');

    const cleanup = useCallback(() => {
        if (sessionRef.current) sessionRef.current.close();
        if (micStreamRef.current) micStreamRef.current.getTracks().forEach(t => t.stop());
        
        if (playbackSources.current) {
            playbackSources.current.forEach(s => {
                try { s.stop(); } catch (e) {}
            });
            playbackSources.current.clear();
        }
        
        setIsActive(false);
        setIsInterviewerSpeaking(false);
    }, []);

    useEffect(() => {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 24000 });
        return cleanup;
    }, [cleanup]);

    useEffect(() => {
        let interval;
        if (isActive) {
            interval = setInterval(() => {
                setElapsedTime(prev => prev + 1);
            }, 1000);
        } else {
            setElapsedTime(0);
        }
        return () => clearInterval(interval);
    }, [isActive]);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const fetchSuggestedAnswer = async (question) => {
        if (!question || question === lastFinalizedQuestionRef.current) return;
        lastFinalizedQuestionRef.current = question;
        setIsGeneratingAnswer(true);
        setSuggestedAnswer('');
        try {
            const answer = await api.generateSuggestedAnswer(question, interviewData.jobDesc, interviewData.resume, language);
            setSuggestedAnswer(answer);
            
            // Attach this answer to the corresponding turn in history
            setTranscript(prev => {
                const updated = [...prev];
                for (let i = updated.length - 1; i >= 0; i--) {
                    if (updated[i].role === 'interviewer' && updated[i].text.includes(question.substring(0, 10))) {
                        updated[i].suggestedAnswer = answer;
                        break;
                    }
                }
                return updated;
            });
        } catch (err) {
            console.error(err);
        } finally {
            setIsGeneratingAnswer(false);
        }
    };

    const startSession = async () => {
        try {
            micStreamRef.current = await navigator.mediaDevices.getUserMedia({ audio: true });
            setIsActive(true);
            setTranscript([]);

            const sysInstr = `You are a professional HR interviewer. 
            Job: ${interviewData.jobDesc}. Resume: ${interviewData.resume}.
            Ask 5 relevant questions one by one. Language: ${language === 'ar' ? 'Arabic' : 'English'}.
            Do not provide feedback during the interview, just ask and listen.`;

            const sessionPromise = api.connectLiveInterview({
                onopen: () => {
                    const inputCtx = new AudioContext({ sampleRate: 16000 });
                    const source = inputCtx.createMediaStreamSource(micStreamRef.current);
                    const processor = inputCtx.createScriptProcessor(4096, 1, 1);
                    processor.onaudioprocess = (e) => {
                        const blob = api.createAudioBlob(e.inputBuffer.getChannelData(0));
                        sessionPromise.then(s => s.sendRealtimeInput({ media: blob }));
                    };
                    source.connect(processor);
                    processor.connect(inputCtx.destination);
                },
                onmessage: async (msg) => {
                    // Audio output from model
                    if (msg.serverContent?.modelTurn?.parts[0]?.inlineData?.data) {
                        setIsInterviewerSpeaking(true);
                        const audioData = api.decodeAudio(msg.serverContent.modelTurn.parts[0].inlineData.data);
                        nextStartTimeRef.current = Math.max(nextStartTimeRef.current, audioCtxRef.current.currentTime);
                        const buffer = await api.decodeAudioData(audioData, audioCtxRef.current);
                        const source = audioCtxRef.current.createBufferSource();
                        source.buffer = buffer;
                        source.connect(audioCtxRef.current.destination);
                        source.onended = () => {
                            playbackSources.current.delete(source);
                            if (playbackSources.current.size === 0) setIsInterviewerSpeaking(false);
                        };
                        source.start(nextStartTimeRef.current);
                        nextStartTimeRef.current += buffer.duration;
                        playbackSources.current.add(source);
                    }

                    // Interviewer transcription (partial)
                    if (msg.serverContent?.outputTranscription) {
                        const text = msg.serverContent.outputTranscription.text;
                        interviewerAccRef.current += text;
                        setTranscript(prev => {
                            const updated = [...prev];
                            const last = updated[updated.length - 1];
                            if (last?.role === 'interviewer' && !last.complete) {
                                last.text = interviewerAccRef.current;
                                return updated;
                            }
                            return [...updated, { role: 'interviewer', text: interviewerAccRef.current, complete: false }];
                        });
                    }

                    // Candidate transcription (partial)
                    if (msg.serverContent?.inputTranscription) {
                        const text = msg.serverContent.inputTranscription.text;
                        candidateAccRef.current += text;
                        setTranscript(prev => {
                            const updated = [...prev];
                            const last = updated[updated.length - 1];
                            if (last?.role === 'candidate') {
                                last.text = candidateAccRef.current;
                                return updated;
                            }
                            return [...updated, { role: 'candidate', text: candidateAccRef.current }];
                        });
                    }

                    // Turn complete - finalize the text and get suggested answer
                    if (msg.serverContent?.turnComplete) {
                        const finalizedQuestion = interviewerAccRef.current;
                        setTranscript(prev => {
                            const updated = [...prev];
                            const last = updated[updated.length - 1];
                            if (last?.role === 'interviewer') last.complete = true;
                            return updated;
                        });
                        if (finalizedQuestion) fetchSuggestedAnswer(finalizedQuestion);
                        interviewerAccRef.current = '';
                        candidateAccRef.current = '';
                    }
                }
            }, sysInstr);

            sessionRef.current = await sessionPromise;
        } catch (err) {
            console.error(err);
            alert("Microphone access is required.");
            setIsActive(false);
        }
    };

    const handleEnd = () => {
        setInterviewData(prev => ({ ...prev, history: transcript, duration: elapsedTime }));
        cleanup();
        setView(AppView.Review);
    };

    return React.createElement('div', { className: "animate-fade-in-up w-full px-4 md:px-12 lg:px-20 max-w-[100vw] overflow-x-hidden" },
        React.createElement('div', { className: "text-center mb-10" },
            React.createElement('h2', { className: "text-5xl font-black mb-4 bg-clip-text text-transparent bg-gradient-to-r from-brand-red to-orange-500" }, t.mockTitle),
            React.createElement('p', { className: "text-slate-500 dark:text-slate-400 text-xl font-medium" }, "Experience a high-stakes professional interview with real-time AI guidance.")
        ),

        React.createElement('div', { className: "flex flex-col lg:flex-row gap-8 w-full min-h-[750px] mb-20" },
            // Left Column: Interface and Transcript (Focused on conversation)
            React.createElement('div', { className: "lg:w-[45%] flex flex-col gap-6" },
                React.createElement('div', { className: "bg-white dark:bg-[#0F172A] rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-white/10 flex flex-col" },
                    React.createElement('div', { className: "flex justify-between items-center mb-8" },
                        React.createElement('h3', { className: "text-sm font-bold text-slate-400 uppercase tracking-widest" }, "LIVE INTERVIEW"),
                        isActive && React.createElement('div', { className: "flex items-center gap-4" },
                            React.createElement('div', { className: "flex items-center gap-2 bg-slate-100 dark:bg-white/5 px-3 py-1 rounded-full font-mono text-xs font-bold" },
                                React.createElement('span', { className: "text-brand-red" }, "⏱"),
                                formatTime(elapsedTime)
                            ),
                            React.createElement('div', { className: "flex items-center gap-2" },
                                React.createElement('div', { className: "w-2.5 h-2.5 bg-red-500 rounded-full animate-ping" }),
                                React.createElement('span', { className: "text-xs font-black text-red-500" }, "SESSION ACTIVE")
                            )
                        )
                    ),

                    React.createElement('div', { className: "flex flex-col items-center gap-8 mb-10" },
                        React.createElement('div', {
                            className: `w-40 h-40 rounded-full border-4 ${isInterviewerSpeaking ? 'border-brand-red animate-pulse shadow-[0_0_40px_rgba(239,68,68,0.3)]' : 'border-slate-700'} flex items-center justify-center bg-slate-800 transition-all duration-500`
                        },
                            React.createElement('div', { className: "w-32 h-32 rounded-full bg-slate-900 flex items-center justify-center text-6xl" }, 
                                isInterviewerSpeaking ? "🎙️" : "🤖"
                            )
                        ),
                        React.createElement('div', { className: "text-center" },
                            React.createElement('p', { className: "text-2xl font-black dark:text-white" }, isInterviewerSpeaking ? t.speaking : (isActive ? t.listening : "Click Start to Begin")),
                            React.createElement('p', { className: "text-slate-500 font-medium mt-1" }, isActive ? "The model is analyzing your responses..." : "Ready when you are.")
                        )
                    ),

                    React.createElement('div', { className: "flex gap-4" },
                        !isActive ? React.createElement('button', {
                            onClick: startSession,
                            className: "flex-grow bg-brand-red hover:bg-red-600 text-white font-black py-5 rounded-2xl shadow-xl shadow-red-500/20 transition-all flex items-center justify-center gap-3 text-lg"
                        }, React.createElement(MicrophoneIcon, { className: "w-6 h-6" }), t.startMock) : React.createElement('button', {
                            onClick: handleEnd,
                            className: "flex-grow bg-slate-800 hover:bg-black text-white font-black py-5 rounded-2xl transition-all flex items-center justify-center gap-3 text-lg"
                        }, React.createElement(StopIcon, { className: "w-6 h-6" }), t.endMock)
                    )
                ),

                React.createElement('div', { className: "bg-white dark:bg-[#0F172A] rounded-[2.5rem] p-8 shadow-2xl border border-slate-200 dark:border-white/10 flex-grow h-[400px] flex flex-col" },
                    React.createElement('h3', { className: "text-sm font-bold text-slate-400 uppercase tracking-widest mb-6" }, "REAL-TIME TRANSCRIPT"),
                    React.createElement('div', { className: "flex-grow overflow-y-auto custom-scrollbar pr-4 space-y-6" },
                        transcript.length === 0 ? React.createElement('div', { className: "h-full flex flex-col items-center justify-center text-slate-400 opacity-50 italic" },
                            React.createElement('p', null, "The words will flow here...")
                        ) : transcript.map((m, i) => React.createElement('div', {
                            key: i,
                            className: `flex flex-col ${m.role === 'candidate' ? 'items-end' : 'items-start'} animate-fade-in-up`
                        },
                            React.createElement('div', {
                                className: `max-w-[90%] p-5 rounded-3xl ${
                                    m.role === 'candidate' ? 'bg-brand-red text-white rounded-tr-none shadow-lg' : 'bg-slate-100 dark:bg-white/5 dark:text-white rounded-tl-none'
                                }`
                            },
                                React.createElement('p', { className: "font-black mb-2 uppercase text-[10px] opacity-60 tracking-tighter" }, m.role === 'candidate' ? 'You' : 'Interviewer'),
                                React.createElement('p', { className: "text-lg leading-relaxed font-medium whitespace-pre-wrap" }, m.text)
                            )
                        ))
                    )
                )
            ),

            // Right Column: Expert Suggested Answer (High Visibility)
            React.createElement('div', { className: "lg:w-[55%] flex flex-col" },
                React.createElement('div', { className: "bg-white dark:bg-[#0F172A] rounded-[3rem] p-12 shadow-2xl border border-slate-200 dark:border-white/10 h-full flex flex-col" },
                    React.createElement('div', { className: "flex items-center justify-between mb-10" },
                        React.createElement('h3', { className: "text-3xl font-black flex items-center gap-4 text-slate-800 dark:text-white" },
                            React.createElement('span', { className: "text-brand-red text-5xl" }, "✨"), t.suggestedAnswer
                        ),
                        isGeneratingAnswer && React.createElement(Spinner, { size: "8" })
                    ),

                    React.createElement('div', { className: "flex-grow overflow-y-auto custom-scrollbar pr-6" },
                        isGeneratingAnswer && !suggestedAnswer ? React.createElement('div', { className: "flex flex-col items-center justify-center h-full gap-6 text-slate-400" },
                            React.createElement('p', { className: "text-2xl italic font-medium animate-pulse" }, t.generatingAnswer)
                        ) : suggestedAnswer ? React.createElement('div', { 
                            className: "bg-slate-50 dark:bg-brand-red/5 p-12 rounded-[2.5rem] border border-slate-200 dark:border-brand-red/10 text-slate-900 dark:text-slate-100 shadow-inner animate-fade-in-up" 
                        },
                            React.createElement(HighlightText, { 
                                text: suggestedAnswer, 
                                className: "leading-relaxed text-2xl md:text-3xl font-bold" 
                            })
                        ) : React.createElement('div', { className: "flex flex-col items-center justify-center h-full text-slate-400 text-center gap-10 px-10" },
                            React.createElement('div', { className: "w-24 h-24 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center text-5xl" }, "🧠"),
                            React.createElement('p', { className: "text-2xl font-medium italic max-w-md" }, "Listen to the interviewer's question. A masterful response will appear here instantly.")
                        )
                    ),
                    
                    suggestedAnswer && React.createElement('div', { className: "mt-10 pt-10 border-t border-slate-100 dark:border-white/5" },
                        React.createElement('div', { className: "flex items-center gap-4 text-brand-red font-bold" },
                            React.createElement(CheckIcon, { className: "w-6 h-6" }),
                            React.createElement('p', { className: "text-lg" }, "Optimized for your background and the specific role requirements.")
                        )
                    )
                )
            )
        )
    );
};

export default MockInterviewView;

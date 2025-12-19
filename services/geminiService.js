
import { GoogleGenAI, Modality, Type } from "@google/genai";

// Initialize AI client using the global process.env.API_KEY provided by env.js
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const MODEL_TEXT = 'gemini-3-flash-preview';
const MODEL_AUDIO = 'gemini-2.5-flash-native-audio-preview-09-2025';
const MODEL_TTS = 'gemini-2.5-flash-preview-tts';

// Robust retry logic for rate limits and resource exhaustion
const withRetry = async (fn, maxRetries = 5) => {
    let delay = 3000;
    for (let i = 0; i < maxRetries; i++) {
        try {
            return await fn();
        } catch (err) {
            const isQuotaError = err.message?.includes('429') || err.message?.includes('RESOURCE_EXHAUSTED');
            if (isQuotaError && i < maxRetries - 1) {
                console.warn(`Rate limit reached (${err.status || 429}). Retrying in ${delay}ms... (Attempt ${i + 1}/${maxRetries})`);
                await new Promise(r => setTimeout(r, delay));
                delay *= 2; 
                continue;
            }
            throw err;
        }
    }
};

export const extractTextFromFile = async (file) => {
    if (file.type === 'application/pdf') {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await window.pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = '';
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(' ') + '\n';
        }
        return text;
    } else {
        return await file.text();
    }
};

export const generateInterviewQuestions = async (jobDesc, resume, language) => {
    const prompt = `
        Job Description: ${jobDesc}
        Resume: ${resume}
        Language: ${language === 'ar' ? 'Arabic' : 'English'}
        Task: Generate 5 relevant interview questions, tips, and a sample suggested answer for each. 
        
        CRITICAL FORMATTING FOR suggestedAnswer:
        - Use bullet points (•) for organization.
        - Keep it concise (under 80 words).
        - Tailor it to the resume provided.
        - HIGHLIGHT key points or specific actions using **bold** markdown (e.g., **Developed a system**).
        - Must be natural and spoken-style.
        Result as JSON.
    `;
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: {
                        type: Type.OBJECT,
                        properties: {
                            question: { type: Type.STRING },
                            tip: { type: Type.STRING },
                            suggestedAnswer: { type: Type.STRING, description: "A high-quality, bullet-pointed sample answer with **bold** highlights." }
                        },
                        required: ["question", "tip", "suggestedAnswer"]
                    }
                }
            }
        });
        return JSON.parse(response.text);
    });
};

export const generateSuggestedAnswer = async (question, jobDesc, resume, language) => {
    const prompt = `
        Context: Job Description: ${jobDesc}, Resume: ${resume}
        Question: ${question}
        Language: ${language === 'ar' ? 'Arabic' : 'English'}
        Task: Provide a perfect, concise spoken response the candidate should give.
        
        CRITICAL FORMATTING:
        - USE BULLET POINTS (•) to organize the answer points.
        - HIGHLIGHT THE KEY ACTION OR POINT in each bullet using **bold** markdown.
        - Keep it under 100 words total.
        - DO NOT include headings like "###".
        - RETURN THE PLAIN TEXT OF THE BULLETED ANSWER WITH BOLD HIGHLIGHTS.
    `;
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: prompt,
        });
        // Clean up everything except basic bullet points and bolding
        return response.text.replace(/[#_~`>]/g, '').trim();
    });
};

export const generateSpeech = async (text) => {
    // Clean text for TTS (remove markdown symbols)
    const cleanText = text.replace(/\*\*/g, '');
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: MODEL_TTS,
            contents: [{ parts: [{ text: cleanText }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Zephyr' },
                    },
                },
            },
        });
        return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    });
};

export const analyzePerformance = async (history, language) => {
    const prompt = `
        Transcript: ${JSON.stringify(history)}
        Language: ${language === 'ar' ? 'Arabic' : 'English'}
        Task: Analyze score, strengths, improvements, feedback. Result as JSON.
    `;
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: prompt,
            config: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.OBJECT,
                    properties: {
                        score: { type: Type.NUMBER },
                        strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                        improvements: { type: Type.ARRAY, items: { type: Type.STRING } },
                        feedback: { type: Type.STRING }
                    },
                    required: ["score", "strengths", "improvements", "feedback"]
                }
            }
        });
        return JSON.parse(response.text);
    });
};

export const connectLiveInterview = (callbacks, systemInstruction) => {
    return ai.live.connect({
        model: MODEL_AUDIO,
        callbacks,
        config: {
            responseModalities: [Modality.AUDIO],
            systemInstruction,
            speechConfig: {
                voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } }
            },
            outputAudioTranscription: {},
            inputAudioTranscription: {},
        }
    });
};

export const createAudioBlob = (data) => {
    const l = data.length;
    const int16 = new Int16Array(l);
    for (let i = 0; i < l; i++) {
        int16[i] = data[i] * 32768;
    }
    let binary = '';
    const bytes = new Uint8Array(int16.buffer);
    for (let i = 0; i < bytes.byteLength; i++) {
        binary += String.fromCharCode(bytes[i]);
    }
    return {
        data: btoa(binary),
        mimeType: 'audio/pcm;rate=16000',
    };
};

export const decodeAudio = (base64) => {
    const binaryString = atob(base64);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes;
};

export const decodeAudioData = async (data, ctx, sampleRate = 24000) => {
    const dataInt16 = new Int16Array(data.buffer);
    const buffer = ctx.createBuffer(1, dataInt16.length, sampleRate);
    const channelData = buffer.getChannelData(0);
    for (let i = 0; i < dataInt16.length; i++) {
        channelData[i] = dataInt16[i] / 32768.0;
    }
    return buffer;
};

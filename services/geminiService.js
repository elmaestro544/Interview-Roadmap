
import { GoogleGenAI, Modality, Type } from "@google/genai";

const getApiKey = () => {
    if (typeof window !== 'undefined' && window.process && window.process.env) {
        return window.process.env.VITE_API_KEY || window.process.env.API_KEY;
    }
    return undefined;
};

export const geminiApiKey = getApiKey();
const ai = new GoogleGenAI({ apiKey: geminiApiKey });

const MODEL_TEXT = 'gemini-3-flash-preview';
const MODEL_AUDIO = 'gemini-2.5-flash-native-audio-preview-09-2025';

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
        Task: Generate 5 relevant interview questions and tips. Result as JSON.
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
                            tip: { type: Type.STRING }
                        },
                        required: ["question", "tip"]
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
        Task: Provide ONLY the text of a perfect, concise spoken response the candidate should give. 
        CRITICAL CONSTRAINTS:
        - DO NOT include markdown like "**", "###", or "***".
        - DO NOT include section titles or intros like "Here is the answer".
        - DO NOT mention the STAR method by name.
        - RETURN ONLY THE PLAIN TEXT OF THE SPOKEN ANSWER.
    `;
    return withRetry(async () => {
        const response = await ai.models.generateContent({
            model: MODEL_TEXT,
            contents: prompt,
        });
        // Post-process to strip any remaining markdown characters
        return response.text.replace(/[*#_~`>]/g, '').trim();
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

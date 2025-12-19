
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = window.process.env.SUPABASE_URL;
const supabaseKey = window.process.env.SUPABASE_ANON_KEY;

let supabase = null;
if (supabaseUrl && supabaseKey && supabaseUrl !== '__VITE_SUPABASE_URL__') {
    supabase = createClient(supabaseUrl, supabaseKey);
}

export const isSupabaseConfigured = () => !!supabase;

export const signUp = async (email, password, fullName) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    return await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
    });
};

export const signIn = async (email, password) => {
    if (!supabase) throw new Error("Supabase is not configured.");
    return await supabase.auth.signInWithPassword({ email, password });
};

export const signOut = async () => {
    if (!supabase) return;
    return await supabase.auth.signOut();
};

export const onAuthStateChange = (callback) => {
    if (!supabase) return { data: { subscription: { unsubscribe: () => {} } } };
    return supabase.auth.onAuthStateChange(callback);
};

export const saveInterview = async (userId, data) => {
    if (!supabase) return;
    const { jobDesc, resume, history, analysis, questions, duration } = data;
    
    return await supabase.from('interviews').insert([{
        user_id: userId,
        job_desc: jobDesc,
        resume: resume,
        transcript: history,
        duration: duration,
        analysis: { ...analysis, tailoredQuestions: questions },
        created_at: new Date().toISOString()
    }]);
};

export const getInterviews = async (userId) => {
    if (!supabase) return [];
    const { data, error } = await supabase
        .from('interviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
    if (error) throw error;
    return data;
};

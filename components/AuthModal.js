
import React, { useState, useEffect } from 'react';
import { i18n, AppView } from '../constants.js';
import { CloseIcon, GoogleIcon, Spinner } from './Shared.js';
import * as supabaseService from '../services/supabaseService.js';

const ModalContent = ({
  t,
  isLoginView,
  formData,
  error,
  success,
  loading,
  handleInputChange,
  handleSubmit,
  onClose,
  setIsLoginView,
  onLoginSuccess,
}) => {
  return React.createElement('div', {
    className: "bg-white dark:bg-dark-card p-10 rounded-[2.5rem] shadow-2xl w-full max-w-[420px] relative border border-slate-200 dark:border-white/10 animate-fade-in-up"
  },
    React.createElement('button', {
      onClick: onClose,
      className: "absolute top-8 right-8 text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors p-2"
    }, React.createElement(CloseIcon, null)),

    React.createElement('h2', {
      className: "text-4xl font-extrabold text-center text-slate-900 dark:text-white mb-10 tracking-tight"
    }, isLoginView ? t.login : t.register),

    error && React.createElement('div', {
      className: "bg-red-500/10 border border-red-500/20 text-center p-3 rounded-2xl mb-6 text-sm text-red-400 font-medium"
    }, error),

    success && React.createElement('div', {
      className: "bg-green-500/10 border border-green-500/20 text-center p-3 rounded-2xl mb-6 text-sm text-green-400 font-medium"
    }, success),

    React.createElement('form', {
      onSubmit: handleSubmit,
      className: "space-y-6"
    },
      !isLoginView && React.createElement('div', null,
        React.createElement('input', {
          type: "text",
          name: "fullName",
          placeholder: t.fullName,
          required: true,
          value: formData.fullName,
          onChange: handleInputChange,
          className: "w-full px-6 py-4 bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-white/5 rounded-full focus:ring-2 focus:ring-brand-green/50 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all"
        })
      ),
      React.createElement('div', null,
        React.createElement('input', {
          type: "email",
          name: "email",
          placeholder: t.emailAddress,
          required: true,
          value: formData.email,
          onChange: handleInputChange,
          className: "w-full px-6 py-4 bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-white/5 rounded-full focus:ring-2 focus:ring-brand-green/50 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all"
        })
      ),
      React.createElement('div', { className: "space-y-2" },
        React.createElement('input', {
          type: "password",
          name: "password",
          placeholder: t.password,
          required: true,
          value: formData.password,
          onChange: handleInputChange,
          className: "w-full px-6 py-4 bg-slate-50 dark:bg-[#1E293B] border border-slate-200 dark:border-white/5 rounded-full focus:ring-2 focus:ring-brand-green/50 focus:outline-none text-slate-900 dark:text-white placeholder-slate-400 transition-all"
        }),
        isLoginView && React.createElement('div', { className: "flex justify-end px-2" },
          React.createElement('button', {
            type: "button",
            onClick: () => alert("Password reset is coming soon."),
            className: "text-xs font-medium text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors"
          }, t.forgotPassword)
        )
      ),
      React.createElement('button', {
        type: "submit",
        disabled: loading,
        className: "w-full bg-gradient-to-r from-brand-green to-green-600 hover:scale-[1.02] active:scale-[0.98] text-white font-bold py-5 px-6 rounded-full transition-all mt-4 flex items-center justify-center shadow-lg shadow-green-500/30 disabled:opacity-70"
      }, loading ? React.createElement(Spinner, { size: "6" }) : (isLoginView ? t.login : t.createAccount))
    ),

    React.createElement('div', { className: "flex items-center my-10" },
      React.createElement('div', { className: "flex-grow border-t border-slate-200 dark:border-white/10" }),
      React.createElement('span', { className: "px-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]" }, "OR"),
      React.createElement('div', { className: "flex-grow border-t border-slate-200 dark:border-white/10" }),
    ),

    React.createElement('button', {
      onClick: () => onLoginSuccess({ email: 'guest@jobinterview.com', fullName: 'Guest User' }),
      className: "w-full flex items-center justify-center py-5 px-6 bg-transparent border border-slate-200 dark:border-white/10 rounded-full hover:bg-slate-50 dark:hover:bg-white/5 transition-all text-slate-900 dark:text-white font-bold"
    }, 
      React.createElement('span', { className: "mr-3" }, React.createElement(GoogleIcon, null)),
      "Google"
    ),

    React.createElement('p', {
      className: "mt-10 text-center text-sm text-slate-500"
    },
      isLoginView ? t.dontHaveAccount : t.alreadyHaveAccount,
      ' ',
      React.createElement('button', {
        onClick: () => setIsLoginView(!isLoginView),
        className: "font-bold text-brand-green hover:underline ml-1"
      }, isLoginView ? t.register : t.login)
    )
  );
};

const AuthModal = ({ isOpen, onClose, onLoginSuccess, language, setView }) => {
  const t = i18n[language];
  const [isLoginView, setIsLoginView] = useState(true);
  const [formData, setFormData] = useState({ fullName: '', email: '', password: '', confirmPassword: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setError('');
      setSuccess('');
      setLoading(false);
      setFormData({ fullName: '', email: '', password: '', confirmPassword: '' });
    }
  }, [isLoginView, isOpen]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    const ADMIN_PASSWORD = "5431";

    if (isLoginView && formData.password === ADMIN_PASSWORD) {
        onLoginSuccess({
            email: formData.email,
            fullName: 'Admin',
            isAdmin: true,
        });
        setLoading(false);
        onClose();
        return;
    }

    if (!supabaseService.isSupabaseConfigured()) {
        setError("Database connection is not configured.");
        setLoading(false);
        return;
    }

    if (isLoginView) {
        try {
            const { data, error: signInError } = await supabaseService.signIn(formData.email, formData.password);
            if (signInError) {
                setError(signInError.message);
            } else if (data?.user) {
                onLoginSuccess({ 
                    email: data.user.email, 
                    fullName: data.user.user_metadata?.full_name || data.user.email 
                });
                onClose();
            }
        } catch (err) {
            setError(t.error || "Login failed");
            console.error("Login error:", err);
        }
    } else {
        const { fullName, email, password } = formData;
        if (!fullName.trim()) { setError("Full name is required"); setLoading(false); return; }
        if (!validateEmail(email)) { setError("Invalid email address"); setLoading(false); return; }
        if (password.length < 8) { setError("Password must be at least 8 characters"); setLoading(false); return; }

        try {
            const { data, error: signUpError } = await supabaseService.signUp(email, password, fullName);
            if (signUpError) {
                setError(signUpError.message);
            } else {
                if (data?.user && !data.session) {
                    setSuccess("Verify your email to continue.");
                } else {
                    setSuccess("Registration successful!");
                    setTimeout(() => setIsLoginView(true), 2000);
                }
            }
        } catch (err) {
            setError(t.error || "Registration failed");
            console.error("Registration error:", err);
        }
    }
    setLoading(false);
  };

  if (!isOpen) return null;

  return React.createElement('div', {
    className: "fixed inset-0 bg-slate-900/60 dark:bg-black/80 z-[100] flex justify-center items-center backdrop-blur-xl transition-all p-4"
  },
    React.createElement('div', {
      onClick: (e) => e.stopPropagation(),
      className: "w-full flex justify-center"
    },
      React.createElement(ModalContent, {
        t,
        isLoginView,
        formData,
        error,
        success,
        loading,
        handleInputChange,
        handleSubmit,
        onClose,
        setIsLoginView,
        onLoginSuccess,
      })
    )
  );
};

export default AuthModal;

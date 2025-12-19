
import React from 'react';

export const Spinner = ({ size = '8' }) => (
  React.createElement('div', {
    className: `animate-spin rounded-full h-${size} w-${size} border-b-2 border-t-2 border-brand-red`
  })
);

export const UploadIcon = ({ className = "h-12 w-12 text-slate-400 dark:text-brand-text-light" }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" })
    )
);

export const TextSizeIcon = ({ className = "h-5 w-5" }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M3 12h18M3 18h18M6 6h12m-9 0v6m6-6v6" })
    )
);

export const SendIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M13 5l7 7-7 7M5 12h14" })
    )
);

export const CopyIcon = ({ className = "h-5 w-5 mr-2" }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" })
    )
);

export const DownloadIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5 mr-2", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" })
    )
);

export const UserIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" })
    )
);

export const CloseIcon = () => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-6 w-6", fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M6 18L18 6M6 6l12 12" })
    )
);

export const GoogleIcon = () => (
    React.createElement('svg', { className: "w-5 h-5", "aria-hidden": "true", focusable: "false", "data-prefix": "fab", "data-icon": "google", role: "img", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 488 512" },
        React.createElement('path', { fill: "currentColor", d: "M488 261.8C488 403.3 381.5 512 244 512 111.8 512 0 398.9 0 261.8 0 124.9 111.8 12.8 244 12.8c70.3 0 129.5 27.8 175.2 72.9l-68.5 68.5c-24.1-22.9-57-37.1-97.2-37.1-72.5 0-132.3 58.9-132.3 131.5s59.8 131.5 132.3 131.5c83.8 0 116.3-59.5 121.2-88.5H244v-83.8h236.1c2.4 12.8 3.9 26.6 3.9 41.5z" })
    )
);

export const SpeakerIcon = ({ className = "h-5 w-5" }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" })
    )
);

export const StopIcon = ({ className = "h-5 w-5" }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M21 12a9 9 0 11-18 0 9 9 0 0118 0z" }),
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M9 9h6v6H9z" })
    )
);

export const MicrophoneIcon = ({ className = "h-6 w-6" }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor", strokeWidth: 2 },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", d: "M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" })
    )
);

export const CheckIcon = ({ className = 'w-5 h-5' }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
        React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M5 13l4 4L19 7" })
    )
);

export const SunIcon = ({ className = 'w-6 h-6' }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M12 12a5 5 0 100-10 5 5 0 000 10z" })
    )
);

export const MoonIcon = ({ className = 'w-6 h-6' }) => (
    React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: className, fill: "none", viewBox: "0 0 24 24", stroke: "currentColor" },
      React.createElement('path', { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: 2, d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" })
    )
);

export const Logo = () => (
    React.createElement('img', {
        src: "https://i.imgur.com/3urddbC.jpeg",
        alt: "Job Interview Logo",
        className: "h-10 w-auto rounded-lg"
    })
);

/**
 * Renders text with **bold** markers as highlighted spans.
 */
export const HighlightText = ({ text, className = "" }) => {
    if (!text) return null;
    
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return React.createElement('div', { className: `whitespace-pre-wrap ${className}` },
        parts.map((part, i) => {
            if (part.startsWith('**') && part.endsWith('**')) {
                const inner = part.slice(2, -2);
                return React.createElement('span', { 
                    key: i, 
                    className: "font-black text-brand-red bg-brand-red/5 px-1 rounded" 
                }, inner);
            }
            return part;
        })
    );
};

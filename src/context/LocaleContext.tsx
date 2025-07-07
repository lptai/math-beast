// src/LocaleContext.tsx
import { createContext, useContext, useState, type ReactNode } from 'react';
import translations from '../translations/translations'; // Import your translations object
import type { LanguageStrings, LocaleContextType } from '../types';

// Create a context with a default value that matches LocaleContextType
const LocaleContext = createContext<LocaleContextType | undefined>(undefined);

interface LocaleProviderProps {
    children: ReactNode;
}

export const LocaleProvider = ({ children }: LocaleProviderProps) => {
    const [locale, setLocale] = useState<string>('en'); // Default to English

    /**
     * Translation function. Looks up the key in the current locale's translations.
     * Falls back to English if not found, then to the key itself.
     * Supports variable substitution using {variableName}.
     * @param {keyof LanguageStrings} key - The translation key.
     * @param {object} vars - Optional variables to substitute into the translation string.
     * @returns {string} The translated string.
     */
    const t = (key: keyof LanguageStrings, vars: { [key: string]: string | number } = {}): string => {
        let text = translations[locale as keyof typeof translations]?.[key] || translations['en'][key] || key;
        if (typeof text !== 'string') { // Fallback if translation is not a string
            text = String(text);
        }

        for (const [varKey, varValue] of Object.entries(vars)) {
            text = text.replace(`{${varKey}}`, String(varValue)); // Ensure varValue is string
        }
        return text;
    };

    return (
        <LocaleContext.Provider value={{ locale, setLocale, t }}>
            {children}
        </LocaleContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useLocale = () => {
    const context = useContext(LocaleContext);
    if (context === undefined) {
        throw new Error('useLocale must be used within a LocaleProvider');
    }
    return context;
};

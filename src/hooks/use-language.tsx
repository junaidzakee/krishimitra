"use client";

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import enTranslations from '@/locales/en-US.json';
import hiTranslations from '@/locales/hi-IN.json';
import knTranslations from '@/locales/kn-IN.json';


export const languages = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
];

const translations: Record<string, any> = {
  'en-US': enTranslations,
  'hi-IN': hiTranslations,
  'kn-IN': knTranslations,
};

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  languageName: string;
  t: (key: string,
    options?: {
      [key: string]: string | number;
    }
  ) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en-US');
  const [loadedTranslations, setLoadedTranslations] = useState(translations['en-US']);

  useEffect(() => {
    const storedLanguage = localStorage.getItem('appLanguage');
    const effectiveLanguage = storedLanguage && languages.some(l => l.code === storedLanguage) ? storedLanguage : 'en-US';
    setLanguageState(effectiveLanguage);
    setLoadedTranslations(translations[effectiveLanguage]);
  }, []);

  const setLanguage = (langCode: string) => {
    if (translations[langCode]) {
      localStorage.setItem('appLanguage', langCode);
      setLanguageState(langCode);
      setLoadedTranslations(translations[langCode]);
    }
  };
  
  const languageName = useMemo(() => {
    return languages.find(l => l.code === language)?.name.split(' ')[0] || 'English';
  }, [language]);

  const t = useCallback((key: string, options?: { [key: string]: string | number; }) => {
    const keys = key.split('.');
    let value = loadedTranslations;
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        return key;
      }
    }
    let strValue = String(value);

    if (options) {
      Object.entries(options).forEach(([key, value]) => {
        strValue = strValue.replace(`{{${key}}}`, String(value));
      });
    }

    return strValue;

  }, [loadedTranslations]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageName, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

"use client";

import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';

export const languages = [
  { code: 'en-US', name: 'English' },
  { code: 'hi-IN', name: 'हिंदी (Hindi)' },
  { code: 'kn-IN', name: 'ಕನ್ನಡ (Kannada)' },
];

interface LanguageContextType {
  language: string;
  setLanguage: (language: string) => void;
  languageName: string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [language, setLanguageState] = useState('en-US');

  useEffect(() => {
    const storedLanguage = localStorage.getItem('appLanguage');
    if (storedLanguage && languages.some(l => l.code === storedLanguage)) {
      setLanguageState(storedLanguage);
    }
  }, []);

  const setLanguage = (langCode: string) => {
    localStorage.setItem('appLanguage', langCode);
    setLanguageState(langCode);
  };
  
  const languageName = useMemo(() => {
    return languages.find(l => l.code === language)?.name.split(' ')[0] || 'English';
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, languageName }}>
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

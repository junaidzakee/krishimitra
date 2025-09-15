"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';

interface VoiceContextType {
  voiceInputEnabled: boolean;
  setVoiceInputEnabled: (enabled: boolean) => void;
  voiceOutputEnabled: boolean;
  setVoiceOutputEnabled: (enabled: boolean) => void;
}

const VoiceContext = createContext<VoiceContextType | undefined>(undefined);

export const VoiceProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [voiceInputEnabled, setVoiceInputEnabledState] = useState(false);
  const [voiceOutputEnabled, setVoiceOutputEnabledState] = useState(false);

  useEffect(() => {
    const storedInput = localStorage.getItem('voiceInputEnabled');
    if (storedInput) {
      setVoiceInputEnabledState(JSON.parse(storedInput));
    }
    const storedOutput = localStorage.getItem('voiceOutputEnabled');
    if (storedOutput) {
      setVoiceOutputEnabledState(JSON.parse(storedOutput));
    }
  }, []);

  const setVoiceInputEnabled = (enabled: boolean) => {
    localStorage.setItem('voiceInputEnabled', JSON.stringify(enabled));
    setVoiceInputEnabledState(enabled);
  };

  const setVoiceOutputEnabled = (enabled: boolean) => {
    localStorage.setItem('voiceOutputEnabled', JSON.stringify(enabled));
    setVoiceOutputEnabledState(enabled);
  };

  return (
    <VoiceContext.Provider value={{ voiceInputEnabled, setVoiceInputEnabled, voiceOutputEnabled, setVoiceOutputEnabled }}>
      {children}
    </VoiceContext.Provider>
  );
};

export const useVoice = () => {
  const context = useContext(VoiceContext);
  if (context === undefined) {
    throw new Error('useVoice must be used within a VoiceProvider');
  }
  return context;
};

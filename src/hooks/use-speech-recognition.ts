"use client";

import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionOptions {
  onResult: (transcript: string) => void;
  onError?: (error: any) => void;
  language?: string;
}

export const useSpeechRecognition = ({ onResult, onError, language = 'en-US' }: SpeechRecognitionOptions) => {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      console.warn('Speech recognition not supported in this browser.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = language;

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      onResult(currentTranscript);
      setListening(false);
    };

    recognition.onerror = (event: any) => {
      if (event.error === 'aborted' || event.error === 'no-speech') {
        setListening(false);
        return;
      }
      
      console.error('Speech recognition error:', event.error);
      if (onError) {
        onError(event.error);
      }
      setListening(false);
    };
    
    recognition.onend = () => {
      setListening(false);
    };

    recognitionRef.current = recognition;

    return () => {
        if (recognitionRef.current) {
            recognitionRef.current.stop();
        }
    };
  }, [onResult, onError, language]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      try {
        recognitionRef.current.start();
        setListening(true);
      } catch (e) {
        console.error("Could not start recognition", e);
        setListening(false);
      }
    }
  };

  const stopListening = () => {
    if (recognitionRef.current && listening) {
      recognitionRef.current.stop();
      setListening(false);
    }
  };

  return {
    listening,
    transcript: '',
    startListening,
    stopListening,
  };
};

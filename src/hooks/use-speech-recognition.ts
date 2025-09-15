"use client";

import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionOptions {
  onResult: (transcript: string) => void;
  onError?: (error: any) => void;
}

export const useSpeechRecognition = ({ onResult, onError }: SpeechRecognitionOptions) => {
  const [listening, setListening] = useState(false);
  const [transcript, setTranscript] = useState('');
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
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      setTranscript(currentTranscript);
      onResult(currentTranscript);
      setListening(false);
    };

    recognition.onerror = (event: any) => {
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
      recognition.stop();
    };
  }, [onResult, onError]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
      setTranscript('');
      recognitionRef.current.start();
      setListening(true);
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
    transcript,
    startListening,
    stopListening,
  };
};

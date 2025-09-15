"use client";

import { useState, useEffect, useRef } from 'react';

interface SpeechRecognitionOptions {
  onResult: (transcript: string) => void;
  onError?: (error: any) => void;
}

export const useSpeechRecognition = ({ onResult, onError }: SpeechRecognitionOptions) => {
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
    recognition.lang = 'en-US';

    recognition.onresult = (event: any) => {
      const currentTranscript = event.results[0][0].transcript;
      onResult(currentTranscript);
      setListening(false);
    };

    recognition.onerror = (event: any) => {
      // "aborted" is a non-critical error that can occur when the user
      // stops the recognition process manually. We can ignore it.
      if (event.error === 'aborted') {
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
  }, [onResult, onError]);

  const startListening = () => {
    if (recognitionRef.current && !listening) {
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
    transcript: '', // Transcript is now handled by the callback
    startListening,
    stopListening,
  };
};

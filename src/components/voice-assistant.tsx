"use client";

import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Bot, Loader2, Mic, Send, Volume2, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from './ui/card';
import { useVoice } from '@/hooks/use-voice';
import { useLanguage } from '@/hooks/use-language';
import { useSpeechRecognition } from '@/hooks/use-speech-recognition';
import { chat } from '@/ai/flows/chat';
import { textToSpeech } from '@/ai/flows/text-to-speech';
import { ScrollArea } from './ui/scroll-area';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { cn } from '@/lib/utils';
import { Textarea } from './ui/textarea';

interface Message {
  role: 'user' | 'model';
  content: { text: string }[];
}

export function VoiceAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isResponding, setIsResponding] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const { voiceInputEnabled, voiceOutputEnabled } = useVoice();
  const { language, languageName } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);


  const handleSpeechResult = useCallback((result: string) => {
    setInput(result);
    handleSubmit(result);
  }, []);
  
  const { listening, startListening, stopListening } = useSpeechRecognition({
      onResult: handleSpeechResult,
      language: language,
  });

  useEffect(() => {
    if (isOpen) {
        setMessages([
            { role: 'model', content: [{ text: 'Hello! How can I help you today?' }] }
        ]);
        inputRef.current?.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [messages]);

  const speak = async (text: string) => {
    if (!voiceOutputEnabled) return;
    try {
      setIsSpeaking(true);
      const { audioDataUri } = await textToSpeech({ text, language });
      const audio = new Audio(audioDataUri);
      audioRef.current = audio;
      audio.play();
      audio.onended = () => {
        setIsSpeaking(false);
        audioRef.current = null;
      };
    } catch (error) {
      console.error("Could not play audio", error);
      setIsSpeaking(false);
    }
  };

  const handleSubmit = async (messageText?: string) => {
    const text = messageText || input;
    if (!text.trim()) return;

    const userMessage: Message = { role: 'user', content: [{ text }] };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsResponding(true);

    try {
      const history = messages.map(m => ({
        role: m.role,
        content: m.content,
      }));
      const result = await chat({ message: text, history, language: languageName });

      const modelMessage: Message = { role: 'model', content: [{ text: result.message }] };
      setMessages(prev => [...prev, modelMessage]);

      await speak(result.message);
    } catch (error) {
      console.error("Chat error:", error);
      const errorMessage: Message = { role: 'model', content: [{ text: "Sorry, I encountered an error. Please try again." }] };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsResponding(false);
    }
  };
  
  const handleMicClick = () => {
    if(listening) {
        stopListening();
    } else {
        startListening();
    }
  };

  if (!isOpen) {
    return (
      <Button
        className="fixed bottom-4 right-4 rounded-full h-16 w-16 shadow-lg z-50"
        onClick={() => setIsOpen(true)}
        aria-label="Open AI Assistant"
      >
        <Bot className="h-8 w-8" />
      </Button>
    );
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <Card className="w-96 shadow-2xl rounded-xl flex flex-col h-[600px]">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bot className="h-6 w-6" />
            AI Assistant
          </CardTitle>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </CardHeader>
        <CardContent className="flex-1 overflow-hidden">
            <ScrollArea className="h-full" ref={scrollAreaRef}>
                 <div className="space-y-4 pr-4">
                    {messages.map((msg, index) => (
                    <div
                        key={index}
                        className={cn(
                        'flex items-start gap-3',
                        msg.role === 'user' ? 'justify-end' : 'justify-start'
                        )}
                    >
                        {msg.role === 'model' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback><Bot /></AvatarFallback>
                        </Avatar>
                        )}
                        <div
                        className={cn(
                            'p-3 rounded-lg max-w-xs',
                            msg.role === 'user'
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                        >
                        <p className="text-sm">{msg.content[0].text}</p>
                        </div>
                         {msg.role === 'user' && (
                        <Avatar className="h-8 w-8">
                            <AvatarFallback>U</AvatarFallback>
                        </Avatar>
                        )}
                    </div>
                    ))}
                    {isResponding && (
                        <div className="flex items-start gap-3 justify-start">
                             <Avatar className="h-8 w-8">
                                <AvatarFallback><Bot /></AvatarFallback>
                            </Avatar>
                             <div className="p-3 rounded-lg bg-muted">
                                <Loader2 className="h-5 w-5 animate-spin" />
                            </div>
                        </div>
                    )}
                 </div>
            </ScrollArea>
        </CardContent>
        <CardFooter>
          <div className="relative w-full">
            <Textarea
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="pr-20"
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit();
                }
              }}
            />
            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                    type="button"
                    size="icon"
                    variant="ghost"
                    onClick={handleMicClick}
                    disabled={!voiceInputEnabled}
                >
                    {listening ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Mic className="h-4 w-4" />}
                </Button>
                <Button type="submit" size="icon" onClick={() => handleSubmit()} disabled={!input.trim()}>
                    <Send className="h-4 w-4" />
                </Button>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useLanguage } from "@/hooks/use-language";
import { getSupportResponse } from '@/ai/flows/support-agent';
import { Loader2, Send } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Bot, User } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export default function SupportPage() {
  const { t, language, languageName } = useLanguage();
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const faqs = [
    {
      question: t('support.faq.q1.question'),
      answer: t('support.faq.q1.answer')
    },
    {
      question: t('support.faq.q2.question'),
      answer: t('support.faq.q2.answer')
    },
    {
      question: t('support.faq.q3.question'),
      answer: t('support.faq.q3.answer')
    },
    {
      question: t('support.faq.q4.question'),
      answer: t('support.faq.q4.answer')
    }
  ];

  useEffect(() => {
    if (scrollAreaRef.current) {
      scrollAreaRef.current.scrollTop = scrollAreaRef.current.scrollHeight;
    }
  }, [chatMessages]);

  const handleContactSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setChatMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const faqString = JSON.stringify(faqs);
      const result = await getSupportResponse({
        message: input,
        language: languageName,
        faq: faqString
      });
      const modelMessage: ChatMessage = { role: 'model', content: result.response };
      setChatMessages(prev => [...prev, modelMessage]);
    } catch (error) {
      console.error("Support chat error:", error);
      const errorMessage: ChatMessage = { role: 'model', content: t('voiceAssistant.error') };
      setChatMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-12 md:grid-cols-5">
      <div className="md:col-span-3">
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t('support.title')}</h1>
        <p className="text-muted-foreground mb-8">{t('support.description')}</p>
        
        <Card>
          <CardHeader>
            <CardTitle>{t('support.faq.title')}</CardTitle>
          </CardHeader>
          <CardContent>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger>{faq.question}</AccordionTrigger>
                  <AccordionContent>{faq.answer}</AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </CardContent>
        </Card>
      </div>
      <div className="md:col-span-2">
        <Card className="flex flex-col h-[70vh]">
          <CardHeader>
            <CardTitle>{t('support.contact.title')}</CardTitle>
            <CardDescription>{t('support.contact.description')}</CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col gap-4 overflow-hidden">
            <ScrollArea className="flex-1 pr-4" ref={scrollAreaRef}>
              <div className="space-y-4">
                {chatMessages.map((msg, index) => (
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
                        'p-3 rounded-lg max-w-xs text-sm',
                        msg.role === 'user'
                          ? 'bg-primary text-primary-foreground'
                          : 'bg-muted'
                      )}
                    >
                      <p>{msg.content}</p>
                    </div>
                    {msg.role === 'user' && (
                      <Avatar className="h-8 w-8">
                        <AvatarFallback><User /></AvatarFallback>
                      </Avatar>
                    )}
                  </div>
                ))}
                {isLoading && (
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
            <form onSubmit={handleContactSubmit} className="relative mt-auto">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder={t('support.contact.form.message.placeholder')}
                className="pr-12"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8" disabled={isLoading}>
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                <span className="sr-only">{t('support.contact.form.submit')}</span>
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

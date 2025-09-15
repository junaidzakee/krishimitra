"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useLanguage } from "@/hooks/use-language";

export default function SupportPage() {
  const { toast } = useToast();
  const { t } = useLanguage();

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

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: t('support.contact.toast.title'),
      description: t('support.contact.toast.description'),
    });
    (event.target as HTMLFormElement).reset();
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
        <Card>
          <CardHeader>
            <CardTitle>{t('support.contact.title')}</CardTitle>
            <CardDescription>{t('support.contact.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">{t('support.contact.form.name.label')}</Label>
                <Input id="name" placeholder={t('support.contact.form.name.placeholder')} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">{t('support.contact.form.email.label')}</Label>
                <Input id="email" type="email" placeholder={t('support.contact.form.email.placeholder')} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">{t('support.contact.form.message.label')}</Label>
                <Textarea id="message" placeholder={t('support.contact.form.message.placeholder')} required />
              </div>
              <Button type="submit" className="w-full">{t('support.contact.form.submit')}</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

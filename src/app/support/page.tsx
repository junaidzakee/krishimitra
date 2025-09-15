"use client";

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

const faqs = [
  {
    question: "How do I use the Soil Analysis feature?",
    answer: "Navigate to the Soil Analysis page, enter your soil's parameters like Nitrogen, Phosphorus, Potassium levels, pH, etc., and the crop you intend to grow. Click 'Analyze Soil' to get AI-powered fertilizer and treatment recommendations."
  },
  {
    question: "How accurate is the Disease Detection?",
    answer: "The AI Disease Detection is a powerful tool for early identification, but it should be used as a preliminary guide. The confidence score indicates the AI's certainty. For a definitive diagnosis, especially when the confidence is low, we always recommend consulting a local agricultural expert."
  },
  {
    question: "Can I use the app in my local language?",
    answer: "Yes! You can change the language by clicking your profile icon in the top right, hovering over 'Language', and selecting from the available options. The AI assistant will also communicate in the selected language."
  },
  {
    question: "How do I use the voice assistant?",
    answer: "First, enable 'Voice Input' and 'Voice Output' from the settings in your profile menu. Then, click the robot icon at the bottom-right of the screen. Use the microphone button in the chat window to speak your commands."
  }
];

export default function SupportPage() {
  const { toast } = useToast();

  const handleContactSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    toast({
      title: "Message Sent",
      description: "Our support team will get back to you shortly.",
    });
    (event.target as HTMLFormElement).reset();
  };

  return (
    <div className="grid gap-12 md:grid-cols-5">
      <div className="md:col-span-3">
        <h1 className="text-3xl font-bold tracking-tight font-headline">Support Center</h1>
        <p className="text-muted-foreground mb-8">Find answers to common questions and get in touch with our team.</p>
        
        <Card>
          <CardHeader>
            <CardTitle>Frequently Asked Questions</CardTitle>
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
            <CardTitle>Contact Us</CardTitle>
            <CardDescription>Can't find an answer? Send us a message.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleContactSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input id="name" placeholder="Your Name" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" placeholder="your@email.com" required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea id="message" placeholder="How can we help you?" required />
              </div>
              <Button type="submit" className="w-full">Send Message</Button>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

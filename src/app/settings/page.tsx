"use client";

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { useLanguage, languages } from '@/hooks/use-language';
import { useVoice } from '@/hooks/use-voice';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  const { language, setLanguage } = useLanguage();
  const { voiceInputEnabled, setVoiceInputEnabled, voiceOutputEnabled, setVoiceOutputEnabled } = useVoice();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Settings</h1>
        <p className="text-muted-foreground">Customize your application experience.</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Language</CardTitle>
          <CardDescription>Choose the language for the application interface and AI assistant.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Label htmlFor="language-select" className="flex-shrink-0">
              Preferred Language
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language-select" className="w-[200px]">
                <SelectValue placeholder="Select language" />
              </SelectTrigger>
              <SelectContent>
                {languages.map((lang) => (
                  <SelectItem key={lang.code} value={lang.code}>
                    {lang.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Voice Assistant</CardTitle>
          <CardDescription>Manage voice settings for the AI assistant.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label htmlFor="voice-input">Enable Voice Input</Label>
              <p className="text-sm text-muted-foreground">Use your microphone to talk to the assistant.</p>
            </div>
            <Switch
              id="voice-input"
              checked={voiceInputEnabled}
              onCheckedChange={setVoiceInputEnabled}
            />
          </div>
          <Separator />
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label htmlFor="voice-output">Enable Voice Output</Label>
              <p className="text-sm text-muted-foreground">Hear the assistant's responses spoken aloud.</p>
            </div>
            <Switch
              id="voice-output"
              checked={voiceOutputEnabled}
              onCheckedChange={setVoiceOutputEnabled}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

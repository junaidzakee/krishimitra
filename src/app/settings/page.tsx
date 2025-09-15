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
  const { language, setLanguage, t } = useLanguage();
  const { voiceInputEnabled, setVoiceInputEnabled, voiceOutputEnabled, setVoiceOutputEnabled } = useVoice();

  return (
    <div className="space-y-8 max-w-2xl mx-auto">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t('settings.title')}</h1>
        <p className="text-muted-foreground">{t('settings.description')}</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('settings.language.title')}</CardTitle>
          <CardDescription>{t('settings.language.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-4">
            <Label htmlFor="language-select" className="flex-shrink-0">
              {t('settings.language.label')}
            </Label>
            <Select value={language} onValueChange={setLanguage}>
              <SelectTrigger id="language-select" className="w-[200px]">
                <SelectValue placeholder={t('settings.language.placeholder')} />
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
          <CardTitle>{t('settings.voice.title')}</CardTitle>
          <CardDescription>{t('settings.voice.description')}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between space-x-2">
            <div>
              <Label htmlFor="voice-input">{t('settings.voice.input.label')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.voice.input.description')}</p>
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
              <Label htmlFor="voice-output">{t('settings.voice.output.label')}</Label>
              <p className="text-sm text-muted-foreground">{t('settings.voice.output.description')}</p>
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

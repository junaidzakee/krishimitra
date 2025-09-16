
"use client";

import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FlaskConical, Loader2, Pause, Play, Save, Volume2, Wand2 } from "lucide-react";
import { analyzeSoilAndRecommend, SoilAnalysisOutput } from "@/ai/flows/soil-analysis-recommendation";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc, serverTimestamp, doc, setDoc, increment } from "firebase/firestore";
import { useVoice } from "@/hooks/use-voice";
import { useLanguage } from "@/hooks/use-language";

const formSchema = z.object({
  soilType: z.string().min(1, "Soil type is required."),
  nitrogenLevel: z.coerce.number().min(0, "Must be a positive number."),
  phosphorusLevel: z.coerce.number().min(0, "Must be a positive number."),
  potassiumLevel: z.coerce.number().min(0, "Must be a positive number."),
  pHLevel: z.coerce.number().min(0).max(14, "pH must be between 0 and 14."),
  organicMatterContent: z.coerce.number().min(0).max(100, "Must be between 0 and 100."),
  cropType: z.string().min(1, "Crop type is required."),
});

type SoilAnalysisFormValues = z.infer<typeof formSchema>;

export default function SoilAnalysisPage() {
  const [analysisResult, setAnalysisResult] = useState<SoilAnalysisOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();
  const { user } = useAuth();
  const { voiceOutputEnabled } = useVoice();
  const { t, language } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const form = useForm<SoilAnalysisFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilType: "loamy",
      nitrogenLevel: 15,
      phosphorusLevel: 25,
      potassiumLevel: 30,
      pHLevel: 6.5,
      organicMatterContent: 3.5,
      cropType: "Wheat",
    },
  });
  
  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const awardPoints = async () => {
    if (user) {
      const userRef = doc(db, "users", user.uid);
       await setDoc(userRef, {
        krishiCoins: increment(10)
      }, { merge: true });
      toast({
        title: t('rewards.soilAnalysis.title'),
        description: t('rewards.soilAnalysis.description', { count: 10 }),
      })
    }
  };

  const onSubmit = async (data: SoilAnalysisFormValues) => {
    setIsLoading(true);
    setAnalysisResult(null);
    if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
    }
    setIsSpeaking(false);
    setIsPaused(false);
    try {
      const result = await analyzeSoilAndRecommend(data);
      setAnalysisResult(result);
      await awardPoints();
    } catch (error) {
      console.error("Error analyzing soil:", error);
      toast({
        variant: "destructive",
        title: t('soilAnalysis.toast.analysisFailed.title'),
        description: t('soilAnalysis.toast.analysisFailed.description'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: t('soilAnalysis.toast.authRequired.title'),
        description: t('soilAnalysis.toast.authRequired.description'),
      });
      return;
    }
    if (!analysisResult) {
      toast({
        variant: 'destructive',
        title: t('soilAnalysis.toast.noResult.title'),
        description: t('soilAnalysis.toast.noResult.description'),
      });
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "soilAnalyses"), {
        userId: user.uid,
        createdAt: serverTimestamp(),
        inputs: form.getValues(),
        results: analysisResult,
      });
      toast({
        title: t('soilAnalysis.toast.saveSuccess.title'),
        description: t('soilAnalysis.toast.saveSuccess.description'),
      });
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast({
        variant: 'destructive',
        title: t('soilAnalysis.toast.saveFailed.title'),
        description: t('soilAnalysis.toast.saveFailed.description'),
      });
    } finally {
      setIsSaving(false);
    }
  };

  const handleSpeak = async () => {
    if (!analysisResult || !voiceOutputEnabled) return;

    if (audioRef.current) {
      if (isSpeaking) {
        audioRef.current.pause();
        setIsSpeaking(false);
        setIsPaused(true);
      } else {
        audioRef.current.play();
        setIsSpeaking(true);
        setIsPaused(false);
      }
      return;
    }
    
    setIsAudioLoading(true);
    try {
      const textToRead = `
        ${t('soilAnalysis.speech.analysisFor', { cropType: form.getValues("cropType") })}
        ${t('soilAnalysis.speech.soilAnalysis')}: ${analysisResult.soilAnalysis}.
        ${t('soilAnalysis.speech.fertilizer')}: ${analysisResult.fertilizerRecommendation}.
        ${t('soilAnalysis.speech.treatment')}: ${analysisResult.treatmentRecommendation}.
      `;
      const { audioDataUri } = await textToSpeech({ text: textToRead, language });
      const audio = new Audio(audioDataUri);
      audioRef.current = audio;
      audio.play();
      setIsSpeaking(true);
      setIsPaused(false);
      audio.onended = () => {
        setIsSpeaking(false);
        setIsPaused(false);
        audioRef.current = null;
      };
    } catch (error) {
      console.error("Error generating speech:", error);
      toast({
        variant: "destructive",
        title: t('soilAnalysis.toast.speechError.title'),
        description: t('soilAnalysis.toast.speechError.description'),
      });
    } finally {
      setIsAudioLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>{t('soilAnalysis.form.title')}</CardTitle>
          <CardDescription>
            {t('soilAnalysis.form.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="soilType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('soilAnalysis.form.soilType.label')}</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t('soilAnalysis.form.soilType.placeholder')} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sandy">{t('soilAnalysis.form.soilType.options.sandy')}</SelectItem>
                        <SelectItem value="silty">{t('soilAnalysis.form.soilType.options.silty')}</SelectItem>
                        <SelectItem value="clay">{t('soilAnalysis.form.soilType.options.clay')}</SelectItem>
                        <SelectItem value="loamy">{t('soilAnalysis.form.soilType.options.loamy')}</SelectItem>
                        <SelectItem value="peaty">{t('soilAnalysis.form.soilType.options.peaty')}</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nitrogenLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('soilAnalysis.form.nitrogen.label')}</FormLabel>
                      <FormControl>
                          <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phosphorusLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('soilAnalysis.form.phosphorus.label')}</FormLabel>
                      <FormControl>
                          <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <FormField
                  control={form.control}
                  name="potassiumLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('soilAnalysis.form.potassium.label')}</FormLabel>
                      <FormControl>
                          <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pHLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('soilAnalysis.form.ph.label')}</FormLabel>
                       <FormControl>
                          <Input type="number" step="0.1" {...field} />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
               <FormField
                  control={form.control}
                  name="organicMatterContent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t('soilAnalysis.form.organicMatter.label')}</FormLabel>
                       <FormControl>
                          <Input type="number" step="0.1" {...field} />
                       </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('soilAnalysis.form.cropType.label')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('soilAnalysis.form.cropType.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {t('soilAnalysis.form.submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="md:col-span-2">
      {isLoading && (
        <div className="space-y-6">
            <Card>
                <CardHeader>
                    <CardTitle className="animate-pulse bg-muted rounded-md h-6 w-1/3"></CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="animate-pulse bg-muted rounded-md h-4 w-full"></p>
                    <p className="animate-pulse bg-muted rounded-md h-4 w-5/6"></p>
                </CardContent>
            </Card>
            <Card>
                <CardHeader>
                    <CardTitle className="animate-pulse bg-muted rounded-md h-6 w-1/3/3"></CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                    <p className="animate-pulse bg-muted rounded-md h-4 w-full"></p>
                    <p className="animate-pulse bg-muted rounded-md h-4 w-4/6"></p>
                </CardContent>
            </Card>
        </div>
      )}
      {analysisResult && (
        <Card className="bg-card/80 backdrop-blur-sm">
            <CardHeader>
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-headline">{t('soilAnalysis.results.title', { cropType: form.getValues("cropType") })}</CardTitle>
                        <CardDescription>{t('soilAnalysis.results.description')}</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={handleSpeak} disabled={isAudioLoading || !voiceOutputEnabled}>
                            {isAudioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isSpeaking ? <Pause className="h-4 w-4" /> : (isPaused ? <Play className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />))}
                            <span className="sr-only">{t('soilAnalysis.results.readAloud')}</span>
                        </Button>
                         <Button variant="outline" size="icon" onClick={handleSave} disabled={isSaving || !user}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4"/>}
                            <span className="sr-only">{t('soilAnalysis.results.saveOffline')}</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg">{t('soilAnalysis.results.soilAnalysis')}</h3>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground">{analysisResult.soilAnalysis}</p>

                </div>
                 <div>
                    <h3 className="font-semibold text-lg">{t('soilAnalysis.results.fertilizer')}</h3>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground">{analysisResult.fertilizerRecommendation}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">{t('soilAnalysis.results.treatment')}</h3>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground">{analysisResult.treatmentRecommendation}</p>
                </div>
            </CardContent>
        </Card>
       )}
       {!isLoading && !analysisResult && (
            <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-border text-center p-8">
                <FlaskConical className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">{t('soilAnalysis.placeholder.title')}</h3>
                <p className="mt-2 text-sm text-muted-foreground">{t('soilAnalysis.placeholder.description')}</p>
            </div>
       )}
      </div>
    </div>
  );
}

    
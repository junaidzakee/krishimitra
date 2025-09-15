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
import { Loader2, Mic, Pause, Play, Save, Volume2, Wand2 } from "lucide-react";
import { analyzeSoilAndRecommend, SoilAnalysisOutput } from "@/ai/flows/soil-analysis-recommendation";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useAuth } from "@/hooks/use-auth";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useVoice } from "@/hooks/use-voice";
import { useSpeechRecognition } from "@/hooks/use-speech-recognition";

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
  const { voiceInputEnabled, voiceOutputEnabled } = useVoice();
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

  const { listening, transcript, startListening, stopListening } = useSpeechRecognition({
    onResult: (result) => {
        const activeElement = document.activeElement as HTMLInputElement;
        if (activeElement && activeElement.name) {
            const fieldName = activeElement.name as keyof SoilAnalysisFormValues;
            const value = result.replace('.', '');
            
            if (fieldName === 'cropType') {
                form.setValue(fieldName, value);
            } else if (['nitrogenLevel', 'phosphorusLevel', 'potassiumLevel', 'pHLevel', 'organicMatterContent'].includes(fieldName)) {
                const numericValue = parseFloat(value);
                if (!isNaN(numericValue)) {
                    form.setValue(fieldName, numericValue);
                }
            }
        }
    }
  });

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
    } catch (error) {
      console.error("Error analyzing soil:", error);
      toast({
        variant: "destructive",
        title: "Analysis Failed",
        description: "Could not get recommendations. Please try again later.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Authentication Required',
        description: 'You must be signed in to save results.',
      });
      return;
    }
    if (!analysisResult) {
      toast({
        variant: 'destructive',
        title: 'No Result to Save',
        description: 'Please analyze the soil first before saving.',
      });
      return;
    }

    setIsSaving(true);
    try {
      await addDoc(collection(db, "soilAnalyses"), {
        userId: user.uid,
        createdAt: new Date(),
        inputs: form.getValues(),
        results: analysisResult,
      });
      toast({
        title: 'Analysis Saved',
        description: 'Your soil analysis has been saved to your history.',
      });
    } catch (error) {
      console.error("Error saving analysis:", error);
      toast({
        variant: 'destructive',
        title: 'Save Failed',
        description: 'Could not save your analysis. Please try again.',
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
        Analysis for ${form.getValues("cropType")}.
        Soil Analysis: ${analysisResult.soilAnalysis}.
        Fertilizer Recommendation: ${analysisResult.fertilizerRecommendation}.
        Treatment Recommendation: ${analysisResult.treatmentRecommendation}.
      `;
      const { audioDataUri } = await textToSpeech({ text: textToRead });
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
        title: "Speech Error",
        description: "Could not generate audio. Please try again.",
      });
    } finally {
      setIsAudioLoading(false);
    }
  };

  const handleMicClick = () => {
    if (listening) {
      stopListening();
    } else {
      startListening();
    }
  };
  
  const renderMicButton = (fieldName: keyof SoilAnalysisFormValues) => (
    <Button 
        type="button" 
        size="icon" 
        variant="ghost" 
        onMouseDown={startListening}
        onMouseUp={stopListening}
        onTouchStart={startListening}
        onTouchEnd={stopListening}
        disabled={!voiceInputEnabled} 
        className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground"
    >
        {listening && document.activeElement?.id === fieldName ? <Loader2 className="h-4 w-4 animate-spin text-primary" /> : <Mic className="h-4 w-4" />}
    </Button>
  );

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>Soil Parameters</CardTitle>
          <CardDescription>
            Enter your soil data to get AI-powered recommendations.
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
                    <FormLabel>Soil Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a soil type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="sandy">Sandy</SelectItem>
                        <SelectItem value="silty">Silty</SelectItem>
                        <SelectItem value="clay">Clay</SelectItem>
                        <SelectItem value="loamy">Loamy</SelectItem>
                        <SelectItem value="peaty">Peaty</SelectItem>
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
                      <FormLabel>Nitrogen (ppm)</FormLabel>
                      <div className="relative">
                        <FormControl>
                            <Input type="number" {...field} id="nitrogenLevel" className="pr-10" />
                        </FormControl>
                        {renderMicButton("nitrogenLevel")}
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phosphorusLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phosphorus (ppm)</FormLabel>
                      <div className="relative">
                        <FormControl>
                            <Input type="number" {...field} id="phosphorusLevel" className="pr-10" />
                        </FormControl>
                        {renderMicButton("phosphorusLevel")}
                       </div>
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
                      <FormLabel>Potassium (ppm)</FormLabel>
                      <div className="relative">
                        <FormControl>
                            <Input type="number" {...field} id="potassiumLevel" className="pr-10" />
                        </FormControl>
                        {renderMicButton("potassiumLevel")}
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="pHLevel"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>pH Level</FormLabel>
                       <div className="relative">
                        <FormControl>
                            <Input type="number" step="0.1" {...field} id="pHLevel" className="pr-10" />
                        </FormControl>
                        {renderMicButton("pHLevel")}
                       </div>
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
                      <FormLabel>Organic Matter (%)</FormLabel>
                       <div className="relative">
                        <FormControl>
                            <Input type="number" step="0.1" {...field} id="organicMatterContent" className="pr-10" />
                        </FormControl>
                        {renderMicButton("organicMatterContent")}
                       </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
               <FormField
                control={form.control}
                name="cropType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Crop Type</FormLabel>
                    <div className="relative">
                        <FormControl>
                            <Input placeholder="e.g., Wheat, Rice" {...field} id="cropType" className="pr-10" />
                        </FormControl>
                        {renderMicButton("cropType")}
                    </div>
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
                Analyze Soil
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
                    <CardTitle className="animate-pulse bg-muted rounded-md h-6 w-1/3"></CardTitle>
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
                        <CardTitle className="text-2xl font-headline">Analysis for {form.getValues("cropType")}</CardTitle>
                        <CardDescription>Based on your provided soil parameters.</CardDescription>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={handleSpeak} disabled={isAudioLoading || !voiceOutputEnabled}>
                            {isAudioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isSpeaking ? <Pause className="h-4 w-4" /> : (isPaused ? <Play className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />))}
                            <span className="sr-only">Read aloud</span>
                        </Button>
                         <Button variant="outline" size="icon" onClick={handleSave} disabled={isSaving}>
                            {isSaving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4"/>}
                            <span className="sr-only">Save for Offline</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-6">
                <div>
                    <h3 className="font-semibold text-lg">Soil Analysis</h3>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground">{analysisResult.soilAnalysis}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Fertilizer Recommendation</h3>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground">{analysisResult.fertilizerRecommendation}</p>
                </div>
                 <div>
                    <h3 className="font-semibold text-lg">Treatment Recommendation</h3>
                    <Separator className="my-2" />
                    <p className="text-muted-foreground">{analysisResult.treatmentRecommendation}</p>
                </div>
            </CardContent>
        </Card>
       )}
       {!isLoading && !analysisResult && (
            <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-border text-center p-8">
                <div className="h-16 w-16 text-muted-foreground/50" />
                <h3 className="mt-4 text-lg font-semibold">Awaiting Analysis</h3>
                <p className="mt-2 text-sm text-muted-foreground">Your soil recommendations will appear here.</p>
            </div>
       )}
      </div>
    </div>
  );
}

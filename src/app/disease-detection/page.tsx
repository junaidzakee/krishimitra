"use client";

import React, { useState, useCallback, useRef, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Loader2, UploadCloud, Wand2, AlertTriangle, Save, Volume2, Play, Pause } from "lucide-react";
import { detectDisease, DetectDiseaseOutput } from "@/ai/flows/ai-disease-detection";
import { textToSpeech } from "@/ai/flows/text-to-speech";
import { useToast } from "@/hooks/use-toast";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { useVoice } from "@/hooks/use-voice";
import { useLanguage } from "@/hooks/use-language";

export default function DiseaseDetectionPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [result, setResult] = useState<DetectDiseaseOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isAudioLoading, setIsAudioLoading] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const { toast } = useToast();
  const { voiceOutputEnabled } = useVoice();
  const { t } = useLanguage();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: t('diseaseDetection.toast.invalidFileType.title'),
          description: t('diseaseDetection.toast.invalidFileType.description'),
        });
        return;
      }
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
      setResult(null);
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
      setIsSpeaking(false);
      setIsPaused(false);
    }
  }, [toast, t]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: { "image/*": [] },
  });

  const handleSubmit = async () => {
    if (!file) {
      toast({
        variant: "destructive",
        title: t('diseaseDetection.toast.noImage.title'),
        description: t('diseaseDetection.toast.noImage.description'),
      });
      return;
    }

    setIsLoading(true);
    setResult(null);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = async () => {
      try {
        const photoDataUri = reader.result as string;
        const analysisResult = await detectDisease({ photoDataUri });
        setResult(analysisResult);
      } catch (error) {
        console.error("Error detecting disease:", error);
        toast({
          variant: "destructive",
          title: t('diseaseDetection.toast.analysisFailed.title'),
          description: t('diseaseDetection.toast.analysisFailed.description'),
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: t('diseaseDetection.toast.fileReadError.title'),
        description: t('diseaseDetection.toast.fileReadError.description'),
      });
      setIsLoading(false);
    };
  };

  const handleSpeak = async () => {
    if (!result || !voiceOutputEnabled) return;

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
        ${t('diseaseDetection.speech.complete')}
        ${t('diseaseDetection.speech.disease')}: ${result.disease || t('diseaseDetection.speech.noneDetected')}.
        ${t('diseaseDetection.speech.confidence')}: ${Math.round(result.confidence * 100)} ${t('diseaseDetection.speech.percent')}.
        ${result.expertNeeded ? t('diseaseDetection.speech.expertRecommended') : ""}
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
        title: t('diseaseDetection.toast.speechError.title'),
        description: t('diseaseDetection.toast.speechError.description'),
      });
    } finally {
      setIsAudioLoading(false);
    }
  };

  const leafImage = PlaceHolderImages.find(p => p.id === 'disease-leaf');

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>{t('diseaseDetection.upload.title')}</CardTitle>
          <CardDescription>
            {t('diseaseDetection.upload.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer transition-colors ${
              isDragActive ? "border-primary bg-accent/50" : "border-border hover:border-primary/50"
            }`}
          >
            <input {...getInputProps()} />
            {preview ? (
              <div className="relative w-full aspect-video rounded-lg overflow-hidden">
                <Image src={preview} alt="Preview" fill style={{ objectFit: "cover" }} />
              </div>
            ) : (
              <div className="text-center">
                <UploadCloud className="w-12 h-12 mx-auto text-muted-foreground" />
                <p className="mt-4 text-muted-foreground">
                  {isDragActive ? t('diseaseDetection.upload.dropActive') : t('diseaseDetection.upload.dropInactive')}
                </p>
                <p className="text-xs text-muted-foreground/80 mt-1">{t('diseaseDetection.upload.fileTypes')}</p>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button onClick={handleSubmit} disabled={!file || isLoading} className="w-full">
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Wand2 className="mr-2 h-4 w-4" />
            )}
            {t('diseaseDetection.upload.button')}
          </Button>
        </CardFooter>
      </Card>

      <div className="flex items-center justify-center">
        {isLoading ? (
            <Card className="w-full">
                <CardHeader>
                    <div className="animate-pulse bg-muted rounded-md h-48 w-full"></div>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="animate-pulse bg-muted rounded-md h-6 w-1/3"></div>
                    <div className="animate-pulse bg-muted rounded-md h-4 w-1/2"></div>
                    <div className="animate-pulse bg-muted rounded-md h-4 w-full"></div>
                </CardContent>
            </Card>
        ) : result ? (
          <Card className="w-full">
             <CardHeader>
                 <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-2xl font-headline">{t('diseaseDetection.results.title')}</CardTitle>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={handleSpeak} disabled={isAudioLoading || !voiceOutputEnabled}>
                          {isAudioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isSpeaking ? <Pause className="h-4 w-4" /> : (isPaused ? <Play className="h-4 w-4" /> : <Volume2 className="h-4 w-4"/>))}
                          <span className="sr-only">{t('diseaseDetection.results.readAloud')}</span>
                        </Button>
                         <Button variant="outline" size="icon">
                            <Save className="h-4 w-4"/>
                            <span className="sr-only">{t('diseaseDetection.results.saveOffline')}</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <Image src={preview!} alt="Analyzed plant" fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('diseaseDetection.results.detectedDisease')}</p>
                <h3 className="text-2xl font-semibold">{result.disease || t('diseaseDetection.results.noneDetected')}</h3>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">{t('diseaseDetection.results.confidence')}</p>
                <div className="flex items-center gap-2">
                  <Progress value={result.confidence * 100} className="w-full" />
                  <span className="font-mono text-sm text-muted-foreground">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
              {result.expertNeeded && (
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>{t('diseaseDetection.results.expertNeeded.title')}</AlertTitle>
                  <AlertDescription>
                    {t('diseaseDetection.results.expertNeeded.description')}
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed text-center p-8 w-full">
            {leafImage && <Image src={leafImage.imageUrl} width={200} height={150} alt={leafImage.description} data-ai-hint={leafImage.imageHint} className="opacity-20" />}
            <h3 className="mt-4 text-lg font-semibold">{t('diseaseDetection.placeholder.title')}</h3>
            <p className="mt-2 text-sm text-muted-foreground">{t('diseaseDetection.placeholder.description')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

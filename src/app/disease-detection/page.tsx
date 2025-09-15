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
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles && acceptedFiles.length > 0) {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile.type.startsWith("image/")) {
        toast({
          variant: "destructive",
          title: "Invalid File Type",
          description: "Please upload an image file.",
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
  }, [toast]);

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
        title: "No Image Selected",
        description: "Please upload an image to analyze.",
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
          title: "Analysis Failed",
          description: "Could not analyze the image. Please try again.",
        });
      } finally {
        setIsLoading(false);
      }
    };
    reader.onerror = () => {
      toast({
        variant: "destructive",
        title: "File Read Error",
        description: "Could not read the selected file.",
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
        Analysis complete.
        Detected Disease: ${result.disease || "None Detected"}.
        Confidence Level: ${Math.round(result.confidence * 100)} percent.
        ${result.expertNeeded ? "An expert consultation is recommended." : ""}
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

  const leafImage = PlaceHolderImages.find(p => p.id === 'disease-leaf');

  return (
    <div className="grid gap-8 md:grid-cols-2">
      <Card>
        <CardHeader>
          <CardTitle>Upload Plant Image</CardTitle>
          <CardDescription>
            Upload an image of a plant leaf to detect potential diseases.
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
                  {isDragActive ? "Drop the image here" : "Drag & drop an image, or click to select"}
                </p>
                <p className="text-xs text-muted-foreground/80 mt-1">PNG, JPG, or WEBP</p>
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
            Analyze Image
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
                        <CardTitle className="text-2xl font-headline">Analysis Result</CardTitle>
                    </div>
                     <div className="flex gap-2">
                        <Button variant="outline" size="icon" onClick={handleSpeak} disabled={isAudioLoading || !voiceOutputEnabled}>
                          {isAudioLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : (isSpeaking ? <Pause className="h-4 w-4" /> : (isPaused ? <Play className="h-4 w-4" /> : <Volume2 className="h-4 w-4"/>))}
                          <span className="sr-only">Read aloud</span>
                        </Button>
                         <Button variant="outline" size="icon">
                            <Save className="h-4 w-4"/>
                            <span className="sr-only">Save for Offline</span>
                        </Button>
                    </div>
                </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="relative w-full aspect-video rounded-lg overflow-hidden border">
                <Image src={preview!} alt="Analyzed plant" fill style={{ objectFit: 'cover' }} />
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Detected Disease</p>
                <h3 className="text-2xl font-semibold">{result.disease || "None Detected"}</h3>
              </div>
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confidence Level</p>
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
                  <AlertTitle>Expert Consultation Recommended</AlertTitle>
                  <AlertDescription>
                    The AI confidence is moderate. For an accurate diagnosis, consider consulting a plant pathology expert.
                  </AlertDescription>
                </Alert>
              )}
            </CardContent>
          </Card>
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed text-center p-8 w-full">
            {leafImage && <Image src={leafImage.imageUrl} width={200} height={150} alt={leafImage.description} data-ai-hint={leafImage.imageHint} className="opacity-20" />}
            <h3 className="mt-4 text-lg font-semibold">Awaiting Image Analysis</h3>
            <p className="mt-2 text-sm text-muted-foreground">Your disease detection results will appear here.</p>
          </div>
        )}
      </div>
    </div>
  );
}

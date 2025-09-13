"use client";

import React, { useState } from "react";
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
import { Loader2, Mic, Save, Volume2, Wand2 } from "lucide-react";
import { analyzeSoilAndRecommend, SoilAnalysisOutput } from "@/ai/flows/soil-analysis-recommendation";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";

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
  const { toast } = useToast();

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

  const onSubmit = async (data: SoilAnalysisFormValues) => {
    setIsLoading(true);
    setAnalysisResult(null);
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
                      <FormLabel>Phosphorus (ppm)</FormLabel>
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
                      <FormLabel>Potassium (ppm)</FormLabel>
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
                      <FormLabel>pH Level</FormLabel>
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
                      <FormLabel>Organic Matter (%)</FormLabel>
                       <div className="relative">
                        <FormControl>
                            <Input type="number" step="0.1" {...field} className="pr-10" />
                        </FormControl>
                        <Button type="button" size="icon" variant="ghost" className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 text-muted-foreground">
                            <Mic className="h-4 w-4" />
                        </Button>
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
                    <FormControl>
                      <Input placeholder="e.g., Wheat, Rice" {...field} />
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
                        <Button variant="outline" size="icon">
                            <Volume2 className="h-4 w-4"/>
                            <span className="sr-only">Read aloud</span>
                        </Button>
                         <Button variant="outline" size="icon">
                            <Save className="h-4 w-4"/>
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

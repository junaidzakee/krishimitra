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
import { DollarSign, Leaf, Loader2, Wand2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { useLanguage } from "@/hooks/use-language";
import { recommendCrops, RecommendCropsOutput } from "@/ai/flows/crop-recommendation";
import Image from "next/image";

const formSchema = z.object({
  soilType: z.string().min(1, "Soil type is required."),
  nitrogenLevel: z.coerce.number().min(0, "Must be a positive number."),
  phosphorusLevel: z.coerce.number().min(0, "Must be a positive number."),
  potassiumLevel: z.coerce.number().min(0, "Must be a positive number."),
  pHLevel: z.coerce.number().min(0).max(14, "pH must be between 0 and 14."),
  location: z.string().min(1, "Location is required."),
});

type CropRecommendationFormValues = z.infer<typeof formSchema>;

export default function CropRecommendationPage() {
  const [recommendations, setRecommendations] = useState<RecommendCropsOutput | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { t, languageName } = useLanguage();

  const form = useForm<CropRecommendationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      soilType: "loamy",
      nitrogenLevel: 50,
      phosphorusLevel: 50,
      potassiumLevel: 50,
      pHLevel: 7,
      location: "Bengaluru",
    },
  });

  const onSubmit = async (data: CropRecommendationFormValues) => {
    setIsLoading(true);
    setRecommendations(null);
    try {
      const result = await recommendCrops({ ...data, language: languageName });
      setRecommendations(result);
    } catch (error) {
      console.error("Error recommending crops:", error);
      toast({
        variant: "destructive",
        title: t('cropRecommendation.toast.failure.title'),
        description: t('cropRecommendation.toast.failure.description'),
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-3">
      <Card className="md:col-span-1">
        <CardHeader>
          <CardTitle>{t('cropRecommendation.form.title')}</CardTitle>
          <CardDescription>
            {t('cropRecommendation.form.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="location"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t('cropRecommendation.form.location.label')}</FormLabel>
                    <FormControl>
                        <Input placeholder={t('cropRecommendation.form.location.placeholder')} {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
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
              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Wand2 className="mr-2 h-4 w-4" />
                )}
                {t('cropRecommendation.form.submit')}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
      
      <div className="md:col-span-2">
        {isLoading ? (
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(2)].map((_, i) => (
              <Card key={i}>
                  <CardHeader>
                      <div className="flex items-center gap-4">
                        <Loader2 className="h-10 w-10 animate-spin text-muted" />
                        <div className="w-full space-y-2">
                          <div className="animate-pulse bg-muted rounded-md h-6 w-2/3"></div>
                          <div className="animate-pulse bg-muted rounded-md h-4 w-1/3"></div>
                        </div>
                      </div>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-2">
                      <div className="animate-pulse bg-muted rounded-md h-4 w-full"></div>
                      <div className="animate-pulse bg-muted rounded-md h-4 w-5/6"></div>
                  </CardContent>
              </Card>
            ))}
          </div>
        ) : recommendations ? (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold tracking-tight font-headline">{t('cropRecommendation.results.title')}</h2>
              <p className="text-muted-foreground">{t('cropRecommendation.results.description', {location: form.getValues("location")})}</p>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              {recommendations.recommendations.map((rec) => (
                <Card key={rec.cropName}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <Image src={`https://picsum.photos/seed/${rec.cropName}/100/100`} alt={rec.cropName} width={64} height={64} className="rounded-lg" />
                      <div>
                        <CardTitle>{rec.cropName}</CardTitle>
                        <CardDescription className="flex items-center gap-1"><DollarSign className="h-4 w-4"/> {t('cropRecommendation.results.marketValue')}: {rec.estimatedMarketValue}</CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Separator className="my-2" />
                    <p className="text-sm text-muted-foreground">{rec.reasoning}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-border text-center p-8">
              <Leaf className="h-16 w-16 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold">{t('cropRecommendation.placeholder.title')}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{t('cropRecommendation.placeholder.description')}</p>
          </div>
        )}
      </div>
    </div>
  );
}

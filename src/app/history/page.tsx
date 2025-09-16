
"use client";

import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { db } from '@/lib/firebase';
import { collection, query, where, getDocs, orderBy, Timestamp } from 'firebase/firestore';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Skeleton } from '@/components/ui/skeleton';
import { format } from 'date-fns';
import { Leaf } from 'lucide-react';
import type { SoilAnalysisOutput } from '@/ai/flows/soil-analysis-recommendation';
import { useLanguage } from '@/hooks/use-language';

interface SoilAnalysisRecord {
  id: string;
  createdAt: Timestamp;
  inputs: {
    cropType: string;
    nitrogenLevel: number;
    organicMatterContent: number;
    pHLevel: number;
    phosphorusLevel: number;
    potassiumLevel: number;
    soilType: string;
  };
  results: SoilAnalysisOutput;
}

export default function HistoryPage() {
  const { user, loading: authLoading } = useAuth();
  const [history, setHistory] = useState<SoilAnalysisRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    if (!user) {
      if (!authLoading) {
        setLoading(false);
      }
      return;
    }

    const fetchHistory = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "soilAnalyses"),
          where("userId", "==", user.uid),
          orderBy("createdAt", "desc")
        );
        const querySnapshot = await getDocs(q);
        const historyData = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as SoilAnalysisRecord[];
        setHistory(historyData);
      } catch (error) {
        console.error("Error fetching history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [user, authLoading]);

  if (loading || authLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-10 w-1/3" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-48" />
          ))}
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="text-center">
        <h2 className="text-2xl font-bold">{t('history.signIn.title')}</h2>
        <p className="text-muted-foreground">{t('history.signIn.description')}</p>
      </div>
    );
  }

  if (history.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed border-border text-center p-8 mt-8">
        <Leaf className="h-16 w-16 text-muted-foreground/50" />
        <h3 className="mt-4 text-lg font-semibold">{t('history.noHistory.title')}</h3>
        <p className="mt-2 text-sm text-muted-foreground">{t('history.noHistory.description')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t('history.title')}</h1>
        <p className="text-muted-foreground">{t('history.description')}</p>
      </div>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {history.map((record) => (
          <Card key={record.id}>
            <CardHeader>
              <CardTitle>{t('history.card.title', { cropType: record.inputs.cropType })}</CardTitle>
              <CardDescription>
                {record.createdAt ? t('history.card.savedOn', { date: format(record.createdAt.toDate(), "PPP") }) : 'Date not available'}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Accordion type="single" collapsible className="w-full">
                <AccordionItem value="results">
                  <AccordionTrigger>{t('history.card.viewResults')}</AccordionTrigger>
                  <AccordionContent className="space-y-4 pt-2">
                    <div>
                      <h4 className="font-semibold">{t('history.card.soilAnalysis')}</h4>
                      <p className="text-sm text-muted-foreground">{record.results.soilAnalysis}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('history.card.fertilizer')}</h4>
                      <p className="text-sm text-muted-foreground">{record.results.fertilizerRecommendation}</p>
                    </div>
                    <div>
                      <h4 className="font-semibold">{t('history.card.treatment')}</h4>
                      <p className="text-sm text-muted-foreground">{record.results.treatmentRecommendation}</p>
                    </div>
                  </AccordionContent>
                </AccordionItem>
                <AccordionItem value="inputs">
                  <AccordionTrigger>{t('history.card.viewInputs')}</AccordionTrigger>
                  <AccordionContent className="space-y-2 pt-2 text-sm">
                    <p><span className="font-semibold">{t('history.card.soilType')}:</span> {record.inputs.soilType}</p>
                    <p><span className="font-semibold">{t('history.card.nitrogen')}:</span> {record.inputs.nitrogenLevel} ppm</p>
                    <p><span className="font-semibold">{t('history.card.phosphorus')}:</span> {record.inputs.phosphorusLevel} ppm</p>
                    <p><span className="font-semibold">{t('history.card.potassium')}:</span> {record.inputs.potassiumLevel} ppm</p>
                    <p><span className="font-semibold">{t('history.card.ph')}:</span> {record.inputs.pHLevel}</p>
                    <p><span className="font-semibold">{t('history.card.organicMatter')}:</span> {record.inputs.organicMatterContent}%</p>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

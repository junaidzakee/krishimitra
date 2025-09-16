"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { HeartPulse } from "lucide-react";
import { useLanguage } from "@/hooks/use-language";

export default function PlaceholderPage() {
  const { t } = useLanguage();

  return (
    <div className="flex flex-col items-center justify-center h-full rounded-lg border-2 border-dashed text-center p-8">
      <HeartPulse className="h-16 w-16 text-muted-foreground/50" />
      <h3 className="mt-4 text-lg font-semibold">{t('breadcrumbs.farmhealth')}</h3>
      <p className="mt-2 text-sm text-muted-foreground">This page is under construction.</p>
    </div>
  );
}

"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getFarmHealthData } from "@/lib/demo-data";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertTriangle, MapPin, ShieldCheck, TestTube2, Wind, Leaf } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/hooks/use-language";

export default function FarmHealthPage() {
  const { t } = useLanguage();
  const farmHealthData = getFarmHealthData(t);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'good':
      case 'healthy':
        return 'bg-green-500';
      case 'moderate':
      case 'warning':
        return 'bg-yellow-500';
      case 'poor':
      case 'critical':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  const getRiskVariant = (risk: string) => {
    switch (risk.toLowerCase()) {
      case 'low':
        return 'default';
      case 'medium':
        return 'secondary';
      case 'high':
        return 'destructive';
      default:
        return 'outline';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t('breadcrumbs.farmhealth')}</h1>
        <p className="text-muted-foreground">{t('farmHealth.description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="lg:col-span-1 flex flex-col items-center justify-center text-center p-6">
           <div className="relative size-32">
            <svg className="size-full" width="36" height="36" viewBox="0 0 36 36" xmlns="http://www.w3.org/2000/svg">
              <circle cx="18" cy="18" r="16" fill="none" className="stroke-current text-gray-200 dark:text-gray-700" strokeWidth="2"></circle>
              <circle
                cx="18" cy="18" r="16" fill="none"
                className="stroke-current text-primary"
                strokeWidth="2"
                strokeDasharray={`${farmHealthData.overallScore * 100}, 100`}
                strokeLinecap="round"
                transform="rotate(-90 18 18)"
              ></circle>
            </svg>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-4xl font-bold text-primary">{Math.round(farmHealthData.overallScore * 100)}%</span>
            </div>
          </div>
          <CardTitle className="mt-4">{t('farmHealth.overallScore.title')}</CardTitle>
          <CardDescription>{t('farmHealth.overallScore.description')}</CardDescription>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('farmHealth.soilQuality.title')}</CardTitle>
            <TestTube2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmHealthData.soilQuality.status}</div>
            <p className="text-xs text-muted-foreground">pH: {farmHealthData.soilQuality.ph}, N: {farmHealthData.soilQuality.nitrogen}ppm</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('farmHealth.cropVigor.title')}</CardTitle>
            <Leaf className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
             <div className="text-2xl font-bold">{farmHealthData.cropVigor.status}</div>
            <p className="text-xs text-muted-foreground">NDVI: {farmHealthData.cropVigor.ndvi}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('farmHealth.pestRisk.title')}</CardTitle>
            <ShieldCheck className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{farmHealthData.pestDiseaseRisk.status}</div>
            <p className="text-xs text-muted-foreground">{t('farmHealth.pestRisk.next7days')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('farmHealth.fieldStatus.title')}</CardTitle>
            <CardDescription>{t('farmHealth.fieldStatus.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {farmHealthData.fieldStatus.map((field) => (
              <div key={field.id} className="flex items-center">
                <div className="flex items-center gap-3 flex-1">
                    <div className={`h-2.5 w-2.5 rounded-full ${getStatusColor(field.status)}`}></div>
                    <p className="font-medium">{field.name}</p>
                    <Badge variant="outline">{field.crop}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{field.status}</p>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('farmHealth.alerts.title')}</CardTitle>
            <CardDescription>{t('farmHealth.alerts.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {farmHealthData.activeAlerts.map((alert) => (
              <Alert key={alert.id} variant={getRiskVariant(alert.risk)}>
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>{alert.title}</AlertTitle>
                <AlertDescription>{alert.description}</AlertDescription>
              </Alert>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

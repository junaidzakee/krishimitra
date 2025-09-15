
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { CloudSun, Leaf, LineChart, TestTube2, ArrowRight } from "lucide-react";
import { getCurrentWeather } from "@/lib/demo-data";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";

export default function Dashboard() {
  const currentWeather = getCurrentWeather();
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);


  const features = [
    {
      title: t('dashboard.features.soilAnalysis.title'),
      description: t('dashboard.features.soilAnalysis.description'),
      icon: <TestTube2 className="w-8 h-8 text-primary" />,
      link: "/soil-analysis",
    },
    {
      title: t('dashboard.features.diseaseDetection.title'),
      description: t('dashboard.features.diseaseDetection.description'),
      icon: <Leaf className="w-8 h-8 text-primary" />,
      link: "/disease-detection",
    },
    {
      title: t('dashboard.features.weather.title'),
      description: t('dashboard.features.weather.description'),
      icon: <CloudSun className="w-8 h-8 text-primary" />,
      link: "/weather",
    },
    {
      title: t('dashboard.features.marketPrices.title'),
      description: t('dashboard.features.marketPrices.description'),
      icon: <LineChart className="w-8 h-8 text-primary" />,
      link: "/market-prices",
    },
  ];

  if (loading || !user) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-10 w-1/2" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div>
          <Skeleton className="h-10 w-1/4 mb-4" />
          <div className="grid gap-6 md:grid-cols-2">
            {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-40" />)}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t('dashboard.welcome')}</h1>
        <p className="text-muted-foreground">{t('dashboard.description')}</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.currentWeather.title')}</CardTitle>
            <CloudSun className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeather.temperature}°C</div>
            <p className="text-xs text-muted-foreground">{currentWeather.condition}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.nitrogen.title')}</CardTitle>
            <TestTube2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 ppm</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.stats.nitrogen.description')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.wheatPrice.title')}</CardTitle>
            <LineChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹20,750/ton</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.stats.wheatPrice.description')}</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.activeAlerts.title')}</CardTitle>
            <Leaf className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.stats.activeAlerts.description')}</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">{t('dashboard.features.title')}</h2>
        <div className="grid gap-6 mt-4 md:grid-cols-2">
          {features.map((feature) => (
            <Card key={feature.title} className="hover:shadow-lg transition-shadow duration-300">
              <CardHeader className="flex flex-row items-start gap-4">
                <div className="p-3 rounded-full bg-accent">
                  {feature.icon}
                </div>
                <div>
                  <CardTitle>{feature.title}</CardTitle>
                  <p className="text-sm text-muted-foreground pt-1">{feature.description}</p>
                </div>
              </CardHeader>
              <CardContent>
                <Link href={feature.link} passHref>
                  <Button variant="outline" className="w-full">
                    {t('dashboard.features.goTo')} {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

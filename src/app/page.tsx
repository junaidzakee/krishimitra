
"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { Leaf, LineChart, TestTube2, Heart, DollarSign, Camera, Activity, FileText } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/hooks/use-language";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const { t } = useLanguage();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/sign-in');
    }
  }, [user, loading, router]);
  
  const quickActions = [
    {
      title: t('dashboard.quickActions.diseaseScanner.title'),
      description: t('dashboard.quickActions.diseaseScanner.description'),
      icon: <Camera className="w-6 h-6 text-primary" />,
      link: "/disease-detection",
    },
    {
      title: t('dashboard.quickActions.soilAnalysis.title'),
      description: t('dashboard.quickActions.soilAnalysis.description'),
      icon: <TestTube2 className="w-6 h-6 text-primary" />,
      link: "/soil-analysis",
    },
     {
      title: t('dashboard.quickActions.cropRecommendation.title'),
      description: t('dashboard.quickActions.cropRecommendation.description'),
      icon: <Leaf className="w-6 h-6 text-primary" />,
      link: "/crop-recommendation",
    },
    {
      title: t('dashboard.quickActions.marketPrices.title'),
      description: t('dashboard.quickActions.marketPrices.description'),
      icon: <LineChart className="w-6 h-6 text-primary" />,
      link: "/market-prices",
    },
  ];

  if (loading || !user) {
    return (
      <div className="flex flex-col gap-8">
        <Skeleton className="h-28 w-full" />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {[...Array(4)].map((_, i) => <Skeleton key={i} className="h-28" />)}
        </div>
        <div className="grid gap-6 md:grid-cols-2">
            <Skeleton className="h-64" />
            <Skeleton className="h-64" />
        </div>
      </div>
    );
  }

  const displayName = user?.displayName || user?.email?.split('@')[0] || 'User';

  return (
    <div className="flex flex-col gap-8">
      <Card className="bg-gradient-to-r from-accent/50 to-accent/80 border-primary/20">
        <CardContent className="p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="space-y-1">
                <h1 className="text-2xl font-bold tracking-tight font-headline text-accent-foreground">
                    {t('dashboard.welcome', { name: displayName })}
                </h1>
                <p className="text-muted-foreground">{t('dashboard.description')}</p>
            </div>
            <Button asChild className="bg-primary hover:bg-primary/90 text-primary-foreground">
                <Link href="/disease-detection">
                    <Camera className="mr-2 h-4 w-4" />
                    {t('dashboard.quickScan')}
                </Link>
            </Button>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.cropsMonitored.title')}</CardTitle>
            <Leaf className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">24</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.stats.cropsMonitored.description')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.diseaseDetections.title')}</CardTitle>
            <FileText className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.stats.diseaseDetections.description')}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.farmHealth.title')}</CardTitle>
            <Heart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">85%</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.stats.farmHealth.description')}</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">{t('dashboard.stats.marketRevenue.title')}</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₹45,230</div>
            <p className="text-xs text-muted-foreground">{t('dashboard.stats.marketRevenue.description')}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
         <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.quickActions.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('dashboard.quickActions.description')}</p>
            </CardHeader>
            <CardContent className="space-y-4">
                {quickActions.map((action) => (
                   <Link href={action.link} passHref key={action.title}>
                    <div className="flex items-center gap-4 p-3 rounded-lg hover:bg-accent/50 cursor-pointer transition-colors">
                        <div className="p-3 rounded-lg bg-accent">
                            {action.icon}
                        </div>
                        <div>
                            <h4 className="font-semibold">{action.title}</h4>
                            <p className="text-sm text-muted-foreground">{action.description}</p>
                        </div>
                    </div>
                   </Link>
                ))}
            </CardContent>
         </Card>
        <Card>
            <CardHeader>
                <CardTitle>{t('dashboard.activityFeed.title')}</CardTitle>
                <p className="text-sm text-muted-foreground">{t('dashboard.activityFeed.description')}</p>
            </CardHeader>
            <CardContent>
                <div className="space-y-6">
                    <div className="flex items-start gap-4">
                         <Avatar className="h-10 w-10 border-2 border-primary/50">
                            <AvatarFallback><FileText/></AvatarFallback>
                        </Avatar>
                        <div>
                            <p className="font-medium">{t('dashboard.activityFeed.disease.text')}</p>
                            <p className="text-sm text-muted-foreground">{t('dashboard.activityFeed.disease.timestamp')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback><TestTube2/></AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{t('dashboard.activityFeed.soil.text')}</p>
                            <p className="text-sm text-muted-foreground">{t('dashboard.activityFeed.soil.timestamp')}</p>
                        </div>
                    </div>
                     <div className="flex items-start gap-4">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback><LineChart/></AvatarFallback>
                        </Avatar>
                        <div>
                            <p>{t('dashboard.activityFeed.market.text')}</p>
                            <p className="text-sm text-muted-foreground">{t('dashboard.activityFeed.market.timestamp')}</p>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
      </div>
    </div>
  );
}

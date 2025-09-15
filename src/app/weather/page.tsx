"use client";

import React, { useState, useEffect } from 'react';
import { getDemoWeather } from "@/lib/demo-data";
import type { WeatherForecast } from "@/types";
import { getWeatherAdvice, WeatherAdviceOutput } from "@/ai/flows/weather-advisor";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import {
  Cloud,
  CloudLightning,
  CloudRain,
  CloudSnow,
  Sun,
  Wind,
  Droplets,
  Sprout,
  SprayCan,
  CalendarDays,
  Thermometer,
} from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';
import { useLanguage } from '@/hooks/use-language';

function getWeatherIcon(condition: string, size: "sm" | "md" | "lg" = "md") {
  const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };
  const className = `${sizes[size]} text-muted-foreground`;

  if (condition.toLowerCase().includes("cloud")) return <Cloud className={className} />;
  if (condition.toLowerCase().includes("rain")) return <CloudRain className={className} />;
  if (condition.toLowerCase().includes("thunder")) return <CloudLightning className={className} />;
  if (condition.toLowerCase().includes("snow")) return <CloudSnow className={className} />;
  return <Sun className={className} />;
}

export default function WeatherPage() {
  const [weatherData, setWeatherData] = useState<WeatherForecast | null>(null);
  const [advice, setAdvice] = useState<WeatherAdviceOutput | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(true);
  const { t } = useLanguage();

  useEffect(() => {
    const data = getDemoWeather();
    setWeatherData(data);

    const fetchAdvice = async () => {
      try {
        setLoadingAdvice(true);
        const result = await getWeatherAdvice({ weather: data });
        setAdvice(result);
      } catch (error) {
        console.error("Failed to get weather advice:", error);
      } finally {
        setLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, []);

  const adviceCards = advice ? [
    {
      title: t('weather.advisory.planting.title'),
      icon: <Sprout className="h-6 w-6 text-primary" />,
      content: advice.plantingAndHarvesting,
    },
    {
      title: t('weather.advisory.irrigation.title'),
      icon: <Droplets className="h-6 w-6 text-primary" />,
      content: advice.irrigation,
    },
    {
      title: t('weather.advisory.pest.title'),
      icon: <SprayCan className="h-6 w-6 text-primary" />,
      content: advice.pestAndDisease,
    },
    {
      title: t('weather.advisory.planning.title'),
      icon: <CalendarDays className="h-6 w-6 text-primary" />,
      content: advice.dailyWorkPlanning,
    },
  ] : [];

  if (!weatherData) {
    return (
      <div className="space-y-8">
        <Skeleton className="h-48 w-full" />
        <Skeleton className="h-32 w-full" />
        <Skeleton className="h-64 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            {t('weather.current.title', { location: weatherData.current.location })}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {getWeatherIcon(weatherData.current.condition, "lg")}
            <div>
              <div className="text-6xl font-bold">{weatherData.current.temperature}°C</div>
              <div className="text-lg text-muted-foreground">{weatherData.current.condition}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{weatherData.current.humidity}%</p>
                <p className="text-sm text-muted-foreground">{t('weather.current.humidity')}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{weatherData.current.windSpeed} km/h</p>
                <p className="text-sm text-muted-foreground">{t('weather.current.wind')}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4 font-headline">{t('weather.advisory.title')}</h2>
        <div className="grid gap-6 md:grid-cols-2">
          {loadingAdvice ? (
            [...Array(4)].map((_, i) => (
              <Card key={i}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <Skeleton className="h-10 w-10 rounded-full" />
                  <Skeleton className="h-6 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-5/6" />
                </CardContent>
              </Card>
            ))
          ) : (
            adviceCards.map((item) => (
              <Card key={item.title}>
                <CardHeader className="flex flex-row items-center gap-4">
                  <div className="p-2 bg-accent rounded-full">{item.icon}</div>
                  <CardTitle className="text-lg">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground">{item.content}</p>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-headline">{t('weather.hourly.title')}</h2>
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {weatherData.hourly.map((hour) => (
              <Card key={hour.time} className="flex-shrink-0 w-[120px]">
                <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                  <div className="font-semibold">{hour.time}</div>
                  {getWeatherIcon(hour.condition, "sm")}
                  <div className="text-lg font-bold">{hour.temperature}°C</div>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>

      <div>
        <h2 className="text-xl font-bold mb-4 font-headline">{t('weather.daily.title')}</h2>
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {weatherData.daily.map((day) => (
              <Card key={day.day} className="flex-shrink-0 w-[150px]">
                <CardContent className="flex flex-col items-center justify-center p-4 gap-2">
                  <div className="font-semibold">{day.day}</div>
                  {getWeatherIcon(day.condition, "sm")}
                   <p className="text-sm text-muted-foreground">{day.condition}</p>
                  <p className="font-semibold">
                    {day.high}° / {day.low}°
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
          <ScrollBar orientation="horizontal" />
        </ScrollArea>
      </div>
    </div>
  );
}

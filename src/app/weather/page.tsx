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
  Spray,
  CalendarDays,
  Thermometer,
} from "lucide-react";
import { Skeleton } from '@/components/ui/skeleton';

function getWeatherIcon(condition: string, size = "md") {
  const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };
  const className = `${sizes[size]} text-muted-foreground`;

  if (condition.toLowerCase().includes("cloud")) return <Cloud className={className} />;
  if (condition.toLowerCase().includes("rain")) return <CloudRain className={className} />;
  if (condition.toLowerCase().includes("thunder")) return <CloudLightning className={className} />;
  if (condition.toLowerCase().includes("snow")) return <CloudSnow className={className} />;
  return <Sun className={className} />;
}

export default function WeatherPage() {
  const [weather] = useState<WeatherForecast>(getDemoWeather());
  const [advice, setAdvice] = useState<WeatherAdviceOutput | null>(null);
  const [loadingAdvice, setLoadingAdvice] = useState(true);

  useEffect(() => {
    const fetchAdvice = async () => {
      try {
        setLoadingAdvice(true);
        const result = await getWeatherAdvice({ weather });
        setAdvice(result);
      } catch (error) {
        console.error("Failed to get weather advice:", error);
      } finally {
        setLoadingAdvice(false);
      }
    };
    fetchAdvice();
  }, [weather]);

  const adviceCards = [
    {
      title: "Planting & Harvesting",
      icon: <Sprout className="h-6 w-6 text-primary" />,
      content: advice?.plantingAndHarvesting,
    },
    {
      title: "Irrigation Scheduling",
      icon: <Droplets className="h-6 w-6 text-primary" />,
      content: advice?.irrigation,
    },
    {
      title: "Pest & Disease Prevention",
      icon: <Spray className="h-6 w-6 text-primary" />,
      content: advice?.pestAndDisease,
    },
    {
      title: "Daily Work Planning",
      icon: <CalendarDays className="h-6 w-6 text-primary" />,
      content: advice?.dailyWorkPlanning,
    },
  ];

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline">
            Current Weather in {weather.current.location}
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="flex items-center gap-6">
            {getWeatherIcon(weather.current.condition, "lg")}
            <div>
              <div className="text-6xl font-bold">{weather.current.temperature}°C</div>
              <div className="text-lg text-muted-foreground">{weather.current.condition}</div>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-x-8 gap-y-4 text-center md:text-left">
            <div className="flex items-center gap-2">
              <Droplets className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{weather.current.humidity}%</p>
                <p className="text-sm text-muted-foreground">Humidity</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Wind className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold">{weather.current.windSpeed} km/h</p>
                <p className="text-sm text-muted-foreground">Wind</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div>
        <h2 className="text-xl font-bold mb-4 font-headline">AI-Powered Agricultural Advisory</h2>
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
        <h2 className="text-xl font-bold mb-4 font-headline">Hourly Forecast</h2>
        <ScrollArea>
          <div className="flex space-x-4 pb-4">
            {weather.hourly.map((hour) => (
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
        <h2 className="text-xl font-bold mb-4 font-headline">7-Day Forecast</h2>
        <div className="space-y-2">
          {weather.daily.map((day) => (
            <Card key={day.day}>
              <CardContent className="flex items-center justify-between p-3">
                <p className="font-semibold w-1/4">{day.day}</p>
                <div className="w-1/4 flex justify-center">{getWeatherIcon(day.condition, "sm")}</div>
                <p className="text-muted-foreground w-1/4 text-center">{day.condition}</p>
                <p className="font-semibold w-1/4 text-right">
                  {day.high}° / {day.low}°
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}

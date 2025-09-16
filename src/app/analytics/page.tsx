
"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Line, LineChart, Legend } from "recharts";
import { getAnalyticsData } from "@/lib/demo-data";
import { useLanguage } from "@/hooks/use-language";

const farmHealthConfig = {
  score: { label: "Health Score", color: "hsl(var(--chart-1))" },
} satisfies ChartConfig;

const diseaseConfig = {
  detections: { label: "Detections", color: "hsl(var(--chart-2))" },
} satisfies ChartConfig;

const soilNutrientsConfig = {
  nitrogen: { label: "Nitrogen (ppm)", color: "hsl(var(--chart-1))" },
  phosphorus: { label: "Phosphorus (ppm)", color: "hsl(var(--chart-2))" },
  potassium: { label: "Potassium (ppm)", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig;

const CustomLegend = (props: any) => {
    const { t } = useLanguage();
    return <p className="text-xs text-muted-foreground">{t('analytics.soilNutrients.legend')}</p>;
}

export default function AnalyticsPage() {
  const { t } = useLanguage();
  const analyticsData = getAnalyticsData(t);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">{t('breadcrumbs.analytics')}</h1>
        <p className="text-muted-foreground">{t('analytics.description')}</p>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>{t('analytics.farmHealth.title')}</CardTitle>
          <CardDescription>{t('analytics.farmHealth.description')}</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={farmHealthConfig} className="min-h-[300px] w-full">
            <LineChart data={analyticsData.farmHealthHistory} margin={{ left: 12, right: 12 }}>
              <CartesianGrid vertical={false} />
              <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
              <YAxis tickLine={false} axisLine={false} tickMargin={8} domain={[60, 100]} tickFormatter={(value) => `${value}%`} />
              <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
              <Line dataKey="score" type="monotone" stroke="var(--color-score)" strokeWidth={2} dot={false} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.diseaseDetections.title')}</CardTitle>
            <CardDescription>{t('analytics.diseaseDetections.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={diseaseConfig} className="min-h-[300px] w-full">
              <BarChart data={analyticsData.diseaseDetections} margin={{ left: -20}}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="crop" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dot" />} />
                <Bar dataKey="detections" fill="var(--color-detections)" radius={8} />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t('analytics.soilNutrients.title')}</CardTitle>
            <CardDescription>{t('analytics.soilNutrients.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={soilNutrientsConfig} className="min-h-[300px] w-full">
              <LineChart data={analyticsData.soilNutrientHistory} margin={{ left: -20}}>
                <CartesianGrid vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tickMargin={8} />
                <YAxis tickLine={false} axisLine={false} tickMargin={8} />
                <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
                <Legend content={<CustomLegend />} />
                <Line dataKey="nitrogen" type="monotone" stroke="var(--color-nitrogen)" strokeWidth={2} dot={false} />
                <Line dataKey="phosphorus" type="monotone" stroke="var(--color-phosphorus)" strokeWidth={2} dot={false} />
                <Line dataKey="potassium" type="monotone" stroke="var(--color-potassium)" strokeWidth={2} dot={false} />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

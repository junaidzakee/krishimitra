"use client";

import * as React from "react";
import { getMarketPrices } from "@/lib/demo-data";
import type { MarketPrice } from "@/types";
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

const chartConfig = {
  price: {
    label: "Price ($)",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig;

function MarketPriceChart({ data }: { data: MarketPrice["data"] }) {
  return (
    <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
      <AreaChart
        accessibilityLayer
        data={data}
        margin={{
          left: 12,
          right: 12,
          top: 12,
        }}
      >
        <CartesianGrid vertical={false} />
        <XAxis
          dataKey="date"
          tickLine={false}
          axisLine={false}
          tickMargin={8}
          tickFormatter={(value) => format(new Date(value), "MMM d")}
        />
        <YAxis
            tickLine={false}
            axisLine={false}
            tickMargin={8}
            domain={['dataMin - 20', 'dataMax + 20']}
            tickFormatter={(value) => `$${value}`}
        />
        <ChartTooltip
          cursor={false}
          content={
            <ChartTooltipContent
              labelFormatter={(value) => format(new Date(value), "eeee, MMM d, yyyy")}
              indicator="dot"
            />
          }
        />
        <Area
          dataKey="price"
          type="natural"
          fill="var(--color-price)"
          fillOpacity={0.4}
          stroke="var(--color-price)"
          stackId="a"
        />
      </AreaChart>
    </ChartContainer>
  );
}

export default function MarketPricesPage() {
  const marketPrices = getMarketPrices();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Market Prices</h1>
        <p className="text-muted-foreground">Historical price data for major crops.</p>
      </div>
      <Tabs defaultValue={marketPrices[0].crop} className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4">
          {marketPrices.map((cropData) => (
            <TabsTrigger key={cropData.crop} value={cropData.crop}>
              {cropData.crop}
            </TabsTrigger>
          ))}
        </TabsList>
        {marketPrices.map((cropData) => (
          <TabsContent key={cropData.crop} value={cropData.crop}>
            <Card>
              <CardHeader>
                <CardTitle>{cropData.crop} Price Trend</CardTitle>
                <CardDescription>Last 30 days price per ton.</CardDescription>
              </CardHeader>
              <CardContent>
                <MarketPriceChart data={cropData.data} />
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
}

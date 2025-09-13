import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from 'next/link';
import { CloudSun, Leaf, LineChart, TestTube2, ArrowRight } from "lucide-react";
import { getCurrentWeather } from "@/lib/demo-data";

export default function Dashboard() {
  const currentWeather = getCurrentWeather();

  const features = [
    {
      title: "Soil Analysis",
      description: "Get fertilizer and treatment advice based on soil parameters.",
      icon: <TestTube2 className="w-8 h-8 text-primary" />,
      link: "/soil-analysis",
    },
    {
      title: "Disease Detection",
      description: "Upload a plant image to detect diseases using AI.",
      icon: <Leaf className="w-8 h-8 text-primary" />,
      link: "/disease-detection",
    },
    {
      title: "Weather Forecast",
      description: "View local weather information and alerts.",
      icon: <CloudSun className="w-8 h-8 text-primary" />,
      link: "/weather",
    },
    {
      title: "Market Prices",
      description: "Visualize historical market prices for key crops.",
      icon: <LineChart className="w-8 h-8 text-primary" />,
      link: "/market-prices",
    },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight font-headline">Welcome to AgriAssist</h1>
        <p className="text-muted-foreground">Your smart crop advisory platform.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Current Weather</CardTitle>
            <CloudSun className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{currentWeather.temperature}°C</div>
            <p className="text-xs text-muted-foreground">{currentWeather.condition}</p>
          </CardContent>
        </Card>
        {/* Placeholder cards for other quick stats */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Nitrogen Level</CardTitle>
            <TestTube2 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12 ppm</div>
            <p className="text-xs text-muted-foreground">From last soil test</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Wheat Price</CardTitle>
            <LineChart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$250/ton</div>
            <p className="text-xs text-muted-foreground">+2.1% from last month</p>
          </CardContent>
        </Card>
         <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium">Active Alerts</CardTitle>
            <Leaf className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1</div>
            <p className="text-xs text-muted-foreground">Potential rust detection</p>
          </CardContent>
        </Card>
      </div>

      <div>
        <h2 className="text-2xl font-bold tracking-tight font-headline">Features</h2>
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
                    Go to {feature.title} <ArrowRight className="ml-2 h-4 w-4" />
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

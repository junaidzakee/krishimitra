import { getDemoWeather } from "@/lib/demo-data";
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
} from "lucide-react";

function getWeatherIcon(condition: string, size = "md") {
  const sizes = { sm: "h-6 w-6", md: "h-10 w-10", lg: "h-16 w-16" };
  const className = `${sizes[size]} text-muted-foreground`;

  if (condition.includes("Cloud")) return <Cloud className={className} />;
  if (condition.includes("Rain")) return <CloudRain className={className} />;
  if (condition.includes("Thunder")) return <CloudLightning className={className} />;
  if (condition.includes("Snow")) return <CloudSnow className={className} />;
  return <Sun className={className} />;
}

export default function WeatherPage() {
  const weather = getDemoWeather();

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

import { getDemoWeather } from "@/lib/demo-data";
import type { WeatherForecast } from "@/types";

// In a real application, this would fetch from a weather API
export async function getWeatherForLocation(location: string): Promise<WeatherForecast> {
    console.log(`Fetching weather for ${location}...`);
    // For now, we'll return the same demo weather regardless of location.
    return getDemoWeather();
}

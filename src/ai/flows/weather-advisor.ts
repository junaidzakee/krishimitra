'use server';

/**
 * @fileOverview An agricultural advisor AI that provides recommendations based on weather data.
 *
 * - getWeatherAdvice - A function that provides farming advice.
 * - WeatherAdviceInput - The input type for the getWeatherAdvice function.
 * - WeatherAdviceOutput - The return type for the getWeatherAdvice function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';
import type { WeatherForecast } from '@/types';

const WeatherAdviceInputSchema = z.object({
  weather: z.object({
    current: z.object({
      temperature: z.number(),
      condition: z.string(),
      location: z.string(),
      humidity: z.number(),
      windSpeed: z.number(),
    }),
    hourly: z.array(z.object({
      time: z.string(),
      temperature: z.number(),
      condition: z.string(),
    })),
    daily: z.array(z.object({
      day: z.string(),
      high: z.number(),
      low: z.number(),
      condition: z.string(),
    })),
  })
});
export type WeatherAdviceInput = z.infer<typeof WeatherAdviceInputSchema>;


const WeatherAdviceOutputSchema = z.object({
  plantingAndHarvesting: z.string().describe('Advice on optimal times for planting and harvesting based on the forecast.'),
  irrigation: z.string().describe('Recommendations for irrigation scheduling, considering upcoming rain.'),
  pestAndDisease: z.string().describe('Alerts and prevention tips for pests and diseases based on weather conditions.'),
  dailyWorkPlanning: z.string().describe('Suggestions for planning daily farm tasks according to the weather.'),
});
export type WeatherAdviceOutput = z.infer<typeof WeatherAdviceOutputSchema>;


export async function getWeatherAdvice(input: WeatherAdviceInput): Promise<WeatherAdviceOutput> {
  return weatherAdvisorFlow(input);
}

const prompt = ai.definePrompt({
  name: 'weatherAdvisorPrompt',
  input: {schema: WeatherAdviceInputSchema},
  output: {schema: WeatherAdviceOutputSchema},
  prompt: `You are an expert agricultural advisor. Based on the provided weather forecast data, generate concise and actionable recommendations for a farmer.

Weather Data:
Current: {{weather.current.temperature}}°C, {{weather.current.condition}}, Humidity: {{weather.current.humidity}}%, Wind: {{weather.current.windSpeed}} km/h
Hourly Forecast:
{{#each weather.hourly}}
- {{time}}: {{temperature}}°C, {{condition}}
{{/each}}
Daily Forecast:
{{#each weather.daily}}
- {{day}}: High {{high}}°C / Low {{low}}°C, {{condition}}
{{/each}}

Provide clear and practical advice for the following categories:
1.  **Planting and Harvest:** When is it a good or bad time to plant or harvest? Mention specific days or times to avoid.
2.  **Irrigation Scheduling:** Advise on watering schedules. Should the farmer irrigate less or more based on predicted rainfall?
3.  **Pest & Disease Prevention:** What pest or disease risks are elevated by these weather conditions (e.g., fungal growth in high humidity)? Suggest preventative actions.
4.  **Daily Work Planning:** What kind of farm activities are suitable for the upcoming days? (e.g., "Good day for indoor tasks," "Ideal for spraying pesticides due to low wind").`,
});

const weatherAdvisorFlow = ai.defineFlow(
  {
    name: 'weatherAdvisorFlow',
    inputSchema: WeatherAdviceInputSchema,
    outputSchema: WeatherAdviceOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

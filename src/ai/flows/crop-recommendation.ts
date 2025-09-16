'use server';

/**
 * @fileOverview An AI agent that recommends crops based on soil and weather conditions.
 *
 * - recommendCrops - A function that provides crop recommendations.
 * - RecommendCropsInput - The input type for the recommendCrops function.
 * - RecommendCropsOutput - The return type for the recommendCrops function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { getWeatherForLocation } from '@/services/weather-service';

const RecommendCropsInputSchema = z.object({
  soilType: z.string().describe('The type of soil, such as sandy, silty, clay, or loamy.'),
  nitrogenLevel: z.number().describe('The nitrogen level in the soil, in ppm (parts per million).'),
  phosphorusLevel: z.number().describe('The phosphorus level in the soil, in ppm (parts per million).'),
  potassiumLevel: z.number().describe('The potassium level in the soil, in ppm (parts per million).'),
  pHLevel: z.number().describe('The pH level of the soil, on a scale of 0 to 14.'),
  location: z.string().describe('The geographical location (e.g., city, region) for which to get weather data.'),
  language: z.string().describe('The language for the response (e.g., "English", "Hindi").'),
});
export type RecommendCropsInput = z.infer<typeof RecommendCropsInputSchema>;

const RecommendCropsOutputSchema = z.object({
  recommendations: z.array(z.object({
    cropName: z.string().describe('The name of the recommended crop.'),
    reasoning: z.string().describe('A detailed explanation of why this crop is suitable.'),
    estimatedMarketValue: z.string().describe('The estimated market value or potential profitability of the crop.'),
  })).describe('A list of up to three crop recommendations.'),
});
export type RecommendCropsOutput = z.infer<typeof RecommendCropsOutputSchema>;

export async function recommendCrops(input: RecommendCropsInput): Promise<RecommendCropsOutput> {
  return recommendCropsFlow(input);
}

const getWeatherTool = ai.defineTool(
    {
      name: 'getWeatherForLocation',
      description: 'Retrieves the current and forecasted weather for a given location.',
      inputSchema: z.object({
        location: z.string().describe('The location to get the weather for.'),
      }),
      outputSchema: z.any(),
    },
    async ({ location }) => {
      return await getWeatherForLocation(location);
    }
  );


const recommendCropsFlow = ai.defineFlow(
  {
    name: 'recommendCropsFlow',
    inputSchema: RecommendCropsInputSchema,
    outputSchema: RecommendCropsOutputSchema,
    tools: [getWeatherTool]
  },
  async (input) => {
    const prompt = `You are an expert agricultural advisor. Based on the provided soil and weather data, recommend the top 2-3 most suitable and profitable crops to grow. For each crop, provide a clear reason and an estimated market value.
      Your response must be entirely in the following language: ${input.language}.

      Soil Data:
      - Soil Type: ${input.soilType}
      - Nitrogen: ${input.nitrogenLevel} ppm
      - Phosphorus: ${input.phosphorusLevel} ppm
      - Potassium: ${input.potassiumLevel} ppm
      - pH: ${input.pHLevel}
      
      Use the available tool to fetch the weather forecast for the location: ${input.location}.
      
      Your analysis should consider all these factors to make holistic recommendations.
      Present the output as a structured list of recommendations.`;
      
    const llmResponse = await ai.generate({
        prompt: prompt,
        model: 'googleai/gemini-2.5-flash',
        output: {
            schema: RecommendCropsOutputSchema
        },
        tools: [getWeatherTool],
    });
    
    return llmResponse.output!;
  }
);

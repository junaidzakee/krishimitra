'use server';

/**
 * @fileOverview A soil analysis and fertilizer recommendation AI agent.
 *
 * - analyzeSoilAndRecommend - A function that handles the soil analysis and recommendation process.
 * - SoilAnalysisInput - The input type for the analyzeSoilAndRecommend function.
 * - SoilAnalysisOutput - The return type for the analyzeSoilAndRecommend function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SoilAnalysisInputSchema = z.object({
  soilType: z
    .string()
    .describe('The type of soil, such as sandy, silty, clay, or loamy.'),
  nitrogenLevel: z
    .number()
    .describe('The nitrogen level in the soil, in ppm (parts per million).'),
  phosphorusLevel: z
    .number()
    .describe('The phosphorus level in the soil, in ppm (parts per million).'),
  potassiumLevel: z
    .number()
    .describe('The potassium level in the soil, in ppm (parts per million).'),
  pHLevel: z
    .number()
    .describe('The pH level of the soil, on a scale of 0 to 14.'),
  organicMatterContent: z
    .number()
    .describe('The organic matter content in the soil, as a percentage.'),
  cropType: z
    .string()
    .describe('The type of crop to be grown in the soil.'),
});
export type SoilAnalysisInput = z.infer<typeof SoilAnalysisInputSchema>;

const SoilAnalysisOutputSchema = z.object({
  soilAnalysis: z.string().describe('An analysis of the soil conditions.'),
  fertilizerRecommendation: z
    .string()
    .describe('A recommendation for fertilizers to use.'),
  treatmentRecommendation: z
    .string()
    .describe('A recommendation for soil treatments.'),
});
export type SoilAnalysisOutput = z.infer<typeof SoilAnalysisOutputSchema>;

export async function analyzeSoilAndRecommend(
  input: SoilAnalysisInput
): Promise<SoilAnalysisOutput> {
  return analyzeSoilAndRecommendFlow(input);
}

const prompt = ai.definePrompt({
  name: 'soilAnalysisPrompt',
  input: {schema: SoilAnalysisInputSchema},
  output: {schema: SoilAnalysisOutputSchema},
  prompt: `You are an expert agricultural advisor. A farmer will provide you with their soil parameters and the crop they intend to grow.

You will provide an analysis of the soil conditions, a recommendation for fertilizers to use, and a recommendation for soil treatments.

Here are the soil parameters:

Soil Type: {{{soilType}}}
Nitrogen Level: {{{nitrogenLevel}}} ppm
Phosphorus Level: {{{phosphorusLevel}}} ppm
Potassium Level: {{{potassiumLevel}}} ppm
pH Level: {{{pHLevel}}}
Organic Matter Content: {{{organicMatterContent}}}%
Crop Type: {{{cropType}}}`,
});

const analyzeSoilAndRecommendFlow = ai.defineFlow(
  {
    name: 'analyzeSoilAndRecommendFlow',
    inputSchema: SoilAnalysisInputSchema,
    outputSchema: SoilAnalysisOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

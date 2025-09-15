'use server';

/**
 * @fileOverview A plant disease detection AI agent.
 *
 * - detectDisease - A function that handles the disease detection process.
 * - DetectDiseaseInput - The input type for the detectDisease function.
 * - DetectDiseaseOutput - The return type for the detectDisease function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const DetectDiseaseInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of a plant leaf, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type DetectDiseaseInput = z.infer<typeof DetectDiseaseInputSchema>;

const DetectDiseaseOutputSchema = z.object({
  disease: z.string().describe('The identified disease, or "Healthy" if no disease is detected.'),
  confidence: z.number().describe('The confidence level of the disease detection (0-1).'),
  isHealthy: z.boolean().describe('Whether the plant appears to be healthy.'),
  diseaseInfo: z.string().describe('A brief description of the identified disease.'),
  fertilizerRecommendation: z.string().describe('Recommended fertilizers or soil amendments to help the plant recover or stay healthy.'),
  preventionTips: z.string().describe('Brief, necessary precautions to manage or prevent the disease.'),
});
export type DetectDiseaseOutput = z.infer<typeof DetectDiseaseOutputSchema>;

export async function detectDisease(input: DetectDiseaseInput): Promise<DetectDiseaseOutput> {
  return detectDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDiseasePrompt',
  input: {schema: DetectDiseaseInputSchema},
  output: {schema: DetectDiseaseOutputSchema},
  prompt: `You are an AI agricultural assistant that analyzes images of plant leaves to detect diseases.

  Analyze the following image and identify any potential diseases.

  Image: {{media url=photoDataUri}}

  - If a disease is detected, identify it, provide a confidence score, and set isHealthy to false.
  - If the plant appears healthy, set the disease to "Healthy", confidence to 1, and isHealthy to true.
  - Provide a brief description of the disease (or a note about general plant health if healthy).
  - Recommend fertilizers or soil amendments to help the plant.
  - Provide short, actionable prevention tips or precautions.

  Keep all text descriptions and recommendations concise and to the point.
`,
});

const detectDiseaseFlow = ai.defineFlow(
  {
    name: 'detectDiseaseFlow',
    inputSchema: DetectDiseaseInputSchema,
    outputSchema: DetectDiseaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

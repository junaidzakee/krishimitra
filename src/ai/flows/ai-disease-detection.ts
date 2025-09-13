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
  disease: z.string().describe('The identified disease, or null if none detected.'),
  confidence: z.number().describe('The confidence level of the disease detection (0-1).'),
  expertNeeded: z.boolean().describe('Whether an expert opinion is recommended.'),
});
export type DetectDiseaseOutput = z.infer<typeof DetectDiseaseOutputSchema>;

export async function detectDisease(input: DetectDiseaseInput): Promise<DetectDiseaseOutput> {
  return detectDiseaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'detectDiseasePrompt',
  input: {schema: DetectDiseaseInputSchema},
  output: {schema: DetectDiseaseOutputSchema},
  prompt: `You are an AI assistant that analyzes images of plant leaves to detect diseases.

  Analyze the following image and identify any potential diseases.

  Image: {{media url=photoDataUri}}

  Respond with the identified disease, a confidence level (0-1), and whether an expert opinion is recommended.
  If no disease is detected, set disease to null, confidence to 0, and expertNeeded to false.
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

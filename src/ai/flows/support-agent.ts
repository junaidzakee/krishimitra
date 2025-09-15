'use server';

/**
 * @fileOverview An AI support agent for the KrishiMitra application.
 *
 * - getSupportResponse - A function that provides an AI-generated response to a user's support query.
 * - SupportInput - The input type for the getSupportResponse function.
 * - SupportOutput - The return type for the getSupportResponse function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';

const SupportInputSchema = z.object({
  message: z.string().describe("The user's support query."),
  language: z.string().describe("The language for the response (e.g., 'English', 'Hindi')."),
  faq: z.string().describe("The stringified JSON of the FAQ section to provide context.")
});
export type SupportInput = z.infer<typeof SupportInputSchema>;

const SupportOutputSchema = z.object({
  response: z.string().describe('The AI-generated support response.'),
});
export type SupportOutput = z.infer<typeof SupportOutputSchema>;

export async function getSupportResponse(input: SupportInput): Promise<SupportOutput> {
  return supportAgentFlow(input);
}

const prompt = ai.definePrompt({
  name: 'supportAgentPrompt',
  input: { schema: SupportInputSchema },
  output: { schema: SupportOutputSchema },
  prompt: `You are a helpful and friendly support agent for the KrishiMitra application.
Your response must be entirely in the following language: {{{language}}}.

The user has the following question:
"{{{message}}}"

Use the following Frequently Asked Questions (FAQs) as your primary knowledge base to answer the user's question.
If the user's question is not covered in the FAQs, provide a helpful response and suggest they provide more details.

Here are the FAQs:
{{{faq}}}

Keep your response concise, friendly, and to the point.
`,
});

const supportAgentFlow = ai.defineFlow(
  {
    name: 'supportAgentFlow',
    inputSchema: SupportInputSchema,
    outputSchema: SupportOutputSchema,
  },
  async (input) => {
    const { output } = await prompt(input);
    return {
      response: output!.response,
    };
  }
);

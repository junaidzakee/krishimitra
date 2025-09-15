'use server';

/**
 * @fileOverview A conversational chat AI agent.
 *
 * - chat - A function that handles the chat conversation.
 * - ChatInput - The input type for the chat function.
 * - ChatOutput - The return type for the chat function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'genkit';
import { MessageData } from 'genkit/experimental/ai';

const ChatInputSchema = z.object({
  history: z.array(
    z.object({
      role: z.enum(['user', 'model']),
      content: z.array(z.object({ text: z.string() })),
    })
  ),
  message: z.string().describe('The latest message from the user.'),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const ChatOutputSchema = z.object({
  message: z.string().describe('The response from the model.'),
});
export type ChatOutput = z.infer<typeof ChatOutputSchema>;

export async function chat(input: ChatInput): Promise<ChatOutput> {
  return chatFlow(input);
}

const chatFlow = ai.defineFlow(
  {
    name: 'chatFlow',
    inputSchema: ChatInputSchema,
    outputSchema: ChatOutputSchema,
  },
  async (input) => {
    const { history, message } = input;
    
    // Ensure the history is in the correct format for the model
    const modelHistory: MessageData[] = history.map(h => ({
        role: h.role,
        content: h.content,
    }));

    const llmResponse = await ai.generate({
      prompt: message,
      history: modelHistory,
    });
    
    return {
      message: llmResponse.text,
    };
  }
);

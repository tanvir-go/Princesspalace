'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating homepage content for the SteakHouse Clone application.
 *
 * It includes:
 * - generateHomepageContent: An asynchronous function to generate homepage content.
 * - GenerateHomepageContentInput: The input type for the generateHomepageContent function.
 * - GenerateHomepageContentOutput: The output type for the generateHomepageContent function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateHomepageContentInputSchema = z.object({
  prompt: z.string().describe('A prompt describing the desired homepage content.'),
});

export type GenerateHomepageContentInput = z.infer<typeof GenerateHomepageContentInputSchema>;

const GenerateHomepageContentOutputSchema = z.object({
  content: z.string().describe('The generated homepage content.'),
});

export type GenerateHomepageContentOutput = z.infer<typeof GenerateHomepageContentOutputSchema>;

/**
 * Generates homepage content based on a given prompt.
 * @param input - The input containing the prompt for generating homepage content.
 * @returns The generated homepage content.
 */
export async function generateHomepageContent(input: GenerateHomepageContentInput): Promise<GenerateHomepageContentOutput> {
  return generateHomepageContentFlow(input);
}

const generateHomepageContentPrompt = ai.definePrompt({
  name: 'generateHomepageContentPrompt',
  input: {schema: GenerateHomepageContentInputSchema},
  output: {schema: GenerateHomepageContentOutputSchema},
  prompt: `You are a marketing expert for a steakhouse. Generate engaging content for the homepage of the SteakHouse Clone application based on the following description: {{{prompt}}}. The generated content should be well-structured, visually appealing, and designed to attract customers.`,
});

const generateHomepageContentFlow = ai.defineFlow(
  {
    name: 'generateHomepageContentFlow',
    inputSchema: GenerateHomepageContentInputSchema,
    outputSchema: GenerateHomepageContentOutputSchema,
  },
  async input => {
    const {output} = await generateHomepageContentPrompt(input);
    return output!;
  }
);

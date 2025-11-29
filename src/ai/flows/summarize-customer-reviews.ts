'use server';
/**
 * @fileOverview A Genkit flow for summarizing customer reviews.
 *
 * - summarizeCustomerReviews - A function that summarizes customer reviews using GenAI.
 * - SummarizeCustomerReviewsInput - The input type for the summarizeCustomerReviews function.
 * - SummarizeCustomerReviewsOutput - The return type for the summarizeCustomerReviews function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const SummarizeCustomerReviewsInputSchema = z.object({
  reviews: z
    .string()
    .describe('A list of customer reviews to be summarized.'),
});
export type SummarizeCustomerReviewsInput = z.infer<
  typeof SummarizeCustomerReviewsInputSchema
>;

const SummarizeCustomerReviewsOutputSchema = z.object({
  summary: z.string().describe('A summary of the customer reviews.'),
});
export type SummarizeCustomerReviewsOutput = z.infer<
  typeof SummarizeCustomerReviewsOutputSchema
>;

export async function summarizeCustomerReviews(
  input: SummarizeCustomerReviewsInput
): Promise<SummarizeCustomerReviewsOutput> {
  return summarizeCustomerReviewsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'summarizeCustomerReviewsPrompt',
  input: {schema: SummarizeCustomerReviewsInputSchema},
  output: {schema: SummarizeCustomerReviewsOutputSchema},
  prompt: `You are an AI assistant that summarizes customer reviews.

  Summarize the following customer reviews, highlighting key positive and negative feedback. Be concise and focus on the main themes and sentiments expressed in the reviews. 

  Reviews: {{{reviews}}}`,
});

const summarizeCustomerReviewsFlow = ai.defineFlow(
  {
    name: 'summarizeCustomerReviewsFlow',
    inputSchema: SummarizeCustomerReviewsInputSchema,
    outputSchema: SummarizeCustomerReviewsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);

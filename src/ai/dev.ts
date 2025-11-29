import { config } from 'dotenv';
config();

import '@/ai/flows/summarize-customer-reviews.ts';
import '@/ai/flows/moderate-customer-reviews.ts';
import '@/ai/flows/generate-homepage-content.ts';
import { NextResponse } from 'next/server';
import { llmProvider } from '@/src/lib/llmProviders';

export async function GET() {
  return NextResponse.json({ provider: llmProvider() });
}

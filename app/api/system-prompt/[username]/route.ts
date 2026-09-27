import { NextResponse } from 'next/server';
import { requireAuth } from '@/src/lib/auth';
import { getSystemPrompt } from '@/src/lib/datastore';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const auth = requireAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { username } = await params;
    return NextResponse.json({ systemPrompt: getSystemPrompt(username) || null });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

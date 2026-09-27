import { NextResponse } from 'next/server';
import { requireAuth } from '@/src/lib/auth';
import { setSystemPrompt } from '@/src/lib/datastore';

export async function PUT(req: Request) {
  const auth = requireAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { username, systemPrompt } = await req.json();
    if (!username || typeof systemPrompt !== 'string') {
      return NextResponse.json({ error: 'Missing username or systemPrompt' }, { status: 400 });
    }

    setSystemPrompt(username, systemPrompt);
    return NextResponse.json({ message: 'System prompt updated' });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

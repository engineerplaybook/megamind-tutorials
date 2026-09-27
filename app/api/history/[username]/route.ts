import { NextResponse } from 'next/server';
import { requireAuth } from '@/src/lib/auth';
import { getConversation, updateConversation } from '@/src/lib/datastore';

export async function GET(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const auth = requireAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { username } = await params;
    const history = getConversation(username);
    return NextResponse.json({ history });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

// Start fresh: wipe the stored conversation so the next turn begins with no history.
export async function DELETE(req: Request, { params }: { params: Promise<{ username: string }> }) {
  const auth = requireAuth(req);
  if (!auth.ok) return NextResponse.json({ error: auth.error }, { status: auth.status });

  try {
    const { username } = await params;
    updateConversation(username, []);
    return NextResponse.json({ message: 'History cleared', username });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

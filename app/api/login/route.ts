import { NextResponse } from 'next/server';
import { checkCredentials, signToken } from '@/src/lib/auth';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();
    const result = checkCredentials(email, password);
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: result.status });
    }
    const token = signToken(email);
    return NextResponse.json({ message: 'Logged in', token });
  } catch {
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

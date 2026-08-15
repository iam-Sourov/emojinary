import { getSessionUser } from '@/lib/auth';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ user: null });
    }
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Session retrieval error:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

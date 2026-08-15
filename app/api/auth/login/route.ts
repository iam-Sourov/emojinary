import { db } from '@/lib/db';
import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password are required' }, { status: 400 });
    }

    const supabase = await createClient();

    // Authenticate user via Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (authError) {
      return NextResponse.json({ error: authError.message }, { status: 401 });
    }

    if (!authData.user) {
      return NextResponse.json({ error: 'Failed to resolve user session' }, { status: 500 });
    }

    // Retrieve corresponding user profile from PostgreSQL
    let user = await db.user.findUnique({
      where: { id: authData.user.id },
    });

    // Fallback: If user is authenticated in Supabase but profile record doesn't exist in Prisma yet
    if (!user) {
      user = await db.user.create({
        data: {
          id: authData.user.id,
          email: authData.user.email || email,
          name: authData.user.user_metadata?.name || null,
        },
      });
    }

    return NextResponse.json({
      id: user.id,
      email: user.email,
      name: user.name,
    });
  } catch (error) {
    console.error('Login error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

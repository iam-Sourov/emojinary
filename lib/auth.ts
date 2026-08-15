import { db } from './db';
import { createClient } from './supabase/server';

export async function getSessionUser() {
  try {
    const supabase = await createClient();
    const { data: { user: supabaseUser } } = await supabase.auth.getUser();

    if (!supabaseUser) return null;

    // Fetch the matched user record in PostgreSQL database
    const user = await db.user.findUnique({
      where: { id: supabaseUser.id },
      select: { id: true, email: true, name: true, createdAt: true },
    });

    return user;
  } catch (error) {
    console.error('Error retrieving session user:', error);
    return null;
  }
}

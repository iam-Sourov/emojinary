import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

interface MigratingMessage {
  sender: 'user' | 'ai';
  text: string;
  timestamp?: number;
}

interface MigratingConversation {
  emojis: string[];
  title: string;
  messages: MigratingMessage[];
  createdAt?: number;
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { conversations } = (await req.json()) as { conversations: MigratingConversation[] };

    if (!conversations || !Array.isArray(conversations)) {
      return NextResponse.json({ error: 'Invalid migration data' }, { status: 400 });
    }

    // Insert all guest conversations into PostgreSQL
    for (const conv of conversations) {
      if (!conv.emojis || !conv.title || !conv.messages) continue;

      await db.conversation.create({
        data: {
          userId: user.id,
          emojis: conv.emojis.join(','),
          title: conv.title,
          createdAt: conv.createdAt ? new Date(conv.createdAt) : new Date(),
          messages: {
            create: conv.messages.map((msg) => ({
              sender: msg.sender,
              text: msg.text,
              timestamp: msg.timestamp ? new Date(msg.timestamp) : new Date(),
            })),
          },
        },
      });
    }

    // Retrieve and return all updated user conversations
    const updatedConversations = await db.conversation.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    const formatted = updatedConversations.map((conv) => ({
      ...conv,
      emojis: conv.emojis.split(','),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Migration error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

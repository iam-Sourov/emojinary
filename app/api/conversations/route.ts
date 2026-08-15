import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const conversations = await db.conversation.findMany({
      where: { userId: user.id },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    // Format emojis back to array
    const formatted = conversations.map((conv) => ({
      ...conv,
      emojis: conv.emojis.split(','),
    }));

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Fetch conversations error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { emojis, title, initialStory } = await req.json();

    if (!emojis || !Array.isArray(emojis) || !title || !initialStory) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const conversation = await db.conversation.create({
      data: {
        userId: user.id,
        emojis: emojis.join(','),
        title,
        messages: {
          create: {
            sender: 'ai',
            text: initialStory,
          },
        },
      },
      include: {
        messages: {
          orderBy: { timestamp: 'asc' },
        },
      },
    });

    const formatted = {
      ...conversation,
      emojis: conversation.emojis.split(','),
    };

    return NextResponse.json(formatted);
  } catch (error) {
    console.error('Create conversation error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

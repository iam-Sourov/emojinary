import { getSessionUser } from '@/lib/auth';
import { db } from '@/lib/db';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}

export async function POST(req: Request) {
  try {
    const { conversationId, emojis, history, prompt } = (await req.json()) as {
      conversationId?: string;
      emojis: string[];
      history: ChatMessage[];
      prompt: string;
    };

    if (!emojis || !Array.isArray(emojis) || !prompt) {
      return NextResponse.json({ error: 'Emojis and prompt are required' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const user = await getSessionUser();

    // If logged in and conversationId is provided, authorize and save the user message immediately
    if (conversationId && user) {
      const conversation = await db.conversation.findUnique({
        where: { id: conversationId },
      });

      if (!conversation) {
        return NextResponse.json({ error: 'Conversation not found' }, { status: 404 });
      }

      if (conversation.userId !== user.id) {
        return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
      }

      // Save user prompt
      await db.message.create({
        data: {
          conversationId,
          sender: 'user',
          text: prompt,
        },
      });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    // Align with story route model
    const model = genAI.getGenerativeModel({ model: 'gemini-3.1-flash-lite' });

    // Format history for Gemini chat: alternates user -> model, starting with user
    const geminiHistory = [
      {
        role: 'user',
        parts: [{ text: `Let's write a story based on these emojis: ${emojis.join(' ')}` }],
      },
    ];

    if (history && history.length > 0) {
      // The first message is the initial story (AI)
      geminiHistory.push({
        role: 'model',
        parts: [{ text: history[0].text }],
      });

      // Map the rest of the history
      for (let i = 1; i < history.length; i++) {
        const msg = history[i];
        geminiHistory.push({
          role: msg.sender === 'user' ? 'user' : 'model',
          parts: [{ text: msg.text }],
        });
      }
    }

    const chat = model.startChat({
      history: geminiHistory,
    });

    const result = await chat.sendMessageStream(prompt);

    let fullResponseText = '';

    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of result.stream) {
            const chunkText = chunk.text();
            fullResponseText += chunkText;
            controller.enqueue(new TextEncoder().encode(chunkText));
          }

          // Save final AI message when stream completes
          if (conversationId && user) {
            await db.message.create({
              data: {
                conversationId,
                sender: 'ai',
                text: fullResponseText,
              },
            });
          }

          controller.close();
        } catch (error) {
          console.error('Streaming error:', error);
          controller.error(error);
        }
      },
    });

    return new NextResponse(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

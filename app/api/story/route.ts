import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const { emojis } = await req.json();

    if (!emojis || !Array.isArray(emojis)) {
      return NextResponse.json({ error: 'Invalid emojis provided' }, { status: 400 });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: 'GEMINI_API_KEY is not set' }, { status: 500 });
    }

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash-lite' });

    const prompt = `Write a creative, engaging, and short story (approx 100-150 words) based on these emojis: ${emojis.join(' ')}. The story should be funny, thrilling and dramatic. The Story should have characters and character should have names related to the given emojis. Make sure you use the emojis in the story.`;

    const result = await model.generateContentStream(prompt);

    const stream = new ReadableStream({
      async start(controller) {
        for await (const chunk of result.stream) {
          const chunkText = chunk.text();
          controller.enqueue(new TextEncoder().encode(chunkText));
        }
        controller.close();
      },
    });

    return new NextResponse(stream, {
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
    });
  } catch (error: unknown) {
    console.error('Error generating story:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to generate story';
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}

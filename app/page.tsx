'use client';

import { EmojiHero } from '@/components/emoji-hero';
import { EmojiPicker } from '@/components/emoji-picker';
import { StoryStage } from '@/components/story-stage';
import { useStoryGeneration } from '@/hooks/use-story-generation';
import { useState } from 'react';

export default function Page() {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const { story, isGenerating, generateStory } = useStoryGeneration();

  const handleEmojiSelect = (emoji: string) => {
    if (selectedEmojis.length >= 4) return;
    setSelectedEmojis((prev) => [...prev, emoji]);
  };

  const handleRemoveEmoji = (index: number) => {
    setSelectedEmojis((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <main className="h-screen flex flex-col overflow-y-auto bg-background selection:bg-primary/20">
      <div className="container mx-auto py-8 flex flex-col items-center gap-8 min-h-full">
        <EmojiHero />

        <StoryStage
          selectedEmojis={selectedEmojis}
          onRemoveEmoji={handleRemoveEmoji}
          onGenerate={async () => {
            const success = await generateStory(selectedEmojis);
            if (success) {
              setSelectedEmojis([]);
            }
          }}
          isGenerating={isGenerating}
        />

        {(story || isGenerating) && (
          <div className="w-full max-w-xl mx-auto p-6 bg-card/50 backdrop-blur-sm rounded-2xl border shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h3 className="text-xl font-semibold mb-3">Once upon a time...</h3>
            <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {story}
              {isGenerating && <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />}
            </p>
          </div>
        )}

        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          selectedEmojis={selectedEmojis}
          disabled={selectedEmojis.length >= 4}
        />
      </div>
    </main>
  );
}

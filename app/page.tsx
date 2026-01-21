'use client';

import { EmojiHero } from '@/components/emoji-hero';
import { EmojiPicker } from '@/components/emoji-picker';
import { StoryStage } from '@/components/story-stage';
import { useState } from 'react';

export default function Page() {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    if (selectedEmojis.length >= 4) return;
    setSelectedEmojis((prev) => [...prev, emoji]);
  };

  const handleRemoveEmoji = (index: number) => {
    setSelectedEmojis((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
    alert('Story generation would happen here! (Connect backend)');
  };

  return (
    <main className="h-screen overflow-hidden flex flex-col">
      <div className="container mx-auto py-4 flex-1 flex flex-col justify-center gap-4">
        <EmojiHero />

        <StoryStage
          selectedEmojis={selectedEmojis}
          onRemoveEmoji={handleRemoveEmoji}
          onGenerate={handleGenerate}
          isGenerating={isGenerating}
        />

        <EmojiPicker
          onEmojiSelect={handleEmojiSelect}
          selectedEmojis={selectedEmojis}
          disabled={selectedEmojis.length >= 4}
        />
      </div>
    </main>
  );
}

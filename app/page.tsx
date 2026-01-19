'use client';

import ChatBox from '@/components/ChatBox';
import { Badge } from '@/components/ui/badge';
import { useState } from 'react';

export default function Page() {
  const [selectedString, setSelectedString] = useState('');

  const EMOJI = {
    Mix: ['🚀 🌑 👽', '🤠 🐎 🌵', '🕵️‍♀️ 💎 🏛️', '🦖 🌋 🍖', '🧞‍♂️ 🕌 🐫'],
    Fantasy: ['🧙‍♂️ 🐉 🏰', '🧚‍♀️ 🍄 ✨', '🧜‍♀️ 🐚 🌊', '🦄 🌈 🏰', '🤴 👸 🐸'],
    'Sci-Fi': ['🤖 🦾 🔋', '🚀 🪐 👾', '🧬 🧪 🔬', '🛸 👽 📡', '👩‍🚀 🛰️ 🌠'],
    Horror: ['🧟 ⚰️ 🩸', '🧛 🦇 🏰', '👻 🏚️ ⛓️', '🔪 🩸 😱', '🤡 🎈 🎪'],
    Nature: ['🦁 🦓 🌅', '🦈 🌊 🐠', '🦋 🌸 🍄', '🦅 🏔️ 🌲', '🐨 🌿 😴'],
  };

  const handleEmojiClick = (emoji: string) => {
    setSelectedString((prev) => {
      const currentEmojis = prev.split(' ');
      if (currentEmojis.includes(emoji)) {
        return prev;
      }
      if (prev.length === 0) return emoji;
      return prev + ' ' + emoji;
    });
  };
  return (
    <div className="container mx-auto flex flex-col items-center p-4 min-h-screen">
      <div className="mt-12 mb-8 text-5xl font-bold text-center tracking-tight">Welcome to Emojinary!</div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-5xl mb-10">
        {Object.entries(EMOJI).map(([category, emojis]) => (
          <div
            key={category}
            className="bg-card border rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">{category}</h2>
              <Badge variant="secondary" className="text-xs">
                Select one
              </Badge>
            </div>

            <div className="flex flex-wrap gap-2">
              {emojis.map((emoji, index) => (
                <button
                  key={index}
                  onClick={() => handleEmojiClick(emoji)}
                  className={`
                    p-2 text-2xl rounded-md transition-all hover:scale-110 active:scale-95
                    ${selectedString === emoji ? 'ring ring-primary' : 'bg-muted/50 hover:bg-muted'}
                  `}
                  title="Click to select"
                >
                  {emoji}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div id="chatbox-container" className="w-full sticky bottom-0 bg-background/80 py-4 border-t">
        <ChatBox inputValue={selectedString} setInputValue={setSelectedString} />
      </div>
    </div>
  );
};

'use client';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { Check, Smile, Sparkles } from 'lucide-react';
import * as React from 'react';

// Category configuration with representative emoji icons
const CATEGORY_CONFIG = {
  Action: { icon: '🚀', label: 'Action' },
  Nature: { icon: '🌿', label: 'Nature' },
  Objects: { icon: '💎', label: 'Objects' },
  SciFi: { icon: '👽', label: 'Sci-Fi' },
  Fantasy: { icon: '🐉', label: 'Fantasy' },
} as const;

export const EMOJI_CATEGORIES = {
  Action: ['🚀', '🤠', '🕵️', '🦖', '🧞', '🦸', '🦹', '🎭', '🧛', '🧟'],
  Nature: ['🌵', '🌸', '🌊', '🍄', '🌪️', '🦁', '🐺', '🦈', '🦅', '🦋'],
  Objects: ['💎', '🏛️', '🍖', '🗡️', '📜', '🗝️', '🧬', '🔮', '⚱️', '⚰️'],
  SciFi: ['👽', '🤖', '🛸', '🚀', '🌌', '🪐', '⭐', '🔭', '🛰️', '☄️'],
  Fantasy: ['🐉', '🧙', '🧚', '🏰', '👑', '🛡️', '⚔️', '🦄', '🔥', '❄️'],
};

interface EmojiPickerProps {
  onEmojiSelect: (emoji: string) => void;
  selectedEmojis?: string[];
  disabled?: boolean;
}

export function EmojiPicker({ onEmojiSelect, selectedEmojis = [], disabled }: EmojiPickerProps) {
  const [activeCategory, setActiveCategory] = React.useState<keyof typeof EMOJI_CATEGORIES>('Action');
  const [customEmoji, setCustomEmoji] = React.useState('');
  const [recentlyClicked, setRecentlyClicked] = React.useState<string | null>(null);

  const isEmojiSelected = (emoji: string) => selectedEmojis.includes(emoji);

  const handleEmojiClick = (emoji: string) => {
    if (disabled || isEmojiSelected(emoji)) return;
    setRecentlyClicked(emoji);
    onEmojiSelect(emoji);
    setTimeout(() => setRecentlyClicked(null), 300);
  };

  const handleAddCustom = () => {
    if (!customEmoji.trim()) {
      return;
    }
    [...customEmoji.trim()]
      .filter((char) => /\p{Extended_Pictographic}/u.test(char) && !selectedEmojis.includes(char))
      .slice(0, 4 - selectedEmojis.length)
      .forEach(onEmojiSelect);
    setCustomEmoji('');
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Category Tabs - Emoji-based navigation */}
      <div className="flex items-center justify-center gap-1 p-1 bg-secondary/40 backdrop-blur-md rounded-2xl border border-border/20 shadow-sm">
        {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              disabled={disabled}
              className={cn(
                'relative flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium transition-all duration-200 select-none cursor-pointer',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                isActive
                  ? 'bg-card text-foreground shadow-sm scale-105'
                  : 'hover:bg-background/30 text-muted-foreground hover:text-foreground',
                disabled && 'opacity-40 cursor-not-allowed pointer-events-none'
              )}
            >
              <span className="text-base leading-none">{CATEGORY_CONFIG[category].icon}</span>
              <span className="hidden sm:inline text-xs font-semibold">{CATEGORY_CONFIG[category].label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-category-indicator"
                  className="absolute inset-0 bg-card rounded-xl shadow-xs -z-10 border border-border/20"
                  transition={{ type: 'spring', bounce: 0.15, duration: 0.35 }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* Emoji Grid */}
      <div className="relative overflow-hidden rounded-xl bg-linear-to-b from-secondary/20 to-transparent border border-border/50 p-2.5">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeCategory}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="grid grid-cols-5 sm:grid-cols-10 gap-0.5"
          >
            {EMOJI_CATEGORIES[activeCategory].map((emoji, idx) => {
              const alreadySelected = isEmojiSelected(emoji);
              return (
                <motion.button
                  key={`${activeCategory}-${idx}`}
                  onClick={() => handleEmojiClick(emoji)}
                  disabled={disabled || alreadySelected}
                  whileHover={{ scale: alreadySelected ? 1 : 1.18 }}
                  whileTap={{ scale: alreadySelected ? 1 : 0.9 }}
                  className={cn(
                    'group relative flex items-center justify-center aspect-square text-2xl sm:text-3xl rounded-xl cursor-pointer select-none',
                    'transition-all duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40',
                    alreadySelected
                      ? 'opacity-35 cursor-not-allowed bg-muted/20'
                      : 'hover:bg-primary/5 active:bg-primary/10',
                    disabled && !alreadySelected && 'opacity-40 cursor-not-allowed pointer-events-none',
                    recentlyClicked === emoji && 'bg-primary/15'
                  )}
                >
                  <span className="relative">
                    {emoji}
                    {alreadySelected && (
                      <span className="absolute -top-1 -right-1 flex items-center justify-center w-3.5 h-3.5 bg-primary text-primary-foreground rounded-full border border-card shadow-sm">
                        <Check className="w-2 h-2 stroke-[3]" />
                      </span>
                    )}
                    {recentlyClicked === emoji && (
                      <motion.span
                        initial={{ scale: 0.6, opacity: 1 }}
                        animate={{ scale: 2.2, opacity: 0 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Sparkles className="w-5 h-5 text-primary animate-pulse" />
                      </motion.span>
                    )}
                  </span>
                </motion.button>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Custom Emoji Input */}
      <div className="flex items-center gap-2.5 px-3.5 py-2 bg-secondary/30 rounded-2xl border border-border/55 shadow-inner focus-within:border-primary/50 focus-within:ring-2 focus-within:ring-primary/10 transition-all duration-300">
        <Smile className="w-4 h-4 text-muted-foreground/75 shrink-0" />
        <Input
          placeholder="Type or paste any emoji..."
          value={customEmoji}
          onChange={(e) => setCustomEmoji(e.target.value)}
          className="flex-1 bg-transparent border-0 h-7 text-sm px-0 focus-visible:ring-0 focus-visible:ring-offset-0 placeholder:text-muted-foreground/45 font-medium"
          onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
          disabled={disabled}
        />
        <Button
          variant="secondary"
          size="sm"
          onClick={handleAddCustom}
          disabled={!customEmoji.trim() || disabled || isEmojiSelected(customEmoji.trim())}
          className="h-7 px-3 text-xs font-semibold shrink-0 rounded-lg hover:bg-primary hover:text-primary-foreground cursor-pointer transition-all duration-200"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

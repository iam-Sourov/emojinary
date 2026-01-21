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
    if (customEmoji.trim()) {
      onEmojiSelect(customEmoji.trim());
      setCustomEmoji('');
    }
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-3">
      {/* Category Tabs - Emoji-based navigation */}
      <div className="flex items-center justify-center gap-0.5 p-1 bg-secondary/40 backdrop-blur-sm rounded-xl">
        {(Object.keys(CATEGORY_CONFIG) as Array<keyof typeof CATEGORY_CONFIG>).map((category) => {
          const isActive = activeCategory === category;
          return (
            <button
              key={category}
              onClick={() => setActiveCategory(category)}
              disabled={disabled}
              className={cn(
                'relative flex items-center gap-1 px-2 py-1.5 rounded-lg text-xs font-medium transition-all duration-300',
                'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring',
                isActive
                  ? 'bg-background shadow-sm'
                  : 'hover:bg-background/50 text-muted-foreground hover:text-foreground',
                disabled && 'opacity-50 cursor-not-allowed'
              )}
            >
              <span className="text-base">{CATEGORY_CONFIG[category].icon}</span>
              <span className="hidden sm:inline text-xs">{CATEGORY_CONFIG[category].label}</span>
              {isActive && (
                <motion.div
                  layoutId="active-category-indicator"
                  className="absolute inset-0 bg-background rounded-lg shadow-sm -z-10"
                  transition={{ type: 'spring', bounce: 0.2, duration: 0.4 }}
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
                  className={cn(
                    'group relative flex items-center justify-center aspect-square text-xl sm:text-2xl rounded-lg cursor-pointer',
                    'transition-colors duration-200',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2',
                    alreadySelected
                      ? 'opacity-40 cursor-not-allowed bg-accent/30'
                      : 'hover:bg-accent/80 active:bg-accent',
                    disabled && !alreadySelected && 'opacity-50 cursor-not-allowed pointer-events-none',
                    recentlyClicked === emoji && 'bg-primary/10'
                  )}
                >
                  <span className="relative">
                    {emoji}
                    {alreadySelected && (
                      <span className="absolute -top-0.5 -right-0.5 flex items-center justify-center w-3 h-3 bg-primary text-primary-foreground rounded-full">
                        <Check className="w-2 h-2" />
                      </span>
                    )}
                    {recentlyClicked === emoji && (
                      <motion.span
                        initial={{ scale: 0.5, opacity: 1 }}
                        animate={{ scale: 2, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="absolute inset-0 flex items-center justify-center"
                      >
                        <Sparkles className="w-4 h-4 text-primary" />
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
      <div className="flex items-center gap-2 px-2.5 py-1.5 bg-secondary/30 rounded-lg border border-border/60">
        <Smile className="w-4 h-4 text-muted-foreground shrink-0" />
        <Input
          placeholder="Type or paste any emoji..."
          value={customEmoji}
          onChange={(e) => setCustomEmoji(e.target.value)}
          className="flex-1 bg-transparent border-0 h-7 text-sm px-0 focus-visible:ring-0 placeholder:text-muted-foreground/50"
          onKeyDown={(e) => e.key === 'Enter' && handleAddCustom()}
          disabled={disabled}
        />
        <Button
          variant="ghost"
          size="sm"
          onClick={handleAddCustom}
          disabled={!customEmoji.trim() || disabled || isEmojiSelected(customEmoji.trim())}
          className="h-6 px-2 text-xs font-medium shrink-0"
        >
          Add
        </Button>
      </div>
    </div>
  );
}

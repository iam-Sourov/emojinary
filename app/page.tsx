'use client';

import { EmojiHero } from '@/components/emoji-hero';
import { EmojiPicker } from '@/components/emoji-picker';
import { StoryStage } from '@/components/story-stage';
import { Button } from '@/components/ui/button';
import {
  ResizablePanel,
  ResizablePanelGroup,
  type ImperativePanelHandle,
} from '@/components/ui/resizable';
import { useStoryGeneration } from '@/hooks/use-story-generation';
import { animate, AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

const EMOJI_STORAGE_KEY = 'emojis';

const ANIMATION_DURATION = 4.0;
const ANIMATION_EASE = [0.22, 1, 0.36, 1];

export default function Page() {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false);
  const { story, isGenerating, generateStory } = useStoryGeneration();
  const inputPanelRef = useRef<ImperativePanelHandle>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    if (selectedEmojis.length >= 4) return;
    setSelectedEmojis((prev) => [...prev, emoji]);
  };

  const handleRemoveEmoji = (index: number) => {
    setSelectedEmojis((prev) => prev.filter((_, i) => i !== index));
  };

  const onGenerateClick = async () => {
    if (selectedEmojis.length < 4) {
      toast.warning('Please select 4 emojis to generate a story.');
      return;
    }
    setIsPanelOpen(true);
    const success = await generateStory(selectedEmojis);
    if (success) {
      setSelectedEmojis([]);
    }
  };

  const handleClosePanel = () => {
    setIsPanelOpen(false);
  };

 
 useEffect(() => {
    const panel = inputPanelRef.current;
    
    if (panel) {
      if (isPanelOpen) {
        const controls = animate(100, 35, {
          duration: ANIMATION_DURATION,
          ease: ANIMATION_EASE,
          onUpdate: (value) => panel.resize(value),
        });
        return () => controls.stop();
      } else {
        const currentSize = panel.getSize();
        const controls = animate(currentSize, 100, {
          duration: 1.0, 
          ease: "easeInOut",
          onUpdate: (value) => panel.resize(value),
        });
        return () => controls.stop();
      }
    }
  }, [isPanelOpen]);

  // --- STORAGE ---
  useEffect(() => {
    const saved = localStorage.getItem(EMOJI_STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed)) setSelectedEmojis(parsed);
      } catch (error) {
        console.error('Failed to parse emojis from storage', error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(EMOJI_STORAGE_KEY, JSON.stringify(selectedEmojis));
    }
  }, [selectedEmojis, isLoaded]);

  if (!isLoaded) return null;

  return (
    <main className="h-screen w-full overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        {/* --- LEFT PANEL --- */}
        <ResizablePanel
          ref={inputPanelRef}
          defaultSize={40}
          minSize={25}
          className="flex flex-col"
        >
          <div className="h-full bg-background selection:bg-primary/20">
            <div
              className={`container mx-auto py-8 flex flex-col items-center gap-8 min-h-full transition-all ${isPanelOpen ? 'opacity-40 scale-95 blur-[1px]' : 'opacity-100 scale-100'}`}
              style={{
                transitionDuration: `${ANIMATION_DURATION}s`,
                transitionTimingFunction: 'cubic-bezier(0.22, 1, 0.36, 1)',
              }}
            >
              <EmojiHero />
              <StoryStage
                selectedEmojis={selectedEmojis}
                onRemoveEmoji={handleRemoveEmoji}
                onGenerate={onGenerateClick}
                isGenerating={isGenerating}
              />
              <EmojiPicker
                onEmojiSelect={handleEmojiSelect}
                selectedEmojis={selectedEmojis}
                disabled={selectedEmojis.length >= 4}
              />
            </div>
          </div>
        </ResizablePanel>
        {/* --- RIGHT PANEL --- */}
        <AnimatePresence mode="wait">
          {isPanelOpen && (
            <>
              <ResizablePanel defaultSize={35} minSize={0} className="bg-muted/10">
                <motion.div
                  initial={{ x: '100%', opacity: 1 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: '100%', opacity: 1 }}
                  transition={{
                    duration: ANIMATION_DURATION,
                    ease: ANIMATION_EASE,
                  }}
                  className="h-screen overflow-y-auto p-2 relative"
                >
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleClosePanel}
                    className="absolute right-6 top-6 h-8 w-8 rounded-full z-10 hover:bg-muted"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <div className="min-h-full flex flex-col justify-center py-12">
                    <motion.div
                      initial={{ opacity: 0, y: 30, scale: 0.98 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      transition={{
                        delay: ANIMATION_DURATION * 0.4,
                        duration: 1.0,
                        ease: 'easeOut',
                      }}
                      className="flex-1 flex flex-col max-w-3xl mx-auto w-full rounded-md border shadow-sm p-8 md:p-12"
                    >
                      <div className="mb-8 border-b pb-8">
                        <div className="text-sm text-muted-foreground mb-4 flex items-center gap-2">
                          <span className=" text-primary px-2 py-0.5 rounded text-xs font-semibold">
                            STORY
                          </span>
                          <span>{new Date().toLocaleDateString()}</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-bold tracking-tight text-foreground mb-4">
                          Story {selectedEmojis.slice(0, 3).join('')}...
                        </h2>
                      </div>

                      <div className="prose prose-zinc dark:prose-invert max-w-none mb-8">
                        <p className="text-lg leading-normal text-foreground/90 whitespace-pre-wrap ">
                          {story}
                          {isGenerating && (
                            <span className="inline-block w-1.5 h-5 ml-1 bg-primary animate-pulse align-middle" />
                          )}
                        </p>
                        {!story && isGenerating && (
                          <p className="text-muted-foreground italic animate-pulse">weaving a new tale...</p>
                        )}
                      </div>

                      {!isGenerating && story && (
                        <div className="mt-auto flex items-center gap-4 pt-8 border-t">
                          <Button variant="outline" onClick={handleClosePanel}>
                            Generate Another
                          </Button>
                        </div>
                      )}
                    </motion.div>
                  </div>
                </motion.div>
              </ResizablePanel>
            </>
          )}
        </AnimatePresence>
      </ResizablePanelGroup>
    </main>
  );
}

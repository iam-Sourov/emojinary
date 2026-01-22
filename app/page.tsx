  'use client';

  import { EmojiHero } from '@/components/emoji-hero';
  import { EmojiPicker } from '@/components/emoji-picker';
  import { StoryStage } from '@/components/story-stage';
  import { Button } from '@/components/ui/button';
  import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
    type ImperativePanelHandle,
  } from '@/components/ui/resizable';
  import { useStoryGeneration } from '@/hooks/use-story-generation';
  import { AnimatePresence, motion } from 'framer-motion';
  import { X } from 'lucide-react';
  import { useEffect, useRef, useState } from 'react';

  import { toast } from 'sonner';

  export default function Page() {
    const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);

    const [isPanelOpen, setIsPanelOpen] = useState(false);

    const { story, isGenerating, generateStory } = useStoryGeneration();
    const inputPanelRef = useRef<ImperativePanelHandle>(null);

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
          panel.resize(25);
        } else {
          panel.resize(100);
        }
      }
    }, [isPanelOpen]);
    return (
      <main className="h-screen w-full  overflow-hidden bg-background">
        <ResizablePanelGroup direction="horizontal" className="w-full h-full">
          <ResizablePanel
            ref={inputPanelRef}
            defaultSize={70}
            minSize={25}
            className="flex flex-col transition-all duration-500 ease-in-out"
          >
            <div className="h-full bg-background selection:bg-primary/20">
              <div className="container mx-auto py-8 flex flex-col items-center gap-8 min-h-full">
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
          {/* --- RIGHT PANEL: Story Results --- */}
          <AnimatePresence>
            {isPanelOpen && (
              <>
                <ResizableHandle withHandle />
                <ResizablePanel defaultSize={100} minSize={30} className="bg-muted/10">
                  <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 50 }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                    className="relative p-6"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={handleClosePanel}
                      className="absolute right-6 top-6 h-8 w-8 rounded-full z-10"
                    >
                      <X className="h-4 w-4" />
                    </Button>

                    <div className="h-full flex flex-col justify-center">
                      <motion.div
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        transition={{ delay: 0.1, duration: 0.4 }}
                        className="w-full max-w-xl mx-auto p-6 bg-card/50 backdrop-blur-sm rounded-2xl border shadow-sm"
                      >
                        <h3 className="text-xl font-semibold mb-3">Once upon a time...</h3>
                        <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
                          {story}
                          {isGenerating && (
                            <span className="inline-block w-1.5 h-4 ml-1 bg-primary animate-pulse align-middle" />
                          )}
                        </p>
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

'use client';

import { EmojiHero } from '@/components/emoji-hero';
import { EmojiPicker } from '@/components/emoji-picker';
import { StoryStage } from '@/components/story-stage';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { useState } from 'react';

import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { toast } from 'sonner';

export default function Page() {
  const [selectedEmojis, setSelectedEmojis] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);

  const [isPanelOpen, setIsPanelOpen] = useState(false);

  const handleEmojiSelect = (emoji: string) => {
    if (selectedEmojis.length >= 4) return;
    setSelectedEmojis((prev) => [...prev, emoji]);
  };
  console.log(selectedEmojis);

  const handleRemoveEmoji = (index: number) => {
    setSelectedEmojis((prev) => prev.filter((_, i) => i !== index));
  };

  const handleGenerate = async () => {
    if (selectedEmojis.length < 4){
      toast.warning("Please select 4 emojis to generate a story.");
      return;
    }
    setIsPanelOpen(true);
    setIsGenerating(true);
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsGenerating(false);
  };
  return (
    <main className="border mr-2 my-2 h-[calc(100vh-16px)] rounded-md overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        <ResizablePanel
          defaultSize={40}
          minSize={25}
          className="flex flex-col transition-all duration-500 ease-in-out"
        >
          <div className="h-full overflow-y-auto p-4">
            <div className="container mx-auto flex flex-col justify-center gap-4 min-h-full">
              <div
                className={isPanelOpen ? 'scale-90 origin-top transition-transform' : 'transition-transform'}
              >
                <EmojiHero />
              </div>
              <StoryStage
                selectedEmojis={selectedEmojis}
                onRemoveEmoji={handleRemoveEmoji}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
              />
              <div
                className={
                  isPanelOpen ? 'opacity-50 pointer-events-none transition-opacity' : 'transition-opacity'
                }
              >
                <EmojiPicker
                  onEmojiSelect={handleEmojiSelect}
                  selectedEmojis={selectedEmojis}
                  disabled={selectedEmojis.length >= 4}
                />
              </div>
            </div>
          </div>
        </ResizablePanel>

        {isPanelOpen && (
          <>
            <ResizableHandle withHandle />
            <ResizablePanel defaultSize={60} minSize={30} className="bg-muted/10">
              <div className="h-full flex flex-col p-6 overflow-y-auto animate-in slide-in-from-right-8 duration-500">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Generated Story</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsPanelOpen(false)}
                    className="h-8 w-8 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="prose dark:prose-invert max-w-none flex-1">
                  {isGenerating ? (
                    <div className="flex items-center justify-center h-64 text-muted-foreground animate-pulse">
                      Generating your story...
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="p-4 bg-card border rounded-lg">
                        <span className="text-xs font-semibold text-muted-foreground uppercase">Inputs</span>
                        <div className="text-3xl mt-2 flex gap-2">
                          {selectedEmojis.map((e, i) => (
                            <span key={i}>{e}</span>
                          ))}
                        </div>
                      </div>

                      <div className="p-6 bg-background border rounded-lg shadow-sm">
                        <h3 className="text-xl font-semibold mb-4">Once upon a time...</h3>
                        <p className="leading-relaxed text-muted-foreground">
                          (This is where the result from your backend would appear. The layout now matches
                          your requested behavior: the input shrinks to the left, and this result panel takes
                          up the remaining space.)
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </ResizablePanel>
          </>
        )}
      </ResizablePanelGroup>
    </main>
  );
}

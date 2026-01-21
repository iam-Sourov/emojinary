import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Wand2, X } from 'lucide-react';

interface StoryStageProps {
  selectedEmojis: string[];
  onRemoveEmoji: (index: number) => void;
  onGenerate: () => void;
  isGenerating?: boolean;
}

export function StoryStage({ selectedEmojis, onRemoveEmoji, onGenerate, isGenerating = false }: StoryStageProps) {
  const maxSlots = 4;
  const slots = Array.from({ length: maxSlots });

  return (
    <div className="w-full max-w-xl mx-auto px-4 mb-4">
      <div className="relative rounded-2xl border bg-card/30 backdrop-blur-md p-4 sm:p-5 flex flex-col items-center justify-center transition-all hover:bg-card/40">
        {/* Slots Container */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-4 w-full">
          {slots.map((_, index) => {
            const emoji = selectedEmojis[index];
            return (
              <div
                key={index}
                className={cn(
                  'relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center text-2xl sm:text-3xl transition-all duration-300',
                  emoji
                    ? 'bg-background shadow-sm border-2 border-primary/20 scale-100'
                    : 'bg-muted/20 border-2 border-dashed border-muted-foreground/20'
                )}
              >
                {emoji ? (
                  <div className="animate-in fade-in zoom-in duration-300 relative group/slot cursor-default">
                    {emoji}
                    <button
                      onClick={() => onRemoveEmoji(index)}
                      className="absolute -top-4 -right-4 bg-background border shadow-sm text-foreground rounded-full p-0.5 opacity-0 group-hover/slot:opacity-100 transition-all hover:scale-0.5 cursor-pointer"
                      title="Remove"
                    >
                      <X size={10} />
                    </button>
                  </div>
                ) : (
                  <div className="text-muted-foreground/20 text-sm font-light select-none">{index + 1}</div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="h-9 flex items-center justify-center">
          <Button
            className={cn(
              'rounded-full px-5 font-medium text-sm transition-all duration-500 cursor-pointer',
              selectedEmojis.length > 0 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2 pointer-events-none'
            )}
            onClick={onGenerate}
            disabled={isGenerating || selectedEmojis.length === 0}
          >
            {isGenerating ? (
              <>Generating...</>
            ) : (
              <>
                <Wand2 className="mr-1.5 h-4 w-4" />
                Generate Story
              </>
            )}
          </Button>
        </div>

        {/* Background Decorations */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden rounded-2xl">
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary/40 rounded-full blur-[80px] -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}

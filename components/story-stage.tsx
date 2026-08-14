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
  const isReady = selectedEmojis.length === maxSlots;

  return (
    <div className="w-full max-w-xl mx-auto px-4 mb-4">
      <div className="relative rounded-3xl border border-border/60 bg-card/45 backdrop-blur-xl p-5 sm:p-6 flex flex-col items-center justify-center shadow-lg transition-all duration-300 hover:shadow-primary/5 hover:border-primary/25">
        
        {/* Slots Container */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 mb-5 w-full">
          {slots.map((_, index) => {
            const emoji = selectedEmojis[index];
            const isActiveSlot = selectedEmojis.length === index;
            
            return (
              <div
                key={index}
                className={cn(
                  'relative w-14 h-14 sm:w-16 sm:h-16 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl transition-all duration-300',
                  emoji
                    ? 'bg-card shadow-md border-2 border-primary/30 scale-100 hover:scale-105 hover:border-primary'
                    : cn(
                        'bg-muted/15 border border-dashed shadow-inner',
                        isActiveSlot 
                          ? 'border-primary/50 bg-primary/5 scale-105 animate-pulse' 
                          : 'border-muted-foreground/20'
                      )
                )}
              >
                {emoji ? (
                  <div className="animate-in fade-in zoom-in-50 duration-200 relative group/slot cursor-default select-none">
                    {emoji}
                    <button
                      onClick={() => onRemoveEmoji(index)}
                      className="absolute -top-5 -right-5 bg-destructive border border-destructive/20 shadow-md text-destructive-foreground rounded-full p-1 opacity-0 group-hover/slot:opacity-100 transition-all hover:scale-110 cursor-pointer"
                      title="Remove"
                    >
                      <X size={12} className="stroke-[3]" />
                    </button>
                  </div>
                ) : (
                  <div className={cn(
                    'text-xs font-semibold select-none transition-colors duration-300',
                    isActiveSlot ? 'text-primary' : 'text-muted-foreground/35'
                  )}>
                    {index + 1}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Action Button */}
        <div className="h-10 flex items-center justify-center">
          <Button
            className={cn(
              'rounded-full px-6 font-semibold text-sm transition-all duration-300 cursor-pointer shadow-md select-none',
              selectedEmojis.length > 0 
                ? 'opacity-100 translate-y-0 scale-100' 
                : 'opacity-0 translate-y-2 pointer-events-none scale-95',
              isReady 
                ? 'bg-primary hover:bg-primary/95 text-primary-foreground shadow-primary/20 hover:shadow-lg hover:shadow-primary/35 hover:-translate-y-0.5 active:translate-y-0 active:scale-95' 
                : 'bg-secondary hover:bg-secondary/90 text-secondary-foreground'
            )}
            onClick={onGenerate}
            disabled={isGenerating || selectedEmojis.length === 0}
          >
            {isGenerating ? (
              <span className="flex items-center gap-2">
                <span className="h-2 w-2 bg-primary-foreground rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                <span className="h-2 w-2 bg-primary-foreground rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                <span className="h-2 w-2 bg-primary-foreground rounded-full animate-bounce"></span>
                Weaving story...
              </span>
            ) : (
              <>
                <Wand2 className={cn("mr-1.5 h-4 w-4 transition-transform", isReady && "animate-bounce")} />
                Generate Story
              </>
            )}
          </Button>
        </div>

        {/* Background Decorations */}
        <div className="absolute inset-0 z-0 opacity-5 pointer-events-none overflow-hidden rounded-3xl">
          <div className="absolute top-1/2 left-1/4 w-48 h-48 bg-primary/40 rounded-full blur-[80px] -translate-y-1/2" />
        </div>
      </div>
    </div>
  );
}

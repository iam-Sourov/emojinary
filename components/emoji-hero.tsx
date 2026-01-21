import { Sparkles } from 'lucide-react';

export function EmojiHero() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-2 py-3 px-4 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-1">
        <Sparkles className="w-3 h-3 text-yellow-500" />
        <span>AI Storyteller</span>
      </div>
      <h1 className="text-2xl md:text-3xl font-extralight tracking-tight lg:text-4xl uppercase">Emojinary</h1>
      <p className="max-w-[500px] text-sm text-muted-foreground">Select a few icons, and watch the story unfold.</p>
    </div>
  );
}

import { Sparkles } from 'lucide-react';

export function EmojiHero() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3 py-4 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-medium mb-1 hover:scale-105 transition-transform">
        <Sparkles className="w-3 h-3 text-amber-500 animate-pulse" />
        <span className="tracking-wide">AI Storyteller</span>
      </div>
      <h1 className="text-3xl md:text-4xl lg:text-5xl font-black tracking-wider uppercase bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/95 to-primary/80">
        Emojinary
      </h1>
      <p className="max-w-md text-sm text-muted-foreground font-light leading-relaxed">
        Select <span className="font-normal text-foreground">4 emojis</span> to weave a custom AI-generated tale.
      </p>
    </div>
  );
}

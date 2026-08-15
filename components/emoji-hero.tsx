export function EmojiHero() {
  return (
    <div className="flex flex-col items-center justify-center text-center space-y-3 py-4 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-normal px-4 pt-2 pb-4 leading-normal md:leading-relaxed inline-block bg-clip-text text-transparent bg-gradient-to-r from-foreground via-foreground/95 to-primary/80 select-none">
        Emojinary
      </h1>
      <p className="max-w-md text-sm text-muted-foreground font-light leading-relaxed">
        Select <span className="font-normal text-foreground">4 emojis</span> to weave a custom AI-generated tale.
      </p>
    </div>
  );
}

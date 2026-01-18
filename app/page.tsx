import ChatBox from '@/components/ChatBox';

export default function Page() {
  const EMOJI = {
    Mix: ['🚀 🌑 👽', '🤠 🐎 🌵', '🕵️‍♀️ 💎 🏛️', '🦖 🌋 🍖', '🧞‍♂️ 🕌 🐫'],
    Fantasy: ['🧙‍♂️ 🐉 🏰', '🧚‍♀️ 🍄 ✨', '🧜‍♀️ 🐚 🌊', '🦄 🌈 🏰', '🤴 👸 🐸'],
    'Sci-Fi': ['🤖 🦾 🔋', '🚀 🪐 👾', '🧬 🧪 🔬', '🛸 👽 📡', '👩‍🚀 🛰️ 🌠'],
    Horror: ['🧟 ⚰️ 🩸', '🧛 🦇 🏰', '👻 🏚️ ⛓️', '🔪 🩸 😱', '🤡 🎈 🎪'],
    Nature: ['🦁 🦓 🌅', '🦈 🌊 🐠', '🦋 🌸 🍄', '🦅 🏔️ 🌲', '🐨 🌿 😴'],
  };
  return (
    <div className="container mx-auto flex flex-col items-center p-4">
      <div className="mt-18 text-5xl item-center">Welcome to Emojinary!</div>
      <div className="grid grid-cols-3 text-center mt-6 p-4">
        {Object.entries(EMOJI).map(([category, emojis]) => (
          <div key={category} className="mb-4">
            <h2 className="text-xl font-bold mb-2">{category}</h2>
            <div className="flex flex-wrap gap-2 justify-center">
              {emojis.map((emoji, index) => (
                <span key={index} className="text-3xl">
                  {emoji}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
      <ChatBox></ChatBox>
    </div>
  );
}

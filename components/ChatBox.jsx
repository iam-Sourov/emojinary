"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Trash2, Wand2 } from 'lucide-react';
import { useState } from 'react';

const ChatBoxCompact = ({ inputValue, setInputValue }) => {
  console.log(inputValue)
  const [isCustom, setCustom] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex flex-col gap-4 border rounded-xl p-2 shadow-sm bg-card">
        <div className="flex p-1 bg-muted rounded-lg">
          <button
            onClick={() => setCustom(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${!isCustom ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
            <Wand2 className="w-4 h-4" />
            Generate
          </button>
          <button
            onClick={() => setCustom(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${isCustom ? 'bg-background shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
            <Plus className="w-4 h-4" />
            Custom Input
          </button>
        </div>
        <div className="relative px-2 pb-2 min-h-15 flex items-center justify-center">
          {isCustom ?
            <div className="w-full flex items-center justify-center gap-2 animate-in fade-in zoom-in-95 duration-200">
              <Input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Type to create custom emoji..."
                className="h-10 border-muted-foreground/20 transition-colors"
              />
              <Button size="icon" variant="default">
                <Search className="w-4 h-4" />
              </Button>
            </div> : <div className="w-full animate-in fade-in zoom-in-95 duration-200">
              {inputValue ?
                <div className="flex items-center justify-center gap-2">
                  <Input
                    type="text"
                    value={inputValue}
                    className="h-10 border-muted-foreground/20 transition-colors"
                  />
                  <Button onClick={() => setInputValue('')} size="icon" variant="destructive">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                  <Button size="icon" variant="default">
                    <Search className="w-4 h-4" />
                  </Button>
                </div>
                :
                <div className="flex items-center justify-center py-2 text-sm text-muted-foreground">
                  <span className="italic flex items-center gap-2">
                    <Wand2 className="w-3 h-3" /> Click emojis above to generate a set!
                  </span>
                </div>
              }
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ChatBoxCompact;
"use client";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Search, Wand2 } from 'lucide-react';
import { useState } from 'react';

const ChatBoxCompact = () => {
  const [isCustom, setCustom] = useState(false);

  return (
    <div className="w-full max-w-5xl mx-auto p-4">
      <div className="flex flex-col gap-4 border rounded-xl p-2 shadow-sm">
        <div className="flex p-1  rounded-lg">
          <button
            onClick={() => setCustom(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${!isCustom ? ' shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
            <Wand2 className="w-4 h-4" />
            Generate
          </button>
          <button
            onClick={() => setCustom(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium rounded-md transition-all ${isCustom ? ' shadow-sm text-foreground' : 'text-muted-foreground hover:text-foreground'
              }`}>
            <Plus className="w-4 h-4" />
            Custom Input
          </button>
        </div>
        <div className="relative px-2 pb-2">
          {isCustom ?
            <div className="flex items-center justify-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200">
              <Input
                type="text"
                placeholder="Type to create custom emoji..."
                className="h-9  border-muted-foreground/20 transition-colors" />
              <Button size="icon" variant="default">
                <Search className="w-4 h-4" />
              </Button>
            </div>
            :
            <div className="flex items-center justify-center py-4 text-sm text-muted-foreground animate-in fade-in slide-in-from-top-1 duration-200">
              <span className="italic">Click Generate to create a random set!</span>
            </div>
          }
        </div>
      </div>
    </div>
  );
};

export default ChatBoxCompact;
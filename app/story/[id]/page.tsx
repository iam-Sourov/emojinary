'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useConversations } from '@/lib/conversation-context';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { ArrowLeft, Sparkles, Send, Loader2, Trash2, Wand2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { toast } from 'sonner';

const SUGGESTION_PILLS = [
  'Write a sequel 🚀',
  'Make it funnier 🎭',
  'Add a dramatic twist ⚡',
  'Translate to Emojis only 💬',
];

export default function StoryPage() {
  const router = useRouter();
  const { id } = useParams() as { id: string };
  const { getConversation, addLocalMessage, updateLastMessageText, deleteConversation } = useConversations();
  
  const conv = getConversation(id);
  
  const [inputText, setInputText] = useState('');
  const [isChatGenerating, setIsChatGenerating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto scroll to bottom
  const scrollToBottom = (behavior: 'smooth' | 'instant' = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior });
  };

  // Scroll to bottom on load and whenever messages change (during streaming too)
  useEffect(() => {
    if (conv?.messages) {
      scrollToBottom('smooth');
    }
  }, [conv?.messages]);

  if (!conv) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <span className="text-muted-foreground font-light text-sm">Searching for your tale...</span>
      </div>
    );
  }

  const handleSend = async (textToSend: string) => {
    if (!textToSend.trim() || isChatGenerating) return;

    const userPrompt = textToSend.trim();
    setInputText('');

    // Save message locally (User)
    addLocalMessage(id, 'user', userPrompt);

    // Save message locally (Placeholder AI for streaming)
    addLocalMessage(id, 'ai', '');
    setIsChatGenerating(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: id,
          emojis: conv.emojis,
          history: conv.messages.map((m) => ({ sender: m.sender, text: m.text })),
          prompt: userPrompt,
        }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        toast.error(data.error || 'Failed to stream response.');
        setIsChatGenerating(false);
        return;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let accumulatedText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        accumulatedText += text;
        
        // Update story state reactively
        updateLastMessageText(id, accumulatedText);
      }
    } catch (error) {
      console.error('Chat error:', error);
      toast.error('Connection lost. Please try again.');
    } finally {
      setIsChatGenerating(false);
    }
  };

  const handleDelete = async () => {
    if (isDeleting) return;
    setIsDeleting(true);
    const success = await deleteConversation(id);
    if (success) {
      router.push('/');
    } else {
      setIsDeleting(false);
    }
  };

  return (
    <main className="h-screen w-full overflow-hidden bg-background">
      <ResizablePanelGroup direction="horizontal" className="w-full h-full">
        {/* --- LEFT SIDEBAR (READ ONLY VIEW OF EMOJIS & CREATOR OPTIONS) --- */}
        <ResizablePanel defaultSize={25} minSize={20} maxSize={40} className="hidden md:flex flex-col bg-muted/5 border-r border-border/40">
          <div className="flex flex-col h-full p-6 justify-between">
            <div className="space-y-6">
              <Link href="/" className="inline-flex items-center gap-2 text-xs text-muted-foreground hover:text-foreground transition-colors group">
                <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-0.5" />
                Back to Storyteller
              </Link>
              
              <div className="space-y-4 pt-2">
                <h3 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Original Recipe</h3>
                <div className="flex flex-wrap gap-2.5">
                  {conv.emojis.map((emoji, index) => (
                    <div
                      key={index}
                      className="w-12 h-12 rounded-xl bg-card border border-border shadow-sm flex items-center justify-center text-2xl select-none"
                    >
                      {emoji}
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-2.5 pt-4">
                <h4 className="text-xs font-bold uppercase tracking-widest text-muted-foreground">About this Tale</h4>
                <div className="text-xs text-muted-foreground leading-relaxed bg-muted/20 border border-border/20 rounded-xl p-3 space-y-1.5">
                  <p>Created: <span className="text-foreground">{new Date(conv.createdAt).toLocaleDateString()}</span></p>
                  <p>Total Prompts: <span className="text-foreground">{Math.floor((conv.messages.length - 1) / 2)}</span></p>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full cursor-pointer justify-start gap-2.5 rounded-xl border-destructive/20 text-destructive hover:bg-destructive/10"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
                Delete Story
              </Button>
              <Button
                className="w-full cursor-pointer justify-start gap-2.5 rounded-xl"
                onClick={() => router.push('/')}
              >
                <Wand2 size={16} />
                Create New Story
              </Button>
            </div>
          </div>
        </ResizablePanel>
        
        <ResizableHandle withHandle className="hidden md:flex" />

        {/* --- RIGHT CHAT AREA --- */}
        <ResizablePanel defaultSize={75} className="flex flex-col bg-background relative">
          {/* Header */}
          <div className="h-16 border-b border-border/40 flex items-center justify-between px-6 bg-card/10 backdrop-blur-sm relative z-10">
            <div className="flex items-center gap-3">
              <Link href="/" className="md:hidden p-1 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground">
                <ArrowLeft size={18} />
              </Link>
              <div>
                <h2 className="text-sm font-bold truncate max-w-[200px] sm:max-w-md">
                  {conv.title}
                </h2>
                <p className="text-[10px] text-muted-foreground">
                  Conversing with AI Character
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="md:hidden text-destructive hover:bg-destructive/10 h-8 w-8 rounded-full"
                onClick={handleDelete}
                disabled={isDeleting}
              >
                <Trash2 size={16} />
              </Button>
              <div className="flex items-center gap-1 bg-primary/5 border border-primary/20 text-primary rounded-full px-2.5 py-0.5 text-[10px] font-medium animate-pulse">
                Live Chat
              </div>
            </div>
          </div>

          {/* Messages Thread */}
          <div
            ref={chatContainerRef}
            className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6 scrollbar-thin scrollbar-thumb-muted-foreground/10"
          >
            <AnimatePresence initial={false}>
              {conv.messages.map((msg, index) => {
                const isAI = msg.sender === 'ai';
                
                // Render initial story uniquely ONLY when it's the only message in the conversation (reading start state)
                if (index === 0 && conv.messages.length === 1) {
                  return (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="max-w-3xl mx-auto border shadow-sm p-6 md:p-8 bg-card/65 backdrop-blur-sm rounded-2xl relative overflow-hidden"
                    >
                      <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl pointer-events-none" />
                      <div className="mb-4 border-b border-border/30 pb-4">
                        <div className="text-[10px] text-muted-foreground flex items-center gap-2 mb-2">
                          <span className="text-primary px-2 py-0.5 rounded bg-primary/10 text-[9px] font-semibold tracking-wider">
                            ORIGINAL TALE
                          </span>
                          <span>{new Date(conv.createdAt).toLocaleDateString()}</span>
                        </div>
                        <h1 className="text-2xl md:text-3xl font-black tracking-tight text-foreground flex items-center gap-2">
                          {conv.title}
                        </h1>
                      </div>

                      <div className="prose prose-zinc dark:prose-invert max-w-none">
                        <p className="text-base md:text-lg leading-relaxed text-foreground/90 whitespace-pre-wrap font-serif">
                          {msg.text}
                        </p>
                      </div>
                    </motion.div>
                  );
                }

                // Render follow up messages
                return (
                  <motion.div
                    key={msg.id}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.3 }}
                    className={`flex w-full ${isAI ? 'justify-start' : 'justify-end'}`}
                  >
                    <div className={`flex gap-3 max-w-[85%] sm:max-w-[75%] ${isAI ? 'flex-row' : 'flex-row-reverse'}`}>
                      {/* Avatar */}
                      <div className={`h-8 w-8 rounded-full border flex items-center justify-center text-xs shadow-inner flex-shrink-0 select-none ${
                        isAI 
                          ? 'bg-primary/10 border-primary/20 text-primary' 
                          : 'bg-muted border-muted-foreground/10 text-muted-foreground font-semibold'
                      }`}>
                        {isAI ? <Sparkles size={14} className="text-amber-500" /> : 'ME'}
                      </div>

                      {/* Content Bubble */}
                      <div className="space-y-1.5">
                        <div className={`rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${
                          isAI 
                            ? 'bg-card border text-foreground/90' 
                            : 'bg-primary text-primary-foreground font-medium'
                        }`}>
                          <p className="whitespace-pre-wrap">{msg.text}</p>
                          {isAI && !msg.text && isChatGenerating && (
                            <div className="flex items-center gap-1.5 text-muted-foreground text-xs italic animate-pulse py-0.5">
                              <Loader2 size={12} className="animate-spin text-primary" />
                              typing...
                            </div>
                          )}
                        </div>
                        <div className={`text-[9px] text-muted-foreground/60 px-1 ${
                          !isAI ? 'text-right' : 'text-left'
                        }`}>
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
            <div ref={messagesEndRef} />
          </div>

          {/* Suggestion Pills and Form */}
          <div className="border-t border-border/40 p-4 bg-background relative z-10">
            <div className="max-w-3xl mx-auto space-y-4">
              {/* Suggestions row */}
              <AnimatePresence>
                {!isChatGenerating && (
                  <motion.div
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    className="flex flex-wrap gap-2 overflow-x-auto pb-1 scrollbar-none"
                  >
                    {SUGGESTION_PILLS.map((pill, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSend(pill.replace(/[\uE000-\uF8FF]|\uD83C[\uDC00-\uDFFF]|\uD83D[\uDC00-\uDFFF]|[\u2011-\u26FF]|\uD83E[\uDD00-\uDFFF]/g, '').trim())}
                        className="text-xs px-3 py-1.5 rounded-full bg-muted/65 hover:bg-primary hover:text-primary-foreground border border-border/40 text-muted-foreground font-medium transition-all hover:scale-103 cursor-pointer shrink-0"
                      >
                        {pill}
                      </button>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Input Field */}
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSend(inputText);
                }}
                className="relative rounded-2xl border border-border/80 bg-card p-1.5 focus-within:ring-2 focus-within:ring-primary/25 transition-all duration-300"
              >
                <div className="flex items-end">
                  <Textarea
                    placeholder="Ask Emojinary to continue, add twists, or translate..."
                    value={inputText}
                    onChange={(e) => setInputText(e.target.value)}
                    className="flex-1 resize-none bg-transparent min-h-[48px] max-h-[120px] border-0 py-2.5 px-3.5 focus-visible:ring-0 focus-visible:ring-offset-0 text-sm focus:outline-none shadow-none"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault();
                        handleSend(inputText);
                      }
                    }}
                    disabled={isChatGenerating}
                  />
                  <Button
                    type="submit"
                    size="icon"
                    className="h-10 w-10 rounded-xl cursor-pointer shrink-0 mb-1 mr-1"
                    disabled={!inputText.trim() || isChatGenerating}
                  >
                    {isChatGenerating ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Send className="h-4 w-4" />
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </main>
  );
}

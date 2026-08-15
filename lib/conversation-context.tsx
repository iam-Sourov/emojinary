'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useAuth } from './auth-context';
import { toast } from 'sonner';

export interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export interface Conversation {
  id: string;
  userId: string;
  emojis: string[];
  title: string;
  messages: Message[];
  createdAt: string;
}

interface ConversationContextType {
  conversations: Conversation[];
  isLoading: boolean;
  createConversation: (emojis: string[], initialStory: string) => Promise<Conversation | null>;
  addLocalMessage: (conversationId: string, sender: 'user' | 'ai', text: string) => void;
  updateLastMessageText: (conversationId: string, text: string) => void;
  deleteConversation: (id: string) => Promise<boolean>;
  getConversation: (id: string) => Conversation | undefined;
  loadConversations: () => Promise<void>;
}

const ConversationContext = createContext<ConversationContextType | undefined>(undefined);

const LOCAL_STORAGE_KEY = 'emojinary_guest_conversations';

export function ConversationProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoggedIn } = useAuth();
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const loadConversations = () => {
    setRefetchTrigger((prev) => prev + 1);
    return Promise.resolve();
  };

  useEffect(() => {
    let active = true;
    const fetchConversations = async () => {
      if (!active) return;
      setIsLoading(true);
      
      if (isLoggedIn && user) {
        try {
          // 1. Check if there are guest conversations in localStorage to migrate
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (localData) {
            const guestConvs = JSON.parse(localData);
            if (Array.isArray(guestConvs) && guestConvs.length > 0) {
              toast.info('Syncing your guest stories to your account...');
              const migrateRes = await fetch('/api/auth/migrate', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ conversations: guestConvs }),
              });
              if (!active) return;
              if (migrateRes.ok) {
                const data = await migrateRes.json();
                setConversations(data);
                localStorage.removeItem(LOCAL_STORAGE_KEY);
                toast.success('Successfully saved your guest stories!');
                setIsLoading(false);
                return;
              }
            }
          }

          // 2. Otherwise load standard user conversations from DB
          const res = await fetch('/api/conversations');
          if (!active) return;
          if (res.ok) {
            const data = await res.json();
            setConversations(data);
          }
        } catch {
          console.error('Failed to fetch user conversations');
        }
      } else {
        // Load guest conversations from localStorage
        try {
          const localData = localStorage.getItem(LOCAL_STORAGE_KEY);
          if (!active) return;
          if (localData) {
            setConversations(JSON.parse(localData));
          } else {
            setConversations([]);
          }
        } catch {
          console.error('Failed to parse guest conversations');
          if (active) setConversations([]);
        }
      }
      if (active) setIsLoading(false);
    };

    fetchConversations();
    return () => {
      active = false;
    };
  }, [isLoggedIn, user, refetchTrigger]);

  const createConversation = useCallback(
    async (emojis: string[], initialStory: string): Promise<Conversation | null> => {
      if (isLoggedIn && user) {
        // Authenticated flow: API call
        try {
          const title = `Story ${emojis.slice(0, 3).join('')}...`;
          const res = await fetch('/api/conversations', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emojis, title, initialStory }),
          });

          if (!res.ok) {
            const data = await res.json();
            toast.error(data.error || 'Failed to save story');
            return null;
          }

          const newConv = await res.json();
          setConversations((prev) => [newConv, ...prev]);
          return newConv;
        } catch {
          toast.error('An error occurred while saving the story.');
          return null;
        }
      } else {
        // Guest flow: Local storage
        const newConv: Conversation = {
          id: crypto.randomUUID(),
          userId: 'guest',
          emojis,
          title: `Story ${emojis.slice(0, 3).join('')}...`,
          createdAt: new Date().toISOString(),
          messages: [
            {
              id: crypto.randomUUID(),
              sender: 'ai',
              text: initialStory,
              timestamp: new Date().toISOString(),
            },
          ],
        };

        setConversations((prev) => {
          const updated = [newConv, ...prev];
          localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
          return updated;
        });
        return newConv;
      }
    },
    [isLoggedIn, user]
  );

  // Locally appends a message for instant client update (e.g. streaming or immediate user send)
  const addLocalMessage = (conversationId: string, sender: 'user' | 'ai', text: string) => {
    const newMessage: Message = {
      id: crypto.randomUUID(),
      sender,
      text,
      timestamp: new Date().toISOString(),
    };

    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const updatedMessages = [...conv.messages, newMessage];
          // If guest, sync to localStorage
          if (!isLoggedIn) {
            const updatedConv = { ...conv, messages: updatedMessages };
            const updatedList = prev.map((c) => (c.id === conversationId ? updatedConv : c));
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
          }
          return { ...conv, messages: updatedMessages };
        }
        return conv;
      })
    );
  };

  // Helper to update the text of the last message chunk-by-chunk (for streaming animation)
  const updateLastMessageText = (conversationId: string, text: string) => {
    setConversations((prev) =>
      prev.map((conv) => {
        if (conv.id === conversationId) {
          const messages = [...conv.messages];
          if (messages.length > 0) {
            const lastIndex = messages.length - 1;
            messages[lastIndex] = { ...messages[lastIndex], text };
          }
          if (!isLoggedIn) {
            const updatedConv = { ...conv, messages };
            const updatedList = prev.map((c) => (c.id === conversationId ? updatedConv : c));
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updatedList));
          }
          return { ...conv, messages };
        }
        return conv;
      })
    );
  };

  const deleteConversation = async (id: string): Promise<boolean> => {
    if (isLoggedIn) {
      try {
        const res = await fetch(`/api/conversations/${id}`, {
          method: 'DELETE',
        });
        if (!res.ok) {
          toast.error('Failed to delete story from server');
          return false;
        }
        setConversations((prev) => prev.filter((conv) => conv.id !== id));
        toast.success('Story deleted');
        return true;
      } catch {
        toast.error('Failed to delete story');
        return false;
      }
    } else {
      const updated = conversations.filter((conv) => conv.id !== id);
      setConversations(updated);
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(updated));
      toast.success('Story deleted');
      return true;
    }
  };

  const getConversation = (id: string): Conversation | undefined => {
    return conversations.find((conv) => conv.id === id);
  };

  return (
    <ConversationContext.Provider
      value={{
        conversations,
        isLoading,
        createConversation,
        addLocalMessage,
        updateLastMessageText,
        deleteConversation,
        getConversation,
        loadConversations,
      }}
    >
      {children}
    </ConversationContext.Provider>
  );
}

export function useConversations() {
  const context = useContext(ConversationContext);
  if (context === undefined) {
    throw new Error('useConversations must be used within a ConversationProvider');
  }
  return context;
}

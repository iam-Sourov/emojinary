import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';

interface UseStoryGenerationResult {
  story: string;
  isGenerating: boolean;
  generateStory: (emojis: string[], onComplete?: (story: string) => void) => Promise<boolean>;
}

export function useStoryGeneration(): UseStoryGenerationResult {
  const [story, setStory] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // Buffer to hold text received from the API but not yet displayed
  const textBufferRef = useRef<string>('');
  // Accumulate the complete story as it streams in
  const fullStoryRef = useRef<string>('');
  // Track if we are currently fetching data
  const isFetchingRef = useRef<boolean>(false);
  // Store callback
  const onCompleteRef = useRef<((story: string) => void) | undefined>(undefined);

  useEffect(() => {
    let intervalId: NodeJS.Timeout;

    if (isGenerating) {
      intervalId = setInterval(() => {
        // If there is text in the buffer, move one character to the displayed story
        if (textBufferRef.current.length > 0) {
          const char = textBufferRef.current.charAt(0);
          textBufferRef.current = textBufferRef.current.slice(1);
          setStory((prev) => prev + char);
        } else if (!isFetchingRef.current) {
          // If buffer is empty AND we are done fetching, stop generating and trigger callback
          clearInterval(intervalId);
          setIsGenerating(false);
          if (onCompleteRef.current) {
            onCompleteRef.current(fullStoryRef.current);
          }
        }
      }, 20); // 20ms delay between characters for smooth typing
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [isGenerating]);

  const generateStory = async (emojis: string[], onComplete?: (story: string) => void) => {
    if (emojis.length === 0) return false;

    // Reset state
    setIsGenerating(true);
    setStory('');
    textBufferRef.current = '';
    fullStoryRef.current = '';
    isFetchingRef.current = true;
    onCompleteRef.current = onComplete;

    try {
      const response = await fetch('/api/story', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ emojis }),
      });

      if (!response.ok || !response.body) {
        const data = await response.json().catch(() => ({}));
        console.error('Error:', data.error);
        toast.error(data.error || 'Failed to generate story.');
        isFetchingRef.current = false;
        setIsGenerating(false);
        return false;
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const text = decoder.decode(value, { stream: true });
        // Add received chunk to the buffer instead of state directly
        textBufferRef.current += text;
        fullStoryRef.current += text;
      }

      isFetchingRef.current = false;
      return true;
    } catch {
      toast.error('Something went wrong. Please try again.');
      isFetchingRef.current = false;
      setIsGenerating(false);
      return false;
    }
  };

  return { story, isGenerating, generateStory };
}

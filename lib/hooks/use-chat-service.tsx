import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { toast } from 'react-hot-toast';
import { type Message, type CreateMessage } from 'ai/react';

export interface UseChatService {
  messages: Message[];
  sendMessage: (message: Message | CreateMessage) => Promise<string | null>;
  isLoading: boolean;
  setInput: React.Dispatch<React.SetStateAction<string>>;
  currentInput: string;
  jobIdentifier: string | null;
  startLoading: () => void;
  stopLoading: () => void;
  updateMessages: (messages: Message[]) => void;
  reloadChatHistory: (id: string) => Promise<void>;
  displayPreviewTokenDialog: boolean;
  setPreviewTokenDialogVisibility: (visible: boolean) => void;
  updatePreviewTokenInput: (value: string) => void;
  submitPreviewToken: () => void;
  previewTokenInputValue: string;
}

export function useChatService(initialMessages: Message[] = []): UseChatService {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [isLoading, setIsLoading] = useState(false);
  const [currentInput, setCurrentInput] = useState('');
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null);
  const [previewTokenInputValue, setPreviewTokenInputValue] = useState(previewToken ?? '');
  const [displayPreviewTokenDialog, setDisplayPreviewTokenDialog] = useState(process.env.VERCEL_ENV === 'preview');
  const [jobIdentifier, setJobIdentifier] = useState<string | null>(null);

  useEffect(() => {
    if (jobIdentifier) {
      const eventSource = new EventSource(`/api/stream/${jobIdentifier}`);
      eventSource.onmessage = (event) => {
        const newMessage = JSON.parse(event.data);
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      };

      eventSource.onerror = () => {
        toast.error('Connection error while receiving updates.');
        setIsLoading(false);
        eventSource.close();
      };

      return () => {
        eventSource.close();
      };
    }
  }, [jobIdentifier]);

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const sendMessage = async (message: Message | CreateMessage): Promise<string | null> => {
    startLoading();
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(previewToken ? { 'Authorization': `Bearer ${previewToken}` } : {}),
        },
        body: JSON.stringify({ message: message.content }),
      });

      if (!response.ok) {
        toast.error(`Failed to send message: ${response.statusText}`);
        return null;
      }
      
      const responseBody = await response.json();
      const job_id = responseBody?.job_id;

      if (job_id) {
        setJobIdentifier(job_id);
        setCurrentInput('');
        return job_id;
      } else {
        toast.error('Backend did not return a job identifier.');
        return null;
      }
    } catch (error) {
      toast.error('Failed to send message.');
      return null;
    } finally {
      stopLoading();
    }
  };

  const reloadChatHistory = async (id: string): Promise<void> => {
    startLoading();
    try {
      const response = await fetch(`/api/chat/history?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${previewToken}`
        }
      });

      if (!response.ok) {
        toast.error('Failed to reload chat history.');
        return;
      }
      
      const history = await response.json();
      setMessages(history);
    } catch (error) {
      toast.error('Failed to reload chat history.');
    } finally {
      stopLoading();
    }
  };

  const updatePreviewTokenInput = (value: string) => {
    setPreviewTokenInputValue(value);
  };

  const submitPreviewToken = () => {
    if (previewTokenInputValue) {
      setPreviewToken(previewTokenInputValue);
      setDisplayPreviewTokenDialog(false);
    } else {
      toast.error('Token input is empty.');
    }
  };

  return {
    messages,
    sendMessage,
    isLoading,
    currentInput,
    setInput: setCurrentInput,
    jobIdentifier,
    startLoading,
    stopLoading,
    updateMessages: setMessages,
    reloadChatHistory,
    displayPreviewTokenDialog,
    setPreviewTokenDialogVisibility: setDisplayPreviewTokenDialog,
    updatePreviewTokenInput,
    submitPreviewToken,
    previewTokenInputValue,
  };
}
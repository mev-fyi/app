'use client'
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

  const startLoading = () => setIsLoading(true);
  const stopLoading = () => setIsLoading(false);

  const sendMessage = async (message: Message | CreateMessage): Promise<string | null> => {
    startLoading();
      
    // Append the user's message to messages state immediately.
    setMessages(prevMessages => [
      ...prevMessages,
      {
        ...message,
        id: 'temp-id',                         // Temporarily assign an id
        createdAt: new Date(),                 // Use createdAt instead of timestamp
      }
    ]);
    setCurrentInput('');
    
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
        // If the request fails, remove the temporary user message and inform the user
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== 'temp-id'));
        toast.error(`Failed to send message: ${response.statusText}`);
        return null;
      }
  
      const responseBody = await response.json();
      console.log('Response body after sending message:', responseBody);
    
      // Assuming the responseBody contains the response message from the server
      const responseContent = responseBody?.response?.response;
      const job_id = responseBody?.job_id;
  
      if (responseContent && job_id) {
        // Append the server's response message to the messages state
        setMessages(prevMessages => [
          // Keep all messages, including the temporary one since we no longer re-append the user's message
          ...prevMessages,
          {
            content: responseContent,
            id: job_id,
            createdAt: new Date(),
            role: 'assistant',                // Assuming the server's response is from the assistant
          }
        ]);
        return job_id;
      } else {
        // If server response is not in expected format, show an error and remove temporary message
        setMessages(prevMessages => prevMessages.filter(msg => msg.id !== 'temp-id'));
        toast.error('Backend did not return the expected response object.');
        return null;
      }
    } catch (error) {
      // On failure, remove temporary message and show error
      setMessages(prevMessages => prevMessages.filter(msg => msg.id !== 'temp-id'));
      if (error instanceof Error) {
          toast.error('Failed to send message: ' + error.message);
      } else {
          toast.error('An unknown error occurred.');
      }
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
      console.log('Chat history after reloading:', history);
      setMessages(history);
      // log the history to the console to show the message
      console.log('Chat history after reloading:', history);
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
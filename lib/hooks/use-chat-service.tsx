'use client'
import { useState, useEffect } from 'react';
import { useLocalStorage } from '@/lib/hooks/use-local-storage';
import { toast } from 'react-hot-toast';
import { type Message, type CreateMessage } from 'ai/react';
import { ExtendedMessage } from '../types';


export interface UseChatService {
  messages: ExtendedMessage[]; // Updated to use ExtendedMessage[]
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
  const [messages, setMessages] = useState<ExtendedMessage[]>(initialMessages); // Updated type here
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
        id: 'temp-id', // Temporarily assign an id
        createdAt: new Date(),
        role: 'user', // Assuming the user role for the message
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
      if (response.ok) {
        const { job_id, response: responseContent, structured_metadata } = responseBody;

        // Update the messages state with the new message and the structured metadata
        setMessages(prevMessages => [
          ...prevMessages,
          {
            content: JSON.stringify(responseContent),  // Convert content to a string if it's not already one
            id: job_id,
            createdAt: new Date(),
            role: 'assistant',
            structured_metadata             // Store the structured metadata
          },
        ]);
        // No need to render a component here; just store the metadata in state
        return job_id;
      } else {
        toast.error(`Failed to send message: ${responseBody.error || 'Unknown error'}`);
        return null;
      }
    } catch (error) {
      toast.error(`Failed to send message: ${error instanceof Error ? error.message : 'Unknown error'}`);
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
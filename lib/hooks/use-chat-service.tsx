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


// Define the structure of a parsed metadata entry that can accommodate both videos and research papers
interface ParsedMetadataEntry {
  index: number;
  title: string;
  link: string;    // URL of the video or research paper
  extraInfo: string; // 'Channel name' for videos or 'Authors' for research papers
  extraInfoType: string; // Either 'Channel name' or 'Authors'
  publishedDate: Date;
}

// Define the input type for the formattedMetadata parameter
type FormattedMetadata = string;

// The parseAndFormatMetadata function with type annotations
function parseAndFormatMetadata(formattedMetadata: FormattedMetadata): string {
  const formattedEntries = formattedMetadata.split(', [Title]: ');
  const parsedEntries: ParsedMetadataEntry[] = formattedEntries.map((entry, index): ParsedMetadataEntry | null => {
    // Extract details using regex that works for both videos and research papers
    const videoDetails = entry.match(/\[Title\]: (.*?), \[Channel name\]: (.*?), \[Video Link\]: (.*?), \[Published date\]: ([\d-]+)/);
    const paperDetails = entry.match(/\[Title\]: (.*?), \[Authors\]: (.*?), \[Link\]: (.*?), \[Release date\]: ([\d-]+)/);

    let details = videoDetails || paperDetails;
    let extraInfoType = videoDetails ? 'Channel name' : 'Authors';

    return details ? {
      index: index + 1,
      title: details[1],
      extraInfoType: extraInfoType,
      link: details[3],
      extraInfo: details[2],
      publishedDate: new Date(details[videoDetails ? 4 : 5])
    } : null;
  }).filter(Boolean) as ParsedMetadataEntry[];

  // Sort by published date
  const formattedList = parsedEntries.sort((a, b) => b.publishedDate.getTime() - a.publishedDate.getTime())
    .map((entry): string => `
      ${entry.index}. <a href="${entry.link}" target="_blank" rel="noopener noreferrer">${entry.title}</a> 
      (${entry.extraInfoType}: ${entry.extraInfo}) - ${entry.publishedDate.toISOString().split('T')[0]}
    `).join('<br>');

  return formattedList;
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
      console.log('Response body received from backend:', responseBody);
  
      const responseContent = responseBody?.response?.response || responseBody?.response;
      const formattedMetadata = responseBody?.formatted_metadata;
      const job_id = responseBody?.job_id;
  
      if (responseContent && job_id) {
         // Format the metadata using the provided function
        const formattedMetadataHtml = formattedMetadata
        ? parseAndFormatMetadata(formattedMetadata)
        : '';

        // Combine the backend response content with the formatted metadata HTML
        const fullResponseContent = `${responseContent}\n\n${formattedMetadataHtml}`;

        setMessages(prevMessages => [
          ...prevMessages,
          {
            content: fullResponseContent,
            id: job_id,
            createdAt: new Date(),
            role: 'assistant',
          }
        ]);
        return job_id;
      } else {
        toast.error('Backend did not return the expected response object.');
        return null;
      }
    } catch (error) {
      // On failure, show error
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
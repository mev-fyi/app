import { useChat, UseChatOptions } from 'ai/react';
import { useState, useEffect } from 'react';
import { ExtendedMessage } from '../types'; // Adjust the import path as needed

export function useExtendedChat(options: UseChatOptions) {
    const chat = useChat(options);
    const [extendedMessages, setExtendedMessages] = useState<ExtendedMessage[]>([]);
  
    useEffect(() => {
      // Convert the messages from useChat to ExtendedMessage type
      setExtendedMessages(chat.messages as ExtendedMessage[]);
    }, [chat.messages]);
  
    return { ...chat, messages: extendedMessages };
  }
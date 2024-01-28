'use client'

import React from 'react';
import { shareChat, getChat, getChats } from '@/app/actions';
import { toast } from 'react-hot-toast';
import { IconShare } from '@/components/ui/icons';
import { Chat } from '@/lib/types'; // Import the Chat type

interface ShareChatHeaderProps {
  userId: string;
  chatId?: string;
  chat?: Chat | null; // Update the type to include null
}

const ShareChatHeader: React.FC<ShareChatHeaderProps> = ({ userId, chatId, chat }) => {
    const handleShareClick = async () => {
      try {
        console.log("handleShareClick invoked with userId:", userId, "and chatId:", chatId);

        // Use the provided chat object if available, otherwise fetch it
        let chatToShare = chat;
        if (!chatToShare && chatId) {
          console.log("Fetching chat using chatId");
          chatToShare = await getChat(chatId, userId);
        } else if (!chatToShare) {
          console.log("Fetching latest chat for user");
          const chats = await getChats(userId);
          chatToShare = chats[chats.length - 1];
        }

        if (!chatToShare) {
          console.error("Chat not found");
          toast.error("Chat not found");
          return;
        }

        console.log("Chat found, attempting to share:", chatToShare);
        const result = await shareChat(chatToShare);

        if (result && 'error' in result) {
          console.error("Error in shareChat:", result.error);
          toast.error(result.error);
        } else {
          navigator.clipboard.writeText(result.sharePath);
          toast.success('Share link copied to clipboard');
          console.log("Share operation successful");
        }
      } catch (error) {
        console.error("Error in handleShareClick:", error);
        toast.error("Error sharing chat");
      }
    };

  return (
    <header style={{ 
      position: 'absolute', 
      top: '10px', 
      right: '50%', 
      transform: 'translateX(50%)', 
      zIndex: 1000
    }}>
      <button onClick={handleShareClick} style={{ 
        background: 'none', 
        border: 'none', 
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <IconShare style={{ fontSize: '24px' }} />
        <span className="sr-only">Share Chat</span>
      </button>
    </header>
  );
};

export default ShareChatHeader;

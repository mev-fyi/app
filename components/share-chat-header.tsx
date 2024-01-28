'use client'

import React from 'react';
import { getChat, getChats, shareChat } from '@/app/actions';
import { toast } from 'react-hot-toast';
import { IconShare } from '@/components/ui/icons';

interface ShareChatHeaderProps {
  userId: string;
  chatId?: string;
}

const ShareChatHeader: React.FC<ShareChatHeaderProps> = ({ userId, chatId }) => {
    const handleShareClick = async () => {
      try {
        console.log("handleShareClick invoked with userId:", userId, "and chatId:", chatId);
  
        let chat;
        if (chatId) {
          console.log("Fetching chat using chatId");
          chat = await getChat(chatId, userId);
        } else {
          console.log("Fetching latest chat for user");
          const chats = await getChats(userId);
          chat = chats[chats.length - 1];
        }
  
        if (!chat) {
          console.error("Chat not found");
          toast.error("Chat not found");
          return;
        }
  
        console.log("Chat found, attempting to share:", chat);
        const result = await shareChat(chat);
  
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
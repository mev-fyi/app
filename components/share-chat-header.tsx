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
      let chat;
      if (chatId) {
        // If chatId is provided, use it directly
        chat = await getChat(chatId, userId);
      } else {
        // Otherwise, fetch the latest chat
        const chats = await getChats(userId);
        chat = chats[chats.length - 1]; // Select the last chat
      }

      if (!chat) {
        toast.error("Chat not found");
        return;
      }

      // Share the chat
      const result = await shareChat(chat);
      if (result && 'error' in result) {
        toast.error(result.error);
      } else {
        navigator.clipboard.writeText(result.sharePath);
        toast.success('Share link copied to clipboard');
      }
    } catch (error) {
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
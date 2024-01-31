'use client'

import React from 'react';
import { shareChat, getChat, getChats } from '@/app/actions';
import { toast } from 'react-hot-toast';
import { Chat } from '@/lib/types';

interface ShareChatHeaderProps {
  userId: string;
  chatId?: string;
  chat?: Chat | null;
}

const ShareChatHeader: React.FC<ShareChatHeaderProps> = ({ userId, chatId, chat }) => {
  const copyToClipboard = async (text: string) => {
    if ('clipboard' in navigator) {
      try {
        await navigator.clipboard.writeText(text);
        toast.success('Share link copied to clipboard');
      } catch (err) {
        toast.error('Failed to copy link');
      }
    } else {
      // Fallback for browsers without clipboard API support
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      try {
        const successful = document.execCommand('copy');
        successful ? toast.success('Share link copied to clipboard') : toast.error('Failed to copy link');
      } catch (err) {
        toast.error('Error copying link');
      }
      document.body.removeChild(textarea);
    }
  };

  const handleShareClick = async () => {
    try {
      console.log("handleShareClick invoked with userId:", userId, "and chatId:", chatId);
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
        const shareUrl = `mev.fyi${result.sharePath}`;
        copyToClipboard(shareUrl);
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
        <img 
          src="/107-1076520_share-png-youtube-share-button-png-clipart-3995698516.png" 
          alt="Share"
          style={{ width: '24px', height: 'auto' }}
        />
        <span className="sr-only">Share Chat</span>
      </button>
    </header>
  );
};

export default ShareChatHeader;
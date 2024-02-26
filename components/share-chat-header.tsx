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
        let successful = false;
        try {
          if ('clipboard' in navigator && navigator.clipboard) {
            await navigator.clipboard.writeText(text);
            successful = true;
          }
        } catch (error) {
          // Handle errors silently, no need to show a toast here
        }
      
        if (!successful) {
          // Fallback for browsers without clipboard API support
          const textarea = document.createElement('textarea');
          textarea.value = text;
          document.body.appendChild(textarea);
          textarea.select();
      
          try {
            successful = document.execCommand('copy');
          } catch (error) {
            // Handle errors silently, no need to show a toast here
          } finally {
            document.body.removeChild(textarea);
          }
        }
      
        if (successful) {
          toast.success('Share link copied to clipboard', { duration: 5000 }); // Adjust duration as needed
        } else {
          toast.error('Failed to copy link. Please copy and paste the link manually:\n' + text, { duration: 10000 }); // Adjust duration as needed
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
      top: '15px', 
      left: '75%', // Adjust this value to move the button more to the left
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
          src="/ui_icons/share_chat_2.svg" 
          alt="Share" 
          style={{ width: '20px', height: 'auto' }}
        />
        <span className="sr-only">Share Chat</span>
      </button>
    </header>
  );
};

export default ShareChatHeader;
import React from 'react';
import { getChats, getChat, shareChat } from '@/app/actions';
import { toast } from 'react-hot-toast';
import { IconShare } from '@/components/ui/icons';

interface ShareChatHeaderProps {
    userId: string;
    chatId?: string;
}

const ShareChatHeader: React.FC<ShareChatHeaderProps> = ({ userId, chatId }) => {
  const handleShare = async () => {
    try {
      let chat;
      if (chatId) {
        chat = await getChat(chatId, userId);
      } else {
        const chats = await getChats(userId);
        chat = chats[chats.length - 1]; // Select the last chat
      }

      if (!chat) {
        toast.error("Chat not found");
        return;
      }

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
    <header style={{ backgroundColor: 'transparent', position: 'relative', width: '100%' }}>
      <div style={{ position: 'absolute', top: 10, right: 20 }}>
        <button onClick={handleShare} style={{ all: 'unset', cursor: 'pointer' }}>
          <IconShare />
          <span className="sr-only">Share Chat</span>
        </button>
      </div>
    </header>
  );
};

export default ShareChatHeader;

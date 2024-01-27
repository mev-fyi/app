import React, { useEffect, useState } from 'react';
import { shareChat, getChat } from '@/app/actions';
import { toast } from 'react-hot-toast';
import { Chat } from '@/lib/types';
import { IconShare } from '@/components/ui/icons'; // Import the IconShare

interface ShareChatHeaderProps {
  chatId: string;
  userId: string;
}

const ShareChatHeader: React.FC<ShareChatHeaderProps> = ({ chatId, userId }) => {
  const [chat, setChat] = useState<Chat | null>(null);

  useEffect(() => {
    const fetchChat = async () => {
      const fetchedChat = await getChat(chatId, userId);
      setChat(fetchedChat);
    };

    fetchChat();
  }, [chatId, userId]);

  const handleShare = async () => {
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
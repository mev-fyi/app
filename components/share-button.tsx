import React, { useState } from 'react';
import { IconShare } from '@/components/ui/icons';
import toast from 'react-hot-toast';

interface ShareButtonProps {
  chatId: string; // Assuming chatId is a string
}

const ShareButton: React.FC<ShareButtonProps> = ({ chatId }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch(`/api/share-chat/${chatId}`);
      if (response.ok) {
        const { shareUrl } = await response.json();
        navigator.clipboard.writeText(shareUrl);
        toast.success('Link copied to clipboard!');
      } else {
        toast.error('Failed to generate shareable link.');
      }
    } catch (error) {
      toast.error('An error occurred while sharing.');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <button onClick={handleShare} disabled={isSharing} className="your-button-class">
      <IconShare className="your-icon-class" />
      {isSharing ? 'Generating link...' : 'Share'}
    </button>
  );
};

export default ShareButton;
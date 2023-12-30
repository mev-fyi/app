import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { IconShare } from '@/components/ui/icons';
import { Chat } from '@/lib/types'; // Import the Chat type

interface ShareButtonProps {
    id?: string
}

const ShareButton: React.FC<ShareButtonProps> = ({ id }) => {
  const [isSharing, setIsSharing] = useState(false);

  const handleShare = async () => {
    setIsSharing(true);
    try {
      const response = await fetch(`/api/share-chat/${id}`, {
        method: 'POST',
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to get the shareable link.');
      }

      const result = await response.json();
      navigator.clipboard.writeText(result.shareUrl);
      toast.success('Link copied to clipboard!');
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('An error occurred while sharing.');
      }
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
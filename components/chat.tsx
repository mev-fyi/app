'use client';
import React from 'react';
import { type Message } from 'ai/react';
import MetadataList from '@/components/metadata-list';
import { useChatService } from '@/lib/hooks/use-chat-service';
import { ChatList } from '@/components/chat-list';
import { ChatPanel } from '@/components/chat-panel';
import { EmptyScreen } from '@/components/empty-screen';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

// Extend the Message type to include structured_metadata
interface MetadataMessage extends Message {
  structured_metadata?: any[]; // Use the correct metadata type here
}

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: MetadataMessage[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  // Make sure that initialMessages is of type ExtendedMessage[] to match the new structure including structured_metadata
  const {
    // Now messages is of type ExtendedMessage[] which includes structured_metadata
    messages,
    sendMessage,
    isLoading,
    setInput,
    currentInput,
    startLoading,
    stopLoading,
    reloadChatHistory,
    displayPreviewTokenDialog,
    setPreviewTokenDialogVisibility,
    updatePreviewTokenInput,
    submitPreviewToken,
    previewTokenInputValue,
  } = useChatService(initialMessages);  // Update the useChatService hook to accept ExtendedMessage[] if it doesn't already

  // Assuming we don't need chatRequestOptions in this context, and it's safe to ignore it
  const handleReloadChatHistory = async (_chatRequestOptions?: unknown): Promise<string | null> => {
    if (id) {
      await reloadChatHistory(id);
    }
    return null;  // Now correctly returning a string | null
  };

  // Render function
  return (
    <>
      <div className={cn('pb-[200px] pt-4 md:pt-10', className)}>
        {messages.length ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stopLoading}
        append={sendMessage}
        reload={handleReloadChatHistory} // Changed to call the new function
        messages={messages}
        input={currentInput}
        setInput={setInput}
      />

      <Dialog open={displayPreviewTokenDialog} onOpenChange={setPreviewTokenDialogVisibility}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              Please enter your OpenAI API key to access the chat. Your token will be securely stored.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInputValue}
            placeholder="OpenAI API key"
            onChange={e => updatePreviewTokenInput(e.target.value)} // Updated to `updatePreviewTokenInput`
          />
          <DialogFooter className="items-center">
            <Button onClick={submitPreviewToken}> // Updated to `submitPreviewToken`
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
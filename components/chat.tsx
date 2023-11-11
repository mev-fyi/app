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
  structured_metadata?: any[]; // Ideally, define a more specific type instead of any[]
}

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: MetadataMessage[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const {
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
  } = useChatService(initialMessages);

  // Extract all metadata entries into a single array
  const metadataEntries = messages.flatMap(msg => 
    msg.role === 'assistant' && msg.structured_metadata ? msg.structured_metadata : []
  );

  // Assuming we don't need chatRequestOptions in this context, and it's safe to ignore it
  const handleReloadChatHistory = async (_chatRequestOptions?: unknown): Promise<string | null> => {
    if (id) {
      await reloadChatHistory(id);
    }
    return null;  // Now correctly returning a string | null
  };

  return (
    <div className={cn('flex h-full max-w-7xl mx-auto', className)}>
      <div className="flex-grow overflow-auto">
        {/* Chat messages */}
        {messages.length > 0 ? (
          <>
            <ChatList messages={messages} />
            <ChatScrollAnchor trackVisibility={isLoading} />
          </>
        ) : (
          <EmptyScreen setInput={setInput} />
        )}
        <ChatPanel
          id={id}
          isLoading={isLoading}
          stop={stopLoading}
          append={sendMessage}
          reload={handleReloadChatHistory}
          messages={messages}
          input={currentInput}
          setInput={setInput}
        />
      </div>
      <div className="w-80 p-4 overflow-auto">
        {/* Metadata section */}
        <MetadataList entries={metadataEntries} />
      </div>

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
            onChange={e => updatePreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button onClick={submitPreviewToken}>
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default Chat;
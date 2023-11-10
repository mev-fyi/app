import { useChatService } from '@/lib/hooks/use-chat-service';
import { type Message } from 'ai/react';
import React from 'react';
import { ChatList } from '@/components/chat-list';
import { ChatPanel } from '@/components/chat-panel';
import { EmptyScreen } from '@/components/empty-screen';
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { cn } from '@/lib/utils';

export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: Message[];
  id?: string;
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  const {
    messages,
    sendMessage,
    isLoading,
    setInput,
    currentInput,
    jobIdentifier,
    startLoading,
    stopLoading,
    reloadChatHistory,
    displayPreviewTokenDialog,
    setPreviewTokenDialogVisibility,
    updatePreviewTokenInput,
    submitPreviewToken,
    previewTokenInputValue,
  } = useChatService(initialMessages);

  // Assuming "reload" will be a button or some trigger to refresh chat history
  const handleReloadChatHistory = async (_chatRequestOptions?: unknown): Promise<string | null | undefined> => {
    if (id) {
      await reloadChatHistory(id);
    }
    return null; // to match expected return type
  };

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
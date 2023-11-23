import { type UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { MetadataMessage } from '@/components/chat'

export interface ChatPanelProps
  extends Pick<
    UseChatHelpers,
    | 'append'
    | 'isLoading'
    | 'reload'
    | 'messages'
    | 'stop'
    | 'input'
    | 'setInput'
  > {
  id?: string;
  onSubmit?: (value: string) => void | Promise<void>; // Add this line
  // Add new properties for the state-setting functions
  setMessages: (messages: MetadataMessage[]) => void;
  setStructuredMetadataEntries: (entries: any[]) => void; // Replace 'any[]' with a more specific type if available
  setLastMessageRole: (role: string) => void;
}

export function ChatPanel({
  id,
  isLoading,
  stop,
  append,
  reload,
  input,
  setInput,
  messages,
  onSubmit,
  setMessages,
  setStructuredMetadataEntries,
  setLastMessageRole
}: ChatPanelProps) {
  return (
    <div className="fixed inset-x-0 bottom-0 ">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-10 items-center justify-center">
          {isLoading ? (
            <Button
              variant="outline"
              onClick={() => stop()}
              className="bg-background"
            >
              <IconStop className="mr-2" />
              Stop generating
            </Button>
          ) : (
            messages?.length > 0 && (
              <Button
                variant="outline"
                onClick={() => reload()}
                className="bg-background"
              >
                <IconRefresh className="mr-2" />
                Regenerate response
              </Button>
            )
          )}
        </div>
        <div className="space-y-4 px-4 py-2 sm:rounded-t-xl md:py-4">
          <PromptForm
            onSubmit={async value => {
              if (onSubmit) {
                await onSubmit(value); // Call the onSubmit prop function
              } else {
                await append({
                  id,
                  content: value,
                  role: 'user'
                });
              }
            }}
            input={input}
            setInput={setInput}
            isLoading={isLoading}
            setMessages={setMessages}
            setStructuredMetadataEntries={setStructuredMetadataEntries}
            setLastMessageRole={setLastMessageRole}
            />
            <FooterText className="hidden sm:block" />
        </div>
      </div>
    </div>
  )
}

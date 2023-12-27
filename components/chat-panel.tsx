import { type UseChatHelpers } from 'ai/react'
import React, { useState } from 'react';
import { css } from '@emotion/react';
import styled from '@emotion/styled';
import { ClipLoader } from 'react-spinners'; // Import the desired spinner

import { Button } from '@/components/ui/button'
import { PromptForm } from '@/components/prompt-form'
import { ButtonScrollToBottom } from '@/components/button-scroll-to-bottom'
import { IconRefresh, IconStop } from '@/components/ui/icons'
import { FooterText } from '@/components/footer'
import { MetadataMessage } from '@/components/chat'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useRouter } from 'next/navigation'

const StyledClipLoader = styled(ClipLoader)`
  display: block;
  margin: 0 auto;
`;


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
  const router = useRouter();

  // Step 1: Create a state variable to track whether the backend response has been received
  const [responseReceived, setResponseReceived] = useState(false);
  // Temporarily set isLoading to true for testing
  isLoading = true;

  return (
    <div className="fixed inset-x-0 bottom-0 sm:mt-4 sm:mr-4 sm:ml-4">
      <ButtonScrollToBottom />
      <div className="mx-auto sm:max-w-2xl sm:px-4">
        <div className="flex h-4 items-center justify-center">
          {isLoading ? (
            <React.Fragment>
              <div className="text-center my-4">
                <StyledClipLoader
                  size={35}
                  color="#007bff"
                  loading={true}
                />
              </div>
              <Button
                variant="outline"
                className="bg-background"
                disabled={true}
              >
                <IconStop className="mr-2" />
                Generating...
              </Button>
            </React.Fragment>
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
        {/* Broom button and Prompt Form Container */}
        <div className="flex items-center space-x-4 bg-black sm:bg-transparent sm:rounded-t-xl px-4 py-2 md:py-4">
          {/* Broom button */}
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={e => {
                  e.preventDefault();
                  setMessages([]); // Resets the chat messages
                  setStructuredMetadataEntries([]); // Resets the structured metadata
                  setLastMessageRole(''); // Resets the last message role
                  setInput(''); // Resets the input field
                  router.refresh();
                  router.push('/');
                }}
                className="flex items-center justify-center h-8 w-8 rounded-full bg-background p-0"
              >
                🧹 {/* Broom emoji */}
                <span className="sr-only">New Chat</span>
              </button>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>

          {/* Prompt Form */}
          <div className="flex-grow mx-auto" style={{ maxWidth: '850px' }}>
            <PromptForm
              onSubmit={async value => {
                // Step 3: When submitting, show the loading animation
                setResponseReceived(false);
                if (onSubmit) {
                  await onSubmit(value); // Call the onSubmit prop function
                } else {
                  await append({
                    id,
                    content: value,
                    role: 'user'
                  });
                }
                // After submitting, set the responseReceived to true
                setResponseReceived(true);
              }}
              input={input}
              setInput={setInput}
              isLoading={isLoading}
              setMessages={setMessages}
              setStructuredMetadataEntries={setStructuredMetadataEntries}
              setLastMessageRole={setLastMessageRole}
            />
          </div>
        </div>

        <FooterText className="hidden sm:block" />
      </div>
    </div>
  );
}
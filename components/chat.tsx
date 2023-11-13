'use client'

import { useChat, UseChatOptions, type Message } from 'ai/react';
import { cn } from '@/lib/utils'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { useState } from 'react';
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import MetadataList from '@/components/metadata-list';


// Extend the Message type to include structured_metadata
interface MetadataMessage extends Message {
  structured_metadata?: any[]; // Ideally, define a more specific type instead of any[]
}

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'
export interface ChatProps extends React.ComponentProps<'div'> {
  initialMessages?: MetadataMessage[]
  id?: string
}

export function Chat({ id, initialMessages, className }: ChatProps) {
  console.log('Chat component rendering with id:', id);
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')

  // State to hold structured metadata entries
  const [structuredMetadataEntries, setStructuredMetadataEntries] = useState([]);
  const [newMessages, setMessages] = useState(initialMessages || []);

  const { messages, append, reload, stop, isLoading, input, setInput } =
  useChat({  // useExtendedChat
      initialMessages,
      id,
      body: {
        id,
        previewToken
      },
      onResponse: async (originalResponse) => {
        if (originalResponse.status === 401) {
          toast.error(originalResponse.statusText)
        } else if (originalResponse.ok) {
          // Clone the response before reading it to avoid "already read" errors
          const response = originalResponse.clone();
          try {
            const responseData = await response.json();
            setStructuredMetadataEntries(responseData.structured_metadata || []);
            setMessages(responseData.messages);

          } catch (error) {
            console.error('Error reading response data:', error);
            // Handle error scenario
          }
        }
      }
    })
  
  console.log('Messages state:', messages);
  console.log('Metadata entries:', structuredMetadataEntries);

  return (
    <>
      {/* Flex container for chatlist and metadata */}
      <div className={cn('flex flex-row', className)}> 
        {/* Chatlist */}
        <div className="flex-grow pb-[200px] pt-4 md:pt-10">
          {messages.length ? (
            <>
              <ChatList messages={newMessages} />
              <ChatScrollAnchor trackVisibility={isLoading} />
            </>
          ) : (
            <EmptyScreen setInput={setInput} />
          )}
        </div>
        
        {/* Metadata section */}
        <div className="w-full md:w-80 p-4 overflow-auto flex-shrink-0">
          <MetadataList entries={structuredMetadataEntries} />
        </div>
        
      </div>
      <ChatPanel
        id={id}
        isLoading={isLoading}
        stop={stop}
        append={append}
        reload={reload}
        messages={newMessages}
        input={input}
        setInput={setInput}
      />
      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              If you have not obtained your OpenAI API key, you can do so by{' '}
              <a
                href="https://platform.openai.com/signup/"
                className="underline"
              >
                signing up
              </a>{' '}
              on the OpenAI website. This is only necessary for preview
              environments so that the open source community can test the app.
              The token will be saved to your browser&apos;s local storage under
              the name <code className="font-mono">ai-token</code>.
            </DialogDescription>
          </DialogHeader>
          <Input
            value={previewTokenInput}
            placeholder="OpenAI API key"
            onChange={e => setPreviewTokenInput(e.target.value)}
          />
          <DialogFooter className="items-center">
            <Button
              onClick={() => {
                setPreviewToken(previewTokenInput)
                setPreviewTokenDialog(false)
              }}
            >
              Save Token
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

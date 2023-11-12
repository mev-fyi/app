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
import { useState, useEffect } from 'react';
import { Button } from './ui/button'
import { Input } from './ui/input'
import { toast } from 'react-hot-toast'
import { ExtendedMessage } from 'lib/types'; // Adjust the import path as needed
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

// function useExtendedChat(options: UseChatOptions) {
//     const chat = useChat(options);
//     const [extendedMessages, setExtendedMessages] = useState<ExtendedMessage[]>([]);
//   
//     useEffect(() => {
//       // Map over messages and ensure that each one has the structured_metadata property
//       const updatedMessages = chat.messages.map((message) => ({
//         ...message,
//         // Add structured_metadata if it doesn't exist on the message
//         structured_metadata: 'structured_metadata' in message ? (message.structured_metadata as any[]) : [],
//       }));
//       setExtendedMessages(updatedMessages);
//     }, [chat.messages]);
//   
//     return { ...chat, messages: extendedMessages };
//   }
  
// State to hold structured metadata entries
  const [structuredMetadataEntries, setStructuredMetadataEntries] = useState([]);

  const { messages, append, reload, stop, isLoading, input, setInput } =
  useChat({  // useExtendedChat
      initialMessages,
      id,
      body: {
        id,
        previewToken
      },
      onResponse: async (response) => {
        if (response.status === 401) {
          toast.error(response.statusText)
        } else if (response.ok && response.body){
          // const messageData = JSON.parse(response.body);
          const messageData = await response.json(); // This reads the stream and parses the JSON.
          setStructuredMetadataEntries(messageData.structured_metadata || []);
        }
      }
    })
  
    console.log('Messages state:', messages);

   // Extract all metadata entries into a single array
   // const metadataEntries = messages.flatMap(msg => 
   //   msg.role === 'assistant' && msg.structured_metadata ? msg.structured_metadata : []
   // );

  //  const metadataEntries = messages.flatMap(msg => 
  //   msg.role === 'assistant' && msg.structured_metadata ? msg.structured_metadata : []
  // );
  // const metadataEntries = [
  //   {
  //     index: 1,
  //     title: "Futuristic Skyline: Architecture of Tomorrow",
  //     link: "https://example.com/architecture",
  //     extraInfo: "Skyline Studios",
  //     extraInfoType: "Production Company",
  //     publishedDate: new Date('2023-08-01'),
  //     publishedDateString: "2023-08-01"
  //   },
  //   {
  //     index: 2,
  //     title: "The Dawn of Cybernetic Enhancements",
  //     link: "https://example.com/cybernetics",
  //     extraInfo: "CyberTech Inc.",
  //     extraInfoType: "Manufacturer",
  //     publishedDate: new Date('2023-07-20'),
  //     publishedDateString: "2023-07-20"
  //   },
  //   {
  //     index: 3,
  //     title: "Exploring the Neon Markets of Neo-Tokyo",
  //     link: "https://example.com/neon-markets",
  //     extraInfo: "Neon Adventures",
  //     extraInfoType: "Travel Blog",
  //     publishedDate: new Date('2023-09-12'),
  //     publishedDateString: "2023-09-12"
  //   }
  // ];
  
  console.log('Metadata entries:', structuredMetadataEntries);

   // <div className="w-full md:w-80 p-4 overflow-auto">
   //      {/* Metadata section */}
   //      <MetadataList entries={metadataEntries} />
   // </div>


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
        stop={stop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />
      <div className="w-full md:w-80 p-4 overflow-auto">
        {/* Metadata section */}
        <MetadataList entries={structuredMetadataEntries} />
      </div>
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

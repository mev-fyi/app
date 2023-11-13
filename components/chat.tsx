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
import styles from './ChatListContainer.module.css'; // Import the CSS module


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
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>(
    'ai-token',
    null
  )
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')

  // State to hold structured metadata entries
  const [structuredMetadataEntries, setStructuredMetadataEntries] = useState([]);
  const [newMessages, setMessages] = useState(initialMessages || []);

  const [isMetadataVisible, setIsMetadataVisible] = useState(false);
  const toggleMetadataVisibility = () => {
    setIsMetadataVisible(!isMetadataVisible);
  };

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
            responseData.messages = responseData.messages.map((message: Message) => {
              if (message.role === "assistant") {
                  try {
                      // Try to parse the content as JSON
                      const parsedContent = JSON.parse(message.content);
                      
                      // Check if parsedContent has a messages array and it's not empty
                      if (parsedContent.messages && parsedContent.messages.length > 0) {
                          // Replace content with the last message of the messages array
                          message.content = parsedContent.messages[parsedContent.messages.length - 1].content;
                      }
                  } catch (error) {
                      // If parsing fails or doesn't meet criteria, leave content as is
                      console.error("Error parsing message content:", error);
                  }
              }
              return message;
            
            });
            setMessages(responseData.messages);

          } catch (error) {
            console.error('Error reading response data:', error);
            // Handle error scenario
          }
        }
      }
    })

  return (
    <>
      <div className={styles.chatAndPromptContainer}>
        {/* Main flex container for chatlist and metadata */}
        <div className={styles.flexContainer}> 
          {/* Chatlist container with scrollable content */}
          <div className={styles.chatListContainer}>
            {messages.length ? (
              <>
                <ChatList messages={newMessages} />
                <ChatScrollAnchor trackVisibility={isLoading} />
              </>
            ) : (
              <EmptyScreen setInput={setInput} />
            )}
          </div>
          
           {/* Toggle button for the metadata view on mobile */}
          <div 
            className={styles.toggleMetadataButton}
            onClick={toggleMetadataVisibility}
          >
            {isMetadataVisible ? 'Hide Sources' : 'Show Sources'}
          </div>
          
          {/* Metadata section */}
          <div 
            className={`${styles.metadataContainer} ${isMetadataVisible ? styles.metadataContainerActive : ''}`}
          >
            <div className={styles.metadataTitle}>Top Sources</div>
            <MetadataList entries={structuredMetadataEntries} />
          </div>
        </div>
    
        {/* ChatPanel component */}
        <div className={styles.promptFormContainer}>
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
        </div>
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

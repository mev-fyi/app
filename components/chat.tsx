'use client'

import { useEffect, useState } from 'react'
import { useLocalStorage } from '@/lib/hooks/use-local-storage'
import { ChatList } from '@/components/chat-list'
import { ChatPanel } from '@/components/chat-panel'
import { EmptyScreen } from '@/components/empty-screen'
import { ChatScrollAnchor } from '@/components/chat-scroll-anchor'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from './ui/button'
import { Input } from './ui/input'
import { cn } from '@/lib/utils'
import { toast } from 'react-hot-toast'

const IS_PREVIEW = process.env.VERCEL_ENV === 'preview'

export interface ChatProps extends React.ComponentProps<'div'> {
  id?: string
}

export function Chat({ id, className }: ChatProps) {
  const [messages, setMessages] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [input, setInput] = useState('')
  const [previewToken, setPreviewToken] = useLocalStorage<string | null>('ai-token', null)
  const [previewTokenDialog, setPreviewTokenDialog] = useState(IS_PREVIEW)
  const [previewTokenInput, setPreviewTokenInput] = useState(previewToken ?? '')
  const [jobId, setJobId] = useState<string | null>(null); // State to store the job ID from the backend
  const [eventSource, setEventSource] = useState<EventSource | null>(null);

  useEffect(() => {
    if (jobId) {
      const newEventSource = new EventSource(`/api/stream/${jobId}`);
      setEventSource(newEventSource);

      return () => {
        newEventSource.close();
      };
    }
  }, [jobId]);

  useEffect(() => {
    if (eventSource) {
      eventSource.onmessage = (e) => {
        const newMessage = JSON.parse(e.data);
        setMessages((prevMessages) => {
          // Avoid adding duplicate messages if they are already displayed
          const messageIds = new Set(prevMessages.map(msg => msg.id));
          return messageIds.has(newMessage.id) ? prevMessages : [...prevMessages, newMessage];
        });
      };
      eventSource.onerror = (e) => {
        toast.error('Error connecting to chat updates.');
        setIsLoading(false);
      };
    }
  }, [eventSource]);

  // Handlers for chat actions
  const handleStop = () => {
    setIsLoading(false)
    eventSource?.close()
  }

  // Append function to send a message to the server
  const append = async (messageContent: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Include the `Authorization` header if your backend requires it
          'Authorization': `Bearer ${previewToken}`,
        },
        body: JSON.stringify({ id, message: messageContent }),
      });

      if (!response.ok) {
        throw new Error('Error sending message to backend.');
      }

      const { job_id } = await response.json(); // Extract `job_id` from backend response
      setJobId(job_id); // Prepare to listen for updates from this job ID
      setInput(''); // Clear the input field after sending the message

    } catch (error) {
      toast.error('Message sending failed.');
    } finally {
      setIsLoading(false);
    }
  };

  // Reload function to refresh the chat history from the server
  const reload = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/chat/history?id=${id}`, {
        headers: {
          'Authorization': `Bearer ${previewToken}`
        }
      });

      if (response.ok) {
        const history = await response.json();
        setMessages(history);
      } else {
        toast.error('Failed to reload chat history.');
      }
    } catch (error) {
      toast.error('Failed to reload chat history.');
    } finally {
      setIsLoading(false);
    }
  }

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
        stop={handleStop}
        append={append}
        reload={reload}
        messages={messages}
        input={input}
        setInput={setInput}
      />

      <Dialog open={previewTokenDialog} onOpenChange={setPreviewTokenDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Enter your OpenAI Key</DialogTitle>
            <DialogDescription>
              Please enter your OpenAI API key to access the chat. Your token will be securely stored.
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
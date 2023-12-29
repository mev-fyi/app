import { UseChatHelpers } from 'ai/react'
import * as React from 'react'
import Textarea from 'react-textarea-autosize'

import { Button, buttonVariants } from '@/components/ui/button'
import { IconArrowElbow, IconPlus, IconNewChat } from '@/components/ui/icons'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { useRouter } from 'next/navigation'
import { MetadataMessage } from './chat'
import { IconBroom } from '@/components/ui/icons'
import './PromptFormStyles.css'; // Import the custom CSS file

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
  // Add new properties for the state-setting functions
  setMessages: (messages: MetadataMessage[]) => void;
  setStructuredMetadataEntries: (entries: any[]) => void; // Replace 'any[]' with a more specific type if available
  setLastMessageRole: (role: string) => void;
  setShowTopSources: (value: boolean) => void;
  setFadeOutCompleted: (value: boolean) => void;
  setMetadataContainerVisible: (value: boolean) => void;
  setShowLeftPanelOverlay: (value: boolean) => void;
  setShowMiddlePanelOverlay: (value: boolean) => void;
  setShowEmptyScreen: (value: boolean) => void;
  setShowChatList: (value: boolean) => void;
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading,
  setMessages,
  setStructuredMetadataEntries,
  setLastMessageRole,
  setShowTopSources,
  setFadeOutCompleted,
  setMetadataContainerVisible,
  setShowLeftPanelOverlay,
  setShowMiddlePanelOverlay,
  setShowEmptyScreen,
  setShowChatList,
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  React.useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

    return (
    <form
      onSubmit={async e => {
        e.preventDefault()
        if (!input?.trim()) return
        setInput('')
        await onSubmit(input)
      }}
      ref={formRef}
    >
      <div className="relative flex w-full flex-col overflow-hidden px-2 sm:rounded-md sm:border bg-black sm:bg-transparent">
        <Textarea
          ref={inputRef}
          onKeyDown={onKeyDown}
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Send a message."
          spellCheck={false}
          className="w-full resize-none py-[1.3rem] focus-within:outline-none text-base"
        />
        <div className="absolute top-4 right-0 sm:right-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={isLoading || input === ''}>
                <IconArrowElbow />
                <span className="sr-only">Send message</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>Send message</TooltipContent>
          </Tooltip>
        </div>
      </div>
    </form>
  )
}

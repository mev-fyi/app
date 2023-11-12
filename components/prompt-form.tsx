import { UseChatHelpers } from 'ai/react'
import Textarea from 'react-textarea-autosize'
import { Button } from '@/components/ui/button'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { useRouter } from 'next/navigation'
import React, { useRef, useEffect } from 'react'
import styles from './MetadataList.module.css'; // Import the CSS module

export interface PromptProps extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({ onSubmit, input, setInput, isLoading }: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = useRef<HTMLTextAreaElement>(null)
  const router = useRouter()

  useEffect(() => {
    inputRef.current?.focus()
  }, [])

  return (
    <form
      onSubmit={e => {
        e.preventDefault()
        if (input.trim()) {
          onSubmit(input)
          setInput('')
        }
      }}
      ref={formRef}
    >
        <div className="relative flex w-full flex-col overflow-hidden bg-background px-4 py-2 sm:rounded-md sm:border">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              type="button"
              onClick={() => router.push('/')}
              className={styles.newChatButton} // Use the style from the module
            >
              <IconPlus />
              <span className="sr-only">New Chat</span>
            </button>
          </TooltipTrigger>
          <TooltipContent>New Chat</TooltipContent>
        </Tooltip>
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            rows={1}
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Send a message."
            spellCheck={false}
            className={`${styles.textareaWithButton} w-full resize-none bg-transparent text-sm focus:outline-none`} // Use the style from the module
          />
        <div className="absolute right-0 top-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
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

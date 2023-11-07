import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'

const exampleMessages = [
  {
    heading: 'What is loss-versus-rebalancing (LVR)?',
    message: `What is loss-versus-rebalancing (LVR)?`
  },
  {
    heading: 'What are intents?',
    message: 'What are intents?'
  },
  {
    heading: 'Describe exhaustively the MEV supply chain',
    message: `Describe exhaustively the MEV supply chain`
  }
]

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold">
          Welcome to mev.fyi Chatbot!
        </h1>
        <p className="mb-2 leading-normal text-muted-foreground">
        mev.fyi is the Maximal Extractable Value (MEV) research chatbot.
        Created by <ExternalLink href="https://twitter.com/unlock_VALue">Valentin</ExternalLink> and funded by <ExternalLink href="https://www.flashbots.net/">Flashbots'</ExternalLink> grant, with special thanks to <ExternalLink href="https://www.twitter.com/freddmannen">Fred</ExternalLink>.
        mev.fyi thrives to lower the level of education required to onboard and contribute to
        MEV-related research, across mechanism design, auction theory, incentives alignment ... from research papers and YouTube videos.
          .
        </p>
        <p className="leading-normal text-muted-foreground">
          You can start a conversation here or try the following examples:
        </p>
        <div className="mt-4 flex flex-col items-start space-y-2">
          {exampleMessages.map((message, index) => (
            <Button
              key={index}
              variant="link"
              className="h-auto p-0 text-base"
              onClick={() => setInput(message.message)}
            >
              <IconArrowRight className="mr-2 text-muted-foreground" />
              {message.heading}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

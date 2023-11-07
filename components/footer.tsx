import React from 'react'

import { cn } from '@/lib/utils'
import { ExternalLink } from '@/components/external-link'

export function FooterText({ className, ...props }: React.ComponentProps<'p'>) {
  return (
    <p
      className={cn(
        'px-2 text-center text-xs leading-normal text-muted-foreground',
        className
      )}
      {...props}
    >
      Created by <ExternalLink href="https://twitter.com/unlock_VALue">Valentin</ExternalLink> and 
      funded by <ExternalLink href="https://www.flashbots.net/">Flashbots'</ExternalLink> grant, 
      with special thanks to <ExternalLink href="https://www.twitter.com/freddmannen">Fred</ExternalLink>.
      .
    </p>
  )
}

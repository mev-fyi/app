/* eslint-disable react/no-unescaped-entities */
import { UseChatHelpers } from 'ai/react'

import { Button } from '@/components/ui/button'
import { ExternalLink } from '@/components/external-link'
import { IconArrowRight } from '@/components/ui/icons'
import { GithubLoginButton, GoogleLoginButton } from './login-button'

export function LandingPage() {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <h1 className="mb-2 text-xl font-semibold">
        <code>mev.fyi</code>
      </h1>
      <p className="mb-2 leading-normal">
        <code>
          <ExternalLink href="https://nextjs.org">mev.fyi</ExternalLink>
        </code>
        aims to lower the level of education required to contribute to
        MEV-related research. The current vision of mev.fyi is to provide a
        conversational tool, to directly frame and quote definitions provided by
        industry leaders and researchers.
        <p className="mb-2 leading-normal">
          Right now, mev.fyi provides a scalable way of contributing and
          displaying research content via the Typeform add.mev.fyi and the
          numerous worksheets of data.mev.fyi, i.e. the MEV Research Hub.
        </p>
        <div className="flex flex-row">
          <GithubLoginButton />
          <GoogleLoginButton className="mx-5" />
        </div>
      </p>
    </div>
  )
}

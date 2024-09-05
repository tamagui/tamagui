'use client'

import { Lock } from '@tamagui/lucide-icons'
import { H2, Paragraph, YStack } from 'tamagui'

// import { ButtonLink } from './Link'

export const SponsorshipRequired = () => {
  return (
    <ErrorContainer>
      <H2 textAlign="center">This feature is only accessible for sponsors.</H2>
      <Paragraph textAlign="center">
        You are not a tamagui sponsor. Sponsor the project to access Studio.
      </Paragraph>
      {/* <ButtonLink href="https://github.com/sponsors/natew">Sponsor Tamagui</ButtonLink> */}
    </ErrorContainer>
  )
}

export const SponsorshipTooLow = () => {
  return (
    <ErrorContainer>
      <H2 textAlign="center">This feature is only accessible for sponsors.</H2>
      <Paragraph textAlign="center">
        You are a sponsor, but your tier doesn&apos;t include Studio access. Please get a
        tier that includes Studio.
      </Paragraph>
      {/* <ButtonLink href="https://github.com/sponsors/natew">Sponsor Tamagui</ButtonLink> */}
    </ErrorContainer>
  )
}

export const NotSignedInWithGithub = () => {
  return (
    <ErrorContainer>
      <H2 textAlign="center">GitHub account not connected</H2>
      <Paragraph textAlign="center">
        This page is only accessible for sponsors. We need your GitHub account connected
        to check your status.
      </Paragraph>
      {/* <ButtonLink href="/account">Connect GitHub</ButtonLink> */}
    </ErrorContainer>
  )
}

const ErrorContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack padding="$2" alignItems="center" space>
      <Lock size="$10" />
      {children}
    </YStack>
  )
}

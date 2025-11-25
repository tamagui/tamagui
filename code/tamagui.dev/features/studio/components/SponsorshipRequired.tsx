'use client'

import { Lock } from '@tamagui/lucide-icons'
import { H2, Paragraph, YStack } from 'tamagui'

export const SponsorshipRequired = () => {
  return (
    <ErrorContainer>
      <H2 text="center">This feature is only accessible for sponsors.</H2>
      <Paragraph text="center">
        You are not a tamagui sponsor. Sponsor the project to access Studio.
      </Paragraph>
      {/* <ButtonLink href="https://github.com/sponsors/natew">Sponsor Tamagui</ButtonLink> */}
    </ErrorContainer>
  )
}

export const SponsorshipTooLow = () => {
  return (
    <ErrorContainer>
      <H2 text="center">This feature is only accessible for sponsors.</H2>
      <Paragraph text="center">
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
      <H2 text="center">GitHub account not connected</H2>
      <Paragraph text="center">
        This page is only accessible for sponsors. We need your GitHub account connected
        to check your status.
      </Paragraph>
      {/* <ButtonLink href="/account">Connect GitHub</ButtonLink> */}
    </ErrorContainer>
  )
}

const ErrorContainer = ({ children }: { children: React.ReactNode }) => {
  return (
    <YStack p="$2" items="center" gap="$4">
      <Lock size="$10" />
      {children}
    </YStack>
  )
}

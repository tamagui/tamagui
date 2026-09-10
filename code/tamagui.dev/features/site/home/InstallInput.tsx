import { Bot, Check, Copy } from '@tamagui/lucide-icons-2'
import { memo } from 'react'
import { Paragraph, TooltipSimple, XStack } from 'tamagui'
import { Button } from '~/components/Button'

import { useClipboard } from '~/hooks/useClipboard'

const installScript = 'npm create tamagui@latest'

const agentPrompt = `Set up Tamagui v3 in this project. Read the docs pages that match my situation before writing any code, and follow them exactly rather than guessing at APIs.

Start here: https://tamagui.dev/docs/intro/introduction

New project:
- https://tamagui.dev/docs/intro/installation

Adding to an existing app, plus the guide for its bundler:
- https://tamagui.dev/docs/intro/installation
- Vite: https://tamagui.dev/docs/guides/vite
- Expo / Metro: https://tamagui.dev/docs/guides/expo
- Next.js: https://tamagui.dev/docs/guides/next-js
- One: https://tamagui.dev/docs/guides/one
- Webpack: https://tamagui.dev/docs/guides/webpack

Upgrading from v1 or v2:
- https://tamagui.dev/docs/guides/how-to-upgrade

Then read these regardless:
- Style syntax: https://tamagui.dev/docs/intro/styles
- Tailwind classNames: https://tamagui.dev/docs/core/tailwind
- Compiler setup: https://tamagui.dev/docs/intro/compiler-install
- Ready-made briefs and the mistakes agents make most: https://tamagui.dev/docs/intro/agents

Tell me which of the three situations you detected before you change anything.`

export const InstallInput = memo(() => {
  const install = useClipboard(installScript)
  const prompt = useClipboard(agentPrompt)

  return (
    <XStack gap="3" items="center" flexWrap="wrap">
      <XStack
        borderWidth={1}
        borderColor="color5"
        bg="color2"
        overflow="hidden"
        paddingRight="2"
        pl="4"
        gap="3"
        height={48}
        items="center"
        rounded={10}
      >
        <Paragraph fontSize={14} fontWeight="500" fontFamily="mono" lineHeight="20px">
          {installScript}
        </Paragraph>
        <TooltipSimple
          placement="top"
          label={install.hasCopied ? 'Copied' : 'Copy to clipboard'}
        >
          <Button
            aria-label={
              install.hasCopied ? 'Install command copied' : 'Copy install command'
            }
            size="sm"
            circular
            variant="quiet"
            icon={install.hasCopied ? Check : Copy}
            onPress={install.onCopy}
          />
        </TooltipSimple>
      </XStack>

      <TooltipSimple
        placement="top"
        label="A prompt pointing your agent at the right docs"
      >
        <Button
          size="lg"
          rounded={10}
          variant="outlined"
          icon={prompt.hasCopied ? Check : Bot}
          onPress={prompt.onCopy}
          aria-label="Copy a setup prompt for your coding agent"
        >
          <Button.Text>{prompt.hasCopied ? 'Copied' : 'Copy agent prompt'}</Button.Text>
        </Button>
      </TooltipSimple>
    </XStack>
  )
})

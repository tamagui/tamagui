import { Bot, Check, Copy } from '@tamagui/local-icons'
import { memo } from 'react'
import { Paragraph, TooltipSimple, XStack } from 'tamagui'
import { Button } from '~/components/Button'

import { AGENT_SETUP_PROMPT } from '~/components/CopyAgentSetupButton'
import { useClipboard } from '~/hooks/useClipboard'

const installScript = 'npm create tamagui@latest'
const agentPrompt = AGENT_SETUP_PROMPT

export const InstallInput = memo(() => {
  const install = useClipboard(installScript)
  const prompt = useClipboard(agentPrompt)

  return (
    <XStack gap="1-5" items="center" flexWrap="wrap">
      <XStack
        borderWidth={0.5}
        borderColor="color-3"
        bg="color-1"
        overflow="hidden"
        paddingRight="1-5"
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
          placement="bottom"
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
        placement="right"
        label="A prompt pointing your agent at the right docs"
      >
        <Button
          size="md"
          variant="quiet"
          borderless
          icon={prompt.hasCopied ? Check : Bot}
          onPress={prompt.onCopy}
          aria-label="Copy a setup prompt for your coding agent"
          fontFamily="mono"
        >
          <Button.Text color="color-8">
            {prompt.hasCopied ? 'Copied' : 'Copy prompt'}
          </Button.Text>
        </Button>
      </TooltipSimple>
    </XStack>
  )
})

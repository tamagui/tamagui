// Shown on component pages in Source mode: the exact default skin source the
// registry ships for this component — copyable — plus its dependency info.
// The payload comes from the page loader (serializable); see
// `getOwnedSource` in ~/features/mdx/sourceMode.
import { CheckCircle, Copy, FileCode2 } from '@tamagui/local-icons'
import { Paragraph, ScrollView, XStack, YStack } from 'tamagui'
import { Button } from '~/components/Button'
import { Code } from '~/components/Code'
import { Pre } from '~/components/Pre'
import { useClipboard } from '~/hooks/useClipboard'

export type OwnedSourceCopy = {
  target: string
  name: string
  via?: string
}

export type OwnedSource = {
  skin: string
  target: string
  content: string
  description?: string
  /** every registry file to copy, dependency-closed. */
  copies: OwnedSourceCopy[]
  /** union of npm deps across the closure. */
  dependencies: string[]
  tokens?: string[]
  native?: string[]
}

export function OwnedSourceBlock({ source }: { source: OwnedSource }) {
  const { hasCopied, onCopy } = useClipboard(source.content, { showToast: false })
  const install = source.dependencies.length
    ? `yarn add ${source.dependencies.join(' ')}`
    : null
  const installClipboard = useClipboard(install ?? '')

  return (
    <YStack
      testID="owned-source"
      gap="3"
      mt="8"
      p="4"
      rounded="4"
      borderWidth={1}
      borderColor="border-color"
      bg="color-1"
    >
      <Paragraph size="6" fontWeight="600" id="source">
        Source
      </Paragraph>

      <Paragraph size="3" color="color-11">
        {source.description
          ? `${source.description} `
          : `The default ${source.skin} skin. `}
        This is the exact source the registry ships — copy it into your app and the
        examples above import from your copy.
      </Paragraph>

      <XStack items="center" gap="1-5">
        <FileCode2 size="5" color="color-11" />
        <Code fontSize="2">{source.target}</Code>
        <XStack ml="auto">
          <Button
            testID="owned-source-copy"
            aria-label={`Copy ${source.skin} source to clipboard`}
            size="xs"
            height={28}
            minHeight={28}
            display="inline-flex"
            variant="outlined"
            borderWidth="px"
            icon={hasCopied ? CheckCircle : Copy}
            onPress={() => onCopy()}
          >
            {hasCopied ? 'Copied' : 'Copy'}
          </Button>
        </XStack>
      </XStack>

      <Pre
        p={0}
        mb={0}
        bg="color-2"
        borderWidth={1}
        borderColor="color-3"
        rounded="4"
        overflow="hidden"
        position="relative"
        maxH={480}
      >
        <ScrollView style={{ maxHeight: 480 }} showsVerticalScrollIndicator={false}>
          <Code p="4" bg="transparent" flex={1} size="3">
            {source.content}
          </Code>
        </ScrollView>
      </Pre>

      {source.copies.length > 1 && (
        <YStack gap="0-5">
          <Paragraph size="2" fontWeight="600">
            Also copy
          </Paragraph>
          {source.copies
            .filter((copy) => copy.target !== source.target)
            .map((copy) => (
              <Paragraph key={copy.target} size="2" color="color-11">
                <Code fontSize="2">{copy.target}</Code>
                {` (registry item "${copy.name}"${copy.via ? `, via "${copy.via}"` : ''})`}
              </Paragraph>
            ))}
        </YStack>
      )}

      {install && (
        <YStack gap="0-5">
          <Paragraph size="2" fontWeight="600">
            Dependencies
          </Paragraph>
          <XStack items="center" gap="1-5">
            <Code fontSize="2" flex={1}>
              {install}
            </Code>
            <Button
              testID="owned-source-copy-deps"
              aria-label="Copy install command to clipboard"
              size="xs"
              height={28}
              minHeight={28}
              variant="outlined"
              borderWidth="px"
              icon={installClipboard.hasCopied ? CheckCircle : Copy}
              onPress={() => installClipboard.onCopy()}
            >
              {installClipboard.hasCopied ? 'Copied' : 'Copy'}
            </Button>
          </XStack>
          {(!!source.tokens?.length || !!source.native?.length) && (
            <Paragraph size="1" color="color-9">
              {[
                source.tokens?.length
                  ? `Expects theme tokens: ${source.tokens.join(', ')}.`
                  : '',
                source.native?.length ? `Native: ${source.native.join(' ')}` : '',
              ]
                .filter(Boolean)
                .join(' ')}
            </Paragraph>
          )}
        </YStack>
      )}

      <Paragraph size="1" color="color-9">
        Need raw behavior without any skin? <Code fontSize="1">tamagui/unstyled</Code>{' '}
        re-exports the <Code fontSize="1">@tamagui/ui</Code> primitives (advanced).
      </Paragraph>
    </YStack>
  )
}

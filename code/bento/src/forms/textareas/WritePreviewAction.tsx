import { useState } from 'react'
import { Button, Separator, Tabs, Text, TextArea, View, styled } from 'tamagui'
import { Paperclip, Send } from '../../icons'
import { tone } from '../../tone'

/** ------ EXAMPLE ------ */
export function WritePreviewAction() {
  const [tab, setTab] = useState('write')
  const [comment, setComment] = useState('')

  return (
    <Tabs value={tab} onValueChange={setTab} width={520} maxW="100%">
      <View
        width="100%"
        overflow="hidden"
        bg={tone.surface}
        borderColor={tone.border}
        borderWidth={1}
        rounded="6"
        boxShadow="0 1px 3px shadow-color"
      >
        <View p="2" pb="0">
          <Tabs.List self="flex-start" gap="1" p="1" rounded="4" bg={tone.fill}>
            <Segment value="write" active={tab === 'write'}>
              <SegmentText active={tab === 'write'}>Write</SegmentText>
            </Segment>
            <Segment value="preview" active={tab === 'preview'}>
              <SegmentText active={tab === 'preview'}>Preview</SegmentText>
            </Segment>
          </Tabs.List>
        </View>

        <Tabs.Content value="write">
          <CommentArea
            aria-label="Comment"
            placeholder="Leave a comment"
            value={comment}
            onChangeText={setComment}
          />
        </Tabs.Content>
        <Tabs.Content value="preview" minH={160} p="4">
          {comment ? (
            <View gap="1">
              {comment.split('\n').map((line, i) => (
                <Text key={i} fontFamily="body" fontSize="sm" color="color-12">
                  {line ? renderInline(line, `${i}-`) : ' '}
                </Text>
              ))}
            </View>
          ) : (
            <Text fontFamily="body" fontSize="sm" color={tone.muted}>
              Nothing to preview yet.
            </Text>
          )}
        </Tabs.Content>

        <Separator borderColor={tone.border} />
        <View flexDirection="row" px="2" py="2" justify="space-between" items="center">
          <Button
            size="sm"
            variant="quiet"
            circular
            aria-label="Attach a file"
            icon={Paperclip}
          />
          <Button size="sm" theme="accent" icon={Send} disabled={!comment}>
            Comment
          </Button>
        </View>
      </View>
    </Tabs>
  )
}

// just enough markdown for a comment preview: **bold**, *italic*, `code`
function renderInline(line: string, keyPrefix: string) {
  return line
    .split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g)
    .filter(Boolean)
    .map((part, i) => {
      const key = `${keyPrefix}${i}`
      if (part.startsWith('**') && part.endsWith('**')) {
        return (
          <Text key={key} fontWeight="700">
            {part.slice(2, -2)}
          </Text>
        )
      }
      if (part.length > 2 && part.startsWith('*') && part.endsWith('*')) {
        return (
          <Text key={key} fontStyle="italic">
            {part.slice(1, -1)}
          </Text>
        )
      }
      if (part.length > 2 && part.startsWith('`') && part.endsWith('`')) {
        return (
          <Text
            key={key}
            fontFamily="mono"
            fontSize="xs"
            bg={tone.fill}
            px="1"
            rounded="2"
          >
            {part.slice(1, -1)}
          </Text>
        )
      }
      return <Text key={key}>{part}</Text>
    })
}

const Segment = styled(Tabs.Tab, {
  unstyled: true,
  px: '3',
  py: '1',
  rounded: '3',
  borderWidth: 0,
  cursor: 'pointer',
  bg: 'transparent',
  variants: {
    active: {
      true: { bg: tone.surface, boxShadow: '0 1px 2px shadow-color' },
    },
  } as const,
})

const SegmentText = styled(Text, {
  fontFamily: 'body',
  fontSize: 'sm',
  fontWeight: '500',
  color: tone.muted,
  variants: {
    active: {
      true: { color: 'color-12' },
    },
  } as const,
})

const CommentArea = styled(TextArea, {
  minH: 160,
  rounded: 0,
  p: '4',
  fontFamily: 'body',
  fontSize: 'sm',
  color: 'color-12',
  placeholderTextColor: tone.muted,
  bg: 'transparent',
  borderWidth: 0,
  outlineWidth: 0,
})

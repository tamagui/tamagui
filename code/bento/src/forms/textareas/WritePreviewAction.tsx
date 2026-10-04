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
          <Text fontFamily="body" fontSize="sm" color={comment ? 'color-12' : tone.muted}>
            {comment || 'Nothing to preview yet.'}
          </Text>
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

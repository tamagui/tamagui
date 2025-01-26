import { Paperclip, Send } from '@tamagui/lucide-icons'
import { useState } from 'react'
import { Button, Separator, Text, Tabs, TextArea, View, styled } from 'tamagui'

/** ------ EXAMPLE ------ */
export function WritePreviewAction() {
  const [activeTab, setActiveTab] = useState('write')
  const [comment, setComment] = useState<string>()

  return (
    <Tabs
      width={500}
      maxWidth="100%"
      value={activeTab}
      onValueChange={setActiveTab}
      $group-window-sm={{
        paddingVertical: '$6',
      }}
    >
      <View
        width="100%"
        overflow="hidden"
        backgroundColor="$background"
        borderColor="$borderColor"
        borderWidth={1}
        borderRadius="$4"
      >
        <View flexDirection="row">
          <Tabs.List width="100%" backgroundColor="$color5" borderRadius={0}>
            <StyledTab
              bblr={0}
              borderBottomRightRadius={0}
              value="write"
              tabSelected={activeTab === 'write'}
            >
              <Text fontSize="$3" lineHeight="$3" fontWeight="$3">
                Write
              </Text>
            </StyledTab>
            <StyledTab
              bblr={0}
              borderBottomRightRadius={0}
              borderTopRightRadius={0}
              value="preview"
              tabSelected={activeTab === 'preview'}
            >
              <Text fontSize="$3" lineHeight="$3" fontWeight="$3">
                Preview
              </Text>
            </StyledTab>
          </Tabs.List>
        </View>
        <Tabs.Content theme="active" value="write" backgroundColor="$color1">
          <StyledTextArea
            size="$4"
            padding="$4"
            height={200}
            fontWeight="300"
            numberOfLines={5}
            placeholder="Your comment here..."
            placeholderTextColor="$placeholderColor"
            color="$color12"
            backgroundColor="$color1"
            defaultValue={comment}
            onChangeText={(text) => setComment(text)}
          />
        </Tabs.Content>
        <Tabs.Content theme="active" backgroundColor="$color1" value="preview">
          <Text
            fontSize="$3"
            lineHeight="$3"
            fontWeight="300"
            borderColor="$color1"
            padding="$3"
            height={200}
          >
            {comment ?? 'Your text preview'}
          </Text>
        </Tabs.Content>
        <Separator />
        <View
          flexDirection="row"
          paddingHorizontal="$3"
          paddingVertical="$2"
          justifyContent="space-between"
          alignItems="center"
        >
          <View flexDirection="row">
            <Button size="$2" chromeless>
              <Button.Icon>
                <Paperclip color="$gray10" size="$1" />
              </Button.Icon>
            </Button>
          </View>
          <Button themeInverse alignSelf="flex-end" size="$4" borderRadius="$10">
            <Button.Icon>
              <Send />
            </Button.Icon>
            <Button.Text>Post</Button.Text>
          </Button>
        </View>
      </View>
    </Tabs>
  )
}

WritePreviewAction.fileName = 'WritePreviewAction'

const StyledTab = styled(Tabs.Tab, {
  unstyled: true,
  borderColor: 'transparent',
  padding: '$2.5',
  paddingHorizontal: '$4.5',

  hoverStyle: {
    backgroundColor: '$background04',
  },

  variants: {
    tabSelected: {
      true: {
        backgroundColor: '$color1',
        borderColor: '$borderColor',
        borderBottomWidth: 0,
        hoverStyle: {
          backgroundColor: '$color1',
        },
      },
      false: {
        opacity: 0.6,
      },
    },
  } as const,
})

const StyledTextArea = styled(TextArea, {
  height: 200,
  padding: '$3',
  borderRadius: 0,
  borderWidth: 0,

  focusStyle: {
    borderRadius: 0,
    borderWidth: 1,
    outlineWidth: 0,
    outlineColor: 'transparent',
  },
})

import { Paperclip, Send } from '../../icons'
import { useState } from 'react'
import { Button, Separator, Text, TextArea, View, styled, Tabs } from 'tamagui'

/** ------ EXAMPLE ------ */
export function WritePreviewAction() {
  const [activeTab, setActiveTab] = useState('write')
  const [comment, setComment] = useState<string>()

  return (
    <Tabs
      width={500}
      maxW="100%"
      py="@max-md/window:6"
      value={activeTab}
      onValueChange={setActiveTab}
    >
      <View
        width="100%"
        overflow="hidden"
        bg="background"
        borderColor="border-color"
        borderWidth={1}
        rounded="4"
      >
        <View flexDirection="row">
          <Tabs.List width="100%" backgroundColor="color-5" rounded={0}>
            <StyledTab
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              value="write"
              tabSelected={activeTab === 'write'}
            >
              <Text fontSize="3" lineHeight="3" fontWeight="400">
                Write
              </Text>
            </StyledTab>
            <StyledTab
              borderBottomLeftRadius={0}
              borderBottomRightRadius={0}
              borderTopRightRadius={0}
              value="preview"
              tabSelected={activeTab === 'preview'}
            >
              <Text fontSize="3" lineHeight="3" fontWeight="400">
                Preview
              </Text>
            </StyledTab>
          </Tabs.List>
        </View>
        <Tabs.Content value="write" bg="color-1" minH={200}>
          <StyledTextArea
            size="md"
            p="4"
            flex={1}
            fontWeight="300"
            color="color-11"
            bg="color-1"
            rows={5}
            placeholder="Your comment here..."
            placeholderTextColor="placeholder-color"
            defaultValue={comment}
            onChangeText={setComment}
          />
        </Tabs.Content>
        <Tabs.Content bg="color-1" minH={200} value="preview">
          <Text
            fontSize="3"
            lineHeight="3"
            fontWeight="300"
            borderColor="color-1"
            p="3"
            flex={1}
          >
            {comment ?? 'Your text preview'}
          </Text>
        </Tabs.Content>
        <Separator />
        <View flexDirection="row" px="3" py="2" justify="space-between" items="center">
          <View flexDirection="row">
            <Button size="xs" variant="quiet">
              <Button.Icon>
                <Paperclip color="color-9" size="1" />
              </Button.Icon>
            </Button>
          </View>
          <Button theme="accent" self="flex-end" rounded="10" size="md">
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
  padding: '2-5',
  paddingHorizontal: 21,
  backgroundColor: 'hover:background-hover',
  variants: {
    tabSelected: {
      true: {
        backgroundColor: 'color-1 hover:color-1',
        borderColor: 'border-color',
        borderBottomWidth: 0,
      },
      false: {
        opacity: 0.6,
      },
    },
  } as const,
})

const StyledTextArea = styled(TextArea, {
  height: 200,
  p: '3',
  rounded: '0px focus:0px',
  borderWidth: '0px focus:1px',
  outlineWidth: 'focus:0px',
  outlineColor: 'focus:transparent',
})

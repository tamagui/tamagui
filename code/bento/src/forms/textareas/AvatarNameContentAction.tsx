import { File, Share } from '../../icons'
import { Button, Separator, Text, TextArea, View, Avatar } from 'tamagui'

/** ------ EXAMPLE ------ */
export function AvatarNameContentAction() {
  return (
    <View
      borderWidth={1}
      borderColor="color-6"
      rounded="4"
      background="background"
      p="4"
      width={500}
      maxW="100%"
      gap="4"
      my="@max-md/window:6"
    >
      <View flexDirection="row" items="center" justify="flex-start" gap="2">
        <Button variant="quiet" circular>
          <Avatar circular size="10">
            <Avatar.Image aria-label="user photo" src="https://i.pravatar.cc/123" />
            <Avatar.Fallback background="color-9" />
          </Avatar>
        </Button>
        <View flexDirection="column">
          <Text fontSize="4" fontWeight="400">
            Kimberly Doe
          </Text>
          <Text fontSize="3" fontWeight="1" theme="level2">
            @doe
          </Text>
        </View>
      </View>
      <TextArea
        placeholderTextColor="color-8"
        bg="transparent"
        borderWidth={0}
        size="md"
        fontWeight="300"
        px={0}
        height={100}
        rounded={0}
        placeholder="Write your comment"
      />
      <Separator theme="level2" mx="-3" />
      <View flexDirection="row" theme="accent" justify="space-between">
        <View gap="2" flexDirection="row">
          <Button size="sm" variant="quiet">
            <Button.Icon>
              <Share size="1" color="color-4" />
            </Button.Icon>
          </Button>
          <Button size="sm" variant="quiet">
            <Button.Icon>
              <File size="1" color="color-4" />
            </Button.Icon>
          </Button>
        </View>
        <Button size="sm">
          <Button.Text>Comment</Button.Text>
        </Button>
      </View>
    </View>
  )
}

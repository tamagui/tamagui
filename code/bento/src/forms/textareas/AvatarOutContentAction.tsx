import {
  Button,
  TextArea,
  View,
  Avatar,
} from 'tamagui'

/** ------ EXAMPLE ------ */
export function AvatarOutContentAction() {
  return (
    <View flexDirection="row" width={500} maxW="100%" gap="3" py="@max-md/window:6">
      <Button variant="quiet" circular>
        <Avatar flexShrink={1} circular size="10">
          <Avatar.Image aria-label="user photo" src="https://i.pravatar.cc/123" />
          <Avatar.Fallback background="color-9" />
        </Avatar>
      </Button>
      <View flexDirection="column" shrink={1} flexBasis={400} gap="3">
        <TextArea
          placeholderTextColor="color-8"
          size="sm"
          fontWeight="300"
          height={180}
          placeholder="Write your comment"
        />
        <Button theme="accent">
          <Button.Text>Post</Button.Text>
        </Button>
      </View>
    </View>
  )
}

AvatarOutContentAction.fileName = 'AvatarOutContentAction'

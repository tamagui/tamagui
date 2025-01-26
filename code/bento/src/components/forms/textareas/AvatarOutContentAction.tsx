import { Avatar, Button, TextArea, View } from 'tamagui'

/** ------ EXAMPLE ------ */
export function AvatarOutContentAction() {
  return (
    <View
      flexDirection="row"
      width={500}
      maxWidth="100%"
      gap="$3"
      $group-window-sm={{
        paddingVertical: '$6',
      }}
    >
      <Button chromeless circular bordered>
        <Avatar flexShrink={1} circular size="$3.5">
          <Avatar.Image aria-label="user photo" src="https://i.pravatar.cc/123" />
          <Avatar.Fallback backgroundColor="$gray10" />
        </Avatar>
      </Button>
      <View flexDirection="column" flexShrink={1} flexBasis={400} gap="$3">
        <TextArea
          size="$3"
          fontWeight="300"
          height={180}
          placeholder="Write your comment"
        />
        <Button themeInverse>
          <Button.Text>Post</Button.Text>
        </Button>
      </View>
    </View>
  )
}

AvatarOutContentAction.fileName = 'AvatarOutContentAction'

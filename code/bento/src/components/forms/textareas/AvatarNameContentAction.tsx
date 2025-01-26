import { Avatar, Button, Separator, Text, TextArea, View } from 'tamagui'
import { File, Share } from '@tamagui/lucide-icons'

/** ------ EXAMPLE ------ */
export function AvatarNameContentAction() {
  return (
    <View
      borderWidth={1}
      borderColor="$color7"
      borderRadius="$true"
      backgroundColor="$background"
      padding="$true"
      width={500}
      maxWidth="100%"
      gap="$3.5"
      $group-window-sm={{
        marginVertical: '$6',
      }}
    >
      <View flexDirection="row" alignItems="center" justifyContent="flex-start" gap="$2">
        <Button chromeless circular bordered>
          <Avatar circular size="$3.5">
            <Avatar.Image aria-label="user photo" src="https://i.pravatar.cc/123" />
            <Avatar.Fallback backgroundColor="$gray10" />
          </Avatar>
        </Button>
        <View flexDirection="column">
          <Text fontSize="$4" fontWeight="$2">
            Kimberly Doe
          </Text>
          <Text fontSize="$3" fontWeight="$1" theme="alt1">
            @doe
          </Text>
        </View>
      </View>
      <TextArea
        unstyled
        size="$4"
        fontWeight="300"
        paddingHorizontal={0}
        height={100}
        borderRadius={0}
        placeholder="Write your comment"
      />
      <Separator theme="alt1" marginHorizontal="$-3" />
      <View flexDirection="row" themeInverse justifyContent="space-between">
        <View gap="$2" flexDirection="row">
          <Button size="$3" themeInverse chromeless>
            <Button.Icon>
              <Share size="$1" color="$gray10" />
            </Button.Icon>
          </Button>
          <Button size="$3" themeInverse chromeless>
            <Button.Icon>
              <File size="$1" color="$gray10" />
            </Button.Icon>
          </Button>
        </View>
        <Button size="$3">
          <Button.Text>Comment</Button.Text>
        </Button>
      </View>
    </View>
  )
}

AvatarNameContentAction.fileName = 'AvatarNameContentAction'

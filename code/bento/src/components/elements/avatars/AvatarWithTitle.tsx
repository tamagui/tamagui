import { Label, Text } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */
export function AvatarWithTitle() {
  return (
    <Avatar size="$6" width={200} alignItems="center" gap="$2">
      <Avatar.Content id="avatar-joseph" circular>
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback backgroundColor="$gray6" />
      </Avatar.Content>
      <Label htmlFor="avatar-joseph" theme="alt1">
        Joseph London
      </Label>
    </Avatar>
  )
}

AvatarWithTitle.fileName = 'AvatarWithTitle'

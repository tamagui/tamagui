import { Label, Text } from 'tamagui'
import { Avatar } from './components/Avatar'

/** ------ EXAMPLE ------ */
export function AvatarWithTitle() {
  return (
    <Avatar size="lg" width={200} items="center" gap="2">
      <Avatar.Content id="avatar-joseph" circular>
        <Avatar.Image src="https://images.unsplash.com/photo-1548142813-c348350df52b?&width=150&height=150&dpr=2&q=80" />
        <Avatar.Fallback bg="color-6" />
      </Avatar.Content>
      <Label htmlFor="avatar-joseph" theme="level2">
        Joseph London
      </Label>
    </Avatar>
  )
}

AvatarWithTitle.fileName = 'AvatarWithTitle'

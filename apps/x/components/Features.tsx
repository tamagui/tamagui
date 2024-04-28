import { Paragraph, XStack, YStack } from 'tamagui'

import { Pencil } from '@tamagui/lucide-icons'
import { CheckCircle } from './CheckCircle'

export const Features = ({ items, size, large, soon, ...props }: any) => {
  return (
    <YStack mt="$4" mb="$6" {...props} gap="$3">
      {items.map((feature, i) => (
        <XStack tag="li" key={i}>
          <YStack y={1} mt={large ? 1 : -2}>
            {soon ? (
              <YStack
                bg="$backgroundHover"
                w={25}
                h={25}
                ai="center"
                jc="center"
                br={100}
                mr="$2.5"
              >
                <Pencil size={12} color="var(--colorHover)" />
              </YStack>
            ) : (
              <CheckCircle />
            )}
          </YStack>
          <YStack f={1}>
            <Paragraph size={size ?? (large ? '$5' : '$4')} color="$gray11">
              {feature}
            </Paragraph>
            {soon && (
              <Paragraph size="$2" theme="alt2">
                In development
              </Paragraph>
            )}
          </YStack>
        </XStack>
      ))}
    </YStack>
  )
}

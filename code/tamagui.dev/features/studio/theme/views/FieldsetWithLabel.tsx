import { Info } from '@tamagui/lucide-icons'
import { useRef, useState } from 'react'
import { Button, Heading, Input, Paragraph, TooltipSimple, XStack, YStack } from 'tamagui'

export type FieldsetWithLabelProps = {
  enableEditLabel?: boolean
  onChangeLabel?: (name: string) => void
  label: string
  children: any
  tooltip?: any
  afterLabel?: any
  isActive?: boolean
  onPress?: () => void
}

export const FieldsetWithLabel = ({
  label,
  afterLabel,
  tooltip,
  children,
  enableEditLabel,
  onChangeLabel,
  isActive,
  onPress,
}: FieldsetWithLabelProps) => {
  const [isEditing, setIsEditing] = useState(false)
  const text = useRef('')

  return (
    <YStack
      tag="fieldset"
      rounded="$4"
      borderColor={isActive ? '$color9' : '$color6'}
      borderWidth={0}
      px="$3"
      onPress={onPress}
    >
      <YStack
        z={100}
        px="$3"
        {...(enableEditLabel && {
          cur: 'pointer',
          onPress: () => {
            setIsEditing(true)
          },
        })}
      >
        {isEditing ? (
          <Input
            size="$3"
            autoFocus
            selectTextOnFocus
            onEndEditing={() => {
              setIsEditing(false)
            }}
            defaultValue={label}
            onChangeText={(t) => {
              text.current = t
            }}
            onSubmitEditing={() => {
              onChangeLabel?.(text.current)
            }}
            onKeyPress={(e) => {
              if (e['key'] === 'Escape') {
                setIsEditing(false)
              }
              if (e['key'] === 'Enter') {
                setIsEditing(false)
                onChangeLabel?.(text.current)
              }
            }}
          />
        ) : (
          <Heading
            select="none"
            tag="label"
            size="$5"
            color="$color11"
            ta="center"
            {...(tooltip && {
              pr: '$6',
            })}
          >
            {label[0].toUpperCase()}
            {label.slice(1)}

            {!!tooltip && (
              <TooltipSimple
                size="$3"
                label={
                  <YStack p="$2" maxW={200}>
                    <Paragraph size="$2" lineHeight="$1">
                      {tooltip}
                    </Paragraph>
                  </YStack>
                }
              >
                <Button
                  color="$color9"
                  size="$1"
                  scaleIcon={1.2}
                  ml="$2"
                  circular
                  rounded={100}
                  hoverTheme={false}
                  pressTheme={false}
                  chromeless
                  icon={Info}
                  position="absolute"
                  t={0}
                  r={8}
                />
              </TooltipSimple>
            )}
          </Heading>
        )}
      </YStack>

      {!!afterLabel && (
        <XStack
          position="absolute"
          t={12}
          r="$4"
          z={100}
          bg="$color2"
          rounded="$4"
          px="$2"
        >
          {afterLabel}
        </XStack>
      )}

      {children}
    </YStack>
  )
}

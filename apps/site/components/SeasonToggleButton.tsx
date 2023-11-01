import { TamaguiLogo, setNextTintFamily, setTintFamily, useTint } from '@tamagui/logo'
import {
  Button,
  ButtonProps,
  Popover,
  Square,
  Text,
  TooltipSimple,
  YStack,
} from 'tamagui'

export const seasons = {
  tamagui: <TamaguiLogo downscale={2.5} />,
  easter: '🐣',
  xmas: '🎅🏻',
  halloween: '🎃',
}

export const SeasonToggleButton = (props: ButtonProps) => {
  const { name } = useTint()

  return (
    <TooltipSimple groupId="header-actions-season" label={`Mode: ${name}`}>
      <Popover hoverable>
        <Popover.Trigger>
          <Button
            size="$3"
            w={38}
            onPress={setNextTintFamily}
            {...props}
            aria-label="Toggle theme"
          >
            <Text>{seasons[name]}</Text>
          </Button>
        </Popover.Trigger>

        <Popover.Content
          enterStyle={{ y: -6, o: 0 }}
          exitStyle={{ y: -6, o: 0 }}
          elevate
          p="$0"
          ov="hidden"
          br="$4"
          animation={[
            'medium',
            {
              opacity: {
                overshootClamping: true,
              },
            },
          ]}
        >
          <YStack>
            {Object.keys(seasons).map((optionName) => {
              return (
                <Square
                  key={optionName}
                  size="$3"
                  hoverStyle={{
                    bc: '$backgroundHover',
                  }}
                  pressStyle={{
                    bc: '$backgroundPress',
                  }}
                  {...(name === optionName && {
                    bc: '$color5',
                    hoverStyle: {
                      bc: '$color5',
                    },
                  })}
                  onPress={() => {
                    setTintFamily(optionName as any)
                  }}
                >
                  <Text cursor="default">{seasons[optionName]}</Text>
                </Square>
              )
            })}
          </YStack>
        </Popover.Content>
      </Popover>
    </TooltipSimple>
  )
}

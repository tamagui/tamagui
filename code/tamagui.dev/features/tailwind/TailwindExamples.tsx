import { Paragraph, Text, XStack, YStack } from 'tamagui'
import { ContainerLarge } from '~/components/Containers'
import { Grid } from '~/components/Grid'
import { HomeH2, HomeH3 } from '~/features/site/home/HomeHeaders'
import { classToProp, exampleGroups } from './tailwindData'

function ClassLine({ line }: { line: string }) {
  return (
    <Text
      fontFamily="$mono"
      fontSize="$3"
      whiteSpace="pre-wrap"
      color="$color11"
      lineHeight="$5"
    >
      {line}
    </Text>
  )
}

export function TailwindExamples() {
  return (
    <ContainerLarge py="$12" gap="$8">
      <YStack items="center" gap="$3">
        <HomeH2>Classes, or props</HomeH2>
        <HomeH3>
          Spacing snaps to the 4px scale, colors to the Tailwind v4 palette, radii to the
          v4 scale. The same utilities are also props, so you can migrate a line at a
          time.
        </HomeH3>
      </YStack>

      <Grid gap={20} itemMinWidth={280}>
        {exampleGroups.map((group) => (
          <YStack
            key={group.title}
            gap="$3"
            p="$5"
            rounded="$6"
            borderWidth={1}
            borderColor="$borderColor"
            bg="$color1"
          >
            <Paragraph size="$5" color="$color12">
              {group.title}
            </Paragraph>
            <YStack gap="$2">
              {group.lines.map((line) => (
                <ClassLine key={line} line={line} />
              ))}
            </YStack>
          </YStack>
        ))}
      </Grid>

      {/* same value, two ways */}
      <YStack
        self="center"
        width="100%"
        maxW={760}
        gap="$3"
        p="$5"
        rounded="$6"
        borderWidth={1}
        borderColor="$borderColor"
        bg="$color1"
      >
        <Paragraph size="$3" color="$color10">
          The same class, as a prop. One system, not two.
        </Paragraph>
        {classToProp.map((pair) => (
          <XStack key={pair.cls} items="center" gap="$3" flexWrap="wrap">
            <Text
              fontFamily="$mono"
              fontSize="$2"
              color="$green10"
              flex={1}
              minWidth={220}
            >
              {pair.cls}
            </Text>
            <Text fontFamily="$mono" fontSize="$2" color="$color8">
              ≡
            </Text>
            <Text
              fontFamily="$mono"
              fontSize="$2"
              color="$blue10"
              flex={1}
              minWidth={200}
            >
              {pair.prop}
            </Text>
          </XStack>
        ))}
      </YStack>
    </ContainerLarge>
  )
}

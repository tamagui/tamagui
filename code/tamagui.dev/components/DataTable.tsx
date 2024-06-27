import { H3, H4, ListItem, ScrollView, XStack, YStack } from 'tamagui'

export function DataTable({
  title = '',
  rows,
  'aria-label': ariaLabel,
  'aria-labelledby': ariaLabelledBy,
}: {
  title?: string
  rows: string[][]
  'aria-label'?: string
  'aria-labelledby'?: string
}) {
  const hasAriaLabel = !!(ariaLabel || ariaLabelledBy)
  return (
    <ScrollView horizontal>
      <YStack
        borderWidth={1}
        borderColor="$borderColor"
        f={1}
        aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
        aria-labelledby={ariaLabelledBy}
        my="$4"
        br="$4"
        ov="hidden"
        mx="$-4"
        $sm={{
          mx: 0,
        }}
      >
        {!!title && (
          <XStack ai="center" py="$2" px="$4" backgroundColor="$borderColor">
            <H3 size="$3">{title}</H3>
          </XStack>
        )}

        {rows.map((items, i) => (
          <ListItem key={i} p={0}>
            <XStack
              ai="center"
              pos="relative"
              py="$3"
              px="$4"
              $sm={{ flexDirection: 'column' }}
            >
              {items.map((item) => (
                <H4
                  color="$color"
                  fow="700"
                  key={item}
                  maw={100}
                  fontFamily="$mono"
                  textTransform="none"
                  ai="center"
                  jc="center"
                  textAlign="center"
                  size="$4"
                  width={200}
                >
                  {item}
                </H4>
              ))}
            </XStack>
          </ListItem>
        ))}
      </YStack>
    </ScrollView>
  )
}

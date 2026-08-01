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
        borderColor="border-color"
        flex={1}
        my="4"
        rounded="4"
        overflow="hidden"
        mx="-4 sm:0px"
        aria-label={hasAriaLabel ? ariaLabel : 'Component Props'}
        aria-labelledby={ariaLabelledBy}
      >
        {!!title && (
          <XStack items="center" py="2" px="4" bg="border-color">
            <H3 size="3">{title}</H3>
          </XStack>
        )}

        {rows.map((items, i) => (
          <ListItem key={i} p={0}>
            <XStack
              items="center"
              position="relative"
              py="3"
              px="4"
              flexDirection="sm:column"
            >
              {items.map((item) => (
                <H4
                  color="color"
                  fontWeight="700"
                  maxW={100}
                  fontFamily="mono"
                  textTransform="none"
                  items="center"
                  justify="center"
                  text="center"
                  width={200}
                  key={item}
                  size="4"
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

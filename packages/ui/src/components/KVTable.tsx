import { XStack, XStackProps, YStack, YStackProps, withStaticProperties } from 'tamagui'

const KVTableWrapper = (props: YStackProps) => {
  return <YStack gap="$6" {...props} />
}

const KVTableRow = (props: XStackProps) => {
  return (
    <XStack
      $sm={{
        flexDirection: 'column',
      }}
      gap="$3"
      flexWrap="wrap"
      {...props}
    />
  )
}

const KVTableKey = (props: YStackProps) => {
  return (
    <YStack
      width="23%"
      $sm={{
        width: '100%',
      }}
      {...props}
    />
  )
}

const KVTableValue = (props: XStackProps) => {
  return (
    <XStack
      width="72%"
      $sm={{
        width: '100%',
      }}
      flexWrap="wrap"
      {...props}
    />
  )
}

/**
 * simple key-value table for displaying info
 */
export const KVTable = withStaticProperties(KVTableWrapper, {
  Row: KVTableRow,
  Key: KVTableKey,
  Value: KVTableValue,
})

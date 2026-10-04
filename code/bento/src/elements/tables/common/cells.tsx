import { Text, View, XStack } from 'tamagui'

export type RowStatus = 'active' | 'paused' | 'vacation' | string

const statusTheme: Record<string, { bg: string; color: string; label: string }> = {
  active: { bg: 'green-200', color: 'green-700', label: 'Active' },
  paused: { bg: 'yellow-200', color: 'yellow-700', label: 'Paused' },
  vacation: { bg: 'blue-200', color: 'blue-700', label: 'Vacation' },
  single: { bg: 'blue-200', color: 'blue-700', label: 'Single' },
  complicated: { bg: 'yellow-200', color: 'yellow-700', label: 'Complicated' },
  relationship: { bg: 'green-200', color: 'green-700', label: 'Relationship' },
}

export function StatusBadge({ status }: { status: RowStatus }) {
  const t = statusTheme[status] ?? {
    bg: 'color-4',
    color: 'color-10',
    label: status.charAt(0).toUpperCase() + status.slice(1),
  }
  return (
    <View bg={t.bg as any} rounded="10" px="2-5" py="1" self="center">
      <Text fontSize="2" fontWeight="600" color={t.color as any} numberOfLines={1}>
        {t.label}
      </Text>
    </View>
  )
}

export function ProgressCell({ value }: { value: number }) {
  return (
    <XStack items="center" gap="2" minW={90}>
      <View flex={1} height={6} rounded="10" bg="color-4" overflow="hidden">
        <View
          width={`${value}%`}
          height="100%"
          rounded="10"
          bg={`${value > 66 ? 'green-500' : value > 33 ? 'yellow-500' : 'red-500'}`}
        />
      </View>
      <Text fontSize="2" color="color-9" width={30} text="right">
        {value}
      </Text>
    </XStack>
  )
}

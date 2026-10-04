import type { ComponentSize } from '@tamagui/core'
import { useState } from 'react'
import { Text, View } from 'tamagui'
import { X } from '../../icons'
import { tone } from '../../tone'
import { Chip } from './components/chipsParts'

const filters = ['Design', 'Engineering', 'Remote', 'Full time', 'Senior']

const statuses = [
  { label: 'Active', color: 'green-9' },
  { label: 'Paused', color: 'yellow-9' },
  { label: 'Blocked', color: 'red-9' },
  { label: 'Draft', color: 'color-8' },
] as const

/** ------ EXAMPLE ------ */
export function ChipsWithCloseIcon({ size = 'md' }: { size?: ComponentSize }) {
  const [active, setActive] = useState(filters)

  return (
    <View gap="5" items="center" p="4" maxW={480}>
      <View flexDirection="row" flexWrap="wrap" justify="center" gap="2">
        {active.map((filter) => (
          <Chip circular size={size} key={filter}>
            <Chip.Text>{filter}</Chip.Text>
            <Chip.Button
              alignRight
              aria-label={`Remove ${filter}`}
              onPress={() => setActive((list) => list.filter((item) => item !== filter))}
            >
              <Chip.Icon color="color-10">
                <X />
              </Chip.Icon>
            </Chip.Button>
          </Chip>
        ))}
        {active.length === 0 ? (
          <Chip circular size={size} pressable onPress={() => setActive(filters)}>
            <Chip.Text>Reset filters</Chip.Text>
          </Chip>
        ) : null}
      </View>

      <View flexDirection="row" flexWrap="wrap" justify="center" gap="2">
        {statuses.map((status) => (
          <Chip
            circular
            size={size}
            key={status.label}
            bg="transparent"
            borderWidth={1}
            borderColor={tone.border}
          >
            <View width={6} height={6} rounded="full" bg={status.color} />
            <Text fontFamily="body" fontSize="xs" fontWeight="500" color="color-11">
              {status.label}
            </Text>
          </Chip>
        ))}
      </View>
    </View>
  )
}

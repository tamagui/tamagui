import { Text } from '@tamagui/core'
import { Stack } from '@tamagui/web'
import { useLayoutEffect, useState } from 'react'

export function TimedRender(props) {
  const [start] = useState(Date.now())
  const [end, setEnd] = useState(0)

  useLayoutEffect(() => {
    setEnd(Date.now())
  }, [])

  return (
    <Stack w="100%" ov="hidden">
      {!!end && <Text>Took {start - end}ms</Text>}
      <Stack flexDirection="row">{props.children}</Stack>
    </Stack>
  )
}

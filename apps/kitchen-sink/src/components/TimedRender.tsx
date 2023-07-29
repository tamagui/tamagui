import { Text } from '@tamagui/core'
import { useLayoutEffect, useState } from 'react'

export function TimedRender(props) {
  const [start] = useState(Date.now())
  const [end, setEnd] = useState(0)

  useLayoutEffect(() => {
    setEnd(Date.now())
  }, [])

  return (
    <>
      {!!end && <Text>Took {start - end}ms</Text>}
      {props.children}
    </>
  )
}

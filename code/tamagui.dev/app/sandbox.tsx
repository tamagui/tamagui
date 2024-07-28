import { Text, useMedia } from '@tamagui/core'
import { useEffect, useState } from 'react'

export default function Sandbox() {
  const [y, setY] = useState(false)
  const x = useMedia(undefined, undefined, 'verbose')

  console.warn('render')

  useEffect(() => {
    setTimeout(() => {
      setY(true)
    })
  }, [])

  if (y === false) {
    return null
  }

  console.log('is is gtsm', x.sm)

  return <>{/* <Text testID="text">{x.sm ? 'small' : 'large'}</Text> */}</>
}

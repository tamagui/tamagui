import { Text, useMedia } from '@tamagui/core'
import { useEffect, useState } from 'react'

export function UseTheme() {
  const [y, setY] = useState(false)
  const x = useMedia()

  useEffect(() => {
    setY(true)
  }, [])

  console.log('is is small', x.sm)

  return (
    <>
      <Text testID="text">{x.sm ? 'small' : 'large'}</Text>
    </>
  )
}

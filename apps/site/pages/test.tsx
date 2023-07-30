// debug
import { useId, useState } from 'react'
import { Button, Circle, Paragraph, Text, useDidFinishSSR } from 'tamagui'
import { H1, H2 } from 'tamagui'

// export default () => <Square size={100} animation="quick" bc="$background" />

export default () => {
  console.warn('rendering')
  const [x, setX] = useState(0)

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        height: '100%',
        flex: 1,
      }}
    >
      <Button onPress={() => setX(Math.random())}>ok</Button>
      <Test key={x} />
    </div>
  )
}

const Test = () => {
  const hydrated = useDidFinishSSR()
  const id = useId()

  console.log('hydrated', id, hydrated)

  return <Paragraph>{`${id} hydrated ${hydrated}`}</Paragraph>
}

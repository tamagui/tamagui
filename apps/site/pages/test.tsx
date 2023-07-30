// debug
import { useId, useState } from 'react'
import { Button, Circle, Paragraph, Text, Theme, YStack, useDidFinishSSR } from 'tamagui'
import { H1, H2 } from 'tamagui'

import { MediaPlayer } from '../components/MediaPlayer'

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
      <YStack>
        <MediaPlayer />
        <Theme name="blue">
          <MediaPlayer />
        </Theme>
      </YStack>
    </div>
  )
}

const Test = () => {
  const hydrated = useDidFinishSSR()
  const id = useId()

  return <Paragraph>{`${id} hydrated ${hydrated}`}</Paragraph>
}

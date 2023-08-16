// import './wdyr'

import { useState } from 'react'
import { Paragraph, ThemeName, YStack } from 'tamagui'

export const Sandbox = () => {
  const [theme, setTheme] = useState('light' as ThemeName)
  // need to test all these they seem to be all working:

  return (
    <YStack>
      <Paragraph size="$10" ta="center">
        Text test with bold
      </Paragraph>
      <Paragraph ta="center" fontSize={40} lh={40}>
        Text test default
      </Paragraph>
    </YStack>
  )
}

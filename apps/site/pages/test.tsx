// import '../lib/wdyr'

import { SelectDemo, SwitchDemo } from '@tamagui/demos'
import { memo } from 'react'
import { Button, Label, Separator, Square, Switch, Theme, XStack } from 'tamagui'

import { ThemeToggle } from '../components/ThemeToggle'

export default memo(() => {
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
      {/* <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <ThemeToggle />
      </div> */}

      <XStack width={200} alignItems="center" space="$4">
        <Label
          paddingRight="$0"
          minWidth={90}
          justifyContent="flex-end"
          size="$4"
          htmlFor="test"
        >
          Accept
        </Label>
        <Separator minHeight={20} vertical />
        <Switch id="test" size="$4">
          <Switch.Thumb animation="quick" />
        </Switch>
      </XStack>
      {/* <Square size={100} bc="$background">
          hi
        </Square> */}
    </div>
  )
})

// export async function getStaticProps() {
//   return {
//     revalidate: 0.00001,
//     props: {},
//   }
// }

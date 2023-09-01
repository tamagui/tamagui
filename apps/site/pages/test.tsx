// debug
// import '../lib/wdyr'

import { Tamagui } from '@tamagui/core'
import { TamaguiLogo } from '@tamagui/logo'
import { memo } from 'react'
import { XStack, YStack } from 'tamagui'

import { Header } from '../components/Header'
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
      <div style={{ position: 'absolute', top: 10, right: 10, zIndex: 1000 }}>
        <ThemeToggle />
      </div>
      <>
        <TamaguiLogo />
      </>
    </div>
  )
})

// export async function getStaticProps() {
//   return {
//     revalidate: 0.00001,
//     props: {},
//   }
// }

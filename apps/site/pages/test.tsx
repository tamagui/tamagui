// import '../lib/wdyr'

import { SwitchDemo } from '@tamagui/demos'
import { memo } from 'react'
import { Theme } from 'tamagui'

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

      <Theme name="blue">
        <SwitchDemo />
      </Theme>
    </div>
  )
})

// export async function getStaticProps() {
//   return {
//     revalidate: 0.00001,
//     props: {},
//   }
// }

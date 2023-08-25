import '../lib/wdyr'

import { SliderDemo, UpdateThemeDemo } from '@tamagui/demos'
// debug
import { memo } from 'react'

export default memo(() => {
  console.warn('rendereingasd')
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
      <SliderDemo />
    </div>
  )
})

// export async function getStaticProps() {
//   return {
//     revalidate: 0.00001,
//     props: {},
//   }
// }

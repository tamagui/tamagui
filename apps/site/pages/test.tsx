// import '../lib/wdyr'

import { UpdateThemeDemo } from '@tamagui/demos'
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
      <div
        style={{
          position: 'absolute',
          top: 20,
          right: 20,
        }}
      >
        <UpdateThemeDemo />
      </div>
    </div>
  )
})

// export async function getStaticProps() {
//   return {
//     revalidate: 0.00001,
//     props: {},
//   }
// }

// import '../lib/wdyr'

import { ThemeTint, ThemeTintAlt } from '@tamagui/logo'
import { Header } from '@tamagui/site/components/Header'
import { SearchProvider } from '@tamagui/site/components/Search'
import { useState } from 'react'
import { Square } from 'tamagui'

function TestPage() {
  const [color, setColor] = useState('red')
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
      <Square
        animation="lazy"
        animateOnly={['backgroundColor']}
        o={1}
        bg={color as any}
        onPress={() => setColor(color === 'red' ? 'green' : 'red')}
        enterStyle={{ bg: 'blue' }}
        size={200}
        // debug="break"
      />
    </div>
  )
}

export default TestPage

const DebugNestedThemeChange = () => {
  return (
    <ThemeTint debug="visualize">
      <ThemeTintAlt debug="visualize">
        {/* <Square theme="active" debug="visualize" size={100} bc="$color5" /> */}
      </ThemeTintAlt>
    </ThemeTint>
  )
}

TestPage.getLayout = (page) => {
  return (
    <>
      <SearchProvider>
        <Header minimal />
        {page}
      </SearchProvider>
    </>
  )
}

// export async function getStaticProps() {
//   return {
//     revalidate: 0.00001,
//     props: {},
//   }
// }

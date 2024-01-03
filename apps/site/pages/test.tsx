// import '../lib/wdyr'

import { Clipboard } from '@tamagui/lucide-icons'
import { Button } from 'tamagui'

import { getDefaultLayout } from '../lib/getDefaultLayout'

function TestPage() {
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

      <Button
        aria-label="Copy code to clipboard"
        position="absolute"
        size="$10"
        top="$3"
        right="$3"
        display="inline-flex"
        $xs={{
          display: 'none',
        }}
        icon={Clipboard}
        onPress={() => {}}
      >
        hello
      </Button>
    </div>
  )
}

export default TestPage

TestPage.getLayout = getDefaultLayout

// export async function getStaticProps() {
//   return {
//     revalidate: 0.00001,
//     props: {},
//   }
// }

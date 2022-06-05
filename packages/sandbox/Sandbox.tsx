// debug
import '@tamagui/core/reset.css'
import '@tamagui/polyfill-dev'

import React, { useState } from 'react'
import { useColorScheme } from 'react-native'
import { Circle, H4, YStack } from 'tamagui'

import Tamagui from './tamagui.config'

React['keep']

export const Sandbox = () => {
  const scheme = useColorScheme()
  const [theme, setTheme] = useState(scheme as any)
  return (
    <Tamagui.Provider injectCSS defaultTheme={theme}>
      <button
        style={{
          position: 'absolute',
          bottom: 20,
          left: 20,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        Switch theme
      </button>

      <div
        style={{
          width: '100vw',
          height: '100vh',
          pointerEvents: 'auto',
          display: 'flex',
          flexDirection: 'column',
          background: 'var(--backgroundStrong)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {/* <TooltipDemo /> */}
        {/* <SquareDemo /> */}
        {/* <SelectDemo /> */}
        {/* <SeparatorDemo /> */}
        {/* <Skeleton>
            <Button>hello world</Button>
          </Skeleton> */}
      </div>
    </Tamagui.Provider>
  )
}

// function SelectDemo() {
//   return (
//     <Select defaultValue="blueberry">
//       <Select.Trigger w={200} iconAfter={ChevronDown}>
//         <Select.Value placeholder="Something" />
//       </Select.Trigger>

//       <Select.Content>
//         <Select.ScrollUpButton>☝️</Select.ScrollUpButton>

//         <Select.Viewport minWidth={200}>
//           <Select.Group>
//             <Select.Label>Fruits</Select.Label>
//             <Select.Item value="apple" index={0}>
//               <Select.ItemText>Apple</Select.ItemText>
//             </Select.Item>
//             <Select.Item value="banana" index={1}>
//               <Select.ItemText>Banana</Select.ItemText>
//             </Select.Item>
//             <Select.Item value="blueberry" index={2}>
//               <Select.ItemText>Blueberry</Select.ItemText>
//             </Select.Item>
//             <Select.Item value="berry" index={3}>
//               <Select.ItemText>Berry</Select.ItemText>
//             </Select.Item>
//             <Select.Item value="strawberry" index={4}>
//               <Select.ItemText>Strawberry</Select.ItemText>
//             </Select.Item>
//             <Select.Item value="kiwi" index={5}>
//               <Select.ItemText>Kiwi</Select.ItemText>
//             </Select.Item>
//             <Select.Item value="grap" index={6}>
//               <Select.ItemText>Grap</Select.ItemText>
//             </Select.Item>
//             <Select.Item value="orange" index={7}>
//               <Select.ItemText>Orange</Select.ItemText>
//             </Select.Item>
//           </Select.Group>
//         </Select.Viewport>

//         <Select.ScrollDownButton>👇</Select.ScrollDownButton>
//       </Select.Content>
//     </Select>
//   )
// }

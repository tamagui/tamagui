import React from 'react'
import { HomeScreen, DemoScreen, Provider } from '@tamagui/kitchen-sink-shared'

export function App() {
  const [currentDemo, setCurrentDemo] = React.useState<string | null>(null)

  return (
    <Provider>
      {currentDemo ? (
        <DemoScreen demoName={currentDemo} onBack={() => setCurrentDemo(null)} />
      ) : (
        <HomeScreen onSelect={setCurrentDemo} />
      )}
    </Provider>
  )
}

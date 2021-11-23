import React from 'react'

import { BenchNativeBaseProvider, Button, Text } from '../nativebase'
import { TestComponentProps, TestRunner } from '../TestRunner'

const Test = ({ testIndex }: TestComponentProps) => {
  const val = Math.random()
  return (
    <>
      <Button
        backgroundColor={val > 0.5 ? 'red' : 'green'}
        size={val > 0.5 ? 1 : 2}
        padding="20px"
        borderRadius={10}
        margin={2}
      >
        <Text>testing</Text>
      </Button>
    </>
  )
}

const NativebaseTest = () => {
  return (
    <>
      <BenchNativeBaseProvider>
        <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />

        <div style={{ opacity: 0, pointerEvents: 'none' }}>
          <Button>
            we mount the button outside the test to make sure we're not clocking any mount time
          </Button>
        </div>
      </BenchNativeBaseProvider>
    </>
  )
}

export default NativebaseTest

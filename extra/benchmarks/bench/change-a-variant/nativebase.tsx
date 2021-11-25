import React from 'react'

import { BenchNativeBaseProvider, Button, Text } from '../nativebase'
import { TestComponentProps, TestRunner } from '../TestRunner'

const Test: React.FunctionComponent<TestComponentProps> = ({ testIndex }: TestComponentProps) => {
  const isEven = testIndex % 2 === 0
  return (
    <Button red={isEven ? true : false} blue={isEven ? false : true} size={isEven ? 1 : 2}>
      <Text>testing</Text>
    </Button>
  )
}

const NativeBaseTest = () => {
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

export default NativeBaseTest

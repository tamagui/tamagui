import React from 'react'
import { Text } from 'react-native-web'

import { Button } from '../rnw/Button'
import { TestComponentProps, TestRunner } from '../TestRunner'

const Test = ({ testIndex }: TestComponentProps) => {
  const val = Math.random()
  return (
    <>
      <Button
        style={{
          backgroundColor: val > 0.5 ? 'red' : 'green',
          padding: 20,
          borderRadius: 10,
          margin: 2,
        }}
      >
        <Text>testing</Text>
      </Button>
    </>
  )
}

const TamaguiTest = () => {
  return (
    <>
      <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />

      <div style={{ opacity: 0, pointerEvents: 'none' }}>
        <Button>
          we mount the button outside the test to make sure we're not clocking any mount time
        </Button>
      </div>
    </>
  )
}

export default TamaguiTest

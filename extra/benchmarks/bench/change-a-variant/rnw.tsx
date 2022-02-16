import React from 'react'
import { Text } from 'react-native-web'

import { Button } from '../rnw/RNWButton'
import { TestComponentProps, TestRunner } from '../TestRunner'

const Test: React.FunctionComponent<TestComponentProps> = ({ testIndex }: TestComponentProps) => {
  return (
    <Button isEven={testIndex % 2 === 0}>
      <Text>testing</Text>
    </Button>
  )
}

const RNWTest = () => {
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

export default RNWTest

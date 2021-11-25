import { DripsyProvider, Text } from 'dripsy'
import React from 'react'

import { Button, dripsyTheme } from '../drispy'
import { TestComponentProps, TestRunner } from '../TestRunner'

const Test: React.FunctionComponent<TestComponentProps> = ({ testIndex }: TestComponentProps) => {
  const isEven = testIndex % 2 === 0
  return (
    <Button red={isEven ? true : false} blue={isEven ? false : true} size={isEven ? 1 : 2}>
      <Text>testing</Text>
    </Button>
  )
}

const DRIPSYTest = () => {
  return (
    <>
      <DripsyProvider theme={dripsyTheme}>
        <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />
      </DripsyProvider>

      <div style={{ opacity: 0, pointerEvents: 'none' }}>
        <Button>
          we mount the button outside the test to make sure we're not clocking any mount time
        </Button>
      </div>
    </>
  )
}

export default DRIPSYTest

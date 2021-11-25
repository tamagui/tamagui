import { DripsyProvider, Text } from 'dripsy'
import React from 'react'

import { Button, dripsyTheme } from '../drispy'
import { TestComponentProps, TestRunner } from '../TestRunner'

const Test = ({ testIndex }: TestComponentProps) => {
  const val = Math.random()
  return (
    <>
      <Button
        sx={{
          backgroundColor: val > 0.5 ? 'red' : 'green',
          padding: '20px',
          borderRadius: 10,
          margin: 2,
        }}
      >
        <Text>testing</Text>
      </Button>
    </>
  )
}

const DripsyTest = () => {
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

export default DripsyTest

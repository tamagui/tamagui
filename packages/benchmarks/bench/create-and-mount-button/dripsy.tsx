import { DripsyProvider, Text } from 'dripsy'
import React from 'react'

import { Button, dripsyTheme } from '../drispy'
import { TestComponentProps, TestRunner } from '../TestRunner'

const Test = ({ testIndex }: TestComponentProps) => {
  return (
    <Button>
      <Text>testing</Text>
    </Button>
  )
}

const TamaguiTest = () => {
  return (
    <DripsyProvider theme={dripsyTheme}>
      <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />
    </DripsyProvider>
  )
}

export default TamaguiTest

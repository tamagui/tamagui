import React from 'react'

import { BenchNativeBaseProvider, Button, Text } from '../nativebase'
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
    <BenchNativeBaseProvider>
      <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />
    </BenchNativeBaseProvider>
  )
}

export default TamaguiTest

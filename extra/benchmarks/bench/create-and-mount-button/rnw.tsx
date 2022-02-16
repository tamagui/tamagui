import React from 'react'
import { Text } from 'react-native-web'

import { Button } from '../rnw/RNWButton'
import { TestComponentProps, TestRunner } from '../TestRunner'

const Test = ({ testIndex }: TestComponentProps) => {
  return (
    <Button>
      <Text>testing</Text>
    </Button>
  )
}

const TamaguiTest = () => {
  return <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />
}

export default TamaguiTest

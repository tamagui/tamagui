import React from 'react'

import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles } from '../utils/buttonStyles'
import { styled } from '../utils/stitches-react-vc17.config'

// This purposefully creates the styled component inside the Test component
// so that we can measure the time it takes using the React profiler
const Button = styled('button', {
  ...(buttonStyles as any),
})

const Test = ({ testIndex }: TestComponentProps) => {
  return <Button>testing</Button>
}

const StitchesTest = () => {
  return <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />
}

export default StitchesTest

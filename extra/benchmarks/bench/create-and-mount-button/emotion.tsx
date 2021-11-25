import styled from '@emotion/styled'
import React from 'react'

import { TestComponentProps, TestRunner } from '../TestRunner'
import { buttonStyles } from '../utils/buttonStyles'

const Button = styled('button')({
  ...(buttonStyles as any),
})

const Test = ({ testIndex }: TestComponentProps) => {
  return <Button>testing</Button>
}

const StitchesTest = () => {
  return <TestRunner numberOfRuns={3} iterationN={1000} TestComponent={Test} />
}

export default StitchesTest

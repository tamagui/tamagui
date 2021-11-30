import { DripsyProvider } from 'dripsy'
import React from 'react'

import { Box, dripsyTheme } from '../drispy'
import { TestComponentProps, TestRunner } from '../TestRunner'

export const Test = ({ testIndex }: TestComponentProps) => {
  return <Tree breadth={2} depth={7} id={0} wrap={1} />
}

const DripsyTest = () => {
  return (
    <DripsyProvider theme={dripsyTheme}>
      <TestRunner numberOfRuns={3} iterationN={50} TestComponent={Test} />
    </DripsyProvider>
  )
}

export default DripsyTest

export function Tree({ breadth, depth, id, wrap }) {
  const colorIndex = id % 3
  const colorIndex2 = (id % 3) + 3
  const isCol = depth % 2 === 0

  let result = (
    <Box color={colorIndex as any} layout={isCol ? 'column' : 'row'} outer>
      {depth === 0 && <Box color={colorIndex2 as any} fixed />}
      {depth !== 0 &&
        Array.from({ length: breadth }).map((el, i) => (
          <Tree breadth={breadth} depth={depth - 1} id={i} key={i} wrap={wrap} />
        ))}
    </Box>
  )

  for (let i = 0; i < wrap; i++) {
    result = <Box>{result}</Box>
  }

  return result
}

import { Box } from '@tamagui/bench-components'
import React from 'react'

import { TestComponentProps, TestRunner } from '../TestRunner'

export const Test = ({ testIndex }: TestComponentProps) => {
  return <Tree breadth={2} depth={7} id={0} wrap={1} />
}

const StitchesTest = () => {
  return <TestRunner numberOfRuns={3} iterationN={50} TestComponent={Test} />
}

export default StitchesTest

export function Tree({ breadth, depth, id, wrap }) {
  const colorIndex = id % 3
  const colorIndex2 = (id % 3) + 3
  const isCol = depth % 2 === 0

  // TODO: we could make this fully extract by having the compiler understand that variants are fixed
  // it would have to generate something like:
  //   <div className={concat( colorIndex === 0 ? cn1 : colorIndex === 1 ? cn2 : ... )} />
  // it understands there are limited variants so it can generate all of them
  let result = (
    <Box color={colorIndex} layout={isCol ? 'column' : 'row'} outer>
      {depth === 0 && <Box color={colorIndex2} fixed />}
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

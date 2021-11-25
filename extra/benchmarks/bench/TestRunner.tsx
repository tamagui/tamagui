import { useRouter } from 'next/router'
import React, { Profiler, useEffect } from 'react'

import { TestResults } from './TestResults'
import { createId } from './utils/createId'

/** The localStorage object that stores our tests between runs */
export type TestInfo = {
  /** The unique id for this test */
  testId: string
  /** How many times should we iterate on the test case? */
  N: number
  /** How many times to run the test */
  numberOfRuns: number
  /** run index as key -> SampleResult */
  results: Record<number, RunResult>
}

/** The results from one individual sample run */
export type RunResult = {
  /** Sample size */
  N: number
  /** First iteration in the run */
  firstIteration: IterationTime
  /** Last iteration in the run */
  lastIteration: IterationTime
  /** Fastest time in the run */
  fastestIteration: IterationTime
  /** Slowest time in the run */
  slowestIteration: IterationTime
  /** Average run time */
  meanIteration: IterationTime
  /** Median run time */
  medianIteration: IterationTime
  /** The variance in the results */
  variance: number
}

/** Maps to actualDuration, which includes the Profiler's own render time but only includes things that ran as a result of this direct render (so anything memoized in the subtree won't be counted if it didn't render) */
type IterationTime = number

/**
 * This information will be passed to the TestComponent during each run
 * so it can make changes to itself across different tests (like testIndex % 2 type logic)
 */
export type TestComponentProps = {
  testIndex: number
}

/** This component runs a single run of the test, from 0...N */
const TestAndRefresh = ({
  runIndex,
  testInfo,
  TestComponent,
}: {
  runIndex: number
  testInfo: TestInfo
  TestComponent: React.FunctionComponent<TestComponentProps>
}) => {
  /** Stores individual results in an array until the test is done and we can crunch them */
  const iterationResults: Array<number> = []

  useEffect(() => {
    if (iterationResults.length !== testInfo.N) {
      throw new Error(
        `Did not calculate N: ${testInfo.N} results (received ${iterationResults.length} results)`
      )
    }

    const firstIteration = iterationResults[0]
    const lastIteration = iterationResults[iterationResults.length - 1]

    // Build the median
    const sortedResults = iterationResults.sort((a, b) => (Number(a) > Number(b) ? 1 : -1))
    const medianIteration = sortedResults[Math.round(sortedResults.length / 2)]

    const fastestIteration = sortedResults[0]
    const slowestIteration = sortedResults[sortedResults.length - 1]

    // Build the mean
    let sumOfIterationTime = 0
    for (let i = 0; i < iterationResults.length; i++) {
      sumOfIterationTime += iterationResults[i]
    }
    const meanIteration = sumOfIterationTime / iterationResults.length

    // Build the variance
    let sumOfSquaredDifferences = 0
    for (let i = 0; i < iterationResults.length; i++) {
      const difference = meanIteration - iterationResults[i]
      const squaredDifference = Math.pow(difference, 2)
      sumOfSquaredDifferences += squaredDifference
    }
    const variance = sumOfSquaredDifferences / iterationResults.length

    // Pop the results into the testInfo:
    testInfo.results[runIndex] = {
      N: testInfo.N,
      firstIteration,
      lastIteration,
      fastestIteration,
      slowestIteration,
      medianIteration,
      meanIteration,
      variance,
    }
    // Serialize the testInfo and pop it back onto localStorage:
    localStorage.setItem(testInfo.testId, JSON.stringify(testInfo))

    // Refresh for the next test or finish the test
    if (runIndex === testInfo.numberOfRuns - 1) {
      // This was the last test, redirect to the results
      window.location.href = `?testId=${testInfo.testId}&finished=true`
    } else {
      // We have more sample sizes to run, +1 the sampleIndex
      window.location.href = `?testId=${testInfo.testId}&runIndex=${runIndex + 1}`
    }
  })

  function handleProfilerData(
    id: string, // the "id" prop of the Profiler tree that has just committed
    phase: string, // either "mount" (if the tree just mounted) or "update" (if it re-rendered)
    actualDuration: number, // time spent rendering the committed update
    baseDuration: number, // estimated time to render the entire subtree without memoization
    startTime: number, // when React began rendering this update
    commitTime: number, // when React committed this update
    interactions: Set<any> // the Set of interactions belonging to this update
  ) {
    iterationResults.push(actualDuration)
  }

  /** An array with the size of N */
  const loops = [...Array(testInfo.N)]

  return (
    <>
      {loops.map((value, index) => {
        return (
          <Profiler key={index} id={testInfo.testId} onRender={handleProfilerData}>
            <TestComponent testIndex={index} />
          </Profiler>
        )
      })}
    </>
  )
}

export const TestRunner = ({
  TestComponent,
  numberOfRuns,
  iterationN,
}: {
  /** The component to run inside the profiler */
  TestComponent: React.FunctionComponent<TestComponentProps>
  /** How many times to run the entire test (to check for variance) */
  numberOfRuns: number
  /** The N number of iterations to run inside each test */
  iterationN: number
}) => {
  if (typeof window === 'undefined') {
    return null
  }

  const router = useRouter()
  const { testId, runIndex, finished } = router.query

  if (!testId) {
    // No test is running yet
    const newTestId = createId()

    const testInfo: TestInfo = {
      testId: newTestId,
      N: iterationN,
      numberOfRuns,
      results: {},
    }
    localStorage.setItem(newTestId, JSON.stringify(testInfo))

    return <a href={`?testId=${newTestId}&runIndex=0`}>start test</a>
  } else if (typeof testId === 'string') {
    // We are mid-test or finished with a test
    if (typeof finished !== 'undefined') {
      // Test is done!
      const testInfo: TestInfo = JSON.parse(localStorage.getItem(testId))

      return <TestResults testInfo={testInfo} />
    } else {
      // We have a test to run

      /** Which sample size are we doing this run? */
      const runNumber = typeof runIndex === 'string' ? Number(runIndex) : 0
      try {
        /** Grab the test info cache from storage */
        const testInfo: TestInfo = JSON.parse(localStorage.getItem(testId))
        return (
          <TestAndRefresh runIndex={runNumber} testInfo={testInfo} TestComponent={TestComponent} />
        )
      } catch (err) {
        console.error(err)
      }
    }
  }

  return null
}

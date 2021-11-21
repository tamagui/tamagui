import React from 'react'

import { RunResult, TestInfo } from './TestRunner'

type Result = Omit<RunResult, 'N'>
type ResultKey = keyof Result

const calculateAverage = (
  results: Record<number, Result>,
  key: ResultKey,
  numberOfRuns: number
) => {
  let total = 0
  ;[...Array(numberOfRuns)].forEach((_, index) => (total = total + results[index][key]))
  return total / numberOfRuns
}

export const TestResults = ({ testInfo }: { testInfo: TestInfo }) => {
  const averageInfo: Result = {
    firstIteration: calculateAverage(testInfo.results, 'firstIteration', testInfo.numberOfRuns),
    lastIteration: calculateAverage(testInfo.results, 'lastIteration', testInfo.numberOfRuns),
    fastestIteration: calculateAverage(testInfo.results, 'fastestIteration', testInfo.numberOfRuns),
    slowestIteration: calculateAverage(testInfo.results, 'slowestIteration', testInfo.numberOfRuns),
    meanIteration: calculateAverage(testInfo.results, 'meanIteration', testInfo.numberOfRuns),
    medianIteration: calculateAverage(testInfo.results, 'medianIteration', testInfo.numberOfRuns),
    variance: calculateAverage(testInfo.results, 'variance', testInfo.numberOfRuns),
  }

  return (
    <div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            th, td {
              padding: 10px;
            }

            ul {
              margin-top: 20px;
              margin-bottom: 20px;
            }

            li {
              padding: 5px;
            }

            h3 {
              margin-bottom: 5px;
            }
        `,
        }}
      />

      <div>N: {testInfo.N}</div>
      <div>Ran test: {testInfo.numberOfRuns} times</div>

      <ul>
        <h3>Instructions</h3>
        <li>Check across tests for drastic differences, should be near identical.</li>
        <li>Take first test for most accurate "cold start" results.</li>
      </ul>

      <table>
        <thead>
          <tr>
            <th />
            <th>First run</th>
            <th>Last run</th>
            <th>Mean</th>
            <th>Median</th>
            <th>Fastest</th>
            <th>Slowest</th>
            <th>SD</th>
          </tr>
        </thead>
        <tbody>
          {[...Array(testInfo.numberOfRuns)].map((_val, runIndex) => {
            return (
              <tr key={runIndex}>
                <th>Test {runIndex + 1}</th>
                <ResultCells result={testInfo.results[runIndex]} />
              </tr>
            )
          })}
        </tbody>
        <tfoot>
          <tr>
            <th>Average</th>
            <ResultCells result={averageInfo} />
          </tr>
        </tfoot>
      </table>

      <hr />

      <ul>
        <li>Last run should be about the same or faster than the first run</li>
        <li>
          Standard deviation should only be a few milliseconds or something is causing renders to be
          wildly different
        </li>
      </ul>
    </div>
  )
}

function ResultCells({ result }) {
  const {
    firstIteration,
    lastIteration,
    meanIteration,
    medianIteration,
    variance,
    slowestIteration,
    fastestIteration,
  } = result

  const alertLastRender = lastIteration > firstIteration * 1.1 ? { color: 'orange' } : undefined
  return (
    <>
      <td>{firstIteration.toFixed(6)}</td>
      <td style={alertLastRender}>{lastIteration.toFixed(6)}</td>
      <td>{meanIteration.toFixed(6)}</td>
      <td>{medianIteration.toFixed(6)}</td>
      <td>{fastestIteration.toFixed(6)}</td>
      <td>{slowestIteration.toFixed(6)}</td>
      <td>{Math.sqrt(variance).toFixed(6)}</td>
    </>
  )
}

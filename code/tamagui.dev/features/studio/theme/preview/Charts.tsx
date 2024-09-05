import { useMemo } from 'react'
import {
  Bar,
  VictoryAxis,
  VictoryBar,
  VictoryChart,
  VictoryLine,
  VictoryPie,
  VictoryTooltip,
} from 'victory'

import { useThemeBuilderStore } from '../store/ThemeBuilderStore'
import { useVictoryTheme } from './useVictoryTheme'

const useIsShowing = () => {
  return !useThemeBuilderStore().isCentered
}

const NullComponent = () => null
const nullElement = <NullComponent />

export const BarChart = () => {
  const victoryTheme = useVictoryTheme()
  const showing = useIsShowing()

  const data = useMemo(
    () => [
      { x: 1, y: 60 * (showing ? 1 : 0.5) },
      { x: 2, y: 34 * (showing ? 1 : 0.5) },
      { x: 3, y: 40 * (showing ? 1 : 0.5) },
      { x: 4, y: 100 * (showing ? 1 : 0.5) },
      { x: 5, y: 80 * (showing ? 1 : 0.5) },
      { x: 6, y: 87 * (showing ? 1 : 0.5) },
      // { x: 7, y: 50 * (showing ? 1 : 0.5) },
      // { x: 8, y: 120 * (showing ? 1 : 0.5) },
    ],
    [showing]
  )

  return (
    <VictoryChart
      width={400}
      height={200}
      animate={{ duration: 2000, easing: 'cubic' }}
      theme={victoryTheme}
      domainPadding={{ x: 0, y: 0 }}
      // width={1}
    >
      {/* <VictoryAxis
        tickLabelComponent={nullElement}
        axisComponent={nullElement}
        tickComponent={nullElement}
        gridComponent={nullElement}
        tickValues={data.map(({ x }) => x - 1)}
        tickFormat={shortMonths}
        padding={0}
        width={0}
      /> */}
      <VictoryAxis
        animate
        tickLabelComponent={nullElement}
        axisComponent={nullElement}
        tickComponent={nullElement}
        gridComponent={nullElement}
        dependentAxis
        tickFormat={(x) => `${x.toLocaleString()}`}
        padding={0}
        width={0}
        height={0}
      />
      <VictoryBar
        padding={0}
        animate={{ duration: 2000, easing: 'cubic' }}
        // cornerRadius={{ togglePreviewThemeItem: 12 }}
        data={data}
        labels={({ datum }) => `${datum.y.toLocaleString()} new users`}
        labelComponent={<VictoryTooltip />}
        barWidth={40}
        // dataComponent={<Bar tabIndex={0} ariaLabel={({ datum }) => `x: ${datum.x}`} />}
      />
    </VictoryChart>
  )
}

export const LineChart = () => {
  const victoryTheme = useVictoryTheme()
  const showing = useIsShowing()

  const data = useMemo(
    () => [
      { x: 1, y: 60 * (showing ? 1 : 0.5) },
      { x: 2, y: 34 * (showing ? 1 : 0.5) },
      { x: 3, y: 40 * (showing ? 1 : 0.5) },
      { x: 4, y: 100 * (showing ? 1 : 0.5) },
      { x: 5, y: 80 * (showing ? 1 : 0.5) },
      { x: 6, y: 87 * (showing ? 1 : 0.5) },
      // { x: 7, y: 50 * (showing ? 1 : 0.5) },
      // { x: 8, y: 120 * (showing ? 1 : 0.5) },
    ],
    [showing]
  )

  return (
    <VictoryChart
      width={400}
      height={200}
      animate={{ duration: 2000, easing: 'cubic' }}
      theme={victoryTheme}
      domainPadding={{ x: 0, y: 0 }}
      // width={1}
    >
      {/* <VictoryAxis
        tickLabelComponent={nullElement}
        axisComponent={nullElement}
        tickComponent={nullElement}
        gridComponent={nullElement}
        tickValues={data.map(({ x }) => x - 1)}
        tickFormat={shortMonths}
        padding={0}
        width={0}
      /> */}
      <VictoryAxis
        animate
        tickLabelComponent={nullElement}
        axisComponent={nullElement}
        tickComponent={nullElement}
        gridComponent={nullElement}
        dependentAxis
        tickFormat={(x) => `${x.toLocaleString()}`}
        padding={0}
        width={0}
        height={0}
      />
      <VictoryLine
        padding={0}
        animate={{ duration: 2000, easing: 'cubic' }}
        // cornerRadius={{ togglePreviewThemeItem: 12 }}
        data={data}
        labels={({ datum }) => `${datum.y.toLocaleString()} new users`}
        labelComponent={<VictoryTooltip />}
        // barWidth={40}
        // dataComponent={<Line tabIndex={0} ariaLabel={({ datum }) => `x: ${datum.x}`} />}
      />
    </VictoryChart>
  )
}

export const NewMembersChart = () => {
  const victoryTheme = useVictoryTheme()
  const showing = useIsShowing()
  return (
    <VictoryPie
      key={Math.random()}
      theme={victoryTheme}
      animate={{ duration: 2000, easing: 'cubic' }}
      height={200}
      width={200}
      data={useMemo(
        () => [
          { x: 'A', y: showing ? 190 : 0 },
          { x: 'B', y: 65 },
          { x: 'C', y: 19 },
          { x: 'D', y: 40 },
        ],
        [showing]
      )}
    />
  )
}

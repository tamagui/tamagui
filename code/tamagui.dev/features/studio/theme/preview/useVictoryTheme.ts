import { assign } from 'lodash'
import { getVariableValue, useTheme, useThemeName } from 'tamagui'
import type { VictoryThemeDefinition } from 'victory'
import { useDemoProps } from '../hooks/useDemoProps'

export const useVictoryTheme = (): VictoryThemeDefinition => {
  const demoProps = useDemoProps()
  const theme = useTheme()
  const themeName = useThemeName()
  const isAccent = themeName.includes('accent')

  // *
  // * Typography
  // *
  const letterSpacing = 'normal'
  const fontSize = 12
  // *
  // * Layout
  // *
  const padding = 8
  const baseProps = {
    width: 350,
    height: 350,
    padding: 50,
  }

  const accentColor = getVariableValue(
    isAccent ? theme.color : theme[demoProps.accentBackground]
  )

  // *
  // * Labels
  // *
  const baseLabelStyles = {
    fontFamily: 'sans-serif',
    fontSize,
    letterSpacing,
    padding,
    fill: getVariableValue(theme[demoProps.accentBackground]),
    stroke: 'transparent',
    strokeWidth: 0,
  }

  const centeredLabelStyles = assign({ textAnchor: 'middle' }, baseLabelStyles)
  // *
  // * Strokes
  // *
  const strokeDasharray = '10, 5'
  const strokeLinecap = 'round'
  const strokeLinejoin = 'round'

  // *
  // * Colors
  // *
  const colors = [
    getVariableValue(theme.color9),
    getVariableValue(theme.yellow9),
    getVariableValue(theme.green9),
    getVariableValue(theme.blue9),
    getVariableValue(theme.purple9),
    getVariableValue(theme.pink9),
    getVariableValue(theme.red9),
  ]

  return {
    area: assign(
      {
        style: {
          data: {
            fill: accentColor,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps
    ),
    axis: assign(
      {
        style: {
          axis: {
            fill: 'transparent',
            stroke: getVariableValue(theme.color5),
            strokeWidth: 2,
            strokeLinecap,
            strokeLinejoin,
          },
          axisLabel: assign({}, centeredLabelStyles, {
            padding,
            stroke: 'transparent',
          }),
          grid: {
            fill: 'none',
            stroke: getVariableValue(theme.color6),
            strokeDasharray,
            strokeLinecap,
            strokeLinejoin,
            pointerEvents: 'painted',
          },
          ticks: {
            fill: 'transparent',
            size: 5,
            stroke: accentColor,
            strokeWidth: 1,
            strokeLinecap,
            strokeLinejoin,
          },
          tickLabels: assign({}, baseLabelStyles, {
            fill: getVariableValue(theme.color8),
          }),
        },
      },
      baseProps
    ),
    polarDependentAxis: assign({
      style: {
        ticks: {
          fill: 'transparent',
          size: 1,
          stroke: 'transparent',
        },
      },
    }),
    bar: assign(
      {
        style: {
          strokeLinejoin: 'round',
          strokeWidth: 6,
          data: {
            fill: accentColor,
            padding,
            strokeWidth: 0,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps
    ),
    boxplot: assign(
      {
        style: {
          max: { padding, stroke: getVariableValue(theme.color8), strokeWidth: 1 },
          maxLabels: assign({}, baseLabelStyles, { padding: 3 }),
          median: { padding, stroke: getVariableValue(theme.color8), strokeWidth: 1 },
          medianLabels: assign({}, baseLabelStyles, { padding: 3 }),
          min: { padding, stroke: getVariableValue(theme.color8), strokeWidth: 1 },
          minLabels: assign({}, baseLabelStyles, { padding: 3 }),
          q1: { padding, fill: getVariableValue(theme.color8) },
          q1Labels: assign({}, baseLabelStyles, { padding: 3 }),
          q3: { padding, fill: getVariableValue(theme.color8) },
          q3Labels: assign({}, baseLabelStyles, { padding: 3 }),
        },
        boxWidth: 20,
      },
      baseProps
    ),
    candlestick: assign(
      {
        style: {
          data: {
            stroke: getVariableValue(theme.color8),
          },
          labels: assign({}, baseLabelStyles, { padding: 5 }),
        },
        candleColors: {
          positive: '#ffffff',
          negative: getVariableValue(theme.color8),
        },
      },
      baseProps
    ),
    chart: baseProps,
    errorbar: assign(
      {
        borderWidth: 8,
        style: {
          data: {
            fill: 'transparent',
            opacity: 1,
            stroke: getVariableValue(theme.color8),
            strokeWidth: 2,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps
    ),
    group: assign(
      {
        colorScale: colors,
      },
      baseProps
    ),
    histogram: assign(
      {
        style: {
          data: {
            fill: getVariableValue(theme.color8),
            stroke: accentColor,
            strokeWidth: 2,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps
    ),
    legend: {
      colorScale: colors,
      gutter: 10,
      orientation: 'vertical',
      titleOrientation: 'top',
      style: {
        data: {
          type: 'circle',
        },
        labels: baseLabelStyles,
        title: assign({}, baseLabelStyles, { padding: 5 }),
      },
    },
    line: assign(
      {
        style: {
          data: {
            fill: 'transparent',
            opacity: 1,
            stroke: accentColor,
            strokeWidth: 2,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps
    ),
    pie: assign(
      {
        colorScale: colors,
        style: {
          data: {
            padding,
            strokeWidth: 0,
          },
          labels: assign({}, baseLabelStyles, { padding: 20 }),
        },
      },
      baseProps
    ),
    scatter: assign(
      {
        style: {
          data: {
            fill: getVariableValue(theme.color8),
            opacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
          },
          labels: baseLabelStyles,
        },
      },
      baseProps
    ),
    stack: assign(
      {
        colorScale: colors,
      },
      baseProps
    ),
    tooltip: {
      style: assign({}, baseLabelStyles, { padding: 0, pointerEvents: 'none' }),
      flyoutStyle: {
        stroke: getVariableValue(theme.borderColor),
        strokeWidth: 1,
        fill: getVariableValue(theme.background),
        pointerEvents: 'none',
      },
      flyoutPadding: 5,
      cornerRadius: 5,
      pointerLength: 10,
    },
    voronoi: assign(
      {
        style: {
          data: {
            fill: 'transparent',
            stroke: 'transparent',
            strokeWidth: 0,
          },
          labels: assign({}, baseLabelStyles, {
            padding: 5,
            pointerEvents: 'none',
          }),
          flyout: {
            stroke: accentColor,
            strokeWidth: 1,
            fill: 'red',
            pointerEvents: 'none',
          },
        },
      },
      baseProps
    ),
  }
}

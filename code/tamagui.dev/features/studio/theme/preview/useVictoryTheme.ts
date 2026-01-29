import { useMemo } from 'react'
import { getVariableValue, useTheme, useThemeName } from 'tamagui'
import type { VictoryThemeDefinition } from 'victory'
import { useDemoProps } from '../hooks/useDemoProps'

export const useVictoryTheme = (): VictoryThemeDefinition => {
  const demoProps = useDemoProps()
  const theme = useTheme()
  const themeName = useThemeName()
  const isAccent = themeName.includes('accent')

  // Extract all theme values upfront for memoization
  const accentBgVal = getVariableValue(theme[demoProps.accentBackground])
  const colorVal = getVariableValue(theme.color)
  const color3Val = getVariableValue(theme.color3)
  const color5Val = getVariableValue(theme.color5)
  const color6Val = getVariableValue(theme.color6)
  const color8Val = getVariableValue(theme.color8)
  const color9Val = getVariableValue(theme.color9)
  const accent3Val = getVariableValue(theme.accent3)
  const accent6Val = getVariableValue(theme.accent6)
  const pink9Val = getVariableValue(theme.pink9)
  const red9Val = getVariableValue(theme.red9)
  const borderColorVal = getVariableValue(theme.borderColor)
  const bgVal = getVariableValue(theme.background)
  const accentColor = isAccent ? colorVal : accentBgVal

  return useMemo(() => {
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

    // *
    // * Labels
    // *
    const baseLabelStyles = {
      fontFamily: 'sans-serif',
      fontSize,
      letterSpacing,
      padding,
      fill: accentBgVal,
      stroke: 'transparent',
      strokeWidth: 0,
    }

    const centeredLabelStyles = Object.assign({ textAnchor: 'middle' }, baseLabelStyles)
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
      color9Val,
      color3Val,
      color6Val,
      accent3Val,
      accent6Val,
      pink9Val,
      red9Val,
    ]

    return {
      area: Object.assign(
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
      axis: Object.assign(
        {
          style: {
            axis: {
              fill: 'transparent',
              stroke: color5Val,
              strokeWidth: 2,
              strokeLinecap,
              strokeLinejoin,
            },
            axisLabel: Object.assign({}, centeredLabelStyles, {
              padding,
              stroke: 'transparent',
            }),
            grid: {
              fill: 'none',
              stroke: color6Val,
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
            tickLabels: Object.assign({}, baseLabelStyles, {
              fill: color8Val,
            }),
          },
        },
        baseProps
      ),
      polarDependentAxis: Object.assign({
        style: {
          ticks: {
            fill: 'transparent',
            size: 1,
            stroke: 'transparent',
          },
        },
      }),
      bar: Object.assign(
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
      boxplot: Object.assign(
        {
          style: {
            max: { padding, stroke: color8Val, strokeWidth: 1 },
            maxLabels: Object.assign({}, baseLabelStyles, { padding: 3 }),
            median: { padding, stroke: color8Val, strokeWidth: 1 },
            medianLabels: Object.assign({}, baseLabelStyles, { padding: 3 }),
            min: { padding, stroke: color8Val, strokeWidth: 1 },
            minLabels: Object.assign({}, baseLabelStyles, { padding: 3 }),
            q1: { padding, fill: color8Val },
            q1Labels: Object.assign({}, baseLabelStyles, { padding: 3 }),
            q3: { padding, fill: color8Val },
            q3Labels: Object.assign({}, baseLabelStyles, { padding: 3 }),
          },
          boxWidth: 20,
        },
        baseProps
      ),
      candlestick: Object.assign(
        {
          style: {
            data: {
              stroke: color8Val,
            },
            labels: Object.assign({}, baseLabelStyles, { padding: 5 }),
          },
          candleColors: {
            positive: '#ffffff',
            negative: color8Val,
          },
        },
        baseProps
      ),
      chart: baseProps,
      errorbar: Object.assign(
        {
          borderWidth: 8,
          style: {
            data: {
              fill: 'transparent',
              opacity: 1,
              stroke: color8Val,
              strokeWidth: 2,
            },
            labels: baseLabelStyles,
          },
        },
        baseProps
      ),
      group: Object.assign(
        {
          colorScale: colors,
        },
        baseProps
      ),
      histogram: Object.assign(
        {
          style: {
            data: {
              fill: color8Val,
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
          title: Object.assign({}, baseLabelStyles, { padding: 5 }),
        },
      },
      line: Object.assign(
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
      pie: Object.assign(
        {
          colorScale: colors,
          style: {
            data: {
              padding,
              strokeWidth: 0,
            },
            labels: Object.assign({}, baseLabelStyles, { padding: 20 }),
          },
        },
        baseProps
      ),
      scatter: Object.assign(
        {
          style: {
            data: {
              fill: color8Val,
              opacity: 1,
              stroke: 'transparent',
              strokeWidth: 0,
            },
            labels: baseLabelStyles,
          },
        },
        baseProps
      ),
      stack: Object.assign(
        {
          colorScale: colors,
        },
        baseProps
      ),
      tooltip: {
        style: Object.assign({}, baseLabelStyles, { padding: 0, pointerEvents: 'none' }),
        flyoutStyle: {
          stroke: borderColorVal,
          strokeWidth: 1,
          fill: bgVal,
          pointerEvents: 'none',
        },
        flyoutPadding: 5,
        cornerRadius: 5,
        pointerLength: 10,
      },
      voronoi: Object.assign(
        {
          style: {
            data: {
              fill: 'transparent',
              stroke: 'transparent',
              strokeWidth: 0,
            },
            labels: Object.assign({}, baseLabelStyles, {
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
  }, [
    accentColor,
    accentBgVal,
    color3Val,
    color5Val,
    color6Val,
    color8Val,
    color9Val,
    accent3Val,
    accent6Val,
    pink9Val,
    red9Val,
    borderColorVal,
    bgVal,
  ])
}

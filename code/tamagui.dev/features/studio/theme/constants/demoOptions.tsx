import type { TextProps, YStackProps } from 'tamagui'

export const optionValues = {
  inverseAccent: [false, true],
  borderRadius: ['$0', '$2', '$4', '$5', '$6'] as YStackProps['borderRadius'][],
  borderWidth: [0 as const, 1 as const, 2 as const],
  headingFontFamily: [
    '$heading',
    '$headingNohemi',
    '$headingDmSans',
    '$headingDmSerifDisplay',
  ] as TextProps['fontFamily'][],
  fillStyle: ['filled' as const, 'outlined' as const],
  elevation: [0, '$1', '$2'] as YStackProps['elevation'][],
  spacing: ['sm' as const, 'md' as const, 'lg' as const],
  textAccent: ['low' as const, 'high' as const],
  backgroundAccent: ['low' as const, 'high' as const],
}

export const demoOptions = {
  inverseAccent: false,
  borderRadius: '$5' as (typeof optionValues)['borderRadius'][number],
  borderWidth: 1 as (typeof optionValues)['borderWidth'][number],
  headingFontFamily: '$heading' as (typeof optionValues)['headingFontFamily'][number],
  fillStyle: 'filled' as (typeof optionValues)['fillStyle'][number],
  elevation: 0 as (typeof optionValues)['elevation'][number],
  spacing: 'md' as (typeof optionValues)['spacing'][number],
  textAccent: 'high' as (typeof optionValues)['textAccent'][number],
  backgroundAccent: 'low' as (typeof optionValues)['backgroundAccent'][number],
}

export type DemoOptions = typeof demoOptions

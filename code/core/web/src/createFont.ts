import type { FontWeightValues, GenericFont } from './types'

const fontWeights: FontWeightValues[] = [
  '100',
  '200',
  '300',
  '400',
  '500',
  '600',
  '700',
  '800',
  '900',
]

const processSection = <T>(
  section: string | Record<string, T>,
  keys: string[],
  defaultValue?: any
): string | Record<string, T> => {
  if (typeof section === 'string') return section

  const sectionKeys = Object.keys(section)
  let fillValue = section[sectionKeys[0]]

  return Object.fromEntries(
    [...new Set([...keys, ...sectionKeys])].map((key) => {
      const value = section[key] ?? defaultValue ?? fillValue
      fillValue = value
      defaultValue = value
      return [key, value]
    })
  )
}

export const createFont = <A extends GenericFont>(font: A): A => {
  const sizeKeys = Object.keys(font.size)
  const processedFont = Object.fromEntries(
    Object.entries(font).map(([key, section]) => {
      return [
        key,
        processSection(
          section as any,
          key === 'face' ? fontWeights : sizeKeys,
          key === 'face' ? { normal: font.family } : undefined
        ),
      ]
    })
  )
  return Object.freeze(processedFont) as A
}

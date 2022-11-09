import { FontWeightSteps, GenericFont } from './types'

const fontWeights: FontWeightSteps[] = [
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
  keys: string[]
): string | Record<string, T> => {
  if (typeof section === 'string') return section

  let fillValue = section[Object.keys(section)[0]]

  return Object.fromEntries(
    keys.map((key) => {
      const value = section[key] ?? fillValue
      fillValue = value
      return [key, value]
    })
  )
}

export const createFont = <A extends GenericFont>(font: A): A => {
  const sizeKeys = Object.keys(font.size)

  const processedFont = Object.fromEntries(
    Object.entries(font).map(([key, section]) => {
      const fillKeys = key === 'face' ? fontWeights : sizeKeys

      return [key, processSection(section, fillKeys)]
    })
  )

  return Object.freeze(processedFont) as A
}

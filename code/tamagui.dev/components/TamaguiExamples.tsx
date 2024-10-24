import type { getCompilationExamples } from '@tamagui/mdx-2'
import { createContext, useContext } from 'react'
import { Spacer } from 'tamagui'
import { HeroContainer } from '~/features/docs/HeroContainer'
import { HomeExamples } from '~/features/site/home/HomeExamples'

export const TamaguiExamples = createContext<ReturnType<
  typeof getCompilationExamples
> | null>(null)

export function TamaguiExamplesCode() {
  try {
    const examples = useContext(TamaguiExamples)
    return (
      <HeroContainer noScroll noPad>
        <Spacer />
        <HomeExamples onlyDemo examples={examples?.compilationExamples} />
        <Spacer />
      </HeroContainer>
    )
  } catch {
    return null
  }
}

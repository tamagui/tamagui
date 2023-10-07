import { createContext, useContext } from 'react'
import { Spacer, YStack } from 'tamagui'

import { getCompilationExamples } from '../lib/getCompilationExamples'
import { HeroContainer } from './HeroContainer'
import { HeroExampleCode } from './HeroExampleCode'

export const TamaguiExamples = createContext<ReturnType<
  typeof getCompilationExamples
> | null>(null)

export function TamaguiExamplesCode() {
  try {
    // Context isn't working here for some reason
    // const examples = useContext(TamaguiExamples)
    return (
      <HeroContainer noScroll noPad>
        <Spacer />
        {/* <HeroExampleCode onlyDemo examples={examples?.compilationExamples} /> */}
        <HeroExampleCode
          onlyDemo
          examples={getCompilationExamples().compilationExamples}
        />
        <Spacer />
      </HeroContainer>
    )
  } catch {
    return null
  }
}

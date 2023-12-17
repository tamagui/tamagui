import { CardBackground, CardFooter, CardFrame, CardHeader } from './Card'
import { createCard } from './createCard'

export * from './Card'
export * from './createCard'
export const Card = createCard({
  Background: CardBackground,
  Footer: CardFooter,
  Frame: CardFrame,
  Header: CardHeader,
})

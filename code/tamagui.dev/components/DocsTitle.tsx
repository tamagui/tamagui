import { H1 } from 'tamagui'
import { nbspLastWord } from './SubTitle'

/**
 * The title at the top of a docs page.
 *
 * Sized for reading rather than for a landing page: the marketing `HomeH1` is a
 * hero and runs a good deal larger than a page of prose wants.
 */
export const DocsTitle = ({ children }: { children: string }) => {
  return (
    <H1
      mb="1-5"
      color="color-12"
      fontSize={32}
      lineHeight="38px"
      fontWeight="700"
      letterSpacing={-0.6}
      maxW="md:90%"
      className="word-break-keep-all"
    >
      {nbspLastWord(children)}
    </H1>
  )
}

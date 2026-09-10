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
      mb="2"
      color="color-12"
      fontSize={32}
      lineHeight={38}
      fontWeight="600"
      maxW="gtSm:90%"
      className="word-break-keep-all"
    >
      {nbspLastWord(children)}
    </H1>
  )
}

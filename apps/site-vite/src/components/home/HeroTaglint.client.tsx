import React from 'react'
import { Text, TooltipSimple } from 'tamagui'

export const HeroTagline = () => {
  return (
    <>
      {/* <TooltipSimple label="Works the same on iOS, Android, and web">
        <span className="rainbow clip-text help">Universal</span>
      </TooltipSimple>{' '} */}
      design systems for React&nbsp;Native&nbsp;&&nbsp;Web
      {/* TODO text inside text not working because of context */}
      <Text
        tag="span"
        fontSize="inherit"
        ls="inherit"
        fontFamily="inherit"
        $sm={{ display: 'none' }}
      >
        , faster.
      </Text>
    </>
  )
}

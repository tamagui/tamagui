// import './wdyr'

import { useEffect, useState } from 'react'
<<<<<<< HEAD
import { AnimatePresence, H1, Square, XStack } from 'tamagui'

export const Sandbox = () => {
  return (
    <Square
      backgroundColor="red"
      size={100}
      animation="quick"
      hoverStyle={{
        scale: 2,
      }}
      $theme-dark={{
        backgroundColor: 'green',
        hoverStyle: {
          scale: 2,
        },
      }}
      $platform-web={{
        backgroundColor: 'blue',
      }}
    />
  )
}

const NumberTicker = () => {
=======
import { AnimatePresence, H1, XStack } from 'tamagui'

export const Sandbox = () => {
>>>>>>> master
  const [numbers, setNumbers] = useState([0, 5, 2, 3])

  useEffect(() => {
    setTimeout(() => {
      setNumbers(
        numbers.map((n) => {
          return Math.floor(Math.random() * 10)
        })
      )
    }, 3000)
  }, [numbers])

  return (
    <XStack als="center" m="auto">
      {numbers.map((n, i) => {
        return (
          <AnimatePresence exitBeforeEnter key={i}>
            <H1
              animation="quick"
              enterStyle={{
                y: -30,
                o: 0,
              }}
              exitStyle={{
                y: 30,
                o: 0,
              }}
              o={1}
              key={n}
            >
              {n}
            </H1>
          </AnimatePresence>
        )
      })}
    </XStack>
  )
}

import { createContext, useContext, useEffect, useRef, useState } from 'react'
import type { TamaguiElement } from 'tamagui'
import {
  View,
  isWeb,
  Text,
  Image,
  useComposedRefs,
  withStaticProperties,
  H3,
  Button,
} from 'tamagui'

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

const Container = View.styleable(({ children, ...rest }) => {
  const [_containerRef, setContainerRef] = useState<TamaguiElement | null>(null)
  const [perspectiveRef, setPerspectiveRef] = useState<TamaguiElement | null>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)

  const containerRef = _containerRef as HTMLDivElement

  useEffect(() => {
    if (perspectiveRef && isWeb) {
      ;(perspectiveRef as HTMLDivElement).style.perspective = '1000px'
    }
  }, [perspectiveRef])

  useEffect(() => {
    if (containerRef && isWeb) {
      containerRef.style.transformStyle = 'preserve-3d'
      containerRef.style.transition = `50ms linear`
    }
  }, [containerRef])

  let handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  let handleMouseEnter: () => void
  let handleMouseLeave: () => void

  if (isWeb) {
    handleMouseMove = (e) => {
      if (!containerRef) return
      const { left, top, width, height } = containerRef.getBoundingClientRect()
      const x = (e.clientX - left - width / 2) / 25
      const y = (e.clientY - top - height / 2) / 25
      containerRef.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`
    }

    handleMouseEnter = () => {
      setIsMouseEntered(true)
      if (!containerRef) return
    }

    handleMouseLeave = () => {
      if (!containerRef) return
      setIsMouseEntered(false)
      containerRef.style.transform = `rotateY(0deg) rotateX(0deg)`
    }
  }

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <View
        paddingVertical={20}
        justifyContent="center"
        alignItems="center"
        ref={(ref) => setPerspectiveRef(ref)}
        {...rest}
      >
        <View
          justifyContent="center"
          alignItems="center"
          ref={(ref) => setContainerRef(ref)}
          {...(isWeb && {
            onMouseEnter: handleMouseEnter!,
            onMouseMove: handleMouseMove!,
            onMouseLeave: handleMouseLeave!,
          })}
        >
          {children}
        </View>
      </View>
    </MouseEnterContext.Provider>
  )
})

const Body = View.styleable(({ children, ...rest }, forwardedRef) => {
  const [perspectiveRef, setPerspectiveRef] = useState<TamaguiElement | null>(null)

  const composedRef = useComposedRefs(forwardedRef, setPerspectiveRef)

  useEffect(() => {
    if (perspectiveRef && isWeb) {
      ;(perspectiveRef as HTMLDivElement).style.transformStyle = 'preserve-3d'
    }
  }, [perspectiveRef])

  return (
    <View ref={(ref) => composedRef(ref as any)} {...rest}>
      {children}
    </View>
  )
})

type ItemProps = {
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
}
const Item = View.styleable<ItemProps>(
  ({
    translateX = 0,
    translateY = 0,
    translateZ = 0,
    rotateX = 0,
    rotateY = 0,
    rotateZ = 0,
    children,
    ...rest
  }) => {
    const [ref, setRef] = useState<TamaguiElement | null>(null)
    const [isMouseEntered] = useMouseEnter()

    useEffect(() => {
      if (isWeb) {
        handleAnimations()
      }
    }, [isMouseEntered])

    useEffect(() => {
      if (isWeb && ref) {
        ;(ref as HTMLElement).style.transition = 'all 200ms linear'
      }
    }, [ref])

    const handleAnimations = () => {
      if (!ref) return
      if (isMouseEntered) {
        ;(ref as HTMLElement).style.transform =
          `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      } else {
        ;(ref as HTMLElement).style.transform =
          `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
      }
    }

    return (
      <View ref={(ref) => setRef(ref)} {...rest}>
        {children}
      </View>
    )
  }
)

const Card = withStaticProperties(Container, {
  Body,
  Item,
})

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext)
  if (context === undefined) {
    throw new Error('useMouseEnter must be used within a MouseEnterProvider')
  }
  return context
}

/** ------ EXAMPLE ------ */
export function InteractiveCardExample() {
  return (
    <Card maxWidth="100%" width="100%">
      <Card.Body
        width={400}
        maxWidth="100%"
        borderWidth={1}
        borderColor="$gray6"
        padding="$3"
        borderRadius="$4"
        gap="$4"
        backgroundColor="$background"
      >
        <Card.Item translateZ={30} borderRadius="$4" overflow="hidden">
          <View width="100%" height={200}>
            <View width="100%" height="100%">
              <Image
                width="100%"
                height="100%"
                source={{ uri: 'http://tamagui.dev/bento/images/bag/bag1.jpg' }}
              />
            </View>
          </View>
        </Card.Item>
        <Card.Item translateZ={25}>
          <View
            paddingHorizontal="$3"
            paddingVertical="$2"
            borderRadius={'$5'}
            backgroundColor="$blue5"
            alignSelf="flex-start"
          >
            <Text fontSize="$3">Label</Text>
          </View>
        </Card.Item>
        <Card.Item translateZ={15}>
          <H3 size="$7">Heading level 3</H3>
        </Card.Item>
        <Card.Item translateZ={10}>
          <Text fontSize="$4">This is a brief description about card</Text>
        </Card.Item>
        <Card.Item translateZ={50} translateY={5}>
          <Button
            themeInverse
            animation="quick"
            pressStyle={{
              scale: 0.98,
            }}
          >
            <Button.Text>Buy</Button.Text>
          </Button>
        </Card.Item>
      </Card.Body>
    </Card>
  )
}

InteractiveCardExample.fileName = 'InteractiveCard'

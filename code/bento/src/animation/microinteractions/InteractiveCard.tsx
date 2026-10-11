import { createContext, useContext, useEffect, useState } from 'react'
import type { TamaguiElement, ViewProps } from 'tamagui'
import {
  createStyledHOC,
  Button,
  H3,
  Image,
  isWeb,
  Text,
  useComposedRefs,
  View,
  withStaticProperties,
} from 'tamagui'

const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

// Tamagui refs resolve to HTMLElements on web but stay cross-platform in its public type.
const getWebElement = (element: TamaguiElement | null) =>
  isWeb ? (element as HTMLElement | null) : null

const Container = ({ children, ...rest }: ViewProps) => {
  const [_containerRef, setContainerRef] = useState<TamaguiElement | null>(null)
  const [perspectiveRef, setPerspectiveRef] = useState<TamaguiElement | null>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)

  const containerRef = getWebElement(_containerRef)
  const perspectiveElement = getWebElement(perspectiveRef)

  useEffect(() => {
    if (perspectiveElement) {
      perspectiveElement.style.perspective = '1000px'
    }
  }, [perspectiveElement])

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
        py={20}
        justify="center"
        items="center"
        ref={(ref) => setPerspectiveRef(ref)}
        {...rest}
      >
        <View
          justify="center"
          items="center"
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
}

const Body = createStyledHOC(View, ({ children, ...rest }, forwardedRef) => {
  const [perspectiveRef, setPerspectiveRef] = useState<TamaguiElement | null>(null)
  const perspectiveElement = getWebElement(perspectiveRef)

  const composedRef = useComposedRefs(forwardedRef, setPerspectiveRef)

  useEffect(() => {
    if (perspectiveElement) {
      perspectiveElement.style.transformStyle = 'preserve-3d'
    }
  }, [perspectiveElement])

  return (
    <View ref={composedRef} {...rest}>
      {children}
    </View>
  )
})

type ItemProps = Omit<
  React.ComponentProps<typeof View>,
  'translateX' | 'translateY' | 'rotateX' | 'rotateY' | 'rotateZ'
> & {
  translateX?: number | string
  translateY?: number | string
  translateZ?: number | string
  rotateX?: number | string
  rotateY?: number | string
  rotateZ?: number | string
}
const Item = createStyledHOC(
  View,
  (
    {
      translateX = 0,
      translateY = 0,
      translateZ = 0,
      rotateX = 0,
      rotateY = 0,
      rotateZ = 0,
      children,
      ...rest
    }: ItemProps,
    forwardedRef
  ) => {
    const [ref, setRef] = useState<TamaguiElement | null>(null)
    const element = getWebElement(ref)
    const setComposedRef = useComposedRefs(forwardedRef, setRef)
    const [isMouseEntered] = useMouseEnter()

    useEffect(() => {
      if (isWeb) {
        handleAnimations()
      }
    }, [isMouseEntered])

    useEffect(() => {
      if (element) {
        element.style.transition = 'all 200ms linear'
      }
    }, [element])

    const handleAnimations = () => {
      if (!element) return
      if (isMouseEntered) {
        element.style.transform = `translateX(${translateX}px) translateY(${translateY}px) translateZ(${translateZ}px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) rotateZ(${rotateZ}deg)`
      } else {
        element.style.transform = `translateX(0px) translateY(0px) translateZ(0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg)`
      }
    }

    return (
      <View ref={setComposedRef} {...rest}>
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
    if (!isWeb) {
      // Return safe fallback for native platforms where mouse events don't exist
      return [false, () => {}] as [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    }
    throw new Error('useMouseEnter must be used within a MouseEnterProvider')
  }
  return context
}

export function InteractiveCard() {
  return (
    <Card maxW="100%" width="100%">
      <Card.Body
        width={400}
        maxW="100%"
        borderWidth={1}
        borderColor="color-6"
        p="3"
        rounded="4"
        gap="4"
        bg="background"
      >
        <Card.Item translateZ={30} rounded="4" overflow="hidden">
          <View width="100%" height={200}>
            <View width="100%" height="100%">
              <Image
                src="/bento/images/jacket1.webp"
                width="100%"
                height="100%"
                objectFit="cover"
              />
            </View>
          </View>
        </Card.Item>
        <Card.Item translateZ={25}>
          <View px="3" py="2" rounded="5" bg="green-6" self="flex-start">
            <Text fontSize="3">Label</Text>
          </View>
        </Card.Item>
        <Card.Item translateZ={15}>
          <H3 size="7">Heading level 3</H3>
        </Card.Item>
        <Card.Item translateZ={10}>
          <Text fontSize="4">This is a brief description about card</Text>
        </Card.Item>
        <Card.Item translateZ={50} translateY={5}>
          <Button
            theme="accent"
            style={{ transition: 'transform 150ms ease, opacity 150ms ease' }}
            scale="press:0.98"
          >
            <Button.Text>Buy</Button.Text>
          </Button>
        </Card.Item>
      </Card.Body>
    </Card>
  )
}

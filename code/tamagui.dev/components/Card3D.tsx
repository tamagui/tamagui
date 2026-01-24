import { createContext, useContext, useEffect, useState } from 'react'
import type { TamaguiElement, ViewProps } from 'tamagui'
import { isWeb, View, withStaticProperties } from 'tamagui'

// 3D Card Context - shared hover state between container and items
const MouseEnterContext = createContext<
  [boolean, React.Dispatch<React.SetStateAction<boolean>>] | undefined
>(undefined)

export const useMouseEnter = () => {
  const context = useContext(MouseEnterContext)
  if (context === undefined) {
    if (!isWeb) {
      return [false, () => {}] as [boolean, React.Dispatch<React.SetStateAction<boolean>>]
    }
    throw new Error('useMouseEnter must be used within a Card3D')
  }
  return context
}

export type Card3DContainerProps = ViewProps & {
  /** Custom class name for the container */
  className?: string
  /** Tilt intensity - higher = less tilt. Default: 10 */
  tiltDivisor?: number
  /** Center content in container */
  centered?: boolean
}

const Card3DContainer = ({
  children,
  className,
  tiltDivisor = 10,
  centered = false,
  ...rest
}: Card3DContainerProps) => {
  const [_containerRef, setContainerRef] = useState<TamaguiElement | null>(null)
  const [perspectiveRef, setPerspectiveRef] = useState<TamaguiElement | null>(null)
  const [isMouseEntered, setIsMouseEntered] = useState(false)

  const containerRef = _containerRef as HTMLDivElement

  useEffect(() => {
    if (perspectiveRef && isWeb) {
      ;(perspectiveRef as HTMLDivElement).style.perspective = '800px'
    }
  }, [perspectiveRef])

  useEffect(() => {
    if (containerRef && isWeb) {
      containerRef.style.transformStyle = 'preserve-3d'
      containerRef.style.transition = 'transform 100ms ease-out'
    }
  }, [containerRef])

  let handleMouseMove: (e: React.MouseEvent<HTMLDivElement>) => void
  let handleMouseEnter: () => void
  let handleMouseLeave: () => void

  if (isWeb) {
    handleMouseMove = (e) => {
      if (!containerRef) return
      const { left, top, width, height } = containerRef.getBoundingClientRect()
      const x = (e.clientX - left - width / 2) / tiltDivisor
      const y = (e.clientY - top - height / 2) / tiltDivisor
      containerRef.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`
    }

    handleMouseEnter = () => {
      setIsMouseEntered(true)
    }

    handleMouseLeave = () => {
      if (!containerRef) return
      setIsMouseEntered(false)
      containerRef.style.transform = 'rotateY(0deg) rotateX(0deg)'
    }
  }

  return (
    <MouseEnterContext.Provider value={[isMouseEntered, setIsMouseEntered]}>
      <View
        ref={(ref) => setPerspectiveRef(ref)}
        className={className}
        {...(centered && {
          justify: 'center',
          items: 'center',
        })}
        {...rest}
      >
        <View
          ref={(ref) => setContainerRef(ref)}
          {...(centered && {
            justify: 'center',
            items: 'center',
          })}
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

export type Card3DItemProps = {
  /** Z-axis translation on hover in pixels */
  translateZ?: number
}

const Card3DItem = View.styleable<Card3DItemProps>(
  ({ translateZ = 0, children, ...rest }, forwardedRef) => {
    const [ref, setRef] = useState<TamaguiElement | null>(null)
    const [isMouseEntered] = useMouseEnter()

    useEffect(() => {
      if (isWeb && ref) {
        ;(ref as HTMLElement).style.transition = 'transform 200ms ease-out'
      }
    }, [ref])

    useEffect(() => {
      if (!isWeb || !ref) return
      if (isMouseEntered) {
        ;(ref as HTMLElement).style.transform = `translateZ(${translateZ}px)`
      } else {
        ;(ref as HTMLElement).style.transform = 'translateZ(0px)'
      }
    }, [isMouseEntered, translateZ, ref])

    return (
      <View
        ref={(r) => {
          setRef(r)
          if (typeof forwardedRef === 'function') forwardedRef(r)
          else if (forwardedRef) forwardedRef.current = r
        }}
        {...rest}
      >
        {children}
      </View>
    )
  }
)

export const Card3D = withStaticProperties(Card3DContainer, {
  Item: Card3DItem,
})

export { MouseEnterContext }

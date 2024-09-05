import type {
  AccumulativeShadowsProps,
  CenterProps,
  ContactShadowsProps,
  RandomizedLightProps,
} from '@react-three/drei'
import {
  AccumulativeShadows,
  Bounds,
  Center,
  ContactShadows,
  RandomizedLight,
  useBounds,
} from '@react-three/drei'
import * as React from 'react'

const presets = {
  rembrandt: {
    main: [1, 2, 1],
    fill: [-2, -0.5, -2],
  },
  portrait: {
    main: [-1, 2, 0.5],
    fill: [-1, 0.5, -1.5],
  },
  upfront: {
    main: [0, 2, 1],
    fill: [-1, 0.5, -1.5],
  },
  soft: {
    main: [-2, 4, 4],
    fill: [-1, 0.5, -1.5],
  },
}

type StageShadows = Partial<AccumulativeShadowsProps> &
  Partial<RandomizedLightProps> &
  Partial<ContactShadowsProps> & {
    type: 'contact' | 'accumulative'
    /** Shadow plane offset, default: 0 */
    offset?: number
    /** Shadow bias, default: -0.0001 */
    bias?: number
    /** Shadow normal bias, default: 0 */
    normalBias?: number
    /** Shadow map size, default: 1024 */
    size?: number
  }

type StageProps = {
  /** Lighting setup, default: "rembrandt" */
  preset?:
    | 'rembrandt'
    | 'portrait'
    | 'upfront'
    | 'soft'
    | { main: [x: number, y: number, z: number]; fill: [x: number, y: number, z: number] }
  /** Controls the ground shadows, default: "contact" */
  shadows?: boolean | 'contact' | 'accumulative' | StageShadows
  /** Optionally wraps and thereby centers the models using <Bounds>, can also be a margin, default: true */
  adjustCamera?: boolean | number
  /** The lighting intensity, default: 0.5 */
  intensity?: number
  /** To adjust centering, default: undefined */
  center?: Partial<CenterProps>
}

function Refit({ radius, adjustCamera }) {
  const api = useBounds()
  React.useEffect(() => {
    setTimeout(() => {
      if (adjustCamera) {
        api.refresh().clip().fit()
      }
    }, 100)
    setTimeout(() => {
      if (adjustCamera) {
        api.refresh().clip().fit()
      }
    }, 150)
    setTimeout(() => {
      if (adjustCamera) {
        api.refresh().clip().fit()
      }
    }, 200)
  }, [radius, adjustCamera])
  return null
}

export function Stage({
  children,
  center,
  adjustCamera = true,
  intensity = 1,
  shadows = 'contact',
  preset = 'soft',
  ...props
}: StageProps & { children?: any; scale?: number }) {
  const [show, setShow] = React.useState(false)
  React.useEffect(() => {
    setShow(true)
  }, [])

  const config = typeof preset === 'string' ? presets[preset] : preset
  const [{ radius, height }, set] = React.useState({
    radius: 0,
    width: 0,
    height: 0,
    depth: 0,
  })
  const shadowBias = (shadows as StageShadows)?.bias ?? -0.0001
  const normalBias = (shadows as StageShadows)?.normalBias ?? 0
  const shadowSize = (shadows as StageShadows)?.size ?? 1024
  const shadowOffset = (shadows as StageShadows)?.offset ?? 0
  const contactShadow =
    shadows === 'contact' || (shadows as StageShadows)?.type === 'contact'
  const accumulativeShadow =
    shadows === 'accumulative' || (shadows as StageShadows)?.type === 'accumulative'
  const shadowSpread = { ...(typeof shadows === 'object' ? shadows : {}) }
  const onCentered = React.useCallback((props) => {
    const { width, height, depth, boundingSphere } = props
    set({ radius: boundingSphere.radius, width, height, depth })
    if (center?.onCentered) center.onCentered(props)
  }, [])
  return (
    <>
      <ambientLight intensity={intensity / 3} />
      <spotLight
        penumbra={1}
        position={[
          config.main[0] * radius,
          config.main[1] * radius,
          config.main[2] * radius,
        ]}
        intensity={intensity * 2}
        castShadow={!!shadows}
        shadow-bias={shadowBias}
        shadow-normalBias={normalBias}
        shadow-mapSize={shadowSize}
      />
      <pointLight
        position={[
          config.fill[0] * radius,
          config.fill[1] * radius,
          config.fill[2] * radius,
        ]}
        intensity={intensity}
      />
      <Bounds
        fit={!!adjustCamera}
        clip={!!adjustCamera}
        margin={Number(adjustCamera)}
        // observe
        {...props}
      >
        {/* <Refit radius={radius} adjustCamera={adjustCamera} /> */}
        {/* @ts-ignore */}
        <Center
          scale={show ? 0.05 : 0.05} // this somehow fixes the flicker...
          {...center}
          position={[0, shadowOffset / 2, 0]}
          onCentered={onCentered}
        >
          {children}
        </Center>
      </Bounds>
      <group position={[0, -height / 2 - shadowOffset / 2, 0]}>
        {contactShadow && (
          // @ts-ignore
          <ContactShadows
            scale={radius * 4}
            far={radius}
            blur={5}
            {...(shadowSpread as ContactShadowsProps)}
          />
        )}
        {accumulativeShadow && (
          // @ts-ignore
          <AccumulativeShadows
            temporal
            frames={100}
            alphaTest={0.9}
            toneMapped={true}
            scale={radius * 4}
            {...(shadowSpread as AccumulativeShadowsProps)}
          >
            {/* @ts-ignore */}
            <RandomizedLight
              amount={(shadowSpread as RandomizedLightProps).amount ?? 8}
              radius={(shadowSpread as RandomizedLightProps).radius ?? radius}
              ambient={(shadowSpread as RandomizedLightProps).ambient ?? 0.5}
              intensity={(shadowSpread as RandomizedLightProps).intensity ?? 1}
              position={[
                config.main[0] * radius,
                config.main[1] * radius,
                config.main[2] * radius,
              ]}
              size={radius * 4}
              bias={-shadowBias}
              mapSize={shadowSize}
            />
          </AccumulativeShadows>
        )}
      </group>
    </>
  )
}

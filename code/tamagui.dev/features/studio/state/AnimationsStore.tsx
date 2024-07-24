import { createStore } from '@tamagui/use-store'
import { snakeCase } from 'lodash-es'
import { animationTypesInfo } from '../animations/helpers'
import { rootStore } from './RootStore'

const initialDemoValues = {
  x: 0,
  y: 0,
  opacity: 1,
  scale: 1,
  rotate: '0deg',
  // backgroundColor: sampleBackgroundColor[0], // TODO: ask Ehsan about this and re-enable when fixed
}
const getDefaultAnimationValues = (type: 'spring' | 'timing' = 'spring') => {
  return Object.entries(
    // @ts-ignore
    animationTypesInfo[type]
  ).reduce(
    (acc, [infoKey, infoValue]) => {
      return {
        ...acc,
        // @ts-ignore
        [infoKey]: infoValue.default,
      }
    },
    // @ts-ignore
    { type }
  )
}
export class AnimationsStore {
  // AnimationKeys type breaking
  selected: string | null = null
  draftAnimations: {
    [key: string]: any
  } = {}
  demoValues = initialDemoValues
  hasChanges = false
  initialized = false

  animateDemos(property: keyof AnimationsStore['demoValues'], value?: string | number) {
    if (typeof value !== 'undefined') {
      this.demoValues = {
        ...this.demoValues,
        [property as any]: value,
      }
      return
    }
    if (property === 'x') {
      this.demoValues = {
        ...this.demoValues,
        x: (this.demoValues.x + 100) % 200,
      }
    } else if (property === 'y') {
      this.demoValues = {
        ...this.demoValues,
        y: (this.demoValues.y + 100) % 200,
      }
    } else if (property === 'opacity') {
      this.demoValues = {
        ...this.demoValues,
        opacity: this.demoValues.opacity === 0 ? 1 : 0,
      }
    } else if (property === 'rotate') {
      const deg = +this.demoValues.rotate.split('deg')[0]
      this.demoValues = {
        ...this.demoValues,
        rotate: `${(deg + 90) % 450}deg`,
      }
    } else if (property === 'scale') {
      this.demoValues = {
        ...this.demoValues,
        scale: ((this.demoValues.scale + 1) % 3) + 1,
      }
    }
    // else if (property === 'backgroundColor') {
    //   this.demoValues = {
    //     ...this.demoValues,
    //     backgroundColor:
    //       sampleBackgroundColor[
    //         (sampleBackgroundColor.indexOf(this.demoValues.backgroundColor) + 1) %
    //           sampleBackgroundColor.length
    //       ],
    // }
    // }
  }

  resetDemos() {
    this.demoValues = initialDemoValues
  }

  init() {
    this.resetDraft()
    this.initialized = true
  }

  resetDraft() {
    if (!rootStore.config) throw new Error('Config not loaded.')
    this.hasChanges = false
    // normalize animations (god forgive me for i have reduced)
    this.draftAnimations = Object.entries(rootStore.config.animations.animations).reduce(
      (acc, [animationName, animationValue]) => {
        if (typeof animationValue === 'string') {
          return { ...acc, [animationName]: animationValue }
        }
        // arr not handled yet
        if (Array.isArray(animationValue)) return acc
        const defaultValues = getDefaultAnimationValues(animationValue.type)
        return {
          ...acc,
          [animationName]: {
            ...defaultValues,
            ...animationValue,
          },
        }
      },
      {}
    )
  }

  createAnimation(name: string) {
    this.draftAnimations = {
      ...this.draftAnimations,
      [snakeCase(name)]: getDefaultAnimationValues('spring'),
    }
  }

  setSelectedAnimation(name: AnimationsStore['selected']) {
    this.selected = name
  }

  updateAnimationValue(name: string, key: string, value: any) {
    this.hasChanges = true

    const prevValue = this.draftAnimations[name][key]
    let newValue = this.draftAnimations

    if (key === 'type' && prevValue !== value) {
      // type is changing
      const defaultValue = Object.entries(animationTypesInfo[value]).reduce(
        (acc, [propKey, propValue]) => {
          // @ts-ignore
          return { ...acc, [propKey]: propValue['default'] }
        },
        {}
      ) as any

      newValue = {
        ...this.draftAnimations,
        [name]: defaultValue,
      }
    }
    // update the value (applies to `type` too)
    newValue = {
      ...newValue,
      [name]: { ...newValue[name], [key]: value },
    }

    this.draftAnimations = newValue
  }
}

export const animationsStore = createStore(AnimationsStore)

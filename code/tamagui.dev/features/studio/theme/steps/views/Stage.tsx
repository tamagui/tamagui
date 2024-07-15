import { Store, useStore } from '@tamagui/use-store'
import { ScrollView, XStack, YStack, styled } from 'tamagui'

import { ToggleButton } from './ToggleButton'

export function Stage({ steps, current }: { current: number; steps: any[] }) {
  return (
    <YStack fullscreen>
      {steps.map((step, index) => {
        const isLeft = current > index
        const isRight = current < index
        return (
          <Section
            // animation="medium"
            // animateOnly={['opacity', 'transform']}
            isLeft={isLeft}
            isRight={isRight}
            key={index}
          >
            <ScrollView contentContainerStyle={{ minHeight: '100%' }} f={1}>
              {step}
            </ScrollView>
          </Section>
        )
      })}
    </YStack>
  )
}

export function StageButtonBar({ steps }: { steps: UseSteps }) {
  return (
    <XStack zi={100} bbw={1} bc="$color5">
      <ToggleButton active={steps.index === 0} onPress={() => steps.setPage(0)}>
        Palettes
      </ToggleButton>
      <ToggleButton active={steps.index === 1} onPress={() => steps.setPage(1)}>
        Themes
      </ToggleButton>
    </XStack>
  )
}

const Section = styled(YStack, {
  fullscreen: true,

  top: 33,
  px: '$2',

  variants: {
    isLeft: { true: { x: -30, opacity: 0, pe: 'none' } },
    isRight: { true: { x: 30, opacity: 0, pe: 'none' } },
  } as const,
})

const wrap = (min: number, max: number, v: number) => {
  const rangeSize = max - min
  return ((((v - min) % rangeSize) + rangeSize) % rangeSize) + min
}

type Props = { id: string; total: number; initial?: number }

class StepsStore extends Store<Props> {
  page = this.props.initial || 0
  direction = 0

  get total() {
    return this.props.total
  }

  setPage(page: number) {
    this.direction = page === this.page ? 0 : page > this.page ? 1 : -1
    this.page = page
  }

  move(direction: number) {
    this.setPage(this.page + direction)
  }

  get index() {
    return wrap(0, this.props.total, this.page)
  }
}

export const useSteps = (props: Props) => {
  return useStore(StepsStore, props)
}

type UseSteps = ReturnType<typeof useSteps>

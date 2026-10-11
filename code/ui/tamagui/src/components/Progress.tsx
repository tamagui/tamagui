// Styled Progress = the unstyled @tamagui/ui Progress behavior (the clip + the
// size-derived track height + the indeterminate/complete/loading state machine)
// + the default v2-look skin (theme background on the track and indicator, pill
// radius on the track). Single skin definition; the shadcn registry item is
// generated from this file.
import { type GetProps, styled, withStaticProperties } from '@tamagui/core'
import {
  Progress as UiProgress,
  ProgressIndicator as UiProgressIndicator,
  type ProgressExtraProps,
} from '@tamagui/progress'

export const ProgressIndicator = styled(UiProgressIndicator, {
  displayName: 'ProgressIndicator',
  backgroundColor: 'background',
})

const ProgressFrame = styled(UiProgress, {
  displayName: 'Progress',
  backgroundColor: 'background',
  borderRadius: 100_000,
})

export const Progress = withStaticProperties(ProgressFrame, {
  Indicator: ProgressIndicator,
})

export type ProgressProps = GetProps<typeof ProgressFrame> & ProgressExtraProps

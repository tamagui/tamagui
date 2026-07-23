// Styled Progress = the unstyled @tamagui/ui Progress behavior (the clip + the
// size-derived track height + the indeterminate/complete/loading state machine)
// + the default v2-look skin (theme background on the track and indicator, pill
// radius on the track). Single skin definition; the shadcn registry item is
// generated from this file.
import {
  type GetProps,
  Progress as UiProgress,
  ProgressIndicator as UiProgressIndicator,
  type ProgressExtraProps,
  styled,
  withStaticProperties,
} from '@tamagui/ui'

export const ProgressIndicator = styled(UiProgressIndicator, {
  name: 'ProgressIndicator',
  backgroundColor: '$background',
})

const ProgressFrame = styled(UiProgress, {
  name: 'Progress',
  backgroundColor: '$background',
  borderRadius: 100_000,
})

export const Progress = withStaticProperties(ProgressFrame, {
  Indicator: ProgressIndicator,
})

export type ProgressProps = GetProps<typeof ProgressFrame> & ProgressExtraProps

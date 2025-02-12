import { memo, useId } from 'react'
import { type SwitchProps, Switch as TamaguiSwitch, Theme } from 'tamagui'

export const Switch = memo((props: SwitchProps) => {
  return (
    <Theme name={props.checked ? 'accent' : null}>
      <TamaguiSwitch
        animation={[
          'quicker',
          {
            opacity: {
              overshootClamping: true,
            },
            backgroundColor: {
              overshootClamping: true,
            },
          },
        ]}
        size="$3"
        {...props}
      >
        <TamaguiSwitch.Thumb
          animation={[
            'quicker',
            {
              opacity: {
                overshootClamping: true,
              },
              backgroundColor: {
                overshootClamping: true,
              },
            },
          ]}
          alignItems="center"
          justifyContent="center"
        />
      </TamaguiSwitch>
    </Theme>
  )
})

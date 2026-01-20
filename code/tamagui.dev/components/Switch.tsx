import { memo } from 'react'
import { type SwitchProps, Switch as TamaguiSwitch, Theme } from 'tamagui'

export const Switch = memo((props: SwitchProps) => {
  return (
    <Theme name={props.checked ? 'accent' : 'gray'}>
      <TamaguiSwitch
        transition={[
          'bouncy',
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
          transition={[
            'quickest',
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

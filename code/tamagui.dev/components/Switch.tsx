import { memo } from 'react'
import { type SwitchProps, Switch as TamaguiSwitch, Theme } from 'tamagui'

export const Switch = memo((props: SwitchProps) => {
  return (
    <Theme name={props.checked ? 'accent' : 'gray'}>
      <TamaguiSwitch
        transition={{
          preset: 'bouncy',
          opacity: { preset: 'bouncy', spring: { overshootClamping: true } },
          backgroundColor: { preset: 'bouncy', spring: { overshootClamping: true } },
        }}
        size="3"
        {...props}
      >
        <TamaguiSwitch.Thumb
          transition={{
            preset: 'quickest',
            opacity: { preset: 'quickest', spring: { overshootClamping: true } },
            backgroundColor: { preset: 'quickest', spring: { overshootClamping: true } },
          }}
          alignItems="center"
          justifyContent="center"
        />
      </TamaguiSwitch>
    </Theme>
  )
})

import { useEffect, useState } from 'react'
import { AnimatePresence, Button, Spinner, View } from 'tamagui'
import { Check, Send } from '../../icons'
import { tone } from '../../tone'

type Status = 'idle' | 'busy' | 'done'

/** ------ EXAMPLE ------ */
export function ButtonLoading() {
  return (
    <View flexDirection="row" flexWrap="wrap" gap="3" items="center" justify="center">
      <LoadingButton theme="accent" label="Save changes" busy="Saving" done="Saved" />
      <LoadingButton
        label="Send invite"
        busy="Sending"
        done="Invite sent"
        icon={<Send size={16} />}
      />
    </View>
  )
}

// the label crossfades between states and the button holds its width,
// so nothing around it shifts while it works
function LoadingButton({
  label,
  busy,
  done,
  icon,
  theme,
}: {
  label: string
  busy: string
  done: string
  icon?: React.ReactNode
  theme?: 'accent'
}) {
  const [status, setStatus] = useState<Status>('idle')

  useEffect(() => {
    if (status === 'idle') return
    const timer = setTimeout(
      () => setStatus(status === 'busy' ? 'done' : 'idle'),
      status === 'busy' ? 1600 : 1400
    )
    return () => clearTimeout(timer)
  }, [status])

  const text = status === 'idle' ? label : status === 'busy' ? busy : done

  return (
    <Button
      theme={theme}
      size="lg"
      minW={168}
      aria-busy={status === 'busy'}
      disabled={status !== 'idle'}
      opacity={1}
      onPress={() => setStatus('busy')}
      {...(!theme && { bg: tone.surface, borderColor: tone.border, borderWidth: 1 })}
    >
      <AnimatePresence mode="wait" initial={false}>
        <View
          key={status}
          flexDirection="row"
          items="center"
          gap="2"
          transition="quick"
          opacity="enter:0 exit:0"
          y="enter:6px exit:-6px"
        >
          <Button.Icon>
            {status === 'busy' ? (
              <Spinner size="small" />
            ) : status === 'done' ? (
              <Check size={16} />
            ) : (
              icon
            )}
          </Button.Icon>
          <Button.Text>{text}</Button.Text>
        </View>
      </AnimatePresence>
    </Button>
  )
}

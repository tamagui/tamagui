import {
  AlertDialog,
  AlertDialogContent,
  Button,
  View,
  createContext,
  useEvent,
} from 'tamagui'
import type { AlertDialogContentProps } from 'tamagui'
import { useState } from 'react'

type AlertButton = {
  title: string
  action: () => void
  style: 'default' | 'cancel' | 'destructive'
}

type AlertParam = {
  title: string
  message: string
  buttons: AlertButton[]
}

interface AlertDialogContextProps {
  open: boolean
  title: string
  message: string
  buttons: AlertButton[]
  alert: (param: AlertParam) => void
}

const [AlertProvider, useAlert] = createContext<AlertDialogContextProps>('Alert', {
  open: false,
  title: '',
  message: '',
  buttons: [],
  alert: () => {},
})

type AlertProps = AlertDialogContentProps & {
  children: React.ReactNode
}
const Alert = ({ children, ...rest }: AlertProps) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [buttons, setButtons] = useState<AlertButton[]>([])

  const alert = useEvent(({ title, message, buttons }: AlertParam) => {
    setTitle(title)
    setMessage(message)
    setButtons(buttons)
    setOpen(true)
  })

  const closeDialog = useEvent(() => {
    setOpen(false)
  })

  return (
    <AlertProvider
      open={open}
      message={message}
      title={title}
      buttons={buttons}
      alert={alert}
    >
      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay
            onPress={closeDialog}
            key="overlay"
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            backgroundColor="rgba(0,0,0,0.5)"
          />
          <AlertDialog.Content
            padding="$4"
            paddingTop="$3"
            paddingBottom="$2"
            backgroundColor="$color1"
            borderRadius="$4"
            gap="$1"
            key="content"
            animation={[
              'quick',
              {
                opacity: {
                  overshootClamping: true,
                },
              },
            ]}
            enterStyle={{ x: 0, y: -10, opacity: 0, scale: 0.95 }}
            exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
            $theme-dark={{
              borderColor: '$color6',
              borderWidth: 1,
            }}
            {...rest}
          >
            <View>
              <AlertDialog.Title size="$3">{title}</AlertDialog.Title>
              <AlertDialog.Description theme="alt1">{message}</AlertDialog.Description>
            </View>
            <View flexDirection="row" gap="$4" justifyContent="flex-end">
              {buttons.map((button, index) => {
                const Base =
                  button.style === 'cancel' ? AlertDialog.Cancel : AlertDialog.Action
                const color = button.style === 'destructive' ? '$red10' : '$color'
                return (
                  <Base key={index} asChild>
                    <Button
                      chromeless
                      onPress={button.action}
                      ref={(b) => b && button.style === 'destructive' && b.focus()}
                    >
                      <Button.Text color={color}>{button.title}</Button.Text>
                    </Button>
                  </Base>
                )
              })}
            </View>
          </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog>
      {children}
    </AlertProvider>
  )
}

const AlertDialogTest = (props: any) => {
  const { alert } = useAlert('AlertTest')

  const buttons: AlertButton[] = [
    {
      title: 'No',
      style: 'cancel',
      action: () => {
        // do some
      },
    },
    {
      title: 'Yes',
      style: 'destructive',
      action: () => {
        // do some
      },
    },
  ]

  return (
    <Button
      onPress={() => {
        alert({
          title: 'Warning',
          message: 'Are you sure you want to delete all your data?',
          buttons,
        })
      }}
    >
      Open Alert
    </Button>
  )
}

/** ---------- EXAMPLE --------- */
export const AlertDemo = () => {
  return (
    <Alert width={300}>
      <AlertDialogTest />
    </Alert>
  )
}

AlertDemo.fileName = 'Alert'

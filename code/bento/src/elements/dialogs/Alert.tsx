import { useState } from 'react'
import type { AlertDialogContentProps } from 'tamagui'
import { AlertDialog, Button, View, createContext, useEvent } from 'tamagui'

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
            transition="quick"
            opacity="enter:0 exit:0"
            background="rgba(0,0,0,0.5)"
          />
          <AlertDialog.Content
            p="5"
            bg="color-2"
            rounded="6"
            gap="4"
            transition={['quick', { opacity: { overshootClamping: true } }]}
            x="enter:0 exit:0"
            y="enter:-10px exit:10px"
            opacity="enter:0 exit:0"
            scale="enter:0.95 exit:0.95"
            borderColor="color-6"
            borderWidth={1}
            {...rest}
            key="content"
            style={{ left: 0, right: 0, marginHorizontal: 'auto' }}
          >
            <View gap="2">
              <AlertDialog.Title fontSize="7" fontWeight="500">
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description theme="level2" fontSize="4">
                {message}
              </AlertDialog.Description>
            </View>
            <View flexDirection="row" gap="3" justify="flex-end" pt="2">
              {buttons.map((button, index) => {
                const Base =
                  button.style === 'cancel' ? AlertDialog.Cancel : AlertDialog.Action
                const color = button.style === 'destructive' ? 'red-600' : 'color-11'
                return (
                  <Base key={index} asChild>
                    <Button
                      size="sm"
                      borderWidth={1}
                      borderColor="color-7"
                      bg="transparent hover:color-3 focus:color-4"
                      rounded="4"
                      px="4"
                      onPress={button.action}
                    >
                      <Button.Text color={color} fontWeight="500">
                        {button.title}
                      </Button.Text>
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

const AlertDialogTest = () => {
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

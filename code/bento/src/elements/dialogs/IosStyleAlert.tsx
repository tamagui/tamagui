import { useState } from 'react'
import type { AlertDialogContentProps } from 'tamagui'
import { AlertDialog, Button, Input, View, createContext, useEvent } from 'tamagui'
import { tone } from '../../tone'

type AlertButton = {
  title: string
  action: () => void
  style: 'default' | 'cancel' | 'destructive'
}

type AlertParam = {
  title: string
  message: string
  buttons: AlertButton[]
  content?: React.ReactNode
}

interface AlertDialogContextProps {
  open: boolean
  title: string
  message: string
  buttons: AlertButton[]
  content?: React.ReactNode
  alert: (param: AlertParam) => void
}

const [AlertProvider, useAlert] = createContext<AlertDialogContextProps>('Alert', {
  open: false,
  title: '',
  message: '',
  buttons: [],
  alert: () => {},
  content: null,
})

type AlertProps = AlertDialogContentProps & {
  children: React.ReactNode
}
const Alert = ({ children, ...rest }: AlertProps) => {
  const [open, setOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [buttons, setButtons] = useState<AlertButton[]>([])
  const [content, setContent] = useState<React.ReactNode>(null)

  const alert = useEvent(({ title, message, buttons, content }: AlertParam) => {
    setTitle(title)
    setMessage(message)
    setButtons(buttons)
    setOpen(true)
    setContent(content)
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
            px="4"
            pt="3"
            pb={0}
            rounded="6"
            bg={tone.surface}
            overflow="hidden"
            gap="3"
            transition="quick"
            x="enter:0 exit:0"
            y="enter:-10px exit:10px"
            opacity="enter:0 exit:0"
            scale="enter:0.95 exit:0.95"
            borderColor={tone.border}
            borderWidth={1}
            boxShadow="0 16px 40px shadow-color"
            {...rest}
            key="content"
            style={{ left: 0, right: 0, marginHorizontal: 'auto' }}
          >
            <View>
              <AlertDialog.Title
                self="center"
                fontWeight="500"
                fontSize={20}
                letterSpacing={1}
              >
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description self="center">{message}</AlertDialog.Description>
            </View>
            {content}
            <View
              borderTopWidth={1}
              borderTopColor={tone.border}
              flexDirection={buttons.length === 2 ? 'row' : 'column'}
              mx="-6"
              justify="flex-start"
            >
              {buttons.map((button, index) => {
                const makeItVertical = buttons.length > 2
                const Base =
                  button.style === 'cancel' ? AlertDialog.Cancel : AlertDialog.Action
                const color = button.style === 'destructive' ? 'red-10' : 'blue-10'
                return (
                  <View
                    flex={1}
                    flexBasis="auto"
                    borderRightWidth={index === 0 && !makeItVertical ? 1 : 0}
                    borderBottomWidth={makeItVertical && index < buttons.length ? 1 : 0}
                    borderColor={tone.border}
                    key={index}
                  >
                    <Base asChild>
                      <Button
                        variant="quiet"
                        justify="center"
                        items="center"
                        p="3"
                        opacity="0.9 hover:1 focus:1"
                        bg={`transparent ${tone.rowHover}`}
                        onPress={button.action}
                      >
                        <Button.Text
                          fontSize={16}
                          color={color}
                          fontWeight={button.style === 'cancel' ? '400' : '600'}
                        >
                          {button.title}
                        </Button.Text>
                      </Button>
                    </Base>
                  </View>
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

  return (
    <View flexDirection="row" flexWrap="wrap" justify="center" gap="3">
      <Button
        onPress={() =>
          alert({
            title: 'Reply to Sam',
            message: 'Your reply goes straight to the thread.',
            buttons: [
              { title: 'Cancel', style: 'cancel', action: () => {} },
              { title: 'Send', style: 'default', action: () => {} },
            ],
            content: <Input size="sm" placeholder="Message" autoFocus />,
          })
        }
      >
        Reply
      </Button>
      <Button
        onPress={() =>
          alert({
            title: 'Delete this photo?',
            message: 'It will be removed from all your devices.',
            buttons: [
              { title: 'Cancel', style: 'cancel', action: () => {} },
              { title: 'Delete', style: 'destructive', action: () => {} },
            ],
          })
        }
      >
        Delete photo
      </Button>
      <Button
        onPress={() =>
          alert({
            title: 'Save changes?',
            message: 'You have edits that are not saved yet.',
            buttons: [
              { title: 'Save', style: 'default', action: () => {} },
              { title: "Don't save", style: 'destructive', action: () => {} },
              { title: 'Cancel', style: 'cancel', action: () => {} },
            ],
          })
        }
      >
        Close document
      </Button>
    </View>
  )
}

/** ---------- EXAMPLE --------- */
export const IosStyleAlert = () => {
  return (
    <Alert width={300}>
      <AlertDialogTest />
    </Alert>
  )
}

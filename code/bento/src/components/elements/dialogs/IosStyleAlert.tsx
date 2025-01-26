import {
  AlertDialog,
  AlertDialogContent,
  Button,
  Input,
  Spacer,
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
            animation="quick"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
            backgroundColor="rgba(0,0,0,0.5)"
          />
          <AlertDialog.Content
            paddingHorizontal="$4"
            paddingTop="$3"
            paddingBottom={0}
            borderRadius="$6"
            backgroundColor="$gray1"
            overflow="hidden"
            gap="$3"
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
              <AlertDialog.Title
                alignSelf="center"
                fontWeight="500"
                fontSize={20}
                letterSpacing={1}
              >
                {title}
              </AlertDialog.Title>
              <AlertDialog.Description alignSelf="center">
                {message}
              </AlertDialog.Description>
            </View>
            {content}
            <View
              borderTopWidth={1}
              borderTopColor="$borderColor"
              flexDirection={buttons.length === 2 ? 'row' : 'column'}
              marginHorizontal="$-6"
              justifyContent="flex-start"
            >
              {buttons.map((button, index) => {
                const makeItVertical = buttons.length > 2
                const Base =
                  button.style === 'cancel' ? AlertDialog.Cancel : AlertDialog.Action
                const color = button.style === 'destructive' ? '$red10' : '$blue10'
                return (
                  <View
                    borderRightWidth={index === 0 && !makeItVertical ? 1 : 0}
                    borderBottomWidth={makeItVertical && index < buttons.length ? 1 : 0}
                    borderColor="$borderColor"
                    key={index}
                    {...(!makeItVertical && {
                      flex: 1,
                      flexBasis: 0,
                    })}
                  >
                    <Base asChild>
                      <Button
                        unstyled
                        justifyContent="center"
                        alignItems="center"
                        padding="$3"
                        opacity={0.9}
                        focusStyle={{
                          opacity: 1,
                          backgroundColor: '$color4',
                        }}
                        hoverStyle={{
                          opacity: 1,
                          backgroundColor: '$color3',
                        }}
                        onPress={button.action}
                      >
                        <Button.Text
                          fontSize={16}
                          color={color}
                          fontWeight={button.style === 'default' ? '500' : '400'}
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

  const buttons: AlertButton[] = [
    {
      title: 'Cancel',
      style: 'cancel',
      action: () => {
        // do some
      },
    },
    {
      title: 'Reply',
      style: 'default',
      action: () => {
        // do some
      },
    },
  ]

  const buttons2: AlertButton[] = [
    {
      title: 'Ask me later',
      style: 'cancel',
      action: () => {},
    },
    {
      title: 'Reply',
      style: 'default',
      action: () => {},
    },
    {
      title: 'Cancel',
      style: 'cancel',
      action: () => {},
    },
    {
      title: 'OK',
      style: 'destructive',
      action: () => {},
    },
  ]

  return (
    <View flexDirection="row" gap="$5">
      <Button
        onPress={() => {
          alert({
            title: 'My Mom',
            message: 'Hey honey, are you back home?',
            buttons,
            content: (
              <Input
                height="$3"
                placeholder="Your message here"
                ref={(input) => input && input.focus()}
                onKeyPress={(e) => {
                  if (e.nativeEvent.key === 'Escape') e.currentTarget.blur()
                }}
              />
            ),
          })
        }}
      >
        Open Alert
      </Button>
      <Button
        onPress={() => {
          alert({
            title: 'A Message',
            message: 'Hey, please let me know if you are back home?',
            buttons: buttons2,
            content: (
              <Input
                height="$3"
                placeholder="Your message here"
                ref={(input) => input && input.focus()}
                onKeyPress={(e) => {
                  if (e.nativeEvent.key === 'Escape') e.currentTarget.blur()
                }}
              />
            ),
          })
        }}
      >
        Open Alert 2
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

IosStyleAlert.fileName = 'IosStyleAlert'

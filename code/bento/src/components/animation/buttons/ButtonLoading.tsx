import { useEffect, useState } from 'react'
import { AnimatePresence, Button, Spinner, Theme, View } from 'tamagui'

/** ------ EXAMPLE ------ */
export function ButtonLoading() {
  return (
    <View
      flexDirection="row"
      gap="$4"
      flexWrap="wrap"
      alignItems="center"
      justifyContent="center"
      maxWidth={400}
    >
      <ButtonLoadingExample />
      <Theme name="blue">
        <ButtonLoadingExample />
      </Theme>
      <Theme name="purple">
        <ButtonLoadingExample />
      </Theme>
      <Theme name="pink">
        <ButtonLoadingExample />
      </Theme>
      <Theme name="red">
        <ButtonLoadingExample />
      </Theme>
      <Theme name="orange">
        <ButtonLoadingExample />
      </Theme>
      <Theme name="yellow">
        <ButtonLoadingExample />
      </Theme>
      <Theme name="green">
        <ButtonLoadingExample />
      </Theme>
    </View>
  )
}

function ButtonLoadingExample() {
  const [loading, setLoading] = useState(true)
  useEffect(() => {
    // toggle loading state after every 1 second
    const interval = setInterval(() => {
      setLoading(!loading)
    }, 3000)
    return () => clearInterval(interval as NodeJS.Timeout)
  })
  return (
    <Button onPress={() => setLoading(!loading)} size="$5">
      <View
        animation="bouncy"
        flexDirection="row"
        x={loading ? 0 : -15}
        gap="$3"
        alignItems="center"
        justifyContent="center"
      >
        <Button.Icon>
          <Spinner
            animation="slow"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
            opacity={loading ? 1 : 0}
          />
        </Button.Icon>
        <Button.Text>Click</Button.Text>
      </View>
    </Button>
  )
}

ButtonLoading.fileName = 'ButtonLoading'

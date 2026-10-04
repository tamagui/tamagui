import { useEffect, useState } from 'react'
import { Button, Spinner, Theme, View } from 'tamagui'

/** ------ EXAMPLE ------ */
export function ButtonLoading() {
  return (
    <View
      flexDirection="row"
      gap="4"
      flexWrap="wrap"
      items="center"
      justify="center"
      maxW={400}
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
    return () => clearInterval(interval)
  })
  return (
    <Button onPress={() => setLoading(!loading)} size="lg">
      <View
        transition="bouncy"
        flexDirection="row"
        x={loading ? 0 : -15}
        gap="3"
        items="center"
        justify="center"
      >
        <Button.Icon>
          <Spinner transition="slow" scale="enter:0 exit:0" opacity={loading ? 1 : 0} />
        </Button.Icon>
        <Button.Text>Click</Button.Text>
      </View>
    </Button>
  )
}

import { useState } from 'react'
import type { SizeTokens } from 'tamagui'
import { AnimatePresence, Button, Spinner, View, YStack } from 'tamagui'

const sizes = ['$4', '$5', '$6'] as const

/** ------ EXAMPLE ------ */
export function ButtonsWithLoaders() {
  return (
    <YStack gap="$3.5" $group-window-gtSm={{ flexDirection: 'row' }}>
      <View gap="$2">
        <Button theme="blue">
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="red">
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="green">
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="purple">
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="pink">
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Themed</Button.Text>{' '}
        </Button>

        <Button theme="yellow">
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="orange">
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Themed</Button.Text>
        </Button>
      </View>

      <View gap="$2">
        <Button theme="active">
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Active</Button.Text>
        </Button>

        <Button disabled opacity={0.5}>
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Disabled</Button.Text>
        </Button>

        <Button themeInverse>
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Theme inverse</Button.Text>
        </Button>

        <Button variant="outlined">
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Outlined</Button.Text>
        </Button>

        <Button chromeless>
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Chromeless</Button.Text>{' '}
        </Button>
      </View>

      <View gap="$2">
        <Button size={'$3'}>
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Small</Button.Text>{' '}
        </Button>

        <Button>
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Normal</Button.Text>
        </Button>

        <Button size={'$6'}>
          <Spinner
            animation="bouncy"
            enterStyle={{
              scale: 0,
            }}
            exitStyle={{
              scale: 0,
            }}
          />
          <Button.Text>Big</Button.Text>
        </Button>
      </View>
    </YStack>
  )
}

ButtonsWithLoaders.fileName = 'ButtonsWithLoaders'

function EachButton({ size }: { size: SizeTokens }) {
  const [loading, setLoading] = useState(true)
  return (
    <Button space={loading ? '$2' : 0} onPress={() => setLoading(!loading)} size={size}>
      <AnimatePresence>
        {loading && (
          <Button.Icon>
            <Spinner
              animation="bouncy"
              enterStyle={{
                scale: 0,
              }}
              exitStyle={{
                scale: 0,
              }}
            />
          </Button.Icon>
        )}
      </AnimatePresence>
      <Button.Text>Click</Button.Text>
    </Button>
  )
}

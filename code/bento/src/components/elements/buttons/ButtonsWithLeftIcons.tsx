import { Plug, Home, Settings, Heart } from '@tamagui/lucide-icons'
import React from 'react'
import { YStack, Button, View, XGroup } from 'tamagui'

/** ------ EXAMPLE ------ */
export function ButtonsWithLeftIcons() {
  return (
    <YStack gap="$4" $group-window-gtSm={{ flexDirection: 'row' }}>
      <View gap="$2">
        <Button theme="blue">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="red">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="green">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="purple">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="pink">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="yellow">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Themed</Button.Text>
        </Button>

        <Button theme="orange">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Themed</Button.Text>
        </Button>
      </View>

      <View gap="$2">
        <Button theme="active">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Active</Button.Text>
        </Button>

        <Button disabled opacity={0.5}>
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Disabled</Button.Text>
        </Button>

        <Button themeInverse>
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Theme inverse</Button.Text>
        </Button>

        <Button variant="outlined">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Outlined</Button.Text>
        </Button>

        <Button chromeless>
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Chromeless</Button.Text>
        </Button>
      </View>

      <View gap="$2">
        <Button size={'$3'}>
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Small</Button.Text>
        </Button>

        <Button>
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Normal</Button.Text>
        </Button>

        <Button size={'$6'}>
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Big</Button.Text>
        </Button>
      </View>

      <View gap="$2" $group-window-sm={{ display: 'none' }}>
        <XGroup>
          <XGroup.Item>
            <Button>
              <Button.Icon>
                <Home />
              </Button.Icon>
              <Button.Text>Home</Button.Text>
            </Button>
          </XGroup.Item>
          <XGroup.Item>
            <Button>
              <Button.Icon>
                <Plug />
              </Button.Icon>
              <Button.Text>Connect</Button.Text>
            </Button>
          </XGroup.Item>
          <XGroup.Item>
            <Button>
              <Button.Icon>
                <Settings />
              </Button.Icon>
              <Button.Text>Settings</Button.Text>
            </Button>
          </XGroup.Item>
        </XGroup>

        <XGroup themeInverse>
          <XGroup.Item>
            <Button>
              <Button.Icon>
                <Home />
              </Button.Icon>
              <Button.Text>Home</Button.Text>
            </Button>
          </XGroup.Item>
          <XGroup.Item>
            <Button>
              <Button.Icon>
                <Plug />
              </Button.Icon>
              <Button.Text>Connect</Button.Text>
            </Button>
          </XGroup.Item>
          <XGroup.Item>
            <Button>
              <Button.Icon>
                <Settings />
              </Button.Icon>
              <Button.Text>Settings</Button.Text>
            </Button>
          </XGroup.Item>
        </XGroup>

        <XGroup theme="red">
          <XGroup.Item>
            <Button>
              <Button.Icon>
                <Home />
              </Button.Icon>
              <Button.Text>Home</Button.Text>
            </Button>
          </XGroup.Item>
          <XGroup.Item>
            <Button>
              <Button.Icon>
                <Plug />
              </Button.Icon>
              <Button.Text>Connect</Button.Text>
            </Button>
          </XGroup.Item>

          <XGroup.Item>
            <Button>
              <Button.Icon>
                <Settings />
              </Button.Icon>
              <Button.Text>Settings</Button.Text>
            </Button>
          </XGroup.Item>
        </XGroup>
      </View>
    </YStack>
  )
}

ButtonsWithLeftIcons.fileName = 'ButtonsWithLeftIcons'

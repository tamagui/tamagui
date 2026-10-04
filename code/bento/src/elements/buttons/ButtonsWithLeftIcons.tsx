import { Plug, Home, Settings, Heart } from '../../icons'
import React from 'react'
import {
  YStack,
  Button,
  View,
  Theme,
  XGroup,
} from 'tamagui'

/** ------ EXAMPLE ------ */
export function ButtonsWithLeftIcons() {
  return (
    <YStack gap="4" flexDirection="@md/window:row">
      <View gap="2">
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

      <View gap="2">
        <Button>
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

        <Button theme="accent">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Accent</Button.Text>
        </Button>

        <Button theme="accent">
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

        <Button variant="quiet">
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Chromeless</Button.Text>
        </Button>
      </View>

      <View gap="2">
        <Button size={'sm'}>
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

        <Button size={'xl'}>
          <Button.Icon>
            <Heart />
          </Button.Icon>
          <Button.Text>Big</Button.Text>
        </Button>
      </View>

      <View gap="2" display="@max-md/window:none">
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

        <Theme name="accent">
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
        </Theme>

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

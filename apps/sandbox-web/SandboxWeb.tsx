import '@tamagui/web/reset.css'
import '@tamagui/polyfill-dev'

import { yupResolver } from '@hookform/resolvers/yup'
import { Button } from '@tamagui/button'
// import { Check } from '@tamagui/lucide-icons'
import { Form } from '@tamagui/react-hook-form'
import { Stack, TamaguiProvider, Text } from '@tamagui/web'
import { useState } from 'react'
import * as yup from 'yup'

import config from './tamagui.config'

const items = [
  { name: 'Apple' },
  { name: 'Pear' },
  { name: 'Blackberry' },
  { name: 'Peach' },
  { name: 'Apricot' },
  { name: 'Melon' },
]

export const Sandbox = () => {
  const [theme, setTheme] = useState('light')

  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <button
        style={{
          position: 'absolute',
          bottom: 30,
          left: 20,
        }}
        onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}
      >
        🌗
      </button>

      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `html, body { overflow: hidden; height: 100vh; width: 100vw; }`,
        }}
      />

      <Stack ai="center" jc="center" f={1} bc="gray">
        <Form
          onSubmit={(v) => console.log(v)}
          space="$4"
          defaultValues={{ pseudo: '', description: '', Switch: false }}
        >
          <Form.Input name="pseudo" />
          <Form.Message name="pseudo" />

          <Form.TextArea name="description" />
          <Form.Message name="description" />

          <Form.Switch name="Switch">
            <Form.Switch.Thumb animation="quick" />
          </Form.Switch>

          <Form.Checkbox name="Checkbox" value="toto">
            <Form.Checkbox.Indicator>
              <Text>x</Text>
              {/* <Check /> */}
            </Form.Checkbox.Indicator>
          </Form.Checkbox>

          <Form.RadioGroup name="RadioGroup">
            <Form.RadioGroup.Item value={'1'}>
              <Form.RadioGroup.Indicator />
            </Form.RadioGroup.Item>
            <Form.RadioGroup.Item value={'2'}>
              <Form.RadioGroup.Indicator />
            </Form.RadioGroup.Item>
          </Form.RadioGroup>

          <Form.Slider name="Slider" defaultValue={[50]} max={100} step={1}>
            <Form.Slider.Track>
              <Form.Slider.TrackActive />
            </Form.Slider.Track>
            <Form.Slider.Thumb index={0} circular elevate />
          </Form.Slider>

          <Form.Trigger asChild>
            <Button>Submit</Button>
          </Form.Trigger>
        </Form>
      </Stack>

      {/*  */}
    </TamaguiProvider>
  )
}

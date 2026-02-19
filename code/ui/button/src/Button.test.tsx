import { getDefaultTamaguiConfig } from '@tamagui/config-default'
import { createTamagui } from '@tamagui/core'
import { describe, expect, test } from 'vitest'
import { Button } from './Button'

const conf = createTamagui(getDefaultTamaguiConfig())

describe('Button', () => {
  test(`123`, () => {
    expect(true).toBeTruthy()
  })

  // type tests for native button props (issue #3914)
  test('accepts native button html props', () => {
    // these should type check without errors
    const _submitBtn = <Button type="submit">Submit</Button>
    const _resetBtn = <Button type="reset">Reset</Button>
    const _buttonBtn = <Button type="button">Button</Button>
    const _formBtn = (
      <Button
        type="submit"
        form="myForm"
        formAction="/submit"
        formMethod="post"
        formTarget="_blank"
        formNoValidate
        name="submitBtn"
        value="submit"
      >
        Submit
      </Button>
    )
    expect(true).toBeTruthy()
  })

  // test(`Adapts to a when given accessibilityRole="link"`, async () => {
  //   const { container } = render(
  //     <TamaguiProvider config={conf} defaultTheme="light">
  //       <Button href="http://google.com" accessibilityRole="link" />
  //     </TamaguiProvider>
  //   )

  //   expect(container.firstChild).toMatchSnapshot()
  // })
})

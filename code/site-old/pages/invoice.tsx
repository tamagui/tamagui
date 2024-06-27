import { memo, useState } from 'react'
import {
  Checkbox,
  H1,
  H3,
  Input,
  Stack,
  Text,
  XStack,
  YStack,
  styled,
  useDidFinishSSR,
  withStaticProperties,
} from 'tamagui'

import { Container } from '../components/Container'
import { ThemeToggle } from '../components/ThemeToggle'
import { Check } from '@tamagui/lucide-icons'

export default memo(() => {
  const isHydrated = useDidFinishSSR()
  const uid = isHydrated ? crypto.randomUUID() : 0
  const date = new Date().toLocaleString()
  const [purchaseAmt, setpurchaseAmt] = useState(0)
  const [vatpct, setvatpct] = useState(0)

  return (
    <>
      <YStack pos="absolute" b={0} r={0}>
        <ThemeToggle />
      </YStack>
      <Container py="$6">
        <YStack gap="$6">
          <H1>Invoice: Tamagui</H1>

          <DT>
            <DT.Row>
              <DT.Col bold>Invoice Number:</DT.Col>
              <DT.Col>{uid}</DT.Col>
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Invoice Date:</DT.Col>
              <DT.Col>{date}</DT.Col>
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Due Date:</DT.Col>
              <DT.Col>{date}</DT.Col>
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Invoice Status:</DT.Col>
              <DT.Col>Paid ${purchaseAmt}</DT.Col>
            </DT.Row>
          </DT>

          <DT>
            <H3>Company</H3>
            <DT.Row>
              <DT.Col bold>Name:</DT.Col>
              <DT.Col>Tamagui LLC</DT.Col>
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Address:</DT.Col>
              <DT.Col>438 Awakea Rd, Kailua HI, 96734, USA</DT.Col>
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Phone:</DT.Col>
              <DT.Col>+1 520-891-6668</DT.Col>
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Email:</DT.Col>
              <DT.Col>support@tamagui.dev</DT.Col>
            </DT.Row>
          </DT>

          <DT>
            <H3>Billing & Delivery address</H3>
            <DT.Row>
              <DT.Col bold>Company:</DT.Col>
              <DT.Input />
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Company VAT:</DT.Col>
              <DT.Input />
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Address:</DT.Col>
              <DT.Input />
            </DT.Row>
          </DT>

          <DT>
            <H3>Purchase</H3>
            <DT.Row>
              <DT.Col bold>Item:</DT.Col>
              <DT.Col gap="$4">
                <XStack gap="$2">
                  <Checkbox>
                    <Checkbox.Indicator>
                      <Check />
                    </Checkbox.Indicator>
                  </Checkbox>
                  Tamagui Takeout
                </XStack>
                <XStack gap="$2">
                  <Checkbox>
                    <Checkbox.Indicator>
                      <Check />
                    </Checkbox.Indicator>
                  </Checkbox>
                  Tamagui Bento
                </XStack>
              </DT.Col>
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Price:</DT.Col>
              <DT.Input
                onChangeText={(text) => {
                  setpurchaseAmt(parseFloat(text))
                }}
              />
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Vat %:</DT.Col>
              <DT.Input
                onChangeText={(text) => {
                  setvatpct(parseFloat(text))
                }}
              />
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Vat Amount:</DT.Col>
              <DT.Input
                value={`${purchaseAmt && vatpct ? purchaseAmt * vatpct * 0.01 : 0}`}
              />
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Total:</DT.Col>
              <DT.Input
                value={`${purchaseAmt + purchaseAmt * vatpct * 0.01}`}
                fow="bold"
              />
            </DT.Row>
          </DT>
        </YStack>
      </Container>
    </>
  )
})

const DT = withStaticProperties(
  styled(Stack, {
    borderWidth: 1,
    borderColor: '$borderColor',
    p: '$4',
  }),
  {
    Col: styled(Text, {
      p: '$4',
      miw: '40%',

      variants: {
        bold: {
          true: {
            fow: 'bold',
          },
        },
      } as const,
    }),

    Row: styled(Stack, {
      fd: 'row',
    }),

    Input: styled(Input, {
      unstyled: true,
      fos: '$5',
      w: 300,
      p: '$4',
      bbw: 1,
      bc: '$borderColor',
    }),
  }
)

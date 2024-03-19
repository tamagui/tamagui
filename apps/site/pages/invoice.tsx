import { memo } from 'react'
import { H1, H3, Input, Stack, Text, YStack, styled, withStaticProperties } from 'tamagui'

import { Container } from '../components/Container'
import { ThemeToggle } from '../components/ThemeToggle'

export default memo(() => {
  const uid = crypto.randomUUID()
  const date = new Date().toLocaleString()

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
              <DT.Col>Paid</DT.Col>
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
              <DT.Col>Tamagui Takeout</DT.Col>
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Price:</DT.Col>
              <DT.Input />
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Vat %:</DT.Col>
              <DT.Input />
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Vat Amount:</DT.Col>
              <DT.Input />
            </DT.Row>
            <DT.Row>
              <DT.Col bold>Total:</DT.Col>
              <DT.Input fow="bold" />
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

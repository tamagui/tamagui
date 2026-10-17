import { Card, XStack, YStack } from 'tamagui'

// the v6 config sets onlyAllowShorthands, which published styled() and compound declarations must honor

// @ts-expect-error alignItems has the items shorthand
export const yStackLonghand = <YStack alignItems="center" />
export const yStackShorthand = <YStack items="center" />

// @ts-expect-error padding has the p shorthand
export const xStackLonghand = <XStack padding="4" />
export const xStackShorthand = <XStack p="4" />

// @ts-expect-error marginTop has the mt shorthand
export const cardLonghand = <Card marginTop="2" />
export const cardShorthand = <Card mt="2" />

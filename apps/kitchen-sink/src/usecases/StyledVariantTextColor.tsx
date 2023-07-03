import { Tag, Theme } from '@tamagui/sandbox-ui'

// test with flattening and without!

export function StyledVariantTextColor() {
  return (
    <>
      <Theme name="blue">
        <Tag testID="default-flat">default-flat</Tag>
        <Tag testID="active-flat" active>
          active-flat
        </Tag>

        {/* @ts-ignore */}
        <Tag forceNoFlat testID="default">
          default
        </Tag>
        {/* @ts-ignore */}
        <Tag forceNoFlat testID="active" active>
          active
        </Tag>
      </Theme>
    </>
  )
}

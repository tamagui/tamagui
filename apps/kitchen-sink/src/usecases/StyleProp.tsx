import { Stack } from '@tamagui/core'

export function StyleProp(test) {
  return (
    <>
      <Stack
        testID="style-prop"
        style={{
          background: 'radial-gradient(var(--color9), transparent 70%)',
        }}
      />
      <Stack
        testID="class-name"
        className="test-bg"
        pe={!test ? 'none' : 'auto'}
        cursor="pointer"
        onPress={() => {}}
        w={100}
        h={100}
      />
      <style
        type="text/css"
        dangerouslySetInnerHTML={{
          __html: `.test-bg { background: red; }`,
        }}
      ></style>
    </>
  )
}

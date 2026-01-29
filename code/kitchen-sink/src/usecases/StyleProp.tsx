import { View } from '@tamagui/core'

export function StyleProp(test) {
  return (
    <>
      <View
        testID="style-prop"
        style={{
          background: 'radial-gradient(var(--color9), transparent 70%)',
        }}
      />
      <View
        testID="class-name"
        className="test-bg"
        pointerEvents={!test ? 'none' : 'auto'}
        cursor="pointer"
        onPress={() => {}}
        width={100}
        height={100}
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

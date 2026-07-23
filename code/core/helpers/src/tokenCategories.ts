// Canonical prop-to-token-category table shared by runtime style resolution and tooling.
// Keep this module platform-neutral: build-time consumers such as @tamagui/to-tailwind must be
// able to load it under the react-native export condition without importing the React Native
// runtime through @tamagui/helpers' main barrel.
export const tokenCategories = {
  radius: {
    borderRadius: true,
    borderTopLeftRadius: true,
    borderTopRightRadius: true,
    borderBottomLeftRadius: true,
    borderBottomRightRadius: true,

    // logical
    borderStartStartRadius: true,
    borderStartEndRadius: true,
    borderEndStartRadius: true,
    borderEndEndRadius: true,
  },
  size: {
    width: true,
    height: true,
    minWidth: true,
    minHeight: true,
    maxWidth: true,
    maxHeight: true,
    blockSize: true,
    minBlockSize: true,
    maxBlockSize: true,
    inlineSize: true,
    minInlineSize: true,
    maxInlineSize: true,
  },
  zIndex: {
    zIndex: true,
  },
  color: {
    backgroundColor: true,
    borderColor: true,
    borderBlockStartColor: true,
    borderBlockEndColor: true,
    borderBlockColor: true,
    borderBottomColor: true,
    borderInlineColor: true,
    borderInlineStartColor: true,
    borderInlineEndColor: true,
    borderTopColor: true,
    borderLeftColor: true,
    borderRightColor: true,
    borderEndColor: true,
    borderStartColor: true,
    shadowColor: true,
    color: true,
    textDecorationColor: true,
    textShadowColor: true,
    // outlineColor is supported on RN 0.77+ (New Architecture)
    outlineColor: true,
    // caretColor is web-only
    ...(process.env.TAMAGUI_TARGET === 'web' && {
      caretColor: true,
    }),
  },
}

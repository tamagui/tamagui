module.exports = {
  stories: ['../../../packages/ui/**/*.stories.@(ts|tsx|mdx)'],
  features: {
    storyStoreV7: false,
  },
  addons: ['@storybook/addon-ondevice-controls', '@storybook/addon-ondevice-actions'],
  env: (config) => ({
    ...config,
    TAMAGUI_TARGET: 'native',
  }),
  docs: {
    autodocs: true,
  },
}


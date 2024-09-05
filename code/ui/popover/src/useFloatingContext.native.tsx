import React from 'react'

// Avoid bundling react-dom into native: https://github.com/tamagui/tamagui/issues/688
export const useFloatingContext = () => React.useCallback(() => {}, [])

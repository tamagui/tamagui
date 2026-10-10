import type { DialogProps } from '@tamagui/dialog'
import type * as React from 'react'

/**
 * `native` asks for the platform's own alert, which the web does not have, so
 * the web build always falls through to the real dialog. The native sibling is
 * where the work happens.
 */
export const useNativeAlertDialog = (
  _props: DialogProps & { native?: boolean }
): React.ReactElement | null => null

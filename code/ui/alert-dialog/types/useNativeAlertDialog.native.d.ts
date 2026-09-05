import type { DialogProps } from '@tamagui/dialog';
import * as React from 'react';
/**
 * With `native`, the dialog is the platform's own alert: the children are never
 * rendered, they are read for their title, description and buttons and handed
 * to `Alert.alert`, and only the trigger stays in the tree.
 */
export declare const useNativeAlertDialog: (props: DialogProps & {
    native?: boolean;
}) => React.ReactElement | null;
//# sourceMappingURL=useNativeAlertDialog.native.d.ts.map
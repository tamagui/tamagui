/**
 * Which slot a child fills, stamped onto the styled component's staticConfig so
 * the native path can find the title, description and buttons by walking the
 * tree instead of rendering it. Lives here so the native-only walker can read
 * it without importing back into `AlertDialog`.
 */
export declare const ALERT_DIALOG_PART: unique symbol;
export type AlertDialogPart = 'trigger' | 'title' | 'description' | 'action' | 'cancel' | 'destructive';
export type AlertDialogPartStaticConfig = {
    [ALERT_DIALOG_PART]?: AlertDialogPart;
};
export declare const markAlertDialogPart: (component: {
    staticConfig: object;
}, part: AlertDialogPart) => void;
//# sourceMappingURL=alertDialogPart.d.ts.map
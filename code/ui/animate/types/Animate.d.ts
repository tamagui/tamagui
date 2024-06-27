import type { AnimatePresenceProps } from '@tamagui/animate-presence';
type BaseProps = {
    children: React.ReactNode;
};
type PresenceProps = AnimatePresenceProps & {
    type: 'presence';
    present: boolean;
    keepChildrenMounted?: boolean;
};
export type AnimateProps = BaseProps & PresenceProps;
/**
 * Because mounting and unmounting children can be expensive, this gives us the
 * option to avoid that.
 *
 * type: 'presence' will act just like AnimatePresence, except you use `present`
 * instead of conditional children.
 * Note that this does avoid reconciling the children even when present={false}
 * so no extra cost to perf over AnimatePresence.
 *
 * type: 'presence' with keepChildrenMounted true *always* render the children so you pay
 * the cost up-front to mount them, but then you avoid the mount cost at the start
 * of the animation.
 *
 * There's no "right way" it just depends on the use case, this component just makes
 * it easier to choose the strategy yourself.
 *
 *
 */
export declare function Animate({ children, type, ...props }: AnimateProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=Animate.d.ts.map
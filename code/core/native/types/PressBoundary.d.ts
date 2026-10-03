import type { ReactNode, Ref } from "react";
import type { PressBoundaryProps } from "./types";
/**
* Renders children as-is.
*
* The boundary exists to arbitrate Tamagui's shared press ownership with
* react-native-gesture-handler, which only runs on native, so on web there is
* nothing to claim and no view worth adding. `ref` is accepted and ignored for
* the same reason: there is no host node here to hand back.
*/
export declare function PressBoundary({ children }: PressBoundaryProps & {
	ref?: Ref<unknown>;
}): ReactNode;

//# sourceMappingURL=PressBoundary.d.ts.map
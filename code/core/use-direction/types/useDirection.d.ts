// forked from https://github.com/radix-ui/primitives/blob/main/packages/react/direction/src/Direction.tsx
import * as React from "react";
type Direction = "ltr" | "rtl";
interface DirectionProviderProps {
	children?: React.ReactNode;
	dir: Direction;
}
export declare const DirectionProvider: React.FC<DirectionProviderProps>;
export declare function useDirection(localDir?: Direction): Direction;
export declare const Provider: React.FC<DirectionProviderProps>;
export {};

//# sourceMappingURL=useDirection.d.ts.map
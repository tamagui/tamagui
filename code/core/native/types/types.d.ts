import type { ReactNode } from "react";
export type NativePortalState = {
	enabled: boolean;
	type: "teleport" | "legacy" | null;
};
export interface GestureState {
	enabled: boolean;
	Gesture: any;
	GestureDetector: any;
	ScrollView: any;
}
export interface WorkletsState {
	enabled: boolean;
	Worklets: any;
	useRunOnJS: any;
	useWorklet: any;
	createWorkletContextValue: any;
}
export interface SafeAreaInsets {
	top: number;
	right: number;
	bottom: number;
	left: number;
}
export interface SafeAreaFrame {
	x: number;
	y: number;
	width: number;
	height: number;
}
export interface SafeAreaMetrics {
	insets: SafeAreaInsets;
	frame: SafeAreaFrame;
}
export interface SafeAreaState {
	enabled: boolean;
	useSafeAreaInsets: (() => SafeAreaInsets) | null;
	useSafeAreaFrame: (() => SafeAreaFrame) | null;
	initialMetrics: SafeAreaMetrics | null;
}
export type NativePortalProps = {
	hostName?: string;
	children: ReactNode;
};
export type NativePortalHostProps = {
	name: string;
};
export type NativePortalProviderProps = {
	children: ReactNode;
};
export interface LinearGradientState {
	enabled: boolean;
	Component: any;
}
export interface ZeegoState {
	enabled: boolean;
	DropdownMenu: any;
	ContextMenu: any;
}

//# sourceMappingURL=types.d.ts.map
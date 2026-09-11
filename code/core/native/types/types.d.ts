import type { ViewProps } from "@tamagui/react-native-types";
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
	RootView: any;
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
	didSetup: boolean;
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
export interface BurntState {
	enabled: boolean;
	toast: ((options: any) => void) | null;
	dismissAllAlerts: (() => void) | null;
}
export interface KeyboardControllerState {
	enabled: boolean;
	KeyboardProvider: any;
	KeyboardAwareScrollView: any;
	useKeyboardHandler: any;
	useReanimatedKeyboardAnimation: any;
	KeyboardController: any;
	KeyboardEvents: any;
	KeyboardStickyView: any;
}
export interface PressBoundaryProps extends ViewProps {
	enabled?: boolean;
	/**
	* Alias for enabling the boundary. The behavior is limited to Tamagui's
	* shared press ownership and does not patch arbitrary RN bubbling.
	*/
	stopPropagation?: boolean;
	debugName?: string | null;
}

//# sourceMappingURL=types.d.ts.map
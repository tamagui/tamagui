import type { ComponentType, ReactNode } from "react";
import type { NativeMenuAdapter } from "./nativeMenuState";
export type ExpoMenuAction = {
	id: string;
	title: string;
	image?: unknown;
	state?: "on" | "off";
	attributes?: {
		destructive?: boolean;
		disabled?: boolean;
		hidden?: boolean;
	};
	subactions?: ExpoMenuAction[];
	displayInline?: boolean;
};
export type ExpoMenuViewProps = {
	actions: ExpoMenuAction[];
	title?: string;
	shouldOpenOnLongPress?: boolean;
	onPressAction?: (event: {
		nativeEvent: {
			event: string;
		};
	}) => void;
	onOpenMenu?: () => void;
	onCloseMenu?: () => void;
	children?: ReactNode;
};
export type ExpoUIMenuAdapterOptions = {
	MenuView: ComponentType<any>;
};
export declare function createExpoUIMenuAdapter({ MenuView }: ExpoUIMenuAdapterOptions): NativeMenuAdapter;

//# sourceMappingURL=expoUIMenuAdapter.d.ts.map
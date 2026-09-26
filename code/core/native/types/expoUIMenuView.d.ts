import type { ComponentType } from "react";
import type { ExpoMenuViewProps } from "./expoUIMenuAdapter";
type SwiftUIModule = {
	Button: ComponentType<any>;
	ContextMenu: ComponentType<any> & {
		Trigger: ComponentType<any>;
		Items: ComponentType<any>;
	};
	Host: ComponentType<any>;
	Menu: ComponentType<any>;
	RNHostView: ComponentType<any>;
	Section: ComponentType<any>;
	Toggle: ComponentType<any>;
};
type SwiftUIModifiersModule = {
	disabled: (value: boolean) => unknown;
};
export declare function createExpoUIMenuView({ swiftUI, modifiers }: {
	swiftUI: SwiftUIModule;
	modifiers: SwiftUIModifiersModule;
}): ComponentType<ExpoMenuViewProps>;
export {};

//# sourceMappingURL=expoUIMenuView.d.ts.map
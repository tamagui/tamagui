import type { ComponentType } from "react";
export type NativeMenuModule = {
	Root: ComponentType<any>;
	Trigger: ComponentType<any>;
	Content: ComponentType<any>;
	Item: ComponentType<any>;
	ItemTitle: ComponentType<any>;
	ItemSubtitle: ComponentType<any>;
	ItemIcon: ComponentType<any>;
	ItemImage: ComponentType<any>;
	ItemIndicator: ComponentType<any>;
	Group: ComponentType<any>;
	Label: ComponentType<any>;
	Separator: ComponentType<any>;
	Sub: ComponentType<any>;
	SubTrigger: ComponentType<any>;
	SubContent: ComponentType<any>;
	CheckboxItem: ComponentType<any>;
	Preview: ComponentType<any>;
	Auxiliary: ComponentType<any>;
};
/**
* A native implementation for Tamagui Menu and ContextMenu compound components.
* Register one adapter before the first native menu renders.
*/
export type NativeMenuAdapter = {
	name: string;
	Menu: NativeMenuModule;
	ContextMenu: NativeMenuModule;
};
/**
* Registers the process-wide native menu implementation. Re-registering the same
* named adapter supports fast refresh; registering a different adapter throws.
*/
export declare function registerNativeMenuAdapter(adapter: NativeMenuAdapter): void;
export declare function getNativeMenuAdapter(): NativeMenuAdapter | null;

//# sourceMappingURL=nativeMenuState.d.ts.map
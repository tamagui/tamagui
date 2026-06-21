export interface PlatformDriverPseudoState {
	hovered: boolean;
	pressed: boolean;
}
export interface PlatformDriver {
	pseudo?: {
		/**
		* subscribe a mounted component's host instance to native pseudo-state flips.
		* the host instance is whatever the renderer's ref resolves to (on
		* react-native-gpui, the reconciler Instance whose `.id` is the host node id).
		* returns an unsubscribe.
		*/
		subscribe(hostInstance: unknown, listener: (state: PlatformDriverPseudoState) => void): () => void;
	};
}
/** register the renderer platform driver — call once at app setup, before render. */
export declare function setupPlatformDriver(driver: PlatformDriver): void;
export declare function getPlatformDriver(): PlatformDriver | null;

//# sourceMappingURL=platformDriver.d.ts.map
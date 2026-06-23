export interface GestureHandlerConfig {
	/** use RNGH for press events on Tamagui components (default: true) */
	pressEvents?: boolean;
	/** use RNGH for Sheet drag gestures (default: true) */
	sheet?: boolean;
}
export declare function getGestureHandlerConfig(): GestureHandlerConfig;
export declare function setupGestureHandler(config?: GestureHandlerConfig): void;

//# sourceMappingURL=setup-gesture-handler.d.ts.map
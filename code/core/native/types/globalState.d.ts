export declare function createGlobalState<T extends {
	enabled: boolean;
}>(key: string, defaultValue: T): {
	get: () => T;
	set: (next: T) => void;
};

//# sourceMappingURL=globalState.d.ts.map
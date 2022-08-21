export declare const InteractionManager: {
    Events: {
        interactionStart: string;
        interactionComplete: string;
    };
    runAfterInteractions(task: any): {
        then: Function;
        done: Function;
        cancel: Function;
    };
    createInteractionHandle(): number;
    clearInteractionHandle(handle: number): void;
    addListener: () => void;
};
export default InteractionManager;
//# sourceMappingURL=InteractionManager.d.ts.map
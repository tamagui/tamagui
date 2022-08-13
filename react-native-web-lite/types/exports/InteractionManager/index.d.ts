declare const InteractionManager: {
    Events: {
        interactionStart: string;
        interactionComplete: string;
    };
    runAfterInteractions(task: Function | null): {
        then: Function;
        done: Function;
        cancel: Function;
    };
    createInteractionHandle(): number;
    clearInteractionHandle(handle: number): void;
    addListener: () => void;
};
export default InteractionManager;
//# sourceMappingURL=index.d.ts.map
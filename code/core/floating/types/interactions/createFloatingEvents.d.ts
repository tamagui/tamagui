export type FloatingEvents = {
    emit(event: string, data?: any): void;
    on(event: string, handler: (data?: any) => void): void;
    off(event: string, handler: (data?: any) => void): void;
};
export declare function createFloatingEvents(): FloatingEvents;
//# sourceMappingURL=createFloatingEvents.d.ts.map
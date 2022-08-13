export declare type Modality = 'keyboard' | 'mouse' | 'touch' | 'pen';
export declare function getActiveModality(): Modality;
export declare function getModality(): Modality;
export declare function addModalityListener(listener: (arg0: {
    activeModality: Modality;
    modality: Modality;
}) => void): () => void;
export declare function testOnly_resetActiveModality(): void;
//# sourceMappingURL=index.d.ts.map
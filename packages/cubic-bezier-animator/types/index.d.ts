type TransformType = {
    x: number | undefined;
    y: number | undefined;
    scaleX: number | undefined;
    scaleY: number | undefined;
};
interface AnimateProps {
    from: TransformType;
    to: TransformType;
    duration: number;
    onUpdate: (param: TransformType) => void;
    easingFunction?: string;
}
export declare function animate(param: AnimateProps): void;
export {};
//# sourceMappingURL=index.d.ts.map
type TransformType = {
    x: number | undefined;
    y: number | undefined;
    scaleX: number | undefined;
    scaleY: number | undefined;
};
type CubicBuzier = [number, number, number, number];
interface AnimateProps {
    from: TransformType;
    to: TransformType;
    duration: number;
    onUpdate: (param: TransformType) => void;
    cubicBuzier: CubicBuzier;
}
export declare function animate(param: AnimateProps): void;
export {};
//# sourceMappingURL=index.d.ts.map
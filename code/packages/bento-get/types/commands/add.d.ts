import zod from 'zod';
export declare const args: zod.ZodTuple<[zod.ZodString, zod.ZodString], null>;
type Props = {
    args: zod.infer<typeof args>;
};
export default function Add({ args }: Props): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=add.d.ts.map
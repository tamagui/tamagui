import { CardBackground, CardFooter, CardFrame, CardHeader } from './Card';
export declare function createCard<A extends typeof CardFrame, B extends typeof CardHeader, C extends typeof CardFooter, D extends typeof CardBackground>(props: {
    Frame: A;
    Header: B;
    Footer: C;
    Background: D;
}): A & {
    Header: B;
    Footer: C;
    Background: D;
};
//# sourceMappingURL=createCard.d.ts.map
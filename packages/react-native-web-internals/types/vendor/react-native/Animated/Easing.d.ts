export default Easing;
declare class Easing {
    static step0(n: any): 0 | 1;
    static step1(n: any): 0 | 1;
    static linear(t: any): any;
    static ease(t: any): any;
    static quad(t: any): number;
    static cubic(t: any): number;
    static poly(n: any): (t: any) => number;
    static sin(t: any): number;
    static circle(t: any): number;
    static exp(t: any): number;
    static elastic(bounciness: any): (t: any) => number;
    static back(s: any): (t: any) => number;
    static bounce(t: any): number;
    static bezier(x1: any, y1: any, x2: any, y2: any): (x: any) => any;
    static in(easing: any): any;
    static out(easing: any): (t: any) => number;
    static inOut(easing: any): (t: any) => number;
}
//# sourceMappingURL=Easing.d.ts.map
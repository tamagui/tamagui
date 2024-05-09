export declare const getProducts: () => {
    id: number;
    name: string;
    price: string;
    discount: number;
    image: any;
    desc: string;
}[];
export type Product = ReturnType<typeof getProducts>[0];
export declare function useData(): {
    data: {
        id: number;
        name: string;
        price: string;
        discount: number;
        image: any;
        desc: string;
    }[];
};
//# sourceMappingURL=products.d.ts.map
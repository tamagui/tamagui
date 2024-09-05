export declare const getProducts: () => {
    id: number;
    name: string;
    category: string;
    price: string;
    discount: number;
    image: any;
    desc: string;
    city: string;
}[];
export type Product = ReturnType<typeof getProducts>[0];
export declare function useData(): {
    data: {
        id: number;
        name: string;
        category: string;
        price: string;
        discount: number;
        image: any;
        desc: string;
        city: string;
    }[];
};
//# sourceMappingURL=products.d.ts.map
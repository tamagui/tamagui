export type ComponentSchema = {
    name: string;
    category: string;
    categorySection: string;
    fileName: string;
    dependencies?: string[];
    isOSS: boolean;
    moveFilesToFolder?: MoveFileToFolder[];
};
type MoveFileToFolder = {
    file: string;
    to: string;
};
export declare const componentsList: Omit<ComponentSchema, 'isOSS'>[];
export {};
//# sourceMappingURL=components.d.ts.map
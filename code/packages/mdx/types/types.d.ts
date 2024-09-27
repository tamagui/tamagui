export type Frontmatter = {
    title: string;
    headings?: {
        title: string;
        priority: number;
        id: string;
    }[];
    description?: string;
    name?: string;
    versions?: string[];
    version?: string;
    by?: string;
    publishedAt?: string;
    draft?: boolean;
    relatedIds?: string[];
    type?: 'changelog' | string;
    readingTime?: {
        text: string;
        minutes: number;
        time: number;
        words: number;
    };
    poster?: string;
    slug: string;
    image?: string;
    component?: string;
    package?: string;
    demoName?: string;
};
//# sourceMappingURL=types.d.ts.map
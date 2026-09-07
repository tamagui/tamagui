import type { CLIResolvedOptions } from '@tamagui/types';
export interface GeneratePromptOptions extends CLIResolvedOptions {
    output?: string;
    styleValueSyntax?: 'string' | 'object' | 'both';
}
export declare function generatePrompt(options: GeneratePromptOptions): Promise<void>;
export interface GenerateMarkdownOptions {
    styleValueSyntax?: 'string' | 'object' | 'both';
}
export declare function generateMarkdown(config: any, options?: GenerateMarkdownOptions): string;
//# sourceMappingURL=generate-prompt.d.ts.map
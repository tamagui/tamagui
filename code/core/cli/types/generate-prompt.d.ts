import type { CLIResolvedOptions } from '@tamagui/types';
export interface GeneratePromptOptions extends CLIResolvedOptions {
    output?: string;
    styleValueSyntax?: 'string' | 'object' | 'both';
}
export declare function generatePrompt(options: GeneratePromptOptions): Promise<void>;
//# sourceMappingURL=generate-prompt.d.ts.map
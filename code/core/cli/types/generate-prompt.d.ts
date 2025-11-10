import type { CLIResolvedOptions } from '@tamagui/types';
interface GeneratePromptOptions extends CLIResolvedOptions {
    verbose?: boolean;
    output?: string;
}
export declare function generatePrompt(options: GeneratePromptOptions): Promise<void>;
export {};
//# sourceMappingURL=generate-prompt.d.ts.map
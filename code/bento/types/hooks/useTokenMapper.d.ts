declare const useTokenMapper: () => {
    mappedTokens: (Record<string, {
        [key: string]: import("@tamagui/core").VariableVal;
    }> & {
        color: {
            [key: string]: import("@tamagui/core").VariableVal;
        };
        space: {
            [key: string]: import("@tamagui/core").VariableVal;
        };
        size: {
            [key: string]: import("@tamagui/core").VariableVal;
        };
        radius: {
            [key: string]: import("@tamagui/core").VariableVal;
        };
        zIndex: {
            [key: string]: import("@tamagui/core").VariableVal;
        };
    }) | null;
    userTokens: any;
    bentoTokens: import("@tamagui/core").TokensMerged;
};
export default useTokenMapper;
//# sourceMappingURL=useTokenMapper.d.ts.map
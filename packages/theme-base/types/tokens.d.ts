export declare const size: {
    $0: number;
    '$0.25': number;
    '$0.5': number;
    '$0.75': number;
    $1: number;
    '$1.5': number;
    $2: number;
    '$2.5': number;
    $3: number;
    '$3.5': number;
    $4: number;
    $true: number;
    '$4.5': number;
    $5: number;
    $6: number;
    $7: number;
    $8: number;
    $9: number;
    $10: number;
    $11: number;
    $12: number;
    $13: number;
    $14: number;
    $15: number;
    $16: number;
    $17: number;
    $18: number;
    $19: number;
    $20: number;
};
type SizeKeysIn = keyof typeof size;
type Sizes = {
    [Key in SizeKeysIn extends `$${infer Key}` ? Key : SizeKeysIn]: number;
};
type SizeKeys = `${keyof Sizes extends `${infer K}` ? K : never}`;
type SizeKeysWithNegatives = `$-${SizeKeys extends `$${infer Key}` ? Key : SizeKeys}` | SizeKeys;
export declare const space: {
    [Key in SizeKeysWithNegatives]: Key extends keyof Sizes ? Sizes[Key] : number;
};
export declare const zIndex: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
};
export declare const colorTokens: {
    light: {
        blue: {
            blue1: string;
            blue2: string;
            blue3: string;
            blue4: string;
            blue5: string;
            blue6: string;
            blue7: string;
            blue8: string;
            blue9: string;
            blue10: string;
            blue11: string;
            blue12: string;
        };
        gray: {
            gray1: string;
            gray2: string;
            gray3: string;
            gray4: string;
            gray5: string;
            gray6: string;
            gray7: string;
            gray8: string;
            gray9: string;
            gray10: string;
            gray11: string;
            gray12: string;
        };
        green: {
            green1: string;
            green2: string;
            green3: string;
            green4: string;
            green5: string;
            green6: string;
            green7: string;
            green8: string;
            green9: string;
            green10: string;
            green11: string;
            green12: string;
        };
        orange: {
            orange1: string;
            orange2: string;
            orange3: string;
            orange4: string;
            orange5: string;
            orange6: string;
            orange7: string;
            orange8: string;
            orange9: string;
            orange10: string;
            orange11: string;
            orange12: string;
        };
        pink: {
            pink1: string;
            pink2: string;
            pink3: string;
            pink4: string;
            pink5: string;
            pink6: string;
            pink7: string;
            pink8: string;
            pink9: string;
            pink10: string;
            pink11: string;
            pink12: string;
        };
        purple: {
            purple1: string;
            purple2: string;
            purple3: string;
            purple4: string;
            purple5: string;
            purple6: string;
            purple7: string;
            purple8: string;
            purple9: string;
            purple10: string;
            purple11: string;
            purple12: string;
        };
        red: {
            red1: string;
            red2: string;
            red3: string;
            red4: string;
            red5: string;
            red6: string;
            red7: string;
            red8: string;
            red9: string;
            red10: string;
            red11: string;
            red12: string;
        };
        yellow: {
            yellow1: string;
            yellow2: string;
            yellow3: string;
            yellow4: string;
            yellow5: string;
            yellow6: string;
            yellow7: string;
            yellow8: string;
            yellow9: string;
            yellow10: string;
            yellow11: string;
            yellow12: string;
        };
    };
    dark: {
        blue: {
            blue1: string;
            blue2: string;
            blue3: string;
            blue4: string;
            blue5: string;
            blue6: string;
            blue7: string;
            blue8: string;
            blue9: string;
            blue10: string;
            blue11: string;
            blue12: string;
        };
        gray: {
            gray1: string;
            gray2: string;
            gray3: string;
            gray4: string;
            gray5: string;
            gray6: string;
            gray7: string;
            gray8: string;
            gray9: string;
            gray10: string;
            gray11: string;
            gray12: string;
        };
        green: {
            green1: string;
            green2: string;
            green3: string;
            green4: string;
            green5: string;
            green6: string;
            green7: string;
            green8: string;
            green9: string;
            green10: string;
            green11: string;
            green12: string;
        };
        orange: {
            orange1: string;
            orange2: string;
            orange3: string;
            orange4: string;
            orange5: string;
            orange6: string;
            orange7: string;
            orange8: string;
            orange9: string;
            orange10: string;
            orange11: string;
            orange12: string;
        };
        pink: {
            pink1: string;
            pink2: string;
            pink3: string;
            pink4: string;
            pink5: string;
            pink6: string;
            pink7: string;
            pink8: string;
            pink9: string;
            pink10: string;
            pink11: string;
            pink12: string;
        };
        purple: {
            purple1: string;
            purple2: string;
            purple3: string;
            purple4: string;
            purple5: string;
            purple6: string;
            purple7: string;
            purple8: string;
            purple9: string;
            purple10: string;
            purple11: string;
            purple12: string;
        };
        red: {
            red1: string;
            red2: string;
            red3: string;
            red4: string;
            red5: string;
            red6: string;
            red7: string;
            red8: string;
            red9: string;
            red10: string;
            red11: string;
            red12: string;
        };
        yellow: {
            yellow1: string;
            yellow2: string;
            yellow3: string;
            yellow4: string;
            yellow5: string;
            yellow6: string;
            yellow7: string;
            yellow8: string;
            yellow9: string;
            yellow10: string;
            yellow11: string;
            yellow12: string;
        };
    };
};
export declare const darkColors: {
    yellow1: string;
    yellow2: string;
    yellow3: string;
    yellow4: string;
    yellow5: string;
    yellow6: string;
    yellow7: string;
    yellow8: string;
    yellow9: string;
    yellow10: string;
    yellow11: string;
    yellow12: string;
    red1: string;
    red2: string;
    red3: string;
    red4: string;
    red5: string;
    red6: string;
    red7: string;
    red8: string;
    red9: string;
    red10: string;
    red11: string;
    red12: string;
    purple1: string;
    purple2: string;
    purple3: string;
    purple4: string;
    purple5: string;
    purple6: string;
    purple7: string;
    purple8: string;
    purple9: string;
    purple10: string;
    purple11: string;
    purple12: string;
    pink1: string;
    pink2: string;
    pink3: string;
    pink4: string;
    pink5: string;
    pink6: string;
    pink7: string;
    pink8: string;
    pink9: string;
    pink10: string;
    pink11: string;
    pink12: string;
    orange1: string;
    orange2: string;
    orange3: string;
    orange4: string;
    orange5: string;
    orange6: string;
    orange7: string;
    orange8: string;
    orange9: string;
    orange10: string;
    orange11: string;
    orange12: string;
    green1: string;
    green2: string;
    green3: string;
    green4: string;
    green5: string;
    green6: string;
    green7: string;
    green8: string;
    green9: string;
    green10: string;
    green11: string;
    green12: string;
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    gray5: string;
    gray6: string;
    gray7: string;
    gray8: string;
    gray9: string;
    gray10: string;
    gray11: string;
    gray12: string;
    blue1: string;
    blue2: string;
    blue3: string;
    blue4: string;
    blue5: string;
    blue6: string;
    blue7: string;
    blue8: string;
    blue9: string;
    blue10: string;
    blue11: string;
    blue12: string;
};
export declare const lightColors: {
    yellow1: string;
    yellow2: string;
    yellow3: string;
    yellow4: string;
    yellow5: string;
    yellow6: string;
    yellow7: string;
    yellow8: string;
    yellow9: string;
    yellow10: string;
    yellow11: string;
    yellow12: string;
    red1: string;
    red2: string;
    red3: string;
    red4: string;
    red5: string;
    red6: string;
    red7: string;
    red8: string;
    red9: string;
    red10: string;
    red11: string;
    red12: string;
    purple1: string;
    purple2: string;
    purple3: string;
    purple4: string;
    purple5: string;
    purple6: string;
    purple7: string;
    purple8: string;
    purple9: string;
    purple10: string;
    purple11: string;
    purple12: string;
    pink1: string;
    pink2: string;
    pink3: string;
    pink4: string;
    pink5: string;
    pink6: string;
    pink7: string;
    pink8: string;
    pink9: string;
    pink10: string;
    pink11: string;
    pink12: string;
    orange1: string;
    orange2: string;
    orange3: string;
    orange4: string;
    orange5: string;
    orange6: string;
    orange7: string;
    orange8: string;
    orange9: string;
    orange10: string;
    orange11: string;
    orange12: string;
    green1: string;
    green2: string;
    green3: string;
    green4: string;
    green5: string;
    green6: string;
    green7: string;
    green8: string;
    green9: string;
    green10: string;
    green11: string;
    green12: string;
    gray1: string;
    gray2: string;
    gray3: string;
    gray4: string;
    gray5: string;
    gray6: string;
    gray7: string;
    gray8: string;
    gray9: string;
    gray10: string;
    gray11: string;
    gray12: string;
    blue1: string;
    blue2: string;
    blue3: string;
    blue4: string;
    blue5: string;
    blue6: string;
    blue7: string;
    blue8: string;
    blue9: string;
    blue10: string;
    blue11: string;
    blue12: string;
};
export declare const color: {
    yellow1Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow2Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow3Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow4Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow5Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow6Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow7Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow8Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow9Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow10Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow11Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow12Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red1Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red2Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red3Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red4Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red5Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red6Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red7Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red8Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red9Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red10Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red11Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red12Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple1Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple2Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple3Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple4Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple5Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple6Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple7Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple8Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple9Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple10Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple11Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple12Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink1Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink2Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink3Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink4Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink5Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink6Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink7Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink8Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink9Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink10Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink11Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink12Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange1Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange2Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange3Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange4Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange5Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange6Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange7Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange8Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange9Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange10Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange11Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange12Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green1Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green2Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green3Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green4Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green5Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green6Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green7Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green8Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green9Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green10Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green11Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green12Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray1Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray2Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray3Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray4Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray5Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray6Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray7Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray8Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray9Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray10Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray11Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray12Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue1Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue2Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue3Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue4Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue5Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue6Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue7Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue8Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue9Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue10Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue11Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue12Dark: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow1Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow2Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow3Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow4Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow5Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow6Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow7Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow8Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow9Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow10Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow11Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    yellow12Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red1Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red2Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red3Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red4Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red5Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red6Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red7Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red8Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red9Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red10Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red11Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    red12Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple1Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple2Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple3Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple4Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple5Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple6Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple7Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple8Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple9Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple10Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple11Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    purple12Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink1Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink2Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink3Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink4Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink5Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink6Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink7Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink8Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink9Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink10Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink11Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    pink12Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange1Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange2Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange3Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange4Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange5Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange6Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange7Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange8Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange9Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange10Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange11Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    orange12Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green1Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green2Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green3Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green4Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green5Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green6Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green7Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green8Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green9Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green10Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green11Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    green12Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray1Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray2Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray3Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray4Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray5Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray6Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray7Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray8Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray9Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray10Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray11Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    gray12Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue1Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue2Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue3Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue4Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue5Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue6Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue7Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue8Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue9Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue10Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue11Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
    blue12Light: string | ({
        val: string;
        name: string;
        key: string;
    } & {
        variable?: string | undefined;
        isVar?: true | undefined;
    });
};
export declare const radius: {
    0: number;
    1: number;
    2: number;
    3: number;
    4: number;
    true: number;
    5: number;
    6: number;
    7: number;
    8: number;
    9: number;
    10: number;
    11: number;
    12: number;
};
export declare const tokens: {
    color: {
        yellow1Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow2Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow3Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow4Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow5Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow6Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow7Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow8Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow9Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow10Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow11Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow12Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red1Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red2Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red3Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red4Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red5Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red6Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red7Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red8Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red9Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red10Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red11Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red12Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple1Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple2Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple3Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple4Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple5Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple6Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple7Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple8Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple9Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple10Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple11Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple12Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink1Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink2Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink3Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink4Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink5Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink6Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink7Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink8Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink9Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink10Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink11Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink12Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange1Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange2Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange3Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange4Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange5Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange6Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange7Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange8Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange9Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange10Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange11Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange12Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green1Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green2Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green3Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green4Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green5Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green6Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green7Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green8Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green9Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green10Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green11Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green12Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray1Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray2Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray3Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray4Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray5Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray6Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray7Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray8Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray9Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray10Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray11Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray12Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue1Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue2Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue3Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue4Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue5Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue6Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue7Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue8Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue9Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue10Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue11Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue12Light: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow1Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow2Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow3Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow4Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow5Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow6Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow7Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow8Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow9Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow10Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow11Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        yellow12Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red1Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red2Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red3Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red4Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red5Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red6Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red7Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red8Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red9Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red10Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red11Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        red12Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple1Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple2Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple3Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple4Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple5Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple6Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple7Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple8Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple9Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple10Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple11Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        purple12Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink1Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink2Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink3Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink4Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink5Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink6Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink7Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink8Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink9Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink10Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink11Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        pink12Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange1Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange2Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange3Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange4Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange5Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange6Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange7Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange8Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange9Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange10Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange11Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        orange12Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green1Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green2Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green3Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green4Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green5Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green6Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green7Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green8Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green9Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green10Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green11Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        green12Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray1Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray2Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray3Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray4Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray5Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray6Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray7Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray8Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray9Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray10Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray11Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        gray12Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue1Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue2Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue3Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue4Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue5Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue6Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue7Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue8Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue9Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue10Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue11Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        blue12Dark: {
            val: string;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
    };
    space: {
        0: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        0.25: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        0.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        0.75: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        1: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        1.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        2: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        2.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        3: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        3.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        4: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        true: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        4.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        6: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        7: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        8: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        9: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        10: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        11: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        12: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        13: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        14: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        15: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        16: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        17: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        18: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        19: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        20: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-0": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-0.25": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-0.5": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-0.75": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-1": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-1.5": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-2": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-2.5": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-3": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-3.5": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-4": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-true": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-4.5": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-5": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-6": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-7": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-8": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-9": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-10": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-11": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-12": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-13": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-14": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-15": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-16": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-17": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-18": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-19": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        "$-20": {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
    };
    size: {
        0: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        0.25: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        0.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        0.75: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        1: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        1.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        2: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        2.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        3: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        3.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        4: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        true: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        4.5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        6: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        7: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        8: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        9: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        10: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        11: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        12: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        13: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        14: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        15: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        16: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        17: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        18: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        19: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        20: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
    };
    radius: {
        0: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        1: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        4: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        2: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        3: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        8: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        true: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        12: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        7: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        9: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        10: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        6: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        11: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
    };
    zIndex: {
        0: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        1: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        4: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        2: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        3: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
        5: {
            val: number;
            name: string;
            key: string;
        } & {
            variable?: string | undefined;
            isVar?: true | undefined;
        };
    };
};
export {};
//# sourceMappingURL=tokens.d.ts.map
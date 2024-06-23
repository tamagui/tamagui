export declare const animationCode = "import { Button, Square } from 'tamagui'\n\nexport default () => {\n  const [positionI, setPositionI] = React.useState(0)\n  return (\n    <>\n      <Square\n        animation=\"bouncy\"\n        size={110}\n        bg=\"$pink10\"\n        br=\"$9\"\n        hoverStyle={{\n          scale: 1.1,\n        }}\n        pressStyle={{\n          scale: 0.9,\n        }}\n        {...positions[positionI]}\n      >\n        <LogoIcon />\n      </Square>\n\n      <Button\n        pos=\"absolute\"\n        b={20}\n        l={20}\n        icon={require('@tamagui/lucide-icons').Play}\n        size=\"$6\"\n        circular\n        onPress={() => setPositionI(i => (i + 1) % positions.length)}\n      />\n    </>\n  )\n}\n\nexport const positions = [\n  {\n    x: 0,\n    y: 0,\n    scale: 1,\n    rotate: '0deg',\n  },\n  {\n    x: -50,\n    y: -50,\n    scale: 0.5,\n    rotate: '-45deg',\n    hoverStyle: {\n      scale: 0.6,\n    },\n    pressStyle: {\n      scale: 0.4,\n    },\n  },\n  {\n    x: 50,\n    y: 50,\n    scale: 1,\n    rotate: '180deg',\n    hoverStyle: {\n      scale: 1.1,\n    },\n    pressStyle: {\n      scale: 0.9,\n    },\n  },\n]";
export declare const compilationCode: {
    name: string;
    input: {
        description: string;
        examples: {
            name: string;
            language: string;
            code: string;
        }[];
    };
    output: {
        description: string;
        examples: {
            name: string;
            code: string;
            language: string;
        }[];
    };
}[];
//# sourceMappingURL=codeExamples.d.ts.map
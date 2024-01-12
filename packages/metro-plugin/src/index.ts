import type { TamaguiOptions } from '@tamagui/static'
import { createExtractor } from '@tamagui/static'
import type { GetTransformOptionsOpts } from 'metro-config'
import { cssToReactNativeRuntime } from 'react-native-css-interop/css-to-rn'

const extractor = createExtractor()

export function withTamagui(
  metroConfig: GetTransformOptionsOpts,
  options: TamaguiOptions
) {
  console.log('metroConfig', metroConfig)

  const created = extractor.loadTamaguiSync(options)

  // const {
  //   platform,
  //   // @ts-ignore i guess this isnt here yet?
  //   transformer,
  // } = metroConfig

  // const previousTransformOptions = transformer?.getTransformOptions

  // const cssString = ''

  // cssToReactNativeRuntime(cssString, transformer?.cssToReactNativeRuntime)

  return metroConfig
}

//
// import loadConfig from "tailwindcss/loadConfig";
// import tailwindPackage from "tailwindcss/package.json";
// import type { ServerOptions } from "ws";
// import micromatch from "micromatch";

// import path from "path";
// import {
//   withCssInterop,
//   CssToReactNativeRuntimeOptions,
//   ComposableIntermediateConfigT,
// } from "react-native-css-interop/metro";

// import { cssToReactNativeRuntimeOptions } from "./common";
// import { tailwindCli } from "./tailwind-cli";

// interface WithNativeWindOptions extends CssToReactNativeRuntimeOptions {
//   input: string;
//   projectRoot?: string;
//   outputDir?: string;
//   configPath?: string;
//   hotServerOptions?: ServerOptions;
//   cliCommand?: string;
//   browserslist?: string | null;
//   browserslistEnv?: string | null;
// }

// export function withNativeWind(
//   metroConfig: ComposableIntermediateConfigT,
//   {
//     input,
//     outputDir = ["node_modules", ".cache", "nativewind"].join(path.sep),
//     projectRoot = process.cwd(),
//     inlineRem = 14,
//     configPath: tailwindConfigPath = "tailwind.config.js",
//     cliCommand = `node ${path.join(
//       require.resolve("tailwindcss/package.json"),
//       "../",
//       tailwindPackage.bin.tailwindcss,
//     )}`,
//     hotServerOptions = {},
//     browserslist = "last 1 version",
//     browserslistEnv = "native",
//     experiments,
//   }: WithNativeWindOptions = {} as WithNativeWindOptions,
// ) {
//   if (!input) {
//     throw new Error(
//       "withNativeWind requires an input parameter: `withNativeWind(config, { input: <css-file> })`",
//     );
//   }

//   input = path.resolve(input);

//   const { important: importantConfig, content } = loadConfig(
//     path.resolve(tailwindConfigPath),
//   );

//   const contentArray = "files" in content ? content.files : content;

//   metroConfig = withCssInterop(metroConfig, {
//     ...cssToReactNativeRuntimeOptions,
//     inlineRem,
//     experiments,
//     selectorPrefix:
//       typeof importantConfig === "string" ? importantConfig : undefined,
//   });

//   // eslint-disable-next-line unicorn/prefer-module
//   metroConfig.transformerPath = require.resolve("./transformer");

//   const tailwindHasStarted: Record<string, boolean> = {
//     native: false,
//     web: false,
//   };

//   // Use getTransformOptions to bootstrap the Tailwind CLI, but ensure
//   // we still call the original
//   const previousTransformOptions = metroConfig.transformer?.getTransformOptions;
//   metroConfig.transformer = {
//     ...metroConfig.transformer,
//     nativewind: {
//       input,
//       experiments,
//     },
//     getTransformOptions: async (
//       entryPoints: ReadonlyArray<string>,
//       options: GetTransformOptionsOpts,
//       getDependenciesOf: (filePath: string) => Promise<string[]>,
//     ) => {
//       const output = path.resolve(
//         projectRoot,
//         path.join(outputDir, path.basename(input!)),
//       );
//       const matchesOutputDir = contentArray.some((pattern) => {
//         if (typeof pattern !== "string") return false;
//         return micromatch.isMatch(output, pattern);
//       });

//       if (matchesOutputDir) {
//         throw new Error(
//           `NativeWind: Your '${tailwindConfigPath}#content' includes the output file ${output} which will cause an infinite loop. Please read https://tailwindcss.com/docs/content-configuration#styles-rebuild-in-an-infinite-loop`,
//         );
//       }

//       // Clear Metro's progress bar and move to the start of the line
//       // We will print out own output before letting Metro print again
//       if (process.stdout.isTTY) {
//         process.stdout.clearLine(0);
//         process.stdout.cursorTo(0);
//       }

//       const platform = options.platform === "web" ? "web" : "native";

//       // Ensure we only spawn the subprocesses once
//       if (!tailwindHasStarted[platform]) {
//         tailwindHasStarted[platform] = true;

//         // Generate the styles
//         const cliOutput = await tailwindCli(input!, metroConfig, {
//           ...options,
//           output,
//           cliCommand,
//           hotServerOptions,
//           browserslist,
//           browserslistEnv,
//         });

//         if (cliOutput) {
//           Object.assign((metroConfig as any).transformer.nativewind, cliOutput);
//         }
//       }

//       return previousTransformOptions?.(
//         entryPoints,
//         options,
//         getDependenciesOf,
//       );
//     },
//   };

//   return metroConfig;
// }

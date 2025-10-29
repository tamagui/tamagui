import { build } from 'vite'
import { fileURLToPath } from 'node:url'
import { resolve } from 'node:path'

export interface BundleOptions {
  /**
   * Entry point file path (absolute or relative to cwd)
   */
  entry: string

  /**
   * Output directory (relative to cwd)
   * @default 'dist'
   */
  outDir?: string

  /**
   * Output filename
   * @default 'native.cjs'
   */
  fileName?: string

  /**
   * Working directory
   * @default process.cwd()
   */
  cwd?: string

  /**
   * Environment variables to define
   */
  define?: Record<string, string>

  /**
   * Whether to minify the output
   * @default false
   */
  minify?: boolean
}

/**
 * Bundle a Tamagui package for React Native using Vite
 */
export async function bundleNative(options: BundleOptions): Promise<void> {
  const {
    entry,
    outDir = 'dist',
    fileName = 'native.cjs',
    cwd = process.cwd(),
    define = {},
    minify = false,
  } = options

  const resolvePath = (name: string) => {
    try {
      return fileURLToPath(import.meta.resolve(name))
    } catch {
      // Fallback for packages that might not be resolvable
      return name
    }
  }

  const rnwl = resolvePath('@tamagui/react-native-web-lite')
  const entryPath = resolve(cwd, entry)

  const defaultDefine = {
    'process.env.TAMAGUI_TARGET': JSON.stringify('native'),
    'process.env.NODE_ENV': JSON.stringify('production'),
    'process.env.TAMAGUI_IS_CORE_NODE': JSON.stringify('1'),
  }

  await build({
    configFile: false,
    root: cwd,
    build: {
      lib: {
        entry: entryPath,
        name: 'TamaguiNativeBundle',
        fileName: () => fileName,
        formats: ['cjs'],
      },
      outDir,
      emptyOutDir: false,
      rollupOptions: {
        // Only externalize react
        external: ['react'],
        output: {
          // Ensure CommonJS output
          format: 'cjs',
          exports: 'named',
        },
      },
      target: 'es2015',
      minify,
    },
    resolve: {
      // Prefer react-native exports
      mainFields: ['react-native', 'module', 'main'],
      extensions: [
        '.native.ts',
        '.native.tsx',
        '.native.js',
        '.ts',
        '.tsx',
        '.js',
        '.jsx',
      ],
      conditions: ['react-native', 'import', 'module', 'default'],
      alias: [
        {
          find: /^react-native$/,
          replacement: rnwl,
        },
        {
          find: /^react-native\/(.+)$/,
          replacement: `${rnwl}/$1`,
        },
      ],
    },
    define: {
      ...defaultDefine,
      ...define,
    },
    logLevel: 'warn',
  })
}

/**
 * CLI entry point for running as a script
 */
export async function runCLI() {
  const args = process.argv.slice(2)

  if (args.length === 0) {
    console.error('Usage: native-bundle <entry-file> [output-file]')
    process.exit(1)
  }

  const entry = args[0]
  const fileName = args[1] || 'native.cjs'

  console.log(`Bundling ${entry} -> dist/${fileName}`)

  try {
    await bundleNative({ entry, fileName })
    console.log('✓ Bundle created successfully')
  } catch (error) {
    console.error('✗ Bundle failed:', error)
    process.exit(1)
  }
}

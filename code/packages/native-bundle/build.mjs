import { build } from 'esbuild'

const isWatch = process.argv.includes('--watch')

const config = {
  entryPoints: ['src/index.ts', 'src/cli.ts'],
  bundle: false,
  outdir: 'dist',
  platform: 'node',
  format: 'esm',
  target: 'es2020',
}

async function runBuild() {
  if (isWatch) {
    const ctx = await build({
      ...config,
      logLevel: 'info',
    })
    await ctx.watch()
    console.log('Watching for changes...')
  } else {
    await build(config)
    console.log('Build complete')
  }
}

runBuild().catch((err) => {
  console.error(err)
  process.exit(1)
})

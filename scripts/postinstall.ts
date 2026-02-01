import { existsSync } from 'node:fs'
import { execSync } from 'node:child_process'
import { join } from 'node:path'

// check if critical packages are built by looking for dist folder
// using vite-plugin as it's commonly needed and fails loudly if missing
const criticalPackage = join(process.cwd(), 'code/compiler/vite-plugin/dist')

if (!existsSync(criticalPackage)) {
  console.info('\n📦 First time setup detected - building packages...\n')
  console.info('This may take a few minutes on first run.\n')

  try {
    execSync('bun run build:js', {
      stdio: 'inherit',
      cwd: process.cwd(),
    })
    console.info('\n✅ Build complete! You can now run `bun run dev`\n')
  } catch (error) {
    console.error('\n❌ Build failed. Try running `bun run build:js` manually.\n')
    process.exit(1)
  }
}

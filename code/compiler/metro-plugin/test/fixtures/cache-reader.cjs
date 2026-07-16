'use strict'

const { readFile } = require('node:fs/promises')
const generate = require('@babel/generator').default

async function main() {
  const [transformerFactoryPath, cacheBaseRoot, originalBabelTransformerPath, inputPath] =
    process.argv.slice(2)
  const { createMetroCompilerTransformer } = require(transformerFactoryPath)
  const args = JSON.parse(await readFile(inputPath, 'utf8'))
  const result = await createMetroCompilerTransformer({
    cacheBaseRoot,
    originalBabelTransformerPath,
  }).transform(args)
  process.stdout.write(
    JSON.stringify({
      cacheHit: result.metadata?.tamagui?.cacheHit,
      code: generate(result.ast, { comments: true }).code,
      fixtureUserPlugin: result.metadata?.fixtureUserPlugin,
      lowering: result.metadata?.tamagui?.lowering,
    })
  )
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

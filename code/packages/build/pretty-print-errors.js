/* eslint-disable no-console */

/**
 * Pretty print TypeScript diagnostics with file location and error codes
 * @param {import('typescript').Diagnostic[]} diagnostics
 * @param {import('typescript')} ts
 */
function printTypescriptDiagnostics(diagnostics, ts) {
  console.error('\n❌ TypeScript compilation errors:\n')

  diagnostics.forEach((diagnostic) => {
    const messageText =
      typeof diagnostic.messageText === 'string'
        ? diagnostic.messageText
        : diagnostic.messageText?.messageText || JSON.stringify(diagnostic.messageText)

    if (diagnostic.file && diagnostic.start !== undefined) {
      const { line, character } = ts.getLineAndCharacterOfPosition(
        diagnostic.file,
        diagnostic.start
      )
      console.error(
        `  ${diagnostic.file.fileName}:${line + 1}:${character + 1} - error TS${diagnostic.code}: ${messageText}`
      )
    } else {
      console.error(`  error TS${diagnostic.code}: ${messageText}`)
    }
  })

  console.error('')
}

/**
 * Pretty print esbuild errors with file location and code snippets
 * @param {Error & { errors?: any[], warnings?: any[] }} err
 */
function printEsbuildError(err) {
  console.error('\n❌ Build error:\n')

  // esbuild errors have a formatted message that's much more readable
  if (err.errors && err.errors.length > 0) {
    err.errors.forEach((error) => {
      if (error.location) {
        console.error(
          `  ${error.location.file}:${error.location.line}:${error.location.column}: ${error.text}`
        )
        if (error.location.lineText) {
          console.error(`    ${error.location.lineText}`)
        }
      } else {
        console.error(`  ${error.text}`)
      }
    })
  } else {
    // Fallback for non-esbuild errors
    console.error(err.message || err)
  }

  if (err.warnings && err.warnings.length > 0) {
    console.error('\n⚠️  Warnings:\n')
    err.warnings.forEach((warning) => {
      if (warning.location) {
        console.error(
          `  ${warning.location.file}:${warning.location.line}:${warning.location.column}: ${warning.text}`
        )
      } else {
        console.error(`  ${warning.text}`)
      }
    })
  }

  console.error('')
}

/**
 * Pretty print general build errors with stack traces
 * @param {Error} error
 * @param {string} packageName
 * @param {string} cwd
 */
function printBuildError(error, packageName, cwd) {
  console.error(`\n❌ Error building ${packageName} in ${cwd}:\n`)

  if (error.stack) {
    // Show a more readable error with the stack trace
    const lines = error.stack.split('\n')
    console.error(`  ${lines[0]}`) // The error message
    if (lines.length > 1) {
      console.error('\nStack trace:')
      lines.slice(1, 6).forEach((line) => console.error(`  ${line.trim()}`))
      if (lines.length > 6) {
        console.error(`  ... and ${lines.length - 6} more`)
      }
    }
  } else {
    console.error(`  ${error.message || error}`)
  }

  console.error('')
}

/**
 * Pretty print TypeScript compilation errors (network, config, etc)
 * @param {Error & { code?: string }} err
 * @param {string} packageName
 */
function printTypescriptCompilationError(err, packageName) {
  console.error(`\n❌ Error during TypeScript compilation for ${packageName}:\n`)

  if (err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
    console.error(`  Network error: ${err.message}`)
  } else if (err.message) {
    console.error(`  ${err.message}`)
    if (err.stack && process.env.DEBUG) {
      console.error('\nStack trace (DEBUG mode):')
      err.stack.split('\n').slice(1, 6).forEach((line) => console.error(`  ${line.trim()}`))
    }
  } else {
    console.error(`  ${err}`)
  }

  console.error('')
}

module.exports = {
  printTypescriptDiagnostics,
  printEsbuildError,
  printBuildError,
  printTypescriptCompilationError,
}

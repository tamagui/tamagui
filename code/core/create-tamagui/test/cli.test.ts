import { type ChildProcess, spawn } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import { temporaryDirectory } from 'tempy'
import { afterAll, beforeAll, describe, expect, it } from 'vitest'

describe('create-tamagui CLI', () => {
  let tempDir: string
  let cli: ChildProcess
  let projectName: string
  let projectPath: string
  let output: string

  beforeAll(
    async () => {
      tempDir = temporaryDirectory()
      projectName = 'test-project'
      const cliPath = path.join(__dirname, '../dist/index.cjs')
      projectPath = path.join(tempDir, projectName)

      console.info(`Running: node ${cliPath}`)
      console.info(` in dir: ${tempDir}`)
      console.info(` then entering: ${projectName}`)

      cli = spawn('node', [cliPath], {
        cwd: tempDir,
        stdio: ['pipe', 'pipe', 'pipe'],
      })

      output = ''

      cli.stdout?.on('data', (data) => {
        output += data.toString()
        console.info(data.toString()) // Log output for debugging
      })

      cli.stderr?.on('data', (data) => {
        output += data.toString()
        console.error(`ERROR`, data.toString()) // Log errors for debugging
      })

      // Helper function to write input after a delay
      const writeWithDelay = (input: string, delay: number) => {
        return new Promise<void>((resolve) => {
          setTimeout(() => {
            cli.stdin?.write(input)
            resolve()
          }, delay)
        })
      }

      // Simulate user input
      await writeWithDelay(`${projectName}`, 300)
      await writeWithDelay('\r', 300) // Enter
      await writeWithDelay('\x1B\x5B\x42', 300) // Down arrow
      await writeWithDelay('\x1B\x5B\x42', 300) // Down arrow
      await writeWithDelay('\r', 300) // Enter

      // Wait for the process to finish
      await new Promise<void>((resolve, reject) => {
        cli.on('exit', (code) => {
          if (code === 0) {
            resolve()
          } else {
            reject(new Error(`CLI process exited with code ${code}`))
          }
        })
      })
    },
    // timeout
    120_000
  )

  afterAll(() => {
    // Clean up the temporary directory after each test
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('should create the project directory', () => {
    expect(fs.existsSync(projectPath)).toBe(true)
  })

  it('should create essential files', () => {
    const essentialFiles = [
      'package.json',
      'tsconfig.json',
      'app.json',
      'tamagui.config.ts',
    ]

    essentialFiles.forEach((file) => {
      expect(fs.existsSync(path.join(projectPath, file))).toBe(true)
    })
  })

  it('should prompt for project name', () => {
    expect(output).toContain('Project name:')
  })

  it('should display the selected template', () => {
    expect(output).toContain('Free - Expo + Next in a production ready monorepo')
  })

  it('should provide instructions to visit the project', () => {
    expect(output).toContain('visit your project')
  })

  it('should not contain any errors', () => {
    expect(output).not.toContain('Error:')
  })

  it('should indicate successful project creation', () => {
    expect(output).toContain(`Done! created a new project`)
  })

  it('should display the project name', () => {
    expect(output).toContain(`cd ${projectName}`)
  })

  it('should not contain any git errors', () => {
    expect(output).not.toContain('fatal: not a git repository')
  })
})

describe('create-tamagui CLI with --template flag', () => {
  let tempDir: string
  let cli: ChildProcess
  let projectName: string
  let projectPath: string
  let output: string

  beforeAll(async () => {
    tempDir = temporaryDirectory()
    projectName = 'expo-router-project'
    const cliPath = path.join(__dirname, '../dist/index.cjs')
    projectPath = path.join(tempDir, projectName)

    cli = spawn('node', [cliPath, '--template', 'expo-router'], {
      cwd: tempDir,
      stdio: ['pipe', 'pipe', 'pipe'],
    })

    output = ''

    cli.stdout?.on('data', (data) => {
      output += data.toString()
      if (process.env.DEBUG === 'test') {
        console.info(data.toString())
      }
    })

    cli.stderr?.on('data', (data) => {
      output += data.toString()
      if (process.env.DEBUG === 'test') {
        console.error(data.toString())
      }
    })

    // Simulate user input for project name only
    await new Promise<void>((resolve) => {
      setTimeout(() => {
        cli.stdin?.write(`${projectName}\r`)
        resolve()
      }, 1000)
    })

    // Wait for the process to finish
    await new Promise<void>((resolve, reject) => {
      cli.on('exit', (code) => {
        if (code === 0) {
          resolve()
        } else {
          reject(new Error(`CLI process exited with code ${code}`))
        }
      })
    })
  }, 60000) // 60 second timeout for the setup

  afterAll(() => {
    if (tempDir && fs.existsSync(tempDir)) {
      fs.rmSync(tempDir, { recursive: true, force: true })
    }
  })

  it('should create the expo-router project directory', () => {
    expect(fs.existsSync(projectPath)).toBe(true)
  })

  it('should skip the template picker step', () => {
    expect(output).not.toContain('Select a template:')
    expect(output).not.toContain('Free - Expo + Next in a production ready monorepo')
  })

  it('should create essential files for expo-router project', () => {
    const essentialFiles = [
      'package.json',
      'tsconfig.json',
      'app.json',
      'tamagui.config.ts',
      'app/_layout.tsx',
    ]

    essentialFiles.forEach((file) => {
      expect(fs.existsSync(path.join(projectPath, file))).toBe(true)
    })
  })

  it('should indicate successful expo-router project creation', () => {
    expect(output).toContain(`Done! created a new project`)
    expect(output).toContain(`cd ${projectName}`)
  })

  it('should not contain any errors', () => {
    expect(output).not.toContain('Error:')
  })

  it('should contain expo-router specific instructions', () => {
    expect(output).toContain('expo-router')
  })
})

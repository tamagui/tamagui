import { promises as fs } from 'node:fs'
import * as path from 'node:path'
import { exec } from 'node:child_process'
import os from 'node:os'

interface PackageJson {
  profile?: { [key: string]: any }
  [key: string]: any
}

const main = async (name: string) => {
  const packageJsonPath = path.join(process.cwd(), 'package.json')
  const packageJsonContent = await fs.readFile(packageJsonPath, 'utf-8')
  const packageJson: PackageJson = JSON.parse(packageJsonContent)

  const profile = packageJson.profile && packageJson.profile[name]
  if (!profile) {
    console.info(`Profile "${name}" not found in package.json`)
    return
  }

  if (profile.applied) {
    // Profile is applied, remove it
    Object.keys(profile.resolutions).forEach((key) => {
      if (packageJson.resolutions && packageJson.resolutions[key]) {
        delete packageJson.resolutions[key]
      }
    })
    profile.applied = false
  } else {
    // Profile is not applied, merge it
    if (!packageJson.resolutions) packageJson.resolutions = {}
    const processedResolutions = processResolutions(profile.resolutions)
    packageJson.resolutions = mergeDeep(packageJson.resolutions, processedResolutions)
    profile.applied = true
  }

  await fs.writeFile(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf-8')

  console.info(`Profile "${name}" has been ${profile.applied ? 'applied' : 'removed'}.`)

  await new Promise<void>((res) => {
    exec('yarn', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error executing yarn: ${error.message}`)
      } else if (stderr) {
        console.error(`yarn stderr: ${stderr}`)
      } else {
        console.info(`yarn stdout: ${stdout}`)
      }
      res()
    })
  })

  if (profile.applied) {
    // clear things
    exec(
      'git reset HEAD -- package.json && git checkout -- package.json && git reset HEAD -- yarn.lock && git checkout -- yarn.lock',
      (error, stdout, stderr) => {
        if (error) console.error(`err2`, error)
      }
    )
  }
}

// Example usage: pass the profile name as a command-line argument
const args = process.argv.slice(2)
if (args.length !== 1) {
  console.error('Usage: ts-node script.ts <profile-name>')
  process.exit(1)
}

const profileName = args[0]
main(profileName).catch((err) => console.error(err))

const mergeDeep = (target: any, source: any) => {
  const isObject = (obj: any) => obj && typeof obj === 'object'
  if (!isObject(target) || !isObject(source)) return source

  Object.keys(source).forEach((key) => {
    const targetValue = target[key]
    const sourceValue = source[key]

    if (Array.isArray(targetValue) && Array.isArray(sourceValue)) {
      target[key] = targetValue.concat(sourceValue)
    } else if (isObject(targetValue) && isObject(sourceValue)) {
      target[key] = mergeDeep(Object.assign({}, targetValue), sourceValue)
    } else {
      target[key] = sourceValue
    }
  })

  return target
}

const replaceTildeWithHomePath = (value: string) => {
  const homePath = os.homedir()
  return value.replace(/^portal:~\//, `portal:${homePath}/`)
}

const processResolutions = (resolutions: { [key: string]: string }) => {
  const processedResolutions: { [key: string]: string } = {}
  Object.keys(resolutions).forEach((key) => {
    processedResolutions[key] = replaceTildeWithHomePath(resolutions[key])
  })
  return processedResolutions
}

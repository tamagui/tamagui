#!/usr/bin/env node
const fs = require('fs')

const ancestorPath = process.argv[2] // %O - Ancestor
const oursPath = process.argv[3] // %A - Ours
const theirsPath = process.argv[4] // %B - Theirs

function readJSON(filePath) {
  if (!fs.existsSync(filePath)) return {}
  const data = fs.readFileSync(filePath, 'utf8')
  try {
    return JSON.parse(data)
  } catch {
    // If invalid JSON, return empty object to avoid errors
    return {}
  }
}

const base = readJSON(ancestorPath)
const ours = readJSON(oursPath)
const theirs = readJSON(theirsPath)

function normalizeVersion(v) {
  // Remove leading semver modifiers like ^ or ~
  return v.replace(/^[~^]/, '')
}

function compareVersions(a, b) {
  a = normalizeVersion(a)
  b = normalizeVersion(b)

  const pa = a.split('.').map((x) => parseInt(x, 10) || 0)
  const pb = b.split('.').map((x) => parseInt(x, 10) || 0)

  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const diff = (pa[i] || 0) - (pb[i] || 0)
    if (diff !== 0) return diff
  }
  return 0
}

function mergeField(field) {
  const all = [base[field] || {}, ours[field] || {}, theirs[field] || {}]
  const combined = {}

  // Gather all versions for each dependency
  for (const obj of all) {
    for (const [name, version] of Object.entries(obj)) {
      if (typeof version === 'string') {
        if (!combined[name]) combined[name] = []
        combined[name].push(version)
      }
    }
  }

  // Pick the highest version
  const merged = {}
  for (const [name, versions] of Object.entries(combined)) {
    let maxVersion = versions[0]
    for (let i = 1; i < versions.length; i++) {
      if (compareVersions(versions[i], maxVersion) > 0) {
        maxVersion = versions[i]
      }
    }
    merged[name] = maxVersion
  }

  return merged
}

// Start from theirs for non-dependency fields
const result = { ...theirs }

// Merge dependency fields and choose the newest versions
for (const field of [
  'dependencies',
  'devDependencies',
  'peerDependencies',
  'optionalDependencies',
]) {
  result[field] = mergeField(field)
}

// Print merged JSON to stdout for Git to use
process.stdout.write(JSON.stringify(result, null, 2))

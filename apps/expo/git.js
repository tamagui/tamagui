const fs = require('fs')
const execSync = require('child_process').execSync

const commitHash = execSync('git rev-parse HEAD').toString().trim()
const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

fs.writeFileSync('git.json', JSON.stringify({ commitHash, branchName }))

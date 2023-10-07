// eslint-disable-next-line @typescript-eslint/no-var-requires
const fs = require('fs')
// eslint-disable-next-line @typescript-eslint/no-var-requires
const execSync = require('child_process').execSync

const commitHash = execSync('git rev-parse HEAD').toString().trim()
const branchName = execSync('git rev-parse --abbrev-ref HEAD').toString().trim()

fs.writeFileSync('git.json', JSON.stringify({ commitHash, branchName }))

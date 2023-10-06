const fs = require('fs')
const execSync = require('child_process').execSync

const commitHash = execSync('git rev-parse HEAD').toString().trim()

fs.writeFileSync('git.json', JSON.stringify({ commitHash }))

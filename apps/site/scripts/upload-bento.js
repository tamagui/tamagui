const { createClient } = require('@supabase/supabase-js')
const fs = require('fs')
const path = require('path')
const { glob } = require('glob')
require('dotenv').config({ path: ".env.local", override: true })

async function uploadFile(filePath) {
    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL || '',
        process.env.SUPABASE_SERVICE_ROLE_KEY || ''

    )
    const fileBuffer = fs.readFileSync(path.join(process.cwd(), 'bento-output', filePath))
    await supabase.storage.from("bento").upload(filePath, fileBuffer)
}

async function upload() {
    const globPattern = path.join(process.cwd(), 'bento-output', '**/*.txt')

    glob(globPattern, async (error, txtFiles) => {
        await Promise.all(txtFiles.map((filePath) => uploadFile(filePath.split('/bento-output/')[1])))
    })
}

upload()
export async function readBodyBuffer(req: Request) {
  if (!req.body) {
    return null
  }

  const reader = req.body.getReader()
  const chunks: any[] = []

  while (true) {
    const { done, value } = await reader.read()
    if (done) break
    chunks.push(value)
  }

  const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0)
  const uint8Array = new Uint8Array(totalLength)

  let offset = 0
  for (const chunk of chunks) {
    uint8Array.set(chunk, offset)
    offset += chunk.length
  }

  return Buffer.from(uint8Array)
}

export async function readBodyJSON(req: Request) {
  if (req.body) {
    const bodyString = await streamToString(req.body)
    return JSON.parse(bodyString)
  }
  return null
}

async function streamToString(stream: ReadableStream<Uint8Array> | null) {
  if (!stream) {
    return ''
  }
  const reader = stream.getReader()
  let result = ''
  let read = await reader.read()
  while (!read.done) {
    result += new TextDecoder('utf-8').decode(read.value)
    read = await reader.read()
  }
  reader.releaseLock()
  return result
}

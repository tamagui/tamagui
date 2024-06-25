const url = `${
  process.env.URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  import.meta.env.NEXT_PUBLIC_VERCEL_URL ||
  'http://localhost:8081'
}`

const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`

console.info(`base url: ${url}`)

export const getURL = () => {
  return urlWithProtocol
}

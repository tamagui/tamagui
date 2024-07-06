const url = `${
  process.env.URL ||
  process.env.NEXT_PUBLIC_VERCEL_URL ||
  import.meta.env.NEXT_PUBLIC_VERCEL_URL ||
  'http://127.0.0.1:8081'
}`

const urlWithProtocol = url.startsWith('http') ? url : `https://${url}`

export const getURL = () => {
  return urlWithProtocol
}

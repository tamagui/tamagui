export const getURL = () => {
  const url =
    process?.env?.URL && process.env.URL !== ''
      ? process.env.URL
      : process?.env?.NEXT_PUBLIC_VERCEL_URL &&
          import.meta.env.NEXT_PUBLIC_VERCEL_URL !== ''
        ? import.meta.env.NEXT_PUBLIC_VERCEL_URL
        : 'http://localhost:5005'
  return url.includes('http') ? url : `https://${url}`
}

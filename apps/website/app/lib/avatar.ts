export const getDefaultAvatarImage = (name: string) => {
  const params = new URLSearchParams()
  params.append('name', name)
  return `https://ui-avatars.com/api/?${params.toString()}`
}

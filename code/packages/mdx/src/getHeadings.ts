export const getHeadings = (source: string) =>
  source
    .split('\n')
    .filter((x) => x.startsWith('#'))
    .map((x) => ({
      title: x.replace(/^\#+\s+/, ''),
      priority: x.trim().split(' ')[0].length,
      id: `#${x
        .replace(/^\#+\s+/, '')
        .replace(/\s+/, '-')
        .toLowerCase()}`,
    }))

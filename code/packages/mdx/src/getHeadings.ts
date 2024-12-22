const getTitle = (source: string) => source.replace(/^\#+\s+/, '').replace(/\<.*\>/, ' ')

export const getHeadings = (source: string) =>
  source
    .split('\n')
    .filter((x) => x.startsWith('#'))
    .map((x) => ({
      title: getTitle(x),
      priority: x.trim().split(' ')[0].length,
      id: `#${getTitle(x).replace(/\s+/, '-').toLowerCase()}`,
    }))

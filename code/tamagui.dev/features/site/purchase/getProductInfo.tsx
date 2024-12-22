export function getTakeoutPriceInfo(pricingDescription: string) {
  let discordSeats = 1
  let licenseSeats = 1
  let githubSeats = 1

  const isFirstTier = pricingDescription.toLowerCase().includes('hobby')

  const minMaxMatch = Number(pricingDescription?.match(/.*[0-9]+-([0-9]+) seats.*/i)?.[1])
  // e.g. "Team (10-20 seats)"
  if (minMaxMatch && !Number.isNaN(minMaxMatch)) {
    discordSeats = 4
    licenseSeats = 4
    githubSeats = 2
  }

  // e.g. "Team (+20 seats)"
  const minOnlyMatch = Number(pricingDescription?.match(/.*\+([0-9]+) seats.*/i)?.[1])
  if (minOnlyMatch && !Number.isNaN(minOnlyMatch)) {
    discordSeats = 8
    licenseSeats = 8
    githubSeats = 4
  }

  const hasDiscordPrivateChannels = !isFirstTier

  return {
    discordSeats,
    hasDiscordPrivateChannels,
    licenseSeats,
    githubSeats,
    publicDomainUses: 2,
    androidAppsPublished: 2,
    iosAppsPublished: 2,
  }
}

export function getTakeoutPriceInfo(pricingDescription: string) {
  let discordSeats = 1
  let licenseSeats = 1

  const isFirstTier = pricingDescription.toLowerCase().includes('hobby')

  const minMaxMatch = Number(pricingDescription?.match(/.*[0-9]+-([0-9]+) seats.*/i)?.[1])
  // e.g. "Team (10-20 seats)"
  if (minMaxMatch && !isNaN(minMaxMatch)) {
    discordSeats = minMaxMatch
    licenseSeats = minMaxMatch
  }

  // e.g. "Team (+20 seats)"
  const minOnlyMatch = Number(pricingDescription?.match(/.*\+([0-9]+) seats.*/i)?.[1])
  if (minOnlyMatch && !isNaN(minOnlyMatch)) {
    discordSeats = 50
    licenseSeats = 4
  }

  const hasDiscordPrivateChannels = !isFirstTier

  return {
    discordSeats,
    hasDiscordPrivateChannels,
    licenseSeats,
    githubSeats: Math.max(1, Math.floor(licenseSeats / 5)),
    publicDomainUses: 2,
    androidAppsPublished: 2,
    iosAppsPublished: 2,
  }
}

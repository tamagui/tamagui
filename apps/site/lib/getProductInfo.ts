export function getTakeoutPriceInfo(pricingDescription: string) {
    let discordSeats = 1
    let licenseSeats = 1

    const minMaxMatch = Number(
        pricingDescription?.match(/.*[0-9]+-([0-9]+) seats.*/)?.[1]
    )
    // e.g. "Team (10-20 seats)"
    if (minMaxMatch && !isNaN(minMaxMatch)) {
        discordSeats = minMaxMatch
        licenseSeats = minMaxMatch
    }

    // e.g. "Team (+20 seats)"
    const minOnlyMatch = Number(pricingDescription?.match(/.*\+([0-9]+) seats.*/)?.[1])
    if (minOnlyMatch && !isNaN(minOnlyMatch)) {
        discordSeats = 50
        licenseSeats = Infinity
    }

    const hasDiscordPrivateChannels = discordSeats > 1

    return {
        discordSeats,
        hasDiscordPrivateChannels,
        licenseSeats,
        githubSeats: 1,
        publicDomainUses: Math.ceil(licenseSeats / 9),
        androidAppsPublished: Math.ceil(licenseSeats / 9),
        iosAppsPublished: Math.ceil(licenseSeats / 9),
    }
}
export type GithubSponsorshipStatus =
  | {
      hasSponsorAccess: false
      sponsorshipStatus: 'not-sponsor'
      meta: {
        name: string
        id: string
      }
    }
  | {
      hasSponsorAccess: true
      sponsorshipStatus: 'sponsor'
      meta: {
        name: string
        id: string
      }
      tier: {
        id: string
        name: string
      }
    }
  | {
      hasSponsorAccess: true
      sponsorshipStatus: 'whitelist'
      meta: {
        name: string
        id: string
      }
    }
export type GithubAccessStatus = {
  personal: GithubSponsorshipStatus
  orgs: GithubSponsorshipStatus[]
}
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

// whitelisting uniswap org for feedback
const whitelistOrgs = {
  uniswap: true,
  codingscape: true,
}

export function checkOrgSponsor(orgLogin: string) {
  return whitelistOrgs[orgLogin]
}

const uniswapGithubUsers = [
  'zzmp',
  'moodysalem',
  'ianlapham',
  'crowdin-bot',
  'spenciefy',
  'thomasthachil',
  'vm',
  'tinaszheng',
  'leggechr',
  'danielcolinjames',
  'JFrankfurt',
  'tarikbellamine',
  'cbachmeier',
  'just-toby',
  'adjkant',
  'NoahZinsmeister',
  'lynnshaoyu',
  'JackShort',
  'cartcrom',
  'i1skn',
  'cmcewen',
  'MatiPl01',
  'natew',
  'dalmendray',
  'github-actions[bot]',
  'felipebrahm',
  'callil',
  'clayton1110',
  'grabbou',
  'garysye',
  'chelsywu',
  'jmrossy',
  'haydenadams',
  'andrewting19',
  'Tott0',
  'chikeichan',
  'LunrEclipse',
  'hello-happy-puppy',
  'lint-action',
  'kayleegeorge',
  'kristiehuang',
  'kennyt',
  'gbugyis',
  'PiotrWszolek',
  'erichuang27',
  'pp-hh-ii-ll',
  'dependabot[bot]',
  'lavalamp-',
  'unipadmini',
  'andy-reed',
  'aballerr',
  'willhennessy',
  'brnunes',
  'gnewfield',
  'mczernek',
  'chenxsan',
  'yannie-yip',
  'rossbulat',
  'wojtus7',
  'matteenm',
  'brendanww',
  'PaulRBerg',
  'mirshko',
  'mr-uniswap',
  'Jesse-Sawa',
  'Rachel-Eichenberger',
  'carlosdp',
  'darkwing',
  'brunocrosier',
  'snreynolds',
  'uniyj',
  'YutaSugimura',
  'ChristophSiegenthaler',
  'hav-noms',
  'mattbspector',
  'sarobolket',
  'zhyd1997',
  'willpote',
  'cbd',
  'bkrochta',
  'Sowiedu',
  'justindomingue',
  'artistic709',
  'dy',
  'tpmccallum',
  'tsudmi',
  'julianjca',
  'bgits',
  'badkk',
  'lukedonato',
  'jab416171',
  'hzhu',
  'jochenboesmans',
  'graemeblackwood',
  'moontools-hyperion',
  'eccentricexit',
  'MicahZoltu',
  'CryptoCatVC',
  'wjmelements',
  'brianmcmichael',
]

const codinscapeusers = ['NathanBeesley']

const callstackusers = ['troZee']

export const whitelistBentoUsernames = new Set([
  // team
  'baronha',
  'poteboy',
  'zetavg',
  'anhquan291',

  'Bankilo',
  'meal',
  'Bar-Cet',
  'kamilzielinski97',
  'WeronikaKosniowska',
  'patrycjalobodzinska26',

  // stephen_S
  'Stephen-Song',

  // closedloop:
  'wongk',
  'dakotaodell',
  'dougzor',

  'Aljishi89@gmail.com',

  // JBR
  'mattleesounds',

  // livepeer
  '0xcadams',

  // ibot
  'rbondoc96',
  'MOFFROUGH',
  'Jasonej',
  'erik-perri',
  'NilsDelaguardia',
  'andresvega-sourcetoad',
  'chrisr-st',
  'justinvoelkel',
  'jdmonm',
  'michalm-st',
  'charlesreffett',
  'bradtoad',
  'michal-sourcetoad',
  'jpaz91',

  // aldoMC
  'gusribeiro',
  'guilhermebruzzi',
  'Brunier',
  'jlbovenzo',
  'gtkatakura',
  'gsasouza',
  'thiagokpelo',
  'verhagenkava',

  // RichardTunstall
  'ads102003',
  'FateFirst',

  // iBotPeaches
  'iBotPeaches',

  // shaunn.diamond@outlook.com
  'upp22',

  'pshomov@gmail.com',

  // codingscape
  ...codinscapeusers,
])

export const whitelistGithubUsernames = [
  'natew',
  // 'alitnk', // commented out to test `takeout -> studio` access
  'benschac',
  'mohamadchehab',
  'bidah',
  'szymonrybczak',

  // gather team member - https://discord.com/channels/909986013848412191/1125830682661363794/1156983395566497834
  'pkretzschmar',

  // cooking
  'natalie-zamani',

  // codingscape
  ...codinscapeusers,

  // uniswap:
  ...uniswapGithubUsers,

  // callstack
  ...callstackusers,

  // Triba
  'Awelani-Triba',

  // JBR
  'mattleesounds',

  // michak
  'KristoT',
]

export const checkForSponsorship = async (
  login: string,
  userToken: string
): Promise<GithubAccessStatus> => {
  const orgs = await getOrgs(userToken)
  // const personalStatus = await isLoginSponsor(login)
  // const allOrgsStatus = await Promise.all(
  //   orgs.map(async (org) => {
  //     return {
  //       ...org,
  //       isSponsoring: await isLoginSponsor(org.login),
  //     }
  //   })
  // )
  // const orgsStatus = allOrgsStatus.filter((org) => org.)

  // TODO: can probably do all of these on one github req - see: graphql alias

  const isOrgSponsor = orgs.some((org) => checkOrgSponsor(org.login))

  return {
    personal: await isLoginSponsor(login, isOrgSponsor),
    orgs: await Promise.all(orgs.map(async (org) => isLoginSponsor(org.login))),
  }
}

const isLoginSponsor = async (
  login: string,
  isOrgSponsor = false
): Promise<GithubSponsorshipStatus> => {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: `
      query CheckForSponsorship($sponsorLogin: String!) {
        repositoryOwner(login: $sponsorLogin) {
          ... on Organization {
            id
            name
          }
          ... on User {
            id
            name
          }
          ... on Sponsorable {
            sponsorshipForViewerAsSponsorable(activeOnly: true) {
              tier {
                id
                name
                monthlyPriceInCents
                description
              }
            }
          }
        }
      }
`,
      variables: {
        sponsorLogin: login,
      },
    }),
    headers: {
      Authorization: `bearer ${GITHUB_TOKEN}`,
    },
  })

  const json = await res.json()

  const sponsorId = json.data?.repositoryOwner.id
  const sponsorName = json.data?.repositoryOwner.name
  const isSponsoring = !!json.data?.repositoryOwner?.sponsorshipForViewerAsSponsorable
  const tier = json.data?.repositoryOwner?.sponsorshipForViewerAsSponsorable?.tier

  if (isOrgSponsor || whitelistGithubUsernames.includes(login)) {
    return {
      hasSponsorAccess: true,
      sponsorshipStatus: 'whitelist',
      meta: {
        id: sponsorId,
        name: sponsorName,
      },
    }
  }

  if (isSponsoring) {
    // const tierIncludesStudio: boolean = tier.description.toLowerCase().includes('studio')
    return {
      hasSponsorAccess: true,
      sponsorshipStatus: 'sponsor',
      meta: {
        id: sponsorId,
        name: sponsorName,
      },
      tier: {
        id: tier.id,
        name: tier.name,
      },
    }
  }
  return {
    hasSponsorAccess: false,
    sponsorshipStatus: 'not-sponsor',
    meta: {
      id: sponsorId,
      name: sponsorName,
    },
  }

  // const queueDate = sponsorshipDateMap[tier.id]
  // const queuePermission: boolean = queueDate < new Date()

  // return {
  //   sponsoring: isSponsoring,
  //   studio:
  //     tierIncludesStudio && queuePermission
  //       ? {
  //           access: true,
  //         }
  //       : {
  //           access: false,
  //           accessDate: queueDate,
  //           message: !tierIncludesStudio
  //             ? "Your sponsorship doesn't include Studio access"
  //             : `You are a sponsor but you can't access Studio yet. Upgrade sponsorship tier for earlier access!`,
  //         },
  // }
}

const getOrgs = async (
  token: string
): Promise<{ id: string; login: string; avatarUrl: string; name: string }[]> => {
  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    body: JSON.stringify({
      query: `query GetOrganizations {
      viewer {
        organizations(first: 100) {
          nodes {
            id
            login
            avatarUrl
            name
          }
        }
      }
    }`,
      variables: {},
    }),
    headers: {
      Authorization: `bearer ${token}`,
    },
  })
  const json = await res.json()

  return json?.data?.viewer?.organizations?.nodes ?? []
}

// export const dummy = async () => {
//   const res = await fetch('https://api.github.com/graphql', {
//     method: 'POST',
//     body: JSON.stringify({
//       query: `
//       {
//         viewer {
//           ... on User {
//             id
//             sponsorsListing {
//               tiers (first: 100) {
//                 nodes {
//                   id
//                   name
//                   description
//                 }
//               }
//             }
//           }
//         }
//       }
//     `,
//     }),
//     headers: {
//       Authorization: `bearer ${GITHUB_TOKEN}`,
//     },
//   })

//   return await res.json()
// }

const GITHUB_ADMIN_TOKEN = process.env.GITHUB_ADMIN_TOKEN

/**
 * Add a user to a GitHub team
 * @see https://docs.github.com/en/rest/teams/members?apiVersion=2022-11-28#add-or-update-team-membership-for-a-user
 */
export const addUserToTeam = async (
  teamSlug: string,
  userLogin: string,
  orgName = 'tamagui',
  role: 'member' | 'maintainer' = 'member'
) => {
  console.info(
    `Claim: addUserToTeam adding ${userLogin} to ${orgName}/${teamSlug} with role ${role}`
  )

  try {
    const res = await fetch(
      `https://api.github.com/orgs/${orgName}/teams/${teamSlug}/memberships/${userLogin}`,
      {
        method: 'PUT',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
        body: JSON.stringify({ role }),
      }
    )

    if (!res.ok) {
      const error = await res.text()
      console.error(`Claim: addUserToTeam failed: ${res.status} ${error}`)
      throw new Error(`Failed to add user to team: ${res.status} ${error}`)
    }

    const data = await res.json()
    console.info(`Claim: addUserToTeam succeeded (state: ${data.state})`)
    return data
  } catch (err) {
    console.error(`Claim: addUserToTeam Error: ${err}`)
    throw err
  }
}

/**
 * Remove a user from a GitHub team
 * @see https://docs.github.com/en/rest/teams/members?apiVersion=2022-11-28#remove-team-membership-for-a-user
 */
export const removeUserFromTeam = async (
  teamSlug: string,
  userLogin: string,
  orgName = 'tamagui'
) => {
  console.info(
    `Claim: removeUserFromTeam removing ${userLogin} from ${orgName}/${teamSlug}`
  )

  try {
    const res = await fetch(
      `https://api.github.com/orgs/${orgName}/teams/${teamSlug}/memberships/${userLogin}`,
      {
        method: 'DELETE',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    )

    if (res.status === 204) {
      console.info(`Claim: removeUserFromTeam succeeded`)
    } else if (res.status === 404) {
      console.info(`Claim: removeUserFromTeam user was not a member`)
    } else {
      const error = await res.text()
      console.error(`Claim: removeUserFromTeam failed: ${res.status} ${error}`)
      throw new Error(`Failed to remove user from team: ${res.status} ${error}`)
    }
  } catch (err) {
    console.error(`Claim: removeUserFromTeam Error: ${err}`)
    throw err
  }
}

/**
 * Check if a user is a member of a GitHub team
 * @see https://docs.github.com/en/rest/teams/members?apiVersion=2022-11-28#get-team-membership-for-a-user
 */
export const checkIfUserIsTeamMember = async (
  teamSlug: string,
  userLogin: string,
  orgName = 'tamagui'
): Promise<{
  isMember: boolean
  state?: 'active' | 'pending'
  role?: 'member' | 'maintainer'
}> => {
  console.info(`Checking if ${userLogin} is a member of ${orgName}/${teamSlug}`)

  try {
    const res = await fetch(
      `https://api.github.com/orgs/${orgName}/teams/${teamSlug}/memberships/${userLogin}`,
      {
        method: 'GET',
        headers: {
          Accept: 'application/vnd.github+json',
          Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
          'X-GitHub-Api-Version': '2022-11-28',
        },
      }
    )

    if (res.status === 200) {
      const data = await res.json()
      console.info(`${userLogin} is a member of ${teamSlug} (state: ${data.state})`)
      return {
        isMember: true,
        state: data.state,
        role: data.role,
      }
    } else if (res.status === 404) {
      console.info(`${userLogin} is not a member of ${teamSlug}`)
      return { isMember: false }
    } else {
      const errorData = await res.json().catch(() => ({}))
      console.error(
        `Error checking team membership: ${res.status} ${res.statusText}`,
        errorData
      )
      return { isMember: false }
    }
  } catch (err) {
    console.error(`Error checking if user is team member: ${err}`)
    return { isMember: false }
  }
}

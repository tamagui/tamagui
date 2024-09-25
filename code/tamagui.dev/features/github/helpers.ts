import { getOctokit } from '~/features/github/octokit'

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
 * https://docs.github.com/en/rest/collaborators/collaborators?apiVersion=2022-11-28#add-a-repository-collaborator
 */
export const inviteCollaboratorToRepo = async (
  repoName: string,
  userLogin: string,
  permission = 'pull'
) => {
  console.info(
    `Claim: inviteCollaboratorToRepo permission ${permission} for ${repoName} user ${userLogin} using token starting with ${GITHUB_ADMIN_TOKEN?.slice(
      0,
      5
    )}`
  )

  try {
    const octokit = await getOctokit()
    octokit.rest.repos.addCollaborator({
      owner: 'tamagui',
      repo: repoName,
      username: userLogin,
      permission,
    })

    console.info(`Claim: inviteCollaboratorToRepo succeeded`)
  } catch (err) {
    console.error(`Claim: inviteCollaboratorToRepo Error: ${err}`)
    throw err
  }
}

export const removeCollaboratorFromRepo = async (repoName: string, userLogin: string) => {
  await fetch(
    `https://api.github.com/repos/tamagui/${repoName}/collaborators/${userLogin}`,
    {
      method: 'DELETE',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
      },
    }
  )
}

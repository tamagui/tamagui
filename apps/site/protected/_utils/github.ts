export type GithubSponsorshipStatus =
  | {
      isSponsoring: false
      meta: {
        name: string
        id: string
      }
    }
  | {
      isSponsoring: true
      meta: {
        name: string
        id: string
      }
      tier: {
        id: string
        name: string
      }
    }
export type GithubAccessStatus = {
  personal: GithubSponsorshipStatus
  orgs: GithubSponsorshipStatus[]
}
const GITHUB_TOKEN = process.env.GITHUB_TOKEN

export const checkForSponsorship = async (
  login: string,
  userToken: string
): Promise<GithubAccessStatus> => {
  const orgs = await getOrgs(userToken)
  // const personalStatus = await isLo`ginSponsor(login)
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
  return {
    personal: await isLoginSponsor(login),
    orgs: await Promise.all(orgs.map(async (org) => isLoginSponsor(org.login))),
  }
}

const isLoginSponsor = async (login: string): Promise<GithubSponsorshipStatus> => {
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

  // if (new Date() > nonSponsorDate) {
  //   return {
  //     isSponsoring,
  //     studio: {
  //       access: true,
  //     },
  //     tierId: tier?.id,
  //   }
  // }
  // if (!tier) {
  //   return {

  //     isSponsoring,
  //     studio: {
  //       access: false,
  //       accessDate: nonSponsorDate,
  //       message: `You don't have a sponsorship. Sponsor to get early access!`,
  //     },
  //   }
  // }

  if (isSponsoring) {
    // const tierIncludesStudio: boolean = tier.description.toLowerCase().includes('studio')
    return {
      isSponsoring,
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
    isSponsoring: false,
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

  return json.data.viewer.organizations.nodes
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
  permission = 'triage'
) => {
  await fetch(
    `https://api.github.com/repos/tamagui/${repoName}/collaborators/${userLogin}`,
    {
      body: JSON.stringify({
        permission,
      }),
      method: 'PUT',
      headers: {
        'X-GitHub-Api-Version': '2022-11-28',
        Authorization: `Bearer ${GITHUB_ADMIN_TOKEN}`,
      },
    }
  )
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

import { NextApiHandler } from 'next'

const handler: NextApiHandler = (req, res) => {
  res.json({
    $schema: 'http://json-schema.org/draft-07/schema#',
    title: 'Schema for takeout GitHub app',
    type: 'object',
    properties: {
      updateBot: {
        type: 'object',
        properties: {
          sendPullRequests: {
            type: 'boolean',
            description: 'whether or not to send pull requests',
          },
          pullRequestBranch: {
            type: 'string',
            description: 'the branch to send PRs to',
          },
          committer: {
            type: 'object',
            description: 'customize the committer of update commits',
            properties: {
              email: {
                type: 'string',
              },
              name: {
                type: 'string',
              },
            },
          },
        },
      },
    },
    required: ['updateBot'],
  })
}

export default handler

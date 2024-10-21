import { db } from './connection'
import { users, posts, follows, likes, reposts, replies } from './schema'
import { faker } from '@faker-js/faker'

const USER_COUNT = 10
const POST_COUNT_PER_USER = 10
const REPLY_COUNT_PER_POST = 2.5
const FOLLOW_COUNT_PER_USER = 7.5
const LIKE_COUNT_PER_USER = 20
const REPOST_COUNT_PER_USER = 4

const userNames = [
  'SomeRandomDevWeb',
  'Floren Ryance',
  'PrimeRageN',
  'bramadov 22',
  'CodeWarrior',
  'RustEvangelist',
  'AdrenalineCoder',
  'JSFrameworkFanatic',
  'DebuggingDetective',
  'VimGuru',
  'DuckDebugger',
  'ChangeChampion',
  // Additional names to reach 100 users
  'ByteMaster',
  'SyntaxSage',
  'DevNinja',
  'BugHunter',
  'PixelPioneer',
  'DataDiva',
  'CloudCrusader',
  'APIWizard',
  'GitGuru',
  'FrontEndPhenom',
  'BackEndBoss',
  'FullStackFanatic',
  'AIEnthusiast',
  'BlockchainBeliver',
  'CSSWizard',
  'DevOpsDestroyer',
  'DatabaseDiva',
  'SecuritySage',
  'UXUnicorn',
  'MobileMaestro',
  'CloudCommander',
  'MLMaverick',
  'IoTInnovator',
  'ScalabilityScientist',
  'AgileAdvocate',
  'CodeClinic',
  'BugBountyHunter',
  'PenTesterPro',
  'EthicalHacker',
  'DataScientist',
  'QuantumCoder',
  'RoboticsRenegade',
  'VRVirtuoso',
  'ARArchitect',
  'GameDevGuru',
  'CryptoCodeCracker',
  'JavaJedi',
  'PythonPioneer',
  'RubyRockstar',
  'GoGopher',
  'SwiftSavant',
  'KotlinKing',
  'TypeScriptTitan',
  'PHPPhenom',
  'CSharpChampion',
  'ScalaScientist',
  'RustRenegade',
  'ClojureCleric',
  'HaskellHero',
  'ElixirExpert',
  'DartDeveloper',
  'LuaLuminary',
  'JuliaJuggler',
  'ErlangEngineer',
  'FortranFanatic',
  'COBOLCoder',
  'AssemblyAce',
  'BrainfuckBoss',
  'SQLSorcerer',
  'NoSQLNinja',
  'GraphQLGuru',
  'RESTfulRanger',
  'WebSocketWizard',
  'OAuth2Oracle',
  'JWTJedi',
  'DockerDiva',
  'KubernetesKing',
  'TerraformTitan',
  'AnsibleAce',
  'JenkinsGenius',
  'GitLabGladiator',
  'CircleCISage',
  'TravisTrooper',
  'SonarQubeSorcerer',
  'SeleniumSensei',
  'CypressChampion',
  'JestJuggler',
  'MochaMatador',
  'KarmaKing',
  'WebpackWarrior',
  'GulpGladiator',
  'GruntGuru',
  'NPMNinja',
  'YarnYogi',
  'BabelBoss',
  'ESLintExpert',
  'PrettierPro',
  'StylelintStar',
  'SassySorcerer',
  'LessLegend',
]

type Topic = {
  subject: string
  quirk: string
}

const topics: Topic[] = [
  {
    subject: 'Responsive design',
    quirk: 'spending more time adjusting margins than coding actual features',
  },
  { subject: 'AI-driven development', quirk: 'realizing the AI writes better comments than I do' },
  {
    subject: 'Cross-browser compatibility',
    quirk: 'feeling nostalgic for the days when we only had to support one browser',
  },
  { subject: 'React', quirk: 'creating 47 components for a simple landing page' },
  { subject: 'Dark mode', quirk: 'accidentally designing for light mode at 3 AM' },
  {
    subject: 'Progressive Web Apps',
    quirk: "explaining to my mom that it's not a 'real' app, but also not just a website",
  },
  {
    subject: 'Cross-platform development',
    quirk: 'celebrating when it works on two platforms out of five',
  },
  {
    subject: 'Serverless architecture',
    quirk: 'missing the days when I could blame the server for everything',
  },
  {
    subject: 'Content personalization',
    quirk: 'realizing the algorithm knows me better than I know myself',
  },
  {
    subject: 'Voice search optimization',
    quirk: "talking to my code hoping it'll understand me better",
  },
  { subject: 'JavaScript frameworks', quirk: 'learning a new one every time I start a project' },
  { subject: 'CSS-in-JS', quirk: 'forgetting where I put that one crucial style' },
  { subject: 'WebAssembly', quirk: 'pretending I understand how it works' },
  {
    subject: 'Microservices',
    quirk: 'drawing so many boxes and arrows that my architecture diagram looks like abstract art',
  },
  { subject: 'GraphQL', quirk: 'over-fetching data out of habit anyway' },
  {
    subject: 'Agile development',
    quirk: "turning 'it's not a bug, it's a feature' into a lifestyle",
  },
  {
    subject: 'TypeScript',
    quirk: 'feeling smug about catching a type error, then spending hours fixing it',
  },
  { subject: 'Web3', quirk: 'nodding along in meetings while secretly Googling what it means' },
  {
    subject: 'Low-code platforms',
    quirk: 'spending more time customizing than I would have spent coding',
  },
  { subject: 'Code reviews', quirk: 'leaving comments on my own PR because no one else will' },
]

const formats: string[] = [
  "Embracing {subject} means {quirk}. It's not much, but it's honest work. {hashtag}",
  "They said {subject} would be fun. They didn't mention {quirk}. Still, I'm having a blast! {hashtag}",
  'My love letter to {subject}: Roses are red, violets are blue, {quirk}, and I still love you. {hashtag}',
  'Day 47 of {subject}: {quirk}. Send help... or coffee. {hashtag}',
  'Pro tip: Master {subject} by {quirk}. Works 60% of the time, every time. {hashtag}',
  'In my {subject} era: {quirk} and loving every minute of it. {hashtag}',
  "Confession: I thought {subject} would cure my imposter syndrome. Now I'm just {quirk}. Progress? {hashtag}",
  '{subject} has taught me that {quirk} is a valuable life skill. Thanks, I guess? {hashtag}',
  'My {subject} journey: 10% inspiration, 90% {quirk}. {hashtag}',
  "Plot twist: {subject} isn't about coding, it's about {quirk}. Mind blown. {hashtag}",
  'Dear future self, remember when {subject} meant {quirk}? Good times. {hashtag}',
  'Breaking: Local developer finds joy in {subject}. Sources confirm {quirk} is involved. {hashtag}',
  "To all my {subject} folks out there {quirk}, you're not alone. We're in this together! {hashtag}",
  'TIL that {subject} is less about syntax and more about {quirk}. The more you know! {hashtag}',
  "Me: I'm a {subject} expert. Also me: {quirk}. Fake it till you make it, right? {hashtag}",
]

const hashtags: string[] = [
  '#WebDevLife',
  '#CodeHumor',
  '#DevProblems',
  '#ProgrammerHumor',
  '#TechLife',
  '#DeveloperProblems',
  '#CodeNewbie',
  '#SoftwareEngineering',
  '#WebDevelopment',
  '#DevJokes',
]

const replyTemplates = [
  'Have you tried turning it off and on again? #TechSupport101',
  "Ah, I see you've played {subject}y-spoon before!",
  "This is why we can't have nice things in {subject}.",
  'I feel personally attacked by this relatable {subject} content.',
  '{quirk}? Story of my life! #DeveloperProblems',
  "I'm in this tweet and I don't like it. #TooReal",
  'Plot twist: {quirk} is actually a feature, not a bug!',
  'Wait, you guys are getting {subject} to work?',
  'Me, reading about {subject}: I know some of these words!',
  '*Laughs nervously in {subject}*',
  'Bold of you to assume I understand {subject} at all.',
  '{quirk} is my middle name! ...Unfortunately.',
  'Ah yes, {subject}, my old nemesis, we meet again.',
  'This tweet is brought to you by {quirk} gang.',
  "I didn't choose the {subject} life, the {subject} life chose me.",
]

function generatePostContent(topic: Topic): string {
  const format = formats[Math.floor(Math.random() * formats.length)]
  const hashtag = hashtags[Math.floor(Math.random() * hashtags.length)]

  return format
    .replace('{subject}', topic.subject)
    .replace('{quirk}', topic.quirk)
    .replace('{hashtag}', hashtag)
}

function generateReply(topic: Topic): string {
  const template = replyTemplates[Math.floor(Math.random() * replyTemplates.length)]

  return template.replace('{subject}', topic.subject).replace('{quirk}', topic.quirk)
}

const seed = async () => {
  try {
    console.info('Starting the seeding process...')

    // Clear existing data
    console.info('Clearing existing data...')
    await db.transaction(async (trx) => {
      await trx.delete(replies)
      await trx.delete(reposts)
      await trx.delete(likes)
      await trx.delete(follows)
      await trx.delete(posts)
      await trx.delete(users)
    })
    console.info('Existing data cleared.')

    // Insert users
    const randomizedUserCount = Math.round(USER_COUNT * (0.8 + Math.random() * 0.4))
    console.info(`Generating ${randomizedUserCount} users with random names...`)
    const userIds = await insertUsers(randomizedUserCount)
    console.info(`${userIds.length} users generated.`)

    // Insert posts
    console.info('Generating posts...')
    await generatePosts(userIds)
    console.info('Posts generation completed.')

    // Fetch all post IDs
    const allPostIds = await db.select({ id: posts.id }).from(posts)
    console.info(`${allPostIds.length} posts fetched.`)

    // Insert replies
    console.info('Generating replies...')
    await generateReplies(userIds, allPostIds)
    console.info('Replies generation completed.')

    // Insert follows
    console.info('Generating follows...')
    await generateFollows(userIds)
    console.info('Follows generation completed.')

    // Insert likes
    console.info('Generating likes...')
    await generateLikes(userIds, allPostIds)
    console.info('Likes generation completed.')

    // Insert reposts
    console.info('Generating reposts...')
    await generateReposts(userIds, allPostIds)
    console.info('Reposts generation completed.')

    console.info('Seeding completed successfully.')
    process.exit(0)
  } catch (error) {
    console.error('Error seeding data:', error)
    process.exit(1)
  }
}

async function insertUsers(count: number) {
  const selectedUserNames = faker.helpers.arrayElements(userNames, count)
  console.time('insertUsers')
  const userIds: { id: number }[] = await db.transaction(async (trx) => {
    return trx
      .insert(users)
      .values(
        selectedUserNames.map((name) => ({
          username: name,
          email: `${name.toLowerCase().replace(/\s+/g, '.')}@example.com`,
          passwordHash: faker.internet.password(),
          avatarUrl: `https://i.pravatar.cc/150?u=${name}`,
        }))
      )
      .returning({ id: users.id })
  })
  console.timeEnd('insertUsers')
  return userIds
}

async function generatePosts(userIds: { id: number }[]) {
  console.time('generatePosts')
  for (const user of userIds) {
    const randomizedPostCount = Math.round(POST_COUNT_PER_USER * (0.8 + Math.random() * 0.4))
    for (let i = 0; i < randomizedPostCount; i++) {
      try {
        const topic = topics[Math.floor(Math.random() * topics.length)]
        const postContent = generatePostContent(topic)

        await db.insert(posts).values({
          userId: user.id,
          content: postContent,
          createdAt: faker.date.recent({ days: 1 }),
        })
      } catch (error) {
        console.error(`Failed to insert post for user ${user.id}:`, error)
      }
    }
  }
  console.timeEnd('generatePosts')
}

async function generateReplies(userIds: { id: number }[], allPostIds: { id: number }[]) {
  console.time('generateReplies')
  for (const post of allPostIds) {
    const randomizedReplyCount = Math.round(REPLY_COUNT_PER_POST * (0.8 + Math.random() * 0.4))
    for (let j = 0; j < randomizedReplyCount; j++) {
      try {
        const replyingUser = userIds[Math.floor(Math.random() * userIds.length)]
        const topic = topics[Math.floor(Math.random() * topics.length)]
        await db.insert(replies).values({
          userId: replyingUser.id,
          postId: post.id,
          content: generateReply(topic),
          createdAt: faker.date.recent({ days: 1 }),
        })
      } catch (error) {
        console.error(`Failed to insert reply for post ${post.id}:`, error)
      }
    }
  }
  console.timeEnd('generateReplies')
}

async function generateFollows(userIds: { id: number }[]) {
  console.time('generateFollows')
  for (const follower of userIds) {
    const randomizedFollowCount = Math.round(FOLLOW_COUNT_PER_USER * (0.8 + Math.random() * 0.4))
    const followingIds = faker.helpers.arrayElements(
      userIds.filter((user) => user.id !== follower.id),
      Math.min(randomizedFollowCount, userIds.length - 1)
    )
    for (const following of followingIds) {
      try {
        await db.insert(follows).values({
          followerId: follower.id,
          followingId: following.id,
          createdAt: faker.date.recent({ days: 1 }),
        })
      } catch (error) {
        console.error(
          `Failed to insert follow relationship (${follower.id} -> ${following.id}):`,
          error
        )
      }
    }
  }
  console.timeEnd('generateFollows')
}

async function generateLikes(userIds: { id: number }[], allPostIds: { id: number }[]) {
  console.time('generateLikes')
  for (const user of userIds) {
    const postIds = faker.helpers.arrayElements(
      allPostIds,
      Math.min(LIKE_COUNT_PER_USER, allPostIds.length)
    )
    for (const post of postIds) {
      try {
        await db.insert(likes).values({
          userId: user.id,
          postId: post.id,
          createdAt: faker.date.recent({ days: 1 }),
        })
      } catch (error) {
        console.error(`Failed to insert like (user ${user.id}, post ${post.id}):`, error)
      }
    }
  }
  console.timeEnd('generateLikes')
}

async function generateReposts(userIds: { id: number }[], allPostIds: { id: number }[]) {
  console.time('generateReposts')
  const allPostsWithUsers: {
    id: number
    userId: number
  }[] = await db.select({ id: posts.id, userId: posts.userId }).from(posts)
  for (const user of userIds) {
    // This code selects random posts for a user to repost
    // It filters out the user's own posts to avoid self-reposts
    // The number of reposts is limited by REPOST_COUNT_PER_USER or the total available posts
    const postIds = faker.helpers.arrayElements(
      allPostsWithUsers.filter((post) => post.userId !== user.id),
      Math.min(REPOST_COUNT_PER_USER, allPostsWithUsers.length)
    )
    for (const post of postIds) {
      try {
        await db.insert(reposts).values({
          userId: user.id,
          postId: post.id,
          createdAt: faker.date.recent({ days: 1 }),
        })
      } catch (error) {
        console.error(`Failed to insert repost (user ${user.id}, post ${post.id}):`, error)
      }
    }
  }
  console.timeEnd('generateReposts')
}

seed()

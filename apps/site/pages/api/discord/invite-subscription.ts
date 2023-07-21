import { Client, GatewayIntentBits } from '@discordjs/core'
import { REST } from '@discordjs/rest'
import { WebSocketManager } from '@discordjs/ws'
import { NextApiHandler } from 'next'

const token = process.env.DISCORD_BOT_TOKEN!
const TAKEOUT_ROLE_ID = '1131082601600385125'
const GUILD_ID = '909986013848412191'
const PARENT_ID = '1131249991256657950' // group id
// Create REST and WebSocket managers directly
const rest = new REST({ version: '10' }).setToken(token)
console.log(token)

const gateway = new WebSocketManager({
  token: token,
  intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
  rest,
})

// Create a client to emit relevant events.
const client = new Client({ rest, gateway })

const handler: NextApiHandler = async (req, res) => {
  // const response = await client.api.guilds.addRoleToMember('', '', '')
  // const response = await client.api.guilds.createRole(GUILD_ID, '105791678228512768', '1088175368827064400')
  // const response = await client.api.guilds.createRole(GUILD_ID, {
  //   name: 'test from bot',
  // })
  // const response = await client.api.guilds.addRoleToMember(GUILD_ID, '105791678228512768', '1131082605052301403')
  // const response = await client.api.guilds.removeRoleFromMember(GUILD_ID, '105791678228512768', '1131082605052301403')
  // const response = await client.api.guilds.getRoles(GUILD_ID)
  // const response = await client.api.guilds.deleteRole(GUILD_ID, TAKEOUT_ROLE_ID)
  // const response = await client.api.guilds.createChannel(GUILD_ID, {
  //   name: 'hey',
  //   type: 0,
  //   parent_id: PARENT_ID,
  // })
  // res.json({ done: response })
}

export default handler

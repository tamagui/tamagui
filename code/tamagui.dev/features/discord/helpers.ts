import { Client, GatewayIntentBits } from '@discordjs/core'
import { REST } from '@discordjs/rest'
import { WebSocketManager } from '@discordjs/ws'

export const TAKEOUT_ROLE_ID = '1131082605052301403'
export const TAMAGUI_DISCORD_GUILD_ID = '909986013848412191'
export const TAKEOUT_GROUP_ID = '1131249991256657950' // group id
export const DEFAULT_ROLE_ID = '909986013848412191' // @everyone

export const getDiscordClient = async () => {
  const token = process.env.DISCORD_BOT_TOKEN!

  const rest = new REST({ version: '10' }).setToken(token)

  const gateway = new WebSocketManager({
    token: token,
    intents: GatewayIntentBits.GuildMessages | GatewayIntentBits.MessageContent,
    rest,
  })

  // Create a client to emit relevant events.
  const discordClient = new Client({ rest, gateway })

  return discordClient
}

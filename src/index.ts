import {GatewayIntentBits , Client, Events} from 'discord.js';

import {token} from './config.json';

import commands from './commands';

const client = new Client({
  intents: [
    [
      GatewayIntentBits .Guilds,
      GatewayIntentBits .GuildMessages,
      GatewayIntentBits.MessageContent,
      GatewayIntentBits .GuildVoiceStates,
    ],
  ],
});

client.once(Events.ClientReady, async () => {
  console.log('Bot Ready!');
});

client.on(Events.MessageCreate, async message => {
  commands(message);
});

client.login(token);

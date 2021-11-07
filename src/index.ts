import {Intents, Client} from 'discord.js';

import {token} from './config.json';

import commands from './commands';

const client = new Client({
  intents: [
    [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  ],
});

client.on('ready', async () => {
  console.log('Bot Ready!');
});

client.on('messageCreate', async message => {
  commands(message);
});

client.login(token);

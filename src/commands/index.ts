import {Message} from 'discord.js';
import {prefix} from '../config.json';
import {IQueueItem} from '../interfaces/queue';

import play from './play';
import ping from './ping';
import skip from './skip';
import pause from './pause';
import queueCmd from './queue';
import {createAudioPlayer} from '@discordjs/voice';

const queue = new Map<string, IQueueItem>();
const player = createAudioPlayer();

const commands = [play, ping, skip, pause, queueCmd];

const global = {
  queue,
  player,
};

export default (message: Message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift()!.toLowerCase();

  if (command) {
    commands.forEach(cmd => {
      if (
        cmd.name == command ||
        (cmd.aliases && cmd.aliases.includes(command))
      ) {
        cmd.run(message, args, global);
      }
    });
  }
};

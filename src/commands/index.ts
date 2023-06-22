import {Message} from 'discord.js';
import {prefix} from '../config.json';
import {IQueueItem} from '../interfaces/queue';

import play from './play';
import ping from './ping';
import skip from './skip';
import pause from './pause';
import queueCmd from './queue';
import leave from './leave';
import {createAudioPlayer} from '@discordjs/voice';
import replyMessage from '../utils/replyMessage';

const queue = new Map<string, IQueueItem>();
const player = createAudioPlayer();

const commands = [play, ping, skip, pause, queueCmd, leave];

const global = {
  queue,
  player,
};

function isRollingAJoint() : boolean {
  const randomNumber = Math.random();
  return randomNumber < 0.1;
}

export default (message: Message) => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  if(isRollingAJoint()) {
    replyMessage(message, 'Foi mal, to bolando um, já volto! 🍁', false);
    return;
  }

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

import {Message} from 'discord.js';
import {IQueueItem} from '../interfaces/queue';
import global from '../interfaces/global';

export default {
  name: 'skip',
  description: 'Skip current track',
  aliases: [''],
  run: command,
};

function command(message: Message, args: string[], {queue, player}: global) {
  player.stop();
  message.reply('Skiped!');
}

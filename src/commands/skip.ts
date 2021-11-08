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
  if (!message.member?.voice.channel) {
    message.channel
      .send(`Mas tu n ta nem num chat de voz doido!`)
      .then(message => setTimeout(() => message.delete(), 5000));
  }

  player.stop();
  message.react('🆗');
}

import {Message} from 'discord.js';

export default {
  name: 'pause',
  description: 'Pause current track',
  aliases: [''],
  run: command,
};

function command(message: Message, args: string[]) {
  message.reply('Pause Not yet implemented!');
}

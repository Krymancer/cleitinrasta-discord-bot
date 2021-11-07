import {Message} from 'discord.js';

export default {
  name: 'ping',
  description: 'Reply ping!',
  aliases: [''],
  run: command,
};

function command(message: Message, args: string[]) {
  message.channel.send('Pong!');
}

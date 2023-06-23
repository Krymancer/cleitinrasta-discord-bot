import {Message} from 'discord.js';

export default {
  name: 'ping',
  description: 'Reply ping!',
  aliases: [''],
  run: command,
};

function command(message: Message) {
  message.channel.send('Pong!');
}

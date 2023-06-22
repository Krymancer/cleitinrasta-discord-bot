import {Message} from 'discord.js';
import global from '../interfaces/global'

export default {
  name: 'leave',
  description: 'Leave voice channel',
  aliases: [''],
  run: command,
};

function command(message: Message, args: string[], {queue, player}: global) {
  if (!message.member?.voice.channel) {
    message.channel
      .send(`Mas tu n ta nem num chat de voz doido!`)
      .then(message => setTimeout(() => message.delete(), 5000));
      return;
  }

  const server_queue = queue.get(message.guild!.id);

  if (server_queue) {
    if (!server_queue.connection) {
      message.channel
      .send(`Mas eu não to num canal de voz doido!`)
      .then(message => setTimeout(() => message.delete(), 5000));
    }

    server_queue.connection?.disconnect();
    queue.delete(message.guild!.id);
    message.channel
    .send(`To dando o fora daqui taligado mermão!`)
    .then(message => setTimeout(() => message.delete(), 5000));
    message.react('🆗');
  } else {
    message.channel
      .send(`Mas eu não to num canal de voz doido!`)
      .then(message => setTimeout(() => message.delete(), 5000));
  }
}

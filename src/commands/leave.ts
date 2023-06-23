import {Message} from 'discord.js';
import BotContext from '../interfaces/botContext'
import replyMessage from '../utils/replyMessage';

export default {
  name: 'leave',
  description: 'Leave voice channel',
  aliases: ['l'],
  run: command,
};

function command(message: Message, args: string[], {queue}: BotContext) {
  if (!message.member?.voice.channel) {
      replyMessage(message, 'Mas tu n ta nem num chat de voz doido!', false);
      return;
  }

  const server_queue = queue.get(message.guild!.id);

  if (server_queue) {
    if (!server_queue.connection) {
      replyMessage(message, 'Mas eu não to num canal de voz doido!', false);
      return;
    }

    server_queue.connection?.disconnect();
    queue.delete(message.guild!.id);
    replyMessage(message, 'To dando o fora daqui taligado mermão!', true);
    
  } else {
    replyMessage(message, 'Mas eu não to num canal de voz doido!', false);
  }
}

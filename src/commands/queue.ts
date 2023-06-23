import {Message} from 'discord.js';

import BotContext from '../interfaces/botContext';

export default {
  name: 'queue',
  description: 'Reply ping!',
  aliases: ['q'],
  run: command,
};

function command(
  message: Message,
  args: string[],
  {queue}: BotContext
): void {
  const server_queue = queue.get(message.guild!.id);

  if(args.length > 0) {
    const arg = args[0];

    if(arg === 'clear') {
      server_queue?.songs.splice(1);
      message.channel.send('Fila limpa! 🧹')
      .then(message => setTimeout(() => message.delete(), 5000));
      message.react('✅').catch(console.error);
      return;
    } else {
      message.channel.send('Comando invalido! 🤬')
      .then(message => setTimeout(() => message.delete(), 5000));
      message.react('❌').catch(console.error);
      return;
    }
  }

  if (server_queue) {
    const songs = server_queue.songs;
    if (songs.length > 0) {
      
      let queueContent = '```';
      songs.forEach((song, index) => {
        queueContent += `${index + 1} - ${song.title}\n`;
      });
      queueContent += '```';

      message.channel.send(queueContent);
      message.react('✅').catch(console.error);
    } else {
      message.channel.send('Sem musicas na fila! 😥')
      .then(message => setTimeout(() => message.delete(), 5000));
      message.react('❌').catch(console.error);
    }
  } else {
    message.channel.send(
      'Sem fila nesse servidor 😥, use o commando play pra debochar legal! 😎'
    )
    .then(message => setTimeout(() => message.delete(), 5000));
    message.react('❌').catch(console.error);
  }
}

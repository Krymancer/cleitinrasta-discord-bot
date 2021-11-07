import {Message} from 'discord.js';
import {IQueueItem} from '../interfaces/queue';

import global from '../interfaces/global';

export default {
  name: 'queue',
  description: 'Reply ping!',
  aliases: ['q'],
  run: command,
};

function command(
  message: Message,
  args: string[],
  {queue, player}: global
): void {
  const server_queue = queue.get(message.guild!.id);

  if (server_queue) {
    const songs = server_queue.songs;
    if (songs.length > 0) {
      songs.forEach((song, index) => {
        message.channel.send(`${index} - ${song.title}`);
      });
    } else {
      message.channel.send('Sem musicas na fila!');
    }
  } else {
    message.channel.send(
      'Sem fila nesse servidor, use o commando play pra começar a festa!'
    );
  }
}

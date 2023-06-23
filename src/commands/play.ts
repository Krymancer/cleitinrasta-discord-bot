import {Message} from 'discord.js';
import {
  AudioPlayerStatus
} from '@discordjs/voice';
import {IQueueItem} from '../interfaces/queue';
import BotContext from '../interfaces/botContext';
import getVideo from '../utils/getVideo';
import replyMessage from '../utils/replyMessage';
import musicPlayer from '../utils/musicPlayer';
import getConnection from '../utils/getConnection';

export default {
  name: 'play',
  description: 'Play an youtube video in current voice channel',
  aliases: ['p'],
  run: command,
};

async function command(
  message: Message,
  args: string[],
  {queue, player}: BotContext
) {
  if (!args.length) {
    if (player.state.status === AudioPlayerStatus.Paused) {
      player.unpause();
      message.react('▶️');
      return;
    }else if (player.state.status === AudioPlayerStatus.Playing) {
      player.pause();
      message.react('⏸️');
      return;
    }

    replyMessage(message, 'Tenho 2 bola e nenhuma é de cristal, fala ai o nome da musica arrombado', false);
    return;
  }

  const voiceChannel = message.member!.voice.channel;

  if(!voiceChannel) {
    replyMessage(message, 'Mas tu n ta nem num chat de voz corno 😡!', false);
    return;
  }

  const textChannel = message.channel;

  const server_queue = queue.get(message.guild!.id);

  let song = await getVideo(message, args);

  if(!song) {
    replyMessage(message, 'Não tenho o CD dessa musica ai não 💽', false);
    return;
  }

  if(server_queue) {
    // Already have a queue for this server
    server_queue!.songs.push(song!);
    replyMessage(message, `👍 **${song!.title}** Adicionada a fila!`, true);
    return;
  }

  // Create a new queue for this server
  const queueItem: IQueueItem = {
    voiceChannel: voiceChannel,
    textChannel: textChannel,
    connection: null,
    songs: [],
  };

  queueItem.songs.push(song);
  queue.set(message.guild!.id, queueItem);
  queueItem.connection  = getConnection(voiceChannel);
  queueItem.connection!.subscribe(player);

  player.on('stateChange', (oldState, newState) => {
    if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
      queueItem.songs.shift();
      musicPlayer(message.guild!, player, queue);
    }
  });

  musicPlayer(message.guild!, player, queue);

  message.react('✅').catch(console.error);
}
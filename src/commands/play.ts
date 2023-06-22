import {Guild, Message, VoiceChannel} from 'discord.js';
import {
  AudioPlayer,
  AudioPlayerStatus
} from '@discordjs/voice';
import {IQueueItem} from '../interfaces/queue';
import {ISong} from '../interfaces/song';
import global from '../interfaces/global';
import getVideo from '../utils/getVideo';
import playTrack from '../utils/playTrack';
import replyMessage from '../utils/replyMessage';

export default {
  name: 'play',
  description: 'Play an youtube video in current voice channel',
  aliases: ['p'],
  run: command,
};

async function command(
  message: Message,
  args: string[],
  {queue, player}: global
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

  const voiceChannel = message.member?.voice.channel as VoiceChannel;
  const textChannel = message.channel;
  const server_queue = queue.get(message.guild!.id);

  let song = await getVideo(message, args);

  if (!server_queue && song && message.guild) {
    const queueItem: IQueueItem = {
      voiceChannel: voiceChannel,
      textChannel: textChannel,
      connection: null,
      songs: [],
    };

    queue.set(message.guild?.id, queueItem);
    queueItem.songs.push(song);

    if (voiceChannel) {
      try {
        if (!song.url) {
          return;
        }
        queueItem.connection = playTrack(song.url, voiceChannel, player);
        musicPlayer(
          message.guild,
          queueItem.songs[0],
          queueItem,
          player,
          queue
        );
      } catch (error) {
        console.error('Error:', error);
      }
      message.react('✅').catch(console.error);
    } else {
      replyMessage(message, 'Entra no chat de voz ai corno! 😡', false);
    }
  } else {
    server_queue!.songs.push(song!);
    replyMessage(message, `👍 **${song!.title}** Adicionada a fila!`, true);
    return;
  }
}

export function musicPlayer(
  guild: Guild,
  song: ISong,
  songQueue: IQueueItem,
  player: AudioPlayer,
  queue: Map<string, IQueueItem>
) {
  if (!song) {
    console.log('No more songs to play');
    queue.delete(guild.id);
    return;
  }

  playTrack(songQueue.songs[0].url, songQueue.voiceChannel, player);
  player.on('stateChange', (oldState, newState) => {
    console.log(
      `player status chaged from ${oldState.status} to ${newState.status}`
    );
    if (oldState.status === AudioPlayerStatus.Playing && newState.status === AudioPlayerStatus.Idle) {
      console.log('Finished playing the song');
      songQueue.songs.shift();
      musicPlayer(guild, songQueue.songs[0], songQueue, player, queue);
    }
  });

  player.on('error', error => {
    console.error('Player error: ', error);
    player.stop();
  });

  songQueue.textChannel
    .send(`🎶 Tocando agora **${song.title}**`)
    .then(message => setTimeout(() => message.delete(), 5000))
    .catch(error => console.error(error));
}

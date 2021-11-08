import ytdl from 'ytdl-core';
import yts from 'yt-search';
import {Guild, Message, TextChannel, VoiceChannel} from 'discord.js';
import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';
import {IQueueItem} from '../interfaces/queue';
import {ISong} from '../interfaces/song';
import global from '../interfaces/global';
import queue from './queue';

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
    message
      .reply(
        'Tenho 2 bola e nenhuma é de cristal, fala ai o nome da musica arrombado'
      )
      .then(message => setTimeout(() => message.delete(), 5000));
    message.reply('❌');
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
        playTrack(song.url, voiceChannel, player);
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

      message.react('🆗').catch(console.error);
    } else {
      message.react('❌').catch(console.error);
      message.channel
        .send('Entra no chat de voz ai corno!')
        .then(message => setTimeout(() => message.delete(), 5000));
    }
  } else {
    server_queue!.songs.push(song!);
    console.log(`Music ${song!.title} was added to the queue`);
    message.react('🆗').catch(console.error);
    message.channel
      .send(`👍 **${song!.title}** Adicionada a fila!`)
      .then(message => setTimeout(() => message.delete(), 5000));
    return;
  }
}

export async function getVideo(message: Message, args: string[]) {
  if (ytdl.validateURL(args[0])) {
    const songInfo = await ytdl.getInfo(args[0]);
    return {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };
  } else {
    const videoFinder = async (query: string) => {
      const videoResult = await yts(query);
      return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
    };

    const video = await videoFinder(args.join(' '));
    if (video) {
      return {
        title: video.title,
        url: video.url,
      };
    } else {
      message
        .reply('Achei não ow parça')
        .then(message => setTimeout(() => message.delete(), 5000));
    }
  }
}

export function playTrack(
  url: string,
  channel: VoiceChannel,
  player: AudioPlayer
) {
  const stream = ytdl(url, {filter: 'audioonly'});
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  connection.subscribe(player);
  const resource = createAudioResource(stream);
  try {
    player.play(resource);
  } catch (error) {
    console.log('Error: ', error);
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
    if (oldState.status === 'playing' && newState.status === 'idle') {
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

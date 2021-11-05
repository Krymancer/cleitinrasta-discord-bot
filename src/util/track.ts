import ytdl from 'ytdl-core';
import yts from 'yt-search';

import {Guild, Message, VoiceChannel} from 'discord.js';
import {
  AudioPlayer,
  createAudioPlayer,
  createAudioResource,
  joinVoiceChannel,
} from '@discordjs/voice';

import {song} from '../interfaces/song';
import {queueConstructor} from '../interfaces/queue';

export async function getVideo(message: Message, args: string[]) {
  if (ytdl.validateURL(args[0])) {
    const songInfo = await ytdl.getInfo(args[0]);
    console.log(songInfo.is_listed);
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
      message.reply('Achei não ow parça');
    }
  }
}

export function playTrack(url: string, channel: VoiceChannel) {
  const stream = ytdl(url, {filter: 'audioonly'});
  const player = createAudioPlayer();
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });
  connection.subscribe(player);
  const resource = createAudioResource(stream);
  player.play(resource);

  return player;
}

export function musicPlayer(
  guild: Guild,
  song: song,
  songQueue: queueConstructor
) {
  if (!song) {
    return;
  }

  let player = playTrack(songQueue.songs[0].url, songQueue.voiceChannel);
  player.on('stateChange', (oldState, newState) => {
    if (newState.status === 'idle') {
      songQueue.songs.shift();
      musicPlayer(guild, songQueue.songs[0], songQueue);
    }
  });
  songQueue.textChannel.send(`🎶 Now playing **${song.title}**`);
}

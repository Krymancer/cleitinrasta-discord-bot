import { AudioPlayer, VoiceConnection, createAudioResource, joinVoiceChannel } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";
import ytdl from "ytdl-core";

export default function playTrack(
  url: string,
  channel: VoiceBasedChannel,
  player: AudioPlayer
) : VoiceConnection {
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

  return connection;
}
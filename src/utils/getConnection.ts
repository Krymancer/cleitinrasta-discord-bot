import { joinVoiceChannel } from "@discordjs/voice";
import { VoiceBasedChannel } from "discord.js";

export default function getConnection(channel: VoiceBasedChannel) {
  const connection = joinVoiceChannel({
    channelId: channel.id,
    guildId: channel.guild.id,
    adapterCreator: channel.guild.voiceAdapterCreator,
  });

  return connection;
}
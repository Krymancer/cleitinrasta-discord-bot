import {VoiceConnection} from '@discordjs/voice';
import {
  Channel,
  DMChannel,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel,
  VoiceChannel,
} from 'discord.js';
import {song} from './song';

export interface queueConstructor {
  voiceChannel: VoiceChannel;
  textChannel:
    | DMChannel
    | PartialDMChannel
    | TextChannel
    | NewsChannel
    | ThreadChannel;
  connection: VoiceConnection | null;
  songs: song[];
}

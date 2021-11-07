import {VoiceConnection} from '@discordjs/voice';
import {
  DMChannel,
  NewsChannel,
  PartialDMChannel,
  TextChannel,
  ThreadChannel,
  VoiceChannel,
} from 'discord.js';
import {ISong} from './song';

export interface IQueueItem {
  voiceChannel: VoiceChannel;
  textChannel:
    | DMChannel
    | PartialDMChannel
    | TextChannel
    | NewsChannel
    | ThreadChannel;
  connection: VoiceConnection | null;
  songs: ISong[];
}

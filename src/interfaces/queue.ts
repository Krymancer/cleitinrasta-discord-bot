import {VoiceConnection} from '@discordjs/voice';
import {
  TextBasedChannel,
  VoiceBasedChannel
} from 'discord.js';
import {ISong} from './song';

export interface IQueueItem {
  voiceChannel: VoiceBasedChannel;
  textChannel: TextBasedChannel;
  connection: VoiceConnection | null;
  songs: ISong[];
}

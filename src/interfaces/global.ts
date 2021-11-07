import {AudioPlayer} from '@discordjs/voice';
import {IQueueItem} from './queue';

export default interface global {
  queue: Map<string, IQueueItem>;
  player: AudioPlayer;
}

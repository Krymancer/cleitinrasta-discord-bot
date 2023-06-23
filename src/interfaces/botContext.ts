import {AudioPlayer} from '@discordjs/voice';
import {IQueueItem} from './queue';

export default interface IBotContext {
  queue: Map<string, IQueueItem>;
  player: AudioPlayer;
}

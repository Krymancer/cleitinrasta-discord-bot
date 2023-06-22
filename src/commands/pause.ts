import {Message} from 'discord.js';
import global from '../interfaces/global'
import { AudioPlayerStatus } from '@discordjs/voice';
import replyMessage from '../utils/replyMessage';

export default {
  name: 'pause',
  description: 'Pause current track',
  aliases: [''],
  run: command,
};

function command(message: Message, args: string[], {queue, player}: global) {
  if( player.state.status === AudioPlayerStatus.Playing ) {
    player.pause();
    message.react('⏸️');
  } else if (player.state.status === AudioPlayerStatus.Paused) {
    player.unpause();
    message.react('▶️');
  } else {
    replyMessage(message, 'Não tem nada tocando, seu arrombado!', false);
  }
}

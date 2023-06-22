import {Message} from 'discord.js';
import global from '../interfaces/global'

export default {
  name: 'pause',
  description: 'Pause current track',
  aliases: [''],
  run: command,
};

function command(message: Message, args: string[], {queue, player}: global) {
  if( player.state.status === 'playing' ) {
    player.pause();
    message.react('⏸️');
  } else if (player.state.status === 'paused') {
    player.unpause();
    message.react('▶️');
  } else {
    message.reply('Não tem nada tocando, seu arrombado!');
    message.react('❌');
  }
}

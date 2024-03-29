import {Message} from 'discord.js';
import BotContext from '../interfaces/botContext';
import playTrack from '../utils/playTrack';
import replyMessage from '../utils/replyMessage';

export default {
  name: 'skip',
  description: 'Skip current track',
  aliases: ['s'],
  run: command,
};

function command(message: Message, args: string[], {queue, player}: BotContext) {
  if (!message.member?.voice.channel) {
    replyMessage(message, 'Mas tu n ta nem num chat de voz doido!', false);
  }

  const server_queue = queue.get(message.guild!.id);

  if (server_queue) {
    player.stop();

    if (server_queue.songs.length < 1) {
      replyMessage(message, 'Acabou as musicas ai cabaço 😡', true);
      queue.delete(message.guild!.id);
      return;
    }

    const current_track = server_queue.songs.shift();
    const next_track = server_queue.songs[0];

    if (!next_track) {
      replyMessage(message, 'Acabou as musicas ai cabaço 😡', true);
      queue.delete(message.guild!.id);
      return;
    }
    
    replyMessage(message, `Pulando de 💽 ${current_track?.title} para 💽 ${next_track?.title}`, true);
    playTrack(next_track.url, player);
  }
}

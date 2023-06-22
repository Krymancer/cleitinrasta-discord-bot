import {Message} from 'discord.js';
import global from '../interfaces/global';
import { playTrack } from './play';

export default {
  name: 'skip',
  description: 'Skip current track',
  aliases: ['s'],
  run: command,
};

function command(message: Message, args: string[], {queue, player}: global) {
  if (!message.member?.voice.channel) {
    message.channel
      .send(`Mas tu n ta nem num chat de voz doido!`)
      .then(message => setTimeout(() => message.delete(), 5000));
  }

  const server_queue = queue.get(message.guild!.id);

  if (server_queue) {
    player.stop();
    if (server_queue.songs.length === 1) {
      message.channel
        .send(`Acabou as musicas ai cabaço`)
        .then(message => setTimeout(() => message.delete(), 5000));
      queue.delete(message.guild!.id);
      return;
    }
    const current_track = server_queue.songs.shift();
    const next_track = server_queue.songs[0];
    message.channel
      .send(`Pulando de 💽 ${current_track?.title} para 💽 ${next_track?.title}`)
      .then(message => setTimeout(() => message.delete(), 5000));
    playTrack(next_track.url, server_queue.voiceChannel, player);
    message.react('🆗');
  }
}

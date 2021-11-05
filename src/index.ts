import {Intents, Client, VoiceChannel} from 'discord.js';
import {joinVoiceChannel, createAudioPlayer} from '@discordjs/voice';

import {prefix, token} from './config.json';
import {getVideo, playTrack, musicPlayer} from './util/track';
import {queueConstructor} from './interfaces/queue';

const client = new Client({
  intents: [
    [
      Intents.FLAGS.GUILDS,
      Intents.FLAGS.GUILD_MESSAGES,
      Intents.FLAGS.GUILD_VOICE_STATES,
    ],
  ],
});

const queue = new Map<string, queueConstructor>();

client.on('ready', async () => {
  console.log('Pra galera deboxar legal, ao som do cabeça de gelo!');
});

const player = createAudioPlayer();

client.on('messageCreate', async message => {
  if (message.author.bot || !message.content.startsWith(prefix)) return;

  const server_queue = queue.get(message.guild!.id);

  const args = message.content.slice(prefix.length).split(/ +/);
  const command = args.shift()!.toLowerCase();

  if (command === 'p') {
    const channel = message.member?.voice.channel as VoiceChannel;
    const textChannel = message.channel;
    if (!args.length) {
      message.reply(
        'Tenho 2 bola e nenhuma é de cristal, fala ai o nome da musica arrombado'
      );
    }

    let song = await getVideo(message, args);
    if (!server_queue && song && message.guild) {
      const queueItem: queueConstructor = {
        voiceChannel: channel,
        textChannel: textChannel,
        connection: null,
        songs: [],
      };

      queue.set(message.guild?.id, queueItem);
      queueItem.songs.push(song);

      try {
        const connection = joinVoiceChannel({
          channelId: channel.id,
          guildId: channel.guild.id,
          adapterCreator: channel.guild.voiceAdapterCreator,
        });
        queueItem.connection = connection;
      } catch (err) {
        queue.delete(message.guild.id);
        message.channel.send('Deu ruim aqui, depois eu!');
        throw err;
      }

      if (channel) {
        try {
          if (!song.url) {
            return;
          }
          playTrack(song.url, channel);
          await message.reply(`Playing now ${song!.title}!`);
          musicPlayer(message.guild, queueItem.songs[0], queueItem);
        } catch (error) {
          console.error('Error:', error);
        }
      } else {
        void message.reply('Join a voice channel then try again!');
      }
    } else {
      server_queue!.songs.push(song!);
      message.reply(`👍 **${song!.title}** added to queue!`);
      return;
    }
  }
});

client.login(token);

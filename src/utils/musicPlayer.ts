import { Guild } from "discord.js";
import { IQueueItem } from "../interfaces/queue";
import { AudioPlayer } from "@discordjs/voice";
import playTrack from "./playTrack";

export default function musicPlayer(
  guild: Guild,
  player: AudioPlayer,
  queue: Map<string, IQueueItem>
) {
  const server_queue = queue.get(guild.id);

  if (!server_queue) {
    return;
  }

  const [song] = server_queue.songs;

  if (!song) {
    server_queue.textChannel.send('Acabou as musicas ai cabaço 😡')
      .then(message => setTimeout(() => message.delete(), 5000));
    queue.delete(guild.id);
    return;
  }

  playTrack(song.url, player);
  
  server_queue!.textChannel
    .send(`🎶 Tocando agora **${song.title}**`)
    .then(message => setTimeout(() => message.delete(), 5000))
    .catch(error => console.error(error));
}

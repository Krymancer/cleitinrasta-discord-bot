import { AudioPlayer, createAudioResource } from "@discordjs/voice";
import ytdl, { downloadOptions } from "ytdl-core";

export default function playTrack(
  url: string,
  player: AudioPlayer
) {
  const options : downloadOptions = {
    filter: 'audioonly',
    highWaterMark: 1 << 30,
    liveBuffer: 20000,
    dlChunkSize: 4096,
    quality: 'lowestaudio'
  };
  
  const stream = ytdl(url, options);
  const resource = createAudioResource(stream);

  player.play(resource);
}
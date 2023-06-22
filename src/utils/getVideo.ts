import { Message } from "discord.js";
import yts from "yt-search";
import ytdl from "ytdl-core";

export default async function getVideo(message: Message, args: string[]) {
  if (ytdl.validateURL(args[0])) {
    const songInfo = await ytdl.getInfo(args[0]);
    return {
      title: songInfo.videoDetails.title,
      url: songInfo.videoDetails.video_url,
    };
  } else {
    const videoFinder = async (query: string) => {
      const videoResult = await yts(query);
      return videoResult.videos.length > 1 ? videoResult.videos[0] : null;
    };

    const video = await videoFinder(args.join(' '));
    if (video) {
      return {
        title: video.title,
        url: video.url,
      };
    } else {
      message
        .reply('Achei não ow parça')
        .then(message => setTimeout(() => message.delete(), 5000));
    }
  }
}
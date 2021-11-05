import { Message } from "discord.js";

module.exports = {
  name: "ping",
  description: "reply pong!",
  run(message: Message) {
    message.channel.send("Pong!");
  },
};

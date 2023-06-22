import { Message } from "discord.js";

function getStatusReaction(status: boolean) {
  return status ? '✅' : '❌';
}
export default function replyMessage(message: Message, content: string, status: boolean) {
  message.channel.send(content)
    .then(message => setTimeout(() => message.delete(), 5000));
  message.react(getStatusReaction(status)).catch(console.error);
}
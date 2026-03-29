const PING = "ping";
const ECHO = "echo";

function isPing(command: string): boolean {
  return command.toLowerCase() === PING;
}

function isEcho(command: string): boolean {
  return command.toLowerCase() === ECHO;
}

export function parse(data: string): string | undefined {
  const [
    totalWords, // *<number>
    ...args
  ] = data.split("\r\n");

  const command = args[1];

  if (isPing(command)) {
    return '+PONG\r\n';
  } else if (isEcho(command)) {
    return `\$${args[3].length}\r\n${args[3]}\r\n`;
  }

  return undefined;
}

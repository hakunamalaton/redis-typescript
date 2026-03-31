const PING = "ping";
const ECHO = "echo";
const SET = "set";
const GET = "get";

const stringObject: Record<string, string> = {};

function isPing(command: string): boolean {
  return command.toLowerCase() === PING;
}

function isEcho(command: string): boolean {
  return command.toLowerCase() === ECHO;
}

function isSet(command: string): boolean {
  return command.toLowerCase() === SET;
}

function isGet(command: string): boolean {
  return command.toLowerCase() === GET;
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
  } else if (isSet(command)) {
    stringObject[args[3]] = args[5];
    return `+OK\r\n`;
  } else if (isGet(command)) {
    if (stringObject[args[3]]) {
      return `\$${stringObject[args[3]].length}\r\n${stringObject[args[3]]}\r\n`;
    } else {
      return `$-1\r\n`;
    }
  }

  return undefined;
}

import { generateBulkString } from "./formatResponse";

const ECHO = "echo";

export function isEcho(command: string): boolean {
  return command.toLowerCase() === ECHO;
}

export function handleEcho(command: string): string {
  return generateBulkString(command);
}

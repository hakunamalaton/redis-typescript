import { generateSimpleString } from "./formatResponse";

const PING = "ping";
const PONG = "PONG";

export function isPing(command: string): boolean {
  return command.toLowerCase() === PING;
}

export function handlePing(): string {
  return generateSimpleString(PONG);
}
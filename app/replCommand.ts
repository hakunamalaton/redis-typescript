import { generateSimpleString } from "./formatResponse";

const REPL = "replconf";

export function isReplConf(command: string): boolean {
  return command.toLowerCase() === REPL;
}

export function handleReplConf(type: string, replicaof: string | undefined): string {
  return generateSimpleString("OK");
}

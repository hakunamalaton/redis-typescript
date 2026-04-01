import { generateBulkString, generateNull, generateSimpleString } from "./formatResponse";
import { streamObject } from "./structure";

const streamCommands = {
  'xadd': 'xadd',
}

function extractStreamValues(args: Array<string>) {
  const valueObject: Record<string, string> = {};
  for (let i = 1; i < args.length; i += 2) {
    if (i === 1) {
      valueObject['id'] = args[i];
    } else {
      valueObject[args[i]] = args[i + 2];
      i += 2;
    }
  }
  return valueObject;
}

export function isStream(command: string): boolean {
  return Object.keys(streamCommands).includes(command.toLowerCase());
}

function isXAdd(command: string): boolean {
  return command.toLowerCase() === streamCommands['xadd'];
}
function handleXAdd(streamKey: string, values: Record<string, string>): string {
  if (!streamObject[streamKey]) {
    streamObject[streamKey] = {};
  }
  Object.entries(values).forEach(([key, value]) => {
    streamObject[streamKey][key] = value;
  });
  return generateBulkString(values['id']);
}

export function handleStream(command: string, key: string, args: Array<string>): string {
  if (isXAdd(command)) {
    return handleXAdd(key, extractStreamValues(args));
  }
  return generateNull();
}

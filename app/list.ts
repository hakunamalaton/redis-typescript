import { generateInteger } from "./formatResponse";

const RPUSH = "rpush";

const listObject: Record<string, Array<string>> = {};

export function isList(command: string): boolean {
  return command.toLowerCase() === RPUSH;
}

function extractListValues(args: Array<string>): Array<string> {
  return args.filter((_, index) => index % 2 === 1);
}

export function handleList(key: string, args: Array<string>): string {
  if (!listObject[key]) {
    listObject[key] = [];
  }
  listObject[key].push(...extractListValues(args));

  return generateInteger(listObject[key].length);
}

import { generateInteger } from "./formatResponse";

const RPUSH = "rpush";

const listObject: Record<string, Array<string>> = {};

export function isList(command: string): boolean {
  return command.toLowerCase() === RPUSH;
}

export function handleList(key: string, value: string): string {
  if (!listObject[key]) {
    listObject[key] = [];
  }
  listObject[key].push(value);

  return generateInteger(listObject[key].length);
}

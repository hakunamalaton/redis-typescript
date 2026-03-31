import { generateArray, generateInteger, generateNull } from "./formatResponse";

const RPUSH = "rpush";
const LRANGE = "lrange";

const listObject: Record<string, Array<string>> = {};

export function isList(command: string): boolean {
  return [RPUSH, LRANGE].includes(command.toLowerCase());
}

function isRPush(command: string): boolean {
  return command.toLowerCase() === RPUSH;
}

function handleRPush(key: string, args: Array<string>): string {
  if (!listObject[key]) {
    listObject[key] = [];
  }
  listObject[key].push(...extractListValues(args));
  return generateInteger(listObject[key].length);
}

function isLRange(command: string): boolean {
  return command.toLowerCase() === LRANGE;
}

function extractListValues(args: Array<string>): Array<string> {
  return args.filter((_, index) => index % 2 === 1);
}

function handleLRange(key: string, args: [number, number]): string {
  return generateArray(listObject[key].slice(args[0], args[1]));
}

export function handleList(command: string, key: string, args: Array<string> | [number, number]): string {
  if (isRPush(command)) {
    return handleRPush(key, args as Array<string>);
  } else if (isLRange(command)) {
    return handleLRange(key, args as [number, number]);
  }

  return generateNull();
}

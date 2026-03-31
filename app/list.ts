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

function handleRPush(key: string, values: Array<string>): string {
  if (!listObject[key]) {
    listObject[key] = [];
  }
  listObject[key].push(...values);
  return generateInteger(listObject[key].length);
}

function isLRange(command: string): boolean {
  return command.toLowerCase() === LRANGE;
}

function extractListValues(args: Array<string>): Array<string> {
  return args.filter((_, index) => index % 2 === 1);
}

function handleLRange(key: string, indexes: [number, number]): string {
  if (!listObject[key]) {
    return generateArray([]);
  }
  return generateArray(listObject[key].slice(indexes[0], indexes[1] + 1));
}

export function handleList(command: string, key: string, args: Array<string>): string {
  if (isRPush(command)) {
    return handleRPush(key, extractListValues(args));
  } else if (isLRange(command)) {
    return handleLRange(key, extractListValues(args).map(Number) as [number, number]);
  }

  return generateNull();
}

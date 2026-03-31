import { generateArray, generateInteger, generateNull } from "./formatResponse";

const RPUSH = "rpush";
const LRANGE = "lrange";
const LPUSH = "lpush";

const listObject: Record<string, Array<string>> = {};

export function isList(command: string): boolean {
  return [RPUSH, LRANGE, LPUSH].includes(command.toLowerCase());
}

function isRPush(command: string): boolean {
  return command.toLowerCase() === RPUSH;
}

function isLPush(command: string): boolean {
  return command.toLowerCase() === LPUSH;
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
  const start = indexes[0] >= 0 ? indexes[0] : Math.max(0, listObject[key].length + indexes[0]);
  const end = indexes[1] >= 0 ? indexes[1] : Math.max(0, listObject[key].length + indexes[1]);
  return generateArray(listObject[key].slice(start, end + 1));
}

function handleLPush(key: string, values: Array<string>): string {
  if (!listObject[key]) {
    listObject[key] = [];
  }
  listObject[key].unshift(...values.toReversed());
  return generateInteger(listObject[key].length);
}

export function handleList(command: string, key: string, args: Array<string>): string {
  if (isRPush(command)) {
    return handleRPush(key, extractListValues(args));
  } else if (isLRange(command)) {
    return handleLRange(key, extractListValues(args).map(Number) as [number, number]);
  } else if (isLPush(command)) {
    return handleLPush(key, extractListValues(args));
  }

  return generateNull();
}

import { generateArray, generateBulkString, generateInteger, generateNull, generateNullArray } from "./formatResponse";

const listCommands = {
  'rpush': 'rpush',
  'lrange': 'lrange',
  'lpush': 'lpush',
  'llen': 'llen',
  'lpop': 'lpop',
  'blpop': 'blpop',
}

const listObject: Record<string, Array<string>> = {};

export function isList(command: string): boolean {
  return Object.keys(listCommands).includes(command.toLowerCase());
}

function isRPush(command: string): boolean {
  return command.toLowerCase() === listCommands['rpush'];
}
function handleRPush(key: string, values: Array<string>): string {
  if (!listObject[key]) {
    listObject[key] = [];
  }
  listObject[key].push(...values);
  return generateInteger(listObject[key].length);
}


function extractListValues(args: Array<string>): Array<string> {
  return args.filter((_, index) => index % 2 === 1);
}

function isLRange(command: string): boolean {
  return command.toLowerCase() === listCommands['lrange'];
}
function handleLRange(key: string, indexes: [number, number]): string {
  if (!listObject[key]) {
    return generateArray([]);
  }
  const start = indexes[0] >= 0 ? indexes[0] : Math.max(0, listObject[key].length + indexes[0]);
  const end = indexes[1] >= 0 ? indexes[1] : Math.max(0, listObject[key].length + indexes[1]);
  return generateArray(listObject[key].slice(start, end + 1));
}

function isLPush(command: string): boolean {
  return command.toLowerCase() === listCommands['lpush'];
}
function handleLPush(key: string, values: Array<string>): string {
  if (!listObject[key]) {
    listObject[key] = [];
  }
  listObject[key].unshift(...values.toReversed());
  return generateInteger(listObject[key].length);
}

function isLLen(command: string): boolean {
  return command.toLowerCase() === listCommands['llen'];
}
function handleLLen(key: string): string {
  if (!listObject[key]) {
    return generateInteger(0);
  }
  return generateInteger(listObject[key].length);
}

function isLPop(command: string): boolean {
  return command.toLowerCase() === listCommands['lpop'];
}
function handleLPop(key: string, count: number): string {
  if (!listObject[key] || listObject[key].length === 0) {
    return generateNull();
  }
  const value = listObject[key].splice(0, count);
  if (value.length === 1) {
    return generateBulkString(value[0]);
  } else {
    return generateArray(value);
  }
}

function isBLPop(command: string): boolean {
  return command.toLowerCase() === listCommands['blpop'];
}
async function handleBLPop(key: string, timeout: number) {
  if (timeout > 0) {
    const startTime = Date.now();
    while (startTime + timeout * 1000 > Date.now() && (!listObject[key] || listObject[key].length === 0)) {
      await new Promise(resolve => setTimeout(resolve, 0)); // block the client
    }
    const value = listObject?.[key]?.shift();
    if (value) {
      return generateArray([key, value])
    } else {
      return generateNullArray();
    }
  }
  while (!listObject[key] || listObject[key].length === 0) {
    await new Promise(resolve => setTimeout(resolve, 0)); // block the client
  }
  const value = listObject[key].shift();
  if (value) {
    return generateArray([key, value])
  }
}

export async function handleList(command: string, key: string, args: Array<string>) {
  if (isRPush(command)) {
    return handleRPush(key, extractListValues(args));
  } else if (isLRange(command)) {
    return handleLRange(key, extractListValues(args).map(Number) as [number, number]);
  } else if (isLPush(command)) {
    return handleLPush(key, extractListValues(args));
  } else if (isLLen(command)) {
    return handleLLen(key);
  } else if (isLPop(command)) {
    return handleLPop(key, extractListValues(args).map(Number)[0] || 1);
  } else if (isBLPop(command)) {
    return await handleBLPop(key, extractListValues(args).map(Number)[0] || 0);
  }

  return generateNull();
}

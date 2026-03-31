import { generateBulkString, generateNull, generateSimpleString } from "./formatResponse";

const SET = "set";
const GET = "get";
const PX = "px"; // milliseconds
const EX = "ex"; // seconds

interface SetOptions {
  px?: number;
  ex?: number;
}

interface SetValue {
  value: string;
  expiration?: number;
}

const stringObject: Record<string, SetValue> = {};

export function isSet(command: string): boolean {
  return command.toLowerCase() === SET;
}

export function isGet(command: string): boolean {
  return command.toLowerCase() === GET;
}

export function isExpiration(command: string): boolean {
  return command.toLowerCase() === PX || command.toLowerCase() === EX;
}

export function handleSet(key: string, value: string, options?: SetOptions): string {
  stringObject[key] = { value };
  let expiration: number | undefined;
  if (options?.px) {
    expiration = Number(options.px);
  } else if (options?.ex) {
    expiration = Number(options.ex) * 1000;
  }
  if (expiration) {
    stringObject[key].expiration = Date.now() + expiration;
  }
  return generateSimpleString('OK');
}

export function handleGet(key: string): string {
  if (stringObject[key]) {
    if (stringObject[key].expiration && stringObject[key].expiration < Date.now()) {
      delete stringObject[key];
      return generateNull();
    }
    return generateBulkString(stringObject[key].value);
  } else {
    return generateNull();
  }
}

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

function setExpiration(key: string, options?: SetOptions): void {
  let expiration: number | undefined;
  if (options?.px) {
    expiration = Number(options.px);
  } else if (options?.ex) {
    expiration = Number(options.ex) * 1000;
  }
  if (expiration) {
    stringObject[key].expiration = Date.now() + expiration;
  }
}

export function handleSet(key: string, value: string, options?: SetOptions): string {
  stringObject[key] = { value };
  Object.entries(options || {}).forEach(([optionCommand, optionValue]) => {
    if (isExpiration(optionCommand)) {
      setExpiration(key, { [optionCommand.toLowerCase()]: optionValue });
    }
  });
  console.log(stringObject);
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

import { generateBulkString, generateNull, generateSimpleString } from "./formatResponse";
import { stringObject } from "./structure";

const SET = "set";
const GET = "get";
const PX = "px"; // milliseconds
const EX = "ex"; // seconds

interface SetOptions {
  px?: number;
  ex?: number;
}

export function isString(command: string): boolean {
  return command.toLowerCase() === SET || command.toLowerCase() === GET;
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

function handleSet(key: string, value: string, options?: SetOptions): string {
  stringObject[key] = { value };
  Object.entries(options || {}).forEach(([optionCommand, optionValue]) => {
    if (isExpiration(optionCommand)) {
      setExpiration(key, { [optionCommand.toLowerCase()]: optionValue });
    }
  });
  return generateSimpleString('OK');
}

function handleGet(key: string): string {
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

export function handleString(command: string, key: string, value: string, options?: SetOptions): string {
  if (command.toLowerCase() === SET) {
    return handleSet(key, value, options);
  } else if (command.toLowerCase() === GET) {
    return handleGet(key);
  }
  return generateNull();
}

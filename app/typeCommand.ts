import { generateSimpleString } from "./formatResponse";
import { listObject, stringObject, streamObject } from "./structure";

const TYPE = "type";

export function isType(command: string): boolean {
  return command.toLowerCase() === TYPE;
}

export function handleType(key: string): string {
  if (listObject[key]) {
    return generateSimpleString("list");
  } else if (stringObject[key]) {
    return generateSimpleString("string");
  } else if (streamObject[key]) {
    return generateSimpleString("stream");
  }
  return generateSimpleString("none");
}

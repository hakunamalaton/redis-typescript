import { generateSimpleString } from "./formatResponse";
import { listObject, stringObject } from "./structure";

const TYPE = "type";

export function isType(command: string): boolean {
  return command.toLowerCase() === TYPE;
}

export function handleType(key: string): string {
  if (listObject[key]) {
    return generateSimpleString("list");
  } else if (stringObject[key]) {
    return generateSimpleString("string");
  }
  return generateSimpleString("none");
}

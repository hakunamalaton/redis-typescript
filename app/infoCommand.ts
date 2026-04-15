import { generateSimpleString } from "./formatResponse";

const INFO = "info";
const REPLICATION = "replication";

export function isInfo(command: string): boolean {
  return command.toLowerCase() === INFO;
}

export function handleInfo(type: string): string {
  if (type.toLowerCase() === REPLICATION) {
    return generateSimpleString(`role:master`);
  }
  return generateSimpleString("OK");
}

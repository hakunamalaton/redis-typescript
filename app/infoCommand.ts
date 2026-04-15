import { generateBulkString } from "./formatResponse";

const INFO = "info";
const REPLICATION = "replication";

export function isInfo(command: string): boolean {
  return command.toLowerCase() === INFO;
}

export function handleInfo(type: string, replicaof: string | undefined): string {
  if (type.toLowerCase() === REPLICATION) {
    if (replicaof) {
      return generateBulkString(`role:slave`);
    }
    return generateBulkString(`role:master`);
  }
  return generateBulkString("OK");
}

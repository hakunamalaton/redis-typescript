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
    return generateBulkString(`role:master\nmaster_replid:8371b4fb1155b71f4a04d3e1bc3e18c4a990aeeb\nmaster_repl_offset:0`);
  }
  return generateBulkString("OK");
}

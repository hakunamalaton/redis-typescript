import * as net from "net";
import { parse } from "./parser";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    port: {
      type: "string",
      default: "6379",
    },
  },
});

const server: net.Server = net.createServer((connection: net.Socket) => {
  connection.on("data", async (data: Buffer) => {
    const response = await parse(data.toString());
    if (response) {
      connection.write(response);
    }
  });
});

server.listen(Number(values.port), "127.0.0.1");

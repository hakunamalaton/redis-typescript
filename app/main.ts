import * as net from "net";
import { parse } from "./parser";

const server: net.Server = net.createServer((connection: net.Socket) => {
  connection.on("data", async (data: Buffer) => {
    const response = await parse(data.toString());
    if (response) {
      connection.write(response);
    }
  });
});

server.listen(6379, "127.0.0.1");

import * as net from "net";
import { parse } from "./parser";

const server: net.Server = net.createServer((connection: net.Socket) => {
  connection.on("data", (data: Buffer) => {
    const response = parse(data.toString());
    if (response) {
      connection.write(response);
    } else {
      connection.write('+PONG\r\n');
    }
  });
});

server.listen(6381, "127.0.0.1");

import * as net from "net";
import { parse } from "./parser";
import { generateArray } from "./formatResponse";
import { parseArgs } from "util";

const { values } = parseArgs({
  args: Bun.argv.slice(2),
  options: {
    port: {
      type: "string",
      default: "6379",
    },
    replicaof: {
      type: "string",
    }
  },
});

const server: net.Server = net.createServer((connection: net.Socket) => {
  connection.on("data", async (data: Buffer) => {
    console.log(data.toString());
    const response = await parse(data.toString(), values.replicaof || undefined);
    if (response) {
      connection.write(response);
    }
  });

});

server.listen(Number(values.port), "127.0.0.1");

if (values.replicaof) {
  const [masterHost, masterPort] = values.replicaof.split(" ");
  const masterConnection = net.createConnection(
    { host: masterHost, port: Number(masterPort) },
    () => {
      masterConnection.write(generateArray(["PING"]));
    }
  );

  masterConnection.on("data", (data: Buffer) => {
    // After receiving +PONG, send the next handshake steps:
    if (data.toString().includes('+PONG')) {
      masterConnection.write(generateArray(['REPLCONF', 'listening-port', values.port!]));
    }
    if (data.toString().includes('+OK')) {
      masterConnection.write(generateArray(['REPLCONF', 'capa', 'psync2']));
    }
  });
}

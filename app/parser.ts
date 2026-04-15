import { handleEcho, isEcho } from "./echoCommand";
import { handleList, isList } from "./list";
import { handlePing, isPing } from "./pingCommand";
import { handleString, isString } from "./string";
import { handleType, isType } from "./typeCommand";
import { handleStream, isStream } from "./stream";
import { handleInfo, isInfo } from "./infoCommand";
import { handleReplConf, isReplConf } from "./replCommand";

// TODO: implement a parser, not extract value like args[1], args[3]
/*
PING
ECHO toan
SET toan lam
set toan lam ex 5
set toan thien px 3000
get toan
lpush toan thien lam ne
rpush toan haha haha
lrange toan 0 2
llen toan
lpop toan
lpop toan 3
blpop toan
blpop toan 5
xadd toan 1-1 alo 1 bar 2
*/

export async function parse(data: string, replicaof: string | undefined): Promise<string | undefined> {
  const [
    _, // *<number>
    ...args
  ] = data.split("\r\n");

  const command = args[1];
  const firstArgument = args[3];
  const secondArgument = args[5];
  const thirdArgument = args[7];
  const fourthArgument = args[9];

  if (isPing(command) || command === 'COMMAND') {
    return handlePing();
  } else if (isEcho(command)) {
    return handleEcho(firstArgument);
  } else if (isString(command)) {
    return handleString(command, firstArgument, secondArgument, { [thirdArgument]: fourthArgument });
  } else if (isList(command)) {
    return await handleList(command, firstArgument, args.slice(4));
  } else if (isType(command)) {
    return handleType(firstArgument);
  } else if (isStream(command)) {
    return await handleStream(command, firstArgument, args.slice(4));
  } else if (isInfo(command)) {
    return handleInfo(firstArgument, replicaof);
  } else if (isReplConf(command)) {
    return handleReplConf(firstArgument, replicaof);
  }

  return undefined;
}

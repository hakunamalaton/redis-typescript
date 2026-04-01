import { handleEcho, isEcho } from "./echoCommand";
import { handleList, isList } from "./list";
import { handlePing, isPing } from "./pingCommand";
import { handleString, isString } from "./string";
import { handleType, isType } from "./typeCommand";

export async function parse(data: string): Promise<string | undefined> {
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
  }

  return undefined;
}

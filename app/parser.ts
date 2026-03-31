import { handleEcho, isEcho } from "./echoCommand";
import { handleList, isList } from "./list";
import { handlePing, isPing } from "./pingCommand";
import { handleString, isString } from "./string";

function extractArguments(data: string): Array<string> {
  const [
    _, // *<number>
    ...args // [length1, value1, length2, value2, length3, value3, ...]
  ] = data.split("\r\n");
  const command = args[1];

  return args;
}

export function parse(data: string): string | undefined {
  const [
    _, // *<number>
    ...args
  ] = data.split("\r\n");

  const command = args[1];
  const firstArgument = args[3];
  const secondArgument = args[5];
  const thirdArgument = args[7];
  const fourthArgument = args[9];

  if (isPing(command)) {
    return handlePing();
  } else if (isEcho(command)) {
    return handleEcho(firstArgument);
  } else if (isString(command)) {
    return handleString(command, firstArgument, secondArgument, { [thirdArgument]: fourthArgument });
  } else if (isList(command)) {
    return handleList(command, firstArgument, args.slice(4));
  }

  return undefined;
}

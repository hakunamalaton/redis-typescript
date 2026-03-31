import { handleEcho, isEcho } from "./echoCommand";
import { handlePing, isPing } from "./pingCommand";
import { handleGet, handleSet, isGet, isSet } from "./setGetCommand";


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
  } else if (isSet(command)) {
    return handleSet(firstArgument, secondArgument, { [thirdArgument]: fourthArgument });
  } else if (isGet(command)) {
    return handleGet(firstArgument);
  }

  return undefined;
}

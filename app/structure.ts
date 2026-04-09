interface SetValue {
  value: string;
  expiration?: number;
}

const listObject: Record<string, Array<string>> = {};
const stringObject: Record<string, SetValue> = {};
const streamObject: Record<string, Record<string, Record<string, string>>> = {};

export { listObject, stringObject, streamObject };

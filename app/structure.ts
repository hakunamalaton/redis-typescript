interface SetValue {
  value: string;
  expiration?: number;
}

const listObject: Record<string, Array<string>> = {};
const stringObject: Record<string, SetValue> = {};

export { listObject, stringObject };

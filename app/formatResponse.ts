export function generateSimpleString(value: string): string {
  return `+${value}\r\n`;
}

export function generateInteger(value: number): string {
  return `:${value}\r\n`;
}

export function generateBulkString(value: string): string {
  return `$${value.length}\r\n${value}\r\n`;
}

export function generateArray(values: string[]): string {
  return `*${values.length}\r\n${values.map(generateBulkString).join('')}`;
}

export function generateNullArray(): string {
  return `*-1\r\n`;
}

export function generateNull() {
  return `$-1\r\n` as const;
}

export function generateError(message: string): string {
  return `-${message}\r\n`;
}

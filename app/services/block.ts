
const waiters: Record<string, Array<(value: string | null) => void>> = {};

export function notifyWaiters(key: string, value: any): void {
  while (waiters[key]?.length) {
    const waiter = waiters[key].shift()!;
    waiter(value);
  }
}

export function registerWaiter(key: string, waiter: (value: any) => void): void {
  if (!waiters[key]) waiters[key] = [];
  waiters[key].push(waiter);
}

export function removeWaiter(key: string, waiter: (value: any) => void): void {
  const index = waiters[key]?.indexOf(waiter);
  if (index !== undefined && index !== -1) {
    waiters[key].splice(index, 1);
  }
}

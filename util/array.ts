function partition<T>(array: T[], predicate: (value: T) => boolean): [T[], T[]] {
  const truthy: T[] = [];
  const falsy: T[] = [];
  for (const value of array) {
    if (predicate(value)) {
      truthy.push(value);
    } else {
      falsy.push(value);
    }
  }
  return [truthy, falsy];
}

function groupBy<T>(array: T[], getKey: (value: T) => string | string[]): Record<string, T[]> {
  const groups: Record<string, T[]> = {};
  for (const value of array) {
    const key = getKey(value);
    const keys = Array.isArray(key) ? key : [key];
    keys.forEach(k => {
      if (!groups[k]) {
        groups[k] = [];
      }
      groups[k].push(value);
    })
  }
  return groups;
}

export { partition, groupBy }
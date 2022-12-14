export const accountToShort = (address: string): string => {
  return address.substring(0, 4) + '...' + address.slice(-4);
};
type KeyOf<T extends object> = Extract<keyof T, string>;
export type Order = 'asc' | 'desc';

export function dynamicSort<T extends {}>(
  property: KeyOf<T>,
  order: Order = 'asc'
) {
  var sortOrder = 1;
  if (order === 'desc') {
    sortOrder = -1;
  }
  return function (a: T, b: T) {
    var result =
      a[property] < b[property] ? -1 : a[property] > b[property] ? 1 : 0;
    return result * sortOrder;
  };
}

export function dynamicFilter<T extends {}>(property: KeyOf<T>, value: any) {
  return function (a: T) {
    return a[property] === value;
  };
}

// export function objStringsToObjInts(obj: {}) {
//   const newObj = {};
//   Object.keys(obj).forEach((key) => {
//     newObj[key] = parseInt(obj[key]);
//   } );
//   return newObj;
// }

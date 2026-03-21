declare const relationMarker: unique symbol;

export type Include<T> = T & { [relationMarker]: true };

type Unarray<T> = T extends (infer U)[] ? U : T;
type Prev = [never, 0, 1, 2, 3, 4, 5];

export type IsAny<T> = 0 extends 1 & T ? true : false;

type IncludeKeys<T> = {
    [K in keyof T]: IsAny<T[K]> extends true
        ? never
        : T[K] extends { [relationMarker]: true }
        ? K
        : never;
}[keyof T] &
    string;

export type IncludePaths<T, Depth extends number = 2> = [Depth] extends [never]
    ? never
    : {
          [K in IncludeKeys<T>]:
              | K
              | `${K}.${IncludePaths<Unarray<T[K]>, Prev[Depth]>}`;
      }[IncludeKeys<T>];

/**
 *  @file         src/types/extend.d.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/2 16:12
 *  @description
 */
declare type noting = never

declare type Rest<T> = T extends [infer P, ...infer Rest] ? Rest : never

declare type RestParams<T> = Rest<Parameters<T>>

declare type Vector = [x: number, y: number]

declare type Extent = [from: number, to: number]

declare type LayoutPosition = [rowIndex: number, cellIndex: number]

declare type Fn = () => void

declare type RecursivePartial<T> = {
  [P in keyof T]?:
  // T[P] extends (infer U)[] ? RecursivePartial<U>[] :
  T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> :
    T[P]
}

declare type RecursiveRequired<T> = {
  [P in keyof T]-?:
  // T[P] extends (infer U)[] ? RecursiveRequired<U>[] : // 忽略数组的情况 tuple
  T[P] extends Record<string, unknown> ? RecursiveRequired<T[P]> :
    T[P]
}

declare type Bar = {
  open: number;
  high: number;
  low: number;
  close: number;
  date: number;
  DT: Date;
  volume: number;
}

declare type BarValueField = Exclude<keyof Bar, 'DT' | 'volume' | 'date'>

declare type PointLocation = { x: number, y: number }

/**
 * 如果union太复杂 非常吃性能
 */
declare type Permutations<T extends string, U extends string = T> =
  T extends string ? (T | `${T} ${Permutations<Exclude<U, T>>}`) : never;

declare module '*.png' {
  const value: string

  export default value
}

declare type ChartType = 'candle' | 'mountain'

/**
 *  @file         src/types/extend.d.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/2 16:12
 *  @description
 */
type Rest<T> = T extends [infer P, ...infer Rest] ? Rest : never

type RestParams<T> = Rest<Parameters<T>>

type Extent = [from: number, to: number]

type Fn = () => void

declare type RecursivePartial<T> = {
  [P in keyof T]?:
  // T[P] extends (infer U)[] ? RecursivePartial<U>[] :
  T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> :
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

type BarValueField = Exclude<keyof Bar, 'DT' | 'volume'>

type Vector = [x: number, y: number]

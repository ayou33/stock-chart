/**
 *  index.d.ts of project stock-chart
 *  @date 2022/7/25 18:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
declare type BorderGap = Partial<{
  top: number;
  right: number;
  bottom: number;
  left: number;
}> | number

declare type Bar = {
  open: number;
  high: number;
  low: number;
  close: number;
  date: number;
  DT: Date;
  volume: number;
}

declare type Vector = [x: number, y: number]

declare type First<T> = T extends [infer P, ...infer Rest] ? P : never

declare type Rest<T> = T extends [infer P, ...infer Rest] ? Rest : never

declare type Extent = [from: number, to: number]

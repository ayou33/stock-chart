/**
 *  index.d.ts of project stock-chart
 *  @date 2022/7/25 18:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
type BorderGap = Partial<{
  top: number;
  right: number;
  bottom: number;
  left: number;
}> | number

type Bar = {
  open: number;
  high: number;
  low: number;
  close: number;
  date: number;
  DT: Date;
  volume: number;
}

type Vector = [x: number, y: number]

type First<T> = T extends [infer P, ...infer Rest] ? P : never

type Rest<T> = T extends [infer P, ...infer Rest] ? Rest : never

type RestParams<T> = Rest<Parameters<T>>

type Extent = [from: number, to: number]

type Fn = () => void

type AnyFn = (...args: unknown[]) => unknown

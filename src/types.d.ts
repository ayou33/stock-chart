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

type RecursiveRequired<T> = {
  [P in keyof T]-?:
  // T[P] extends (infer U)[] ? RecursiveRequired<U>[] : // 忽略数组的情况 tuple
  T[P] extends Record<string, unknown> ? RecursiveRequired<Required<T[P]>> :
    T[P]
}

type RecursivePartial<T> = {
  [P in keyof T]?:
  // T[P] extends (infer U)[] ? RecursivePartial<U>[] :
  T[P] extends Record<string, unknown> ? RecursivePartial<T[P]> :
    T[P]
}

interface OptionsOf<R, O> {
  define: RecursiveRequired<R> & RecursiveRequired<O>;
  call: R & RecursivePartial<O>;
  partial: RecursivePartial<O> & RecursivePartial<R>;
}

type ConfirmFunctionalKey<O> = {
  [K in keyof O]: O[K] extends ((string | number | Date) | infer P) ? P : O[K]
}

type CellDescriber = Partial<{
  width: number;
  height: number;
}>

type ContainerCell = {
  id: number;
  declaredWidth?: number;
  declaredHeight?: number;
  node: HTMLTableCellElement;
} & Required<CellDescriber>

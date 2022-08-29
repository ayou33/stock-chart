/**
 *  index.d.ts of project stock-chart
 *  @date 2022/7/25 18:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
type BoxPaddingObject = {
  top: number;
  right: number;
  bottom: number;
  left: number;
}

type BoxPadding = Partial<BoxPaddingObject> | number

type Bar = {
  open: number;
  high: number;
  low: number;
  close: number;
  date: number;
  DT: Date;
  volume: number;
}

type BarValueField = Exclude<keyof Bar, 'DT' | 'volume'>

type Patch = {
  symbol: string;
  exchange: string;
  price: number;
  time: number;
}

type ResolutionLiteral = 'tick' | 'millisecond' | 'second' | 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year'

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
  define: R & RecursiveRequired<O>;
  call: R & O;
  partial: RecursivePartial<O> & RecursivePartial<R>;
}

type ConfirmFunctionalKey<O> = {
  [K in keyof O]: O[K] extends ((string | number | Date) | infer P) ? P : O[K]
}

type CellDescriber = Partial<{
  name: string;
  width: number;
  height: number;
  colSpan: number;
  rowSpan: number;
}>

type RowDescriber = {
  name: string;
  cells: (CellDescriber | null)[]
  height?: number;
}

type LayoutDescriber = RowDescriber[]

type Flatten<P> = P extends (infer P)[] ? P : never

type Inputs<T> = { inputs: T }

type IndexName = `index_${number}`

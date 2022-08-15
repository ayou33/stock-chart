/**
 *  IDataFeed.ts of project stock-chart
 *  @date 2022/7/28 17:35
 *  @author 阿佑[ayooooo@petalmail.com]
 */

/**
 * S - second
 * M - minute
 * H - hour
 * d - day
 * w - week
 * m - month
 * s - season
 * y - year
 */
export enum Resolution {
  S1,
  S5,
  M1,
  M5,
  M15,
  M30,
  H1,
  H4,
  d1,
  w1,
  m1,
  s1,
  y1,
}

export type SymbolDescriber = {
  name: string;
  symbol: string;
  exchange: string;
  resolution: Resolution;
  description: string,
}

export type FeedSnapshot = {
  data: Bar[];
}

interface IDataFeed {
  resolveSymbol (symbol: string): Promise<SymbolDescriber>;

  read (symbol: SymbolDescriber, resolution: Resolution): Promise<FeedSnapshot>;

  subscribe (symbol: SymbolDescriber, streamCallback: (bar: Bar) => void): Fn

  unSubscribe (symbol: SymbolDescriber): void
}

export default IDataFeed

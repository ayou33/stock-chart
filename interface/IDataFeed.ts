/**
 *  chart data source feed
 *  IDataFeed.ts of project stock-chart
 *  @date 2022/7/28 17:35
 *  @author 阿佑[ayooooo@petalmail.com]
 */

export type ResolutionLiteral =
  'tick'
  | 'millisecond'
  | 'second'
  | 'minute'
  | 'hour'
  | 'day'
  | 'week'
  | 'month'
  | 'year'

export type Periodicity = {
  interval: number;
  period?: number;
  timeUnit?: ResolutionLiteral,
}

export type Patch = {
  code: string;
  exchange: string;
  price: number;
  time: number;
}

export type SymbolDescriber = {
  name: string;
  code: string;
  exchange: string;
  description?: string,
}

export type FeedSnapshot = {
  data: Bar[];
}

interface IDataFeed {
  resolveSymbol (code: string): Promise<SymbolDescriber>;

  read (symbol: SymbolDescriber, periodicity: Periodicity | null): Promise<FeedSnapshot>;

  subscribe (symbol: SymbolDescriber, streamCallback: (patch: Patch) => void): Fn

  unSubscribe (symbol: SymbolDescriber): void
}

export default IDataFeed

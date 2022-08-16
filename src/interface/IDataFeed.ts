/**
 *  IDataFeed.ts of project stock-chart
 *  @date 2022/7/28 17:35
 *  @author 阿佑[ayooooo@petalmail.com]
 */

export type Periodicity = {
  interval: number;
  period?: number;
  timeUnit?: ResolutionLiteral,
}

export type SymbolDescriber = {
  name: string;
  symbol: string;
  exchange: string;
  periodicity: Periodicity;
  description?: string,
}

export type FeedSnapshot = {
  data: Bar[];
}

export type Subscription = {
  time: number;
  price: number;
}

interface IDataFeed {
  resolveSymbol (symbol: string): Promise<SymbolDescriber>;

  read (symbol: SymbolDescriber): Promise<FeedSnapshot>;

  subscribe (symbol: SymbolDescriber, streamCallback: (subscription: Subscription) => void): Fn

  unSubscribe (symbol: SymbolDescriber): void
}

export default IDataFeed

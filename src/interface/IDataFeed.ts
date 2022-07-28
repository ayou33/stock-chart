/**
 *  IDataFeed.ts of project stock-chart
 *  @date 2022/7/28 17:35
 *  @author 阿佑[ayooooo@petalmail.com]
 */
export type SymbolDescriber = {
  name: string;
}

export type FeedSnapshot = {
  data: Bar[];
}

interface IDataFeed {
  resolveSymbol (symbol: string): Promise<SymbolDescriber>;

  readBars (symbol: SymbolDescriber): Promise<FeedSnapshot>;

  watch (): void;

  unwatch (): void;
}

export default IDataFeed

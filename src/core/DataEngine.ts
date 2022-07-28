/**
 *  DataEngine.ts of project stock-chart
 *  @date 2022/7/28 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Event from '../base/Event'
import IDataFeed from '../interface/IDataFeed'
import { StockChartOptions } from '../options'

class DataEngine  extends Event<'load'> {
  private _dataFeed: IDataFeed | null = null
  private _symbol: string = ''
  private readonly options: StockChartOptions

  constructor (options: StockChartOptions) {
    super()

    this.options = options
  }

  bind (dataFeed: IDataFeed) {
    this._dataFeed = dataFeed
  }

  async load (symbol: string) {
    this._symbol = symbol

    if (this._symbol && this._dataFeed !== null) {
      const symbol = await this._dataFeed.resolveSymbol(this._symbol)
      const result = await this._dataFeed.readBars(symbol)

      this.emit('load', result)

      return result
    }

    return Promise.reject('No symbol or dataFeed provide!')
  }
}

export default DataEngine

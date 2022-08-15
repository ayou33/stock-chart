/**
 *  DataEngine.ts of project stock-chart
 *  @date 2022/7/28 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Event from '../base/Event'
import IDataFeed, { Resolution, SymbolDescriber } from '../interface/IDataFeed'

export type DataEvents = 'load' | 'refresh' | 'append'

class DataEngine extends Event<DataEvents> {
  private _dataFeed: IDataFeed | null = null
  private _symbol: SymbolDescriber | null = null

  attach (dataFeed: IDataFeed) {
    this._dataFeed = dataFeed
  }

  async load (symbolCode: string, resolution: Resolution) {
    if (symbolCode && this._dataFeed !== null) {
      const symbol = await this._dataFeed.resolveSymbol(symbolCode)
      const result = await this._dataFeed.read(symbol, resolution)

      if (symbol !== this._symbol) {
        if (this._symbol) this._dataFeed.unSubscribe(this._symbol)

        this._symbol = symbol
      }

      this.emit('load', symbol, result)

      this._dataFeed.subscribe(symbol, bar => {
        this.stream(bar)
      })

      return result
    }

    return Promise.reject('No symbol or dataFeed provide!')
  }

  private stream (bar: Bar) {
    this.emit('refresh', this._symbol, bar)
    this.emit('append', this._symbol, bar)
  }
}

export default DataEngine

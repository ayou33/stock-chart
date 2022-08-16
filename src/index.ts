/**
 *  index.ts of project stock-chart
 *  @date 2022/7/25 16:32
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import DataSource from './core/DataSource'
import Scene from './core/Scene'
import extend from './helper/extend'
import IDataFeed, { Periodicity } from './interface/IDataFeed'
import stockChartOptions, { StockChartOptions } from './options'

class StockChart {
  private readonly _options: StockChartOptions
  private readonly _dataSource: DataSource
  private readonly _scene: Scene

  public symbol = ''

  constructor (mixed: string | RecursivePartial<StockChartOptions>) {
    const containerOptions = typeof mixed === 'string' ? { root: mixed } : mixed

    this._options = extend(stockChartOptions, containerOptions)

    this._scene = new Scene(this._options)

    this._dataSource = new DataSource(this._options.dataSource)

    this._dataSource.on('set', (_, update) => {
      this._scene.draw(update)
    })
  }

  setData (data: Bar[]) {
    this._dataSource.set(data, {
      symbol: 'BTCUSD',
      name: 'BTCUSD',
      exchange: 'EX',
      periodicity: {
        interval: 30,
      },
    })
  }

  attach (dataFeed: IDataFeed) {
    this._dataSource.attach(dataFeed)
  }

  load (symbol: string, force = false) {
    if (symbol !== this.symbol || force) {
      this.symbol = symbol
      this._dataSource.load(symbol)
    }
  }

  setPeriodicity (periodicity: Periodicity) {
    this._dataSource.setPeriodicity(periodicity)
  }

  stream (patch: Patch) {
    this._dataSource.stream(patch)
  }
}

export default StockChart

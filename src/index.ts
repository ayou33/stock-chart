/**
 *  index.ts of project stock-chart
 *  @date 2022/7/25 16:32
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import DataSource from './core/DataSource'
import Scene from './core/Scene'
import extend from './helper/extend'
import IDataFeed, { Resolution } from './interface/IDataFeed'
import stockChartOptions, { StockChartOptions } from './options'

class StockChart {
  private readonly _options: StockChartOptions
  private readonly _dataSource: DataSource
  private readonly _scene: Scene

  public symbol = ''
  public resolution = Resolution.S1

  constructor (mixed: string | StockChartOptions) {
    const containerOptions = typeof mixed === 'string' ? { container: mixed } : mixed

    this._options = extend(stockChartOptions, containerOptions)

    this._scene = new Scene(this._options)

    this._dataSource = new DataSource(this._options)

    this._dataSource.on('set', (_, update) => {
      this._scene.draw(update)
    })
  }

  setData (data: Bar[]) {
    this._dataSource.set(data)
  }

  addSeries () {
    this._scene.addSeries()
  }

  attach (dataFeed: IDataFeed) {
    this._dataSource.attach(dataFeed)
  }

  load (symbol: string, force = false) {
    if (symbol !== this.symbol || force) {
      this.symbol = symbol
      this._dataSource.load(symbol, this.resolution)
    }
  }

  changeResolution (resolution: Resolution) {
    if (resolution !== this.resolution) {
      this.resolution = resolution
      this.load(this.symbol, true)
    }
  }
}

export default StockChart

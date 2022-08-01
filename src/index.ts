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
  private readonly options: StockChartOptions
  private readonly dataSource: DataSource
  private readonly scene: Scene

  public symbol = ''
  public resolution = Resolution.S1

  constructor (mixed: string | StockChartOptions) {
    const containerOptions = typeof mixed === 'string' ? { container: mixed } : mixed

    this.options = extend(stockChartOptions, containerOptions)

    this.scene = new Scene(this.options)

    this.dataSource = new DataSource(this.options)

    this.dataSource.on('set', (_, update) => {
      this.scene.draw(update)
    })

    this.dataSource.on('beforeSet', (_, a) => {
      console.log('jojo before', a)
    })
  }

  setData (data: Bar[]) {
    this.dataSource.set(data)
  }

  addSeries () {
    this.scene.addSeries()
  }

  attach (dataFeed: IDataFeed) {
    this.dataSource.attach(dataFeed)
  }

  load (symbol: string, force = false) {
    if (symbol !== this.symbol || force) {
      this.symbol = symbol
      this.dataSource.load(symbol, this.resolution)
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

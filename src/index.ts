/**
 *  index.ts of project stock-chart
 *  @date 2022/7/25 16:32
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import DataSource from './core/DataSource'
import Scene from './core/Scene'
import extend from './helper/extend'
import IDataFeed from './interface/IDataFeed'
import stockChartOptions, { StockChartOptions } from './options'

class StockChart {
  private readonly options: StockChartOptions
  private readonly dataSource: DataSource
  private readonly scene: Scene

  public symbol = ''

  constructor (mixed: string | StockChartOptions) {
    const containerOptions = typeof mixed === 'string' ? { container: mixed } : mixed

    this.options = extend(stockChartOptions, containerOptions)

    this.dataSource = new DataSource(this.options)

    this.dataSource.on('set', (_, a) => {
      console.log('jojo', a)
    })

    this.dataSource.on('beforeSet', (_, a) => {
      console.log('jojo before', a)
    })

    this.dataSource.set([
      {
        open: 1,
        high: 1,
        low: 1,
        close: 1,
        date: 1,
        DT: new Date(),
        volume: 1,
      },
    ])

    this.scene = new Scene(this.options)
  }

  setData (data: Bar[]) {
    this.dataSource.set(data)
  }

  addSeries () {
    this.scene.addSeries()
  }

  attach (dataFeed: IDataFeed) {
    this.dataSource.bind(dataFeed)
  }

  load (symbol: string, force = false) {
    if (symbol !== this.symbol || force) {
      this.symbol = symbol
      this.dataSource.load(symbol)
    }

  }

  resize () {
  }
}

export default StockChart

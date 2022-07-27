/**
 *  index.ts of project stock-chart
 *  @date 2022/7/25 16:32
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import DataSource from './core/DataSource'
import Scene from './core/Scene'
import extend from './helper/extend'
import stockChartOptions, { StockChartOptions } from './options'

class StockChart {
  private readonly options: StockChartOptions
  private readonly container: Element
  private readonly dataSource: DataSource
  private readonly scene: Scene

  constructor (mixed: string | StockChartOptions) {
    const containerOptions = typeof mixed === 'string' ? { container: mixed } : mixed

    this.options = extend(stockChartOptions, containerOptions)

    const el = document.querySelector(this.options.container)

    if (el === null) {
      throw new ReferenceError('Invalid container reference!')
    }

    this.container = el

    const context = this.canvas.getContext('2d')

    if (context === null) {
      throw new ReferenceError('Invalid canvas rendering context')
    }

    this.dataSource = new DataSource()

    this.scene = new Scene()
  }

  setData (data: Bar[]) {
    this.dataSource.set(data)
  }
}

export default StockChart

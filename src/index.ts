/**
 *  index.ts of project stock-chart
 *  @date 2022/7/25 16:32
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import DataSource from './core/DataSource'
import MainAxis from './core/MainAxis'
import Series from './core/Series'
import Drawing from './extend/Drawing'
import Indicator from './extend/Indicator'
import Marker from './extend/Marker'
import extend from './helper/extend'
import stockChartOptions, { StockChartOptions } from './options'

class StockChart {
  private readonly options: StockChartOptions
  private readonly container: Element
  private readonly canvas = document.createElement('canvas')
  private readonly context: CanvasRenderingContext2D
  private readonly series: Series
  private readonly mainAxis: MainAxis
  private readonly dataSource: DataSource

  private drawing: Drawing | null = null
  private indicator: Indicator | null = null
  private marker: Marker | null = null

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

    this.context = context

    this.mainAxis = new MainAxis()

    this.series = new Series()

    this.dataSource = new DataSource()
  }

  setData () {
  }
}

export default StockChart

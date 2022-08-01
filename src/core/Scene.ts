/**
 *  管理所有与canvas相关的[需要绘制]组件
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import debouce from 'lodash.debounce'
import Drawing from '../extend/Drawing'
import Indicator from '../extend/Indicator'
import Marker from '../extend/Marker'
import extend from '../helper/extend'
import { stockChartOptions, StockChartOptions } from '../options'
import Chart from './Chart'
import { UpdatePayload } from './DataSource'
import Layout from './Layout'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly options: StockChartOptions
  private readonly container: Element
  private readonly layout: Layout
  private readonly mainAxis = new MainAxis()
  private readonly series: Series[] = []
  private readonly charts: Chart[] = []
  private drawing: Drawing | null = null
  private indicator: Indicator | null = null
  private marker: Marker | null = null

  constructor (options: StockChartOptions) {
    this.options = extend(stockChartOptions, options)

    const el = document.querySelector(options.container)

    if (el === null) {
      throw new ReferenceError('Invalid container reference!')
    }

    this.container = el

    this.layout = new Layout(this.container.getBoundingClientRect())

    this.container.appendChild(this.layout.node())

    this.onResize = debouce(this.onResize.bind(this), 1000 / 6)

    window.addEventListener('resize', this.onResize)
  }

  measureLayout () {
    return {}
  }

  draw (update: UpdatePayload) {
    // this.mainAxis.draw()
    // this.series.forEach(s => s.draw())
    // this.charts.forEach(c => c.draw())
  }

  addSeries () {}

  onResize () {
    console.log('jojo on resize')
  }
}

export default Scene

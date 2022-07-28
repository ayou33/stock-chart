/**
 *  管理所有与canvas相关的[需要绘制]组件
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Drawing from '../extend/Drawing'
import Indicator from '../extend/Indicator'
import Marker from '../extend/Marker'
import { StockChartOptions } from '../options'
import Chart from './Chart'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly container: Element
  private readonly mainAxis = new MainAxis()
  private readonly series: Series[] = []
  private readonly charts: Chart[] = []
  private drawing: Drawing | null = null
  private indicator: Indicator | null = null
  private marker: Marker | null = null

  constructor (options: StockChartOptions) {
    const el = document.querySelector(options.container)

    if (el === null) {
      throw new ReferenceError('Invalid container reference!')
    }

    this.container = el

    /*
    const context = this.canvas.getContext('2d')

    if (context === null) {
      throw new ReferenceError('Invalid canvas rendering context')
    }
     */

  }


  draw () {
    this.mainAxis.draw()
    this.series.forEach(s => s.draw())
    this.charts.forEach(c => c.draw())
  }

  addSeries () {}
}

export default Scene

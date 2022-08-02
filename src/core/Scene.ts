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
import aa from '../helper/aa'
import extend from '../helper/extend'
import { stockChartOptions, StockChartOptions } from '../options'
import Chart from './Chart'
import { UpdatePayload } from './DataSource'
import Layout from './Layout'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly _options: StockChartOptions
  private readonly _container: Element
  private readonly _layout: Layout
  private readonly _canvas: HTMLCanvasElement
  private readonly _context: CanvasRenderingContext2D
  private readonly _mainAxis = new MainAxis()
  private readonly _series: Series[] = []
  private readonly _charts: Chart[] = []
  private _drawing: Drawing | null = null
  private _indicator: Indicator | null = null
  private _marker: Marker | null = null

  constructor (options: StockChartOptions) {
    this._options = extend(stockChartOptions, options)

    const el = document.querySelector(options.container)

    if (el === null) {
      throw new ReferenceError('Invalid container reference!')
    }

    this._container = el

    this._layout = new Layout(this._container.getBoundingClientRect())

    this._container.appendChild(this._layout.node())

    this._canvas = document.createElement('canvas')

    const context = this._canvas.getContext('2d')

    if (!context) {
      throw new ReferenceError('Canvas rendering 2d context reference error')
    }

    this._context = context

    this.build()

    this.onResize = debouce(this.onResize.bind(this), 1000 / 6)

    window.addEventListener('resize', this.onResize)
  }

  measureLayout () {
    return {}
  }

  build () {
    const cell = this._layout.chart()
    this._canvas.width = cell.width
    this._canvas.height = cell.height
    aa(this._context, cell.width, cell.height)
    cell.dom.appendChild(this._canvas)
  }

  draw (update: UpdatePayload) {
    console.log('jojo', update, this._canvas)
    this._context.beginPath()
    this._context.strokeStyle = 'black'
    this._context.lineWidth = 1
    this._context.moveTo(0, 0)
    this._context.lineTo(1064, 1183.33)
    this._context.stroke()

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

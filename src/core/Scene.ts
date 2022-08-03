/**
 *  管理所有与canvas相关的[需要绘制]组件
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import debouce from 'lodash.debounce'
import Crosshair from '../extend/Crosshair'
import Drawing from '../extend/Drawing'
import Indicator from '../extend/Indicator'
import Marker from '../extend/Marker'
import aa from '../helper/aa'
import extend from '../helper/extend'
import IRenderer from '../interface/IRenderer'
import ISeries from '../interface/ISeries'
import { stockChartOptions, StockChartOptions } from '../options'
import { UpdatePayload } from './DataSource'
import Layout from './Layout'
import MainAxis from './MainAxis'

class Scene {
  private readonly _options: StockChartOptions
  private readonly _container: Element
  private readonly _layout: Layout
  private readonly _canvas: HTMLCanvasElement
  private readonly _context: CanvasRenderingContext2D
  private readonly _mainAxis = new MainAxis()
  private readonly _series: ISeries[] = []
  private readonly _charts: IRenderer[] = []

  private _payload: UpdatePayload | null = null
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

    this.render()

    this.onResize = debouce(this.onResize.bind(this), 1000 / 6)

    window.addEventListener('resize', this.onResize)
  }

  private buildChart () {
    const container = this._layout.chart()
    this._canvas.width = container.width
    this._canvas.height = container.height
    aa(this._context, container.width, container.height)
    container.node.appendChild(this._canvas)
    this._charts.push(new Crosshair({
      container,
      xAxis: this._mainAxis,
      yAxis: this._series[0],
    }).render())
  }

  private buildSeries () {}

  private buildMainAxis () {}

  render () {
    this.buildChart()
    this.buildSeries()
    this.buildMainAxis()
  }

  private drawCharts () {
    const chart = this._layout.chart()
    this._context.beginPath()
    this._context.strokeStyle = 'black'
    this._context.lineWidth = 1
    this._context.moveTo(0, 0)
    this._context.lineTo(chart.width, chart.height)
    this._context.stroke()
  }

  private drawSeries () {}

  private drawMainAxis () {}

  draw (update: UpdatePayload) {
    this._payload = update

    this.drawCharts()
    this.drawSeries()
    this.drawMainAxis()
  }

  addSeries () {}

  addIndicator () {}

  addDrawing () {}

  addMarker () {}

  private onResize () {
    this._layout.resize(this._container.getBoundingClientRect())
    this.render()
    if (this._payload) {
      this.draw(this._payload)
    }
  }
}

export default Scene

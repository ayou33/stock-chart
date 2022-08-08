/**
 *  管理所有与canvas相关的[需要绘制]组件
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import debounce from 'lodash.debounce'
import Candle from '../chart/Candle'
import Crosshair from '../extend/Crosshair'
import Drawing from '../extend/Drawing'
import Indicator from '../extend/Indicator'
import Marker from '../extend/Marker'
import extend from '../helper/extend'
import IAxis from '../interface/IAxis'
import IChart from '../interface/IChart'
import { stockChartOptions, StockChartOptions } from '../options'
import { UpdatePayload } from './DataSource'
import Layout from './Layout'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly _options: StockChartOptions
  private readonly _container: Element
  private readonly _layout: Layout
  private readonly _mainAxis
  private readonly _series: Record<'default' | string, IAxis> = {}
  private readonly _charts: IChart[] = []

  private _data: UpdatePayload | null = null
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

    this._mainAxis = new MainAxis({
      container: this._layout.mainAxis(),
    })

    this.render()

    this.onResize = debounce(this.onResize.bind(this), 1000 / 6)

    window.addEventListener('resize', this.onResize)
  }

  private buildSeries () {
    const container = this._layout.series()
    const y = new Series({
      container,
    })
    y.range([0, container.height])
    y.render()
    this._series.default = y
  }

  private buildChart () {
    const container = this._layout.chart()

    const chart = new Candle({
      container,
      xAxis: this._mainAxis,
      yAxis: this._series.default,
    })
      .render()

    const crosshair = new Crosshair({
      container,
      xAxis: this._mainAxis,
      yAxis: this._series.default,
    })
      .render()
      .on('focus', (_, x: number, y: number) => {
        this._mainAxis.focus(x)
        this._series.default.focus(y)
      })
      .on('blur', () => {
        this._mainAxis.blur()
        this._series.default.blur()
      })
      .on('transform', (_, t: number, confirm: () => void) => {
        this._mainAxis.transform(t, confirm)
        // this._series.default.transform(t, confirm)
      })

    this._charts.push(chart, crosshair)
  }

  render () {
    this.buildSeries()
    this.buildChart()
  }

  private drawSeries (update: UpdatePayload) {
    (this._series.default as Series).domain(update.extent)
    this._series.default.render()
  }

  private drawMainAxis (update: UpdatePayload) {
    this._mainAxis.domain(update.domain)
    this._mainAxis.range([-Infinity, this._layout.mainAxis().width])
    this._mainAxis.render()
  }

  private drawCharts (update: UpdatePayload) {
    this._charts.map(c => c.draw(update))
  }

  draw (update: UpdatePayload) {
    this._data = update

    this.drawSeries(update)
    this.drawMainAxis(update)
    this.drawCharts(update)
  }

  addSeries () {
  }

  addIndicator () {
  }

  addDrawing () {
  }

  addMarker () {
  }

  private onResize () {
    this._layout.resize(this._container.getBoundingClientRect())
    this.render()
    if (this._data) {
      this.draw(this._data)
    }
  }
}

export default Scene

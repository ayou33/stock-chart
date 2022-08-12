/**
 *  管理所有与canvas相关的[需要绘制]组件
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import debounce from 'lodash.debounce'
import Candle from '../chart/Candle'
import Crosshair from '../extend/Crosshair'
import IAxis from '../interface/IAxis'
import IChart from '../interface/IChart'
import { StockChartOptions } from '../options'
import { UpdateLevel, UpdatePayload } from './DataSource'
import Layout from './Layout'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly _container: Element
  private readonly _layout: Layout
  private readonly _mainAxis
  private readonly _series: Record<'default' | string, IAxis> = {}
  private readonly _charts: IChart[] = []

  private _lastUpdate: UpdatePayload | null = null

  constructor (options: StockChartOptions) {
    const el = document.querySelector(options.container)

    if (el === null) {
      throw new ReferenceError('Invalid container reference!')
    }

    this._container = el

    this._layout = new Layout(this._container.getBoundingClientRect())

    this._container.appendChild(this._layout.node())

    const mainAxisContainer = this._layout.mainAxis()

    this._mainAxis = new MainAxis({
      container: mainAxisContainer,
    })

    this.render()

    this.onResize = debounce(this.onResize.bind(this), 1000 / 6)

    window.addEventListener('resize', this.onResize)
  }

  private renderSeries () {
    const container = this._layout.series()
    const defaultSeries = new Series({
      container,
    })
    defaultSeries.range([0, container.height])
    this._series.default = defaultSeries
  }

  private renderMainAxis () {
    this._mainAxis.range([-Infinity, this._layout.mainAxis().width])
  }

  private renderChart () {
    const container = this._layout.chart()

    const candle = new Candle({
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
      .on('transform', () => {
        if (this._lastUpdate) {
          this._lastUpdate.level = UpdateLevel.ALL
          this.draw()
        }
      })

    this._charts.push(candle, crosshair)
  }

  render () {
    this.renderMainAxis()
    this.renderSeries()
    this.renderChart()
  }

  draw (update?: UpdatePayload) {
    if (update) {
      this._lastUpdate = update
    }

    if (this._lastUpdate) {
      this._mainAxis.draw(this._lastUpdate)
      this._series.default.draw(this._lastUpdate)
      this._charts.map(c => c.draw(this._lastUpdate as UpdatePayload))
    }
  }

  private onResize () {
    this._layout.resize(this._container.getBoundingClientRect())
    this._mainAxis.resize()
    this._series.default.resize()
    this._charts.map(c => c.resize())
  }
}

export default Scene

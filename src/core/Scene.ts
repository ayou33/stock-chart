/**
 *  管理所有与canvas相关的[需要绘制]组件
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Candle from '../chart/Candle'
import Board from '../extend/Board'
import extend from '../helper/extend'
import { IndicatorInputs, IndicatorNames } from '../indicator/all'
import IAxis from '../interface/IAxis'
import IRenderer from '../interface/IRenderer'
import Layout from '../layout/Layout'
import { StockChartOptions } from '../options'
import { UpdateLevel, UpdatePayload } from './DataSource'
import IndicatorMaster from './IndicatorMaster'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly _options: StockChartOptions
  private readonly _layout: Layout
  private readonly _mainAxis
  private readonly _series: Record<'default' | string, IAxis> = {}
  private readonly _renderers: IRenderer[] = []

  private _indicatorMaster: IndicatorMaster | null = null
  private _lastUpdate: UpdatePayload | null = null

  constructor (options: StockChartOptions) {
    this._options = options

    const container = document.querySelector(options.root)

    if (container === null) {
      throw new ReferenceError('Invalid container reference!')
    }

    this._layout = new Layout(container)
      .on('resize', this.onResize.bind(this))

    const mainAxisContainer = this._layout.mainAxis()

    this._mainAxis = new MainAxis(mainAxisContainer, extend({
      focus: this._options.crosshair,
    }, this._options.mainAxis))

    this.render()
  }

  private useIndicatorMaster () {
    if (this._indicatorMaster === null)
      this._indicatorMaster = new IndicatorMaster({
        xAxis: this._mainAxis,
        yAxis: this._series.default,
        layout: this._layout,
      })

    return this._indicatorMaster
  }

  private renderSeries () {
    const container = this._layout.series()
    this._series.default = new Series(
      container,
      extend({
        focus: this._options.crosshair,
        currentPrice: this._options.currentPrice,
      }, this._options.defaultSeries),
    )
  }

  private renderMainAxis () {
    this._mainAxis.range([-Infinity, this._layout.mainAxis().width()])
  }

  private renderChart () {
    const container = this._layout.chart()

    const chartOptions = {
      container,
      xAxis: this._mainAxis,
      yAxis: this._series.default,
      ...this._options,
    }

    const candle = new Candle(chartOptions).render()

    const board = new Board(chartOptions)
      .render()
      .on('focus', (_, x: number, y: number) => {
        this._mainAxis.focus(x)
        this._series.default.focus(y)
        this._indicatorMaster?.focus(x)
      })
      .on('blur', () => {
        this._mainAxis.blur()
        this._series.default.blur()
        this._indicatorMaster?.blur()
      })
      .on('transform', () => {
        if (this._lastUpdate) {
          this._lastUpdate.level = UpdateLevel.FULL
          this.apply()
        }
      })

    this._renderers.push(candle, board, this.useIndicatorMaster())
  }

  render () {
    this.renderMainAxis()
    this.renderSeries()
    this.renderChart()
  }

  apply (update?: UpdatePayload) {
    if (update) {
      this._lastUpdate = update
    }

    if (this._lastUpdate) {
      this._mainAxis.apply(this._lastUpdate)
      this._series.default.apply(this._lastUpdate)
      this._renderers.map(c => c.apply(this._lastUpdate as UpdatePayload))
    }
  }

  private onResize () {
    this._mainAxis.resize()
    this._series.default.resize()
    this._renderers.map(c => c.resize())
  }

  addStudy <T extends IndicatorNames>(name: T, inputs?: IndicatorInputs[T]) {
    return this.useIndicatorMaster().add(name, inputs)
  }
}

export default Scene

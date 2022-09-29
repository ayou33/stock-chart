/**
 *  管理所有与canvas相关的[需要绘制]组件
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { Transform } from 'nanie'
import Candle from '../chart/Candle'
import Board from '../extend/Board'
import extend from '../helper/extend'
import { IndicatorInputs, IndicatorNames } from '../indicator/all'
import IAxis from '../interface/IAxis'
import IRenderer from '../interface/IRenderer'
import Layout from '../layout/Layout'
import { StockChartOptions } from '../options'
import { UpdateLevel, UpdatePayload } from './DataSource'
import DrawingMaster from './DrawingMaster'
import IndicatorMaster from './IndicatorMaster'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly $container: Element
  private readonly _options: StockChartOptions
  private readonly _layout: Layout
  private readonly _mainAxis
  private readonly _series: Record<'default' | string, IAxis> = {}
  private readonly _renderers: IRenderer[] = []

  private $loading: Element | null = null
  private _indicatorMaster: IndicatorMaster | null = null
  private _drawingMaster: DrawingMaster | null = null
  private _board: Board | null = null
  private _lastUpdate: UpdatePayload | null = null

  constructor (options: StockChartOptions) {
    this._options = options

    const container = document.querySelector(options.root)

    if (container === null) {
      throw new ReferenceError('Invalid container reference!')
    }

    this.$container = container

    this._layout = new Layout(container, this._options.layout)
      .on('resize', this.onResize.bind(this))

    const mainAxisContainer = this._layout.mainAxis()

    this._mainAxis = new MainAxis(mainAxisContainer, extend({
      focus: this._options.crosshair,
    }, this._options.mainAxis))

    this.render()
  }

  private useIndicatorMaster () {
    if (this._indicatorMaster === null) {
      this._indicatorMaster = new IndicatorMaster({
        xAxis: this._mainAxis,
        yAxis: this._series.default,
        layout: this._layout,
      })
        .on('focus', (_, x: number, date: number) => {
          this._mainAxis.focus(x, date)
        })
        .on('transformed', (_, transform: Transform) => {
          /**
           * 保持主图和副图的transform信息一致
           */
          this._board?.applyTransform(transform)
        })
    }

    return this._indicatorMaster
  }

  private renderMainAxis () {
    this._mainAxis.range([-Infinity, this._layout.mainAxis().width()])
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

  private renderChart () {
    const container = this._layout.chart()

    const chartOptions = {
      container,
      xAxis: this._mainAxis,
      yAxis: this._series.default,
      ...this._options,
    }

    const candle = new Candle(chartOptions).render()

    /**
     * 主图画板,承载用户手势与图形绘制
     */
    this._board = new Board(chartOptions)
      .render()
      .on('focus', (_, x: number, y: number, date: number) => {
        this._mainAxis.focus(x, date)
        this._series.default.focus(y, NaN)
        this._indicatorMaster?.focus(x, date)
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
      .on('transformed', (_, transform: Transform) => {
        /**
         * 保持主图和副图的transform信息一致
         */
        this.useIndicatorMaster().applyTransform(transform)
      })
      .on('click', (_, [x, y]: Vector) => {
        this.useDrawing().pick(x, y)
      })

    this._renderers.push(candle, this._board, this.useIndicatorMaster())
  }

  render () {
    this.renderMainAxis()
    this.renderSeries()
    this.renderChart()
  }

  private setUpdateSpan (update: UpdatePayload) {
    const rightMostRange = this._layout.mainAxis()?.width() ?? 0
    const [left, right] = update.span
    const leftMostRender = this._mainAxis.invert(0)
    const rightMostRender = this._mainAxis.invert(rightMostRange)

    if (update.domain[right] < leftMostRender || update.domain[left] > rightMostRender) {
      return {
        ...update,
        span: [0, 0],
      } as UpdatePayload
    }

    return {
      ...update,
      span: [this._mainAxis.index(0) ?? 0, (this._mainAxis.index(rightMostRange) ?? right) + 1],
    } as UpdatePayload
  }

  apply (update?: UpdatePayload) {
    if (update) {
      this._lastUpdate = update

      if (update.level !== UpdateLevel.PATCH) {
        this._mainAxis.domain(update.domain)
      }
    }

    if (this._lastUpdate) {
      this._mainAxis.apply(this._lastUpdate)

      const focusedUpdate = this.setUpdateSpan(this._lastUpdate)

      this._series.default.apply(focusedUpdate)
      this._renderers.map(c => c.apply(focusedUpdate))
    }
  }

  private onResize () {
    this._mainAxis.resize()
    this._series.default.resize()
    this._renderers.map(c => c.resize())
  }

  addStudy<T extends IndicatorNames> (name: T, inputs?: IndicatorInputs[T], typeUnique = false) {
    return this.useIndicatorMaster().add(name, inputs, typeUnique)
  }

  private useDrawing () {
    if (!this._drawingMaster) {
      if (this._board) {
        this._drawingMaster = new DrawingMaster(this._board.getContext())
      } else {
        throw new ReferenceError('No Drawing Context Find!')
      }
    }

    return this._drawingMaster
  }

  createDrawing (type: string) {
    return this.useDrawing().create(type)
  }

  renderDrawing () {
    return this.useDrawing().render()
  }

  loading () {
    if (!this.$loading) {
      const div = document.createElement('div')

      div.classList.add('sc_loading')

      div.innerHTML = `
        <div class="mask"></div>
        <div class="halo"></div>
        <div class="face"></div>
    `

      this.$loading = div
    }

    this.$container.append(this.$loading)
  }

  loaded () {
    if (this.$loading) {
      this.$container.removeChild(this.$loading)
    }
  }
}

export default Scene

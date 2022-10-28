/**
 *  管理所有与canvas相关的[需要绘制]组件
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import extend from '../helper/extend'
import { IndicatorInputs, IndicatorNames } from '../indicator/all'
import IAxis from '../interface/IAxis'
import ChartLayer from '../layer/ChartLayer'
import IndicatorLayer from '../layer/IndicatorLayer'
import ReactiveLayer from '../layer/ReactiveLayer'
import Layout from '../layout/Layout'
import { StockChartOptions } from '../options'
import { UpdateLevel, UpdatePayload } from './DataSource'
import MainAxis from './MainAxis'
import Series from './Series'

class Scene {
  private readonly $container: Element
  private readonly _options: StockChartOptions
  private readonly _layout: Layout
  private readonly _mainAxis
  private readonly _series: Record<'default' | string, IAxis> = {}
  private readonly _chartLayer: ChartLayer
  private readonly _indicatorLayer: IndicatorLayer
  private readonly _reactiveLayer: ReactiveLayer

  private _lastUpdate: UpdatePayload | null = null
  private _$loading: Element | null = null

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

    this._mainAxis.range([-Infinity, this._layout.mainAxis().width()])

    this._series.default = new Series(
      this._layout.series(),
      extend({
        focus: this._options.crosshair,
        currentPrice: this._options.currentPrice,
      }, this._options.defaultSeries),
    )

    const layerOptions = {
      xAxis: this._mainAxis,
      yAxis: this._series.default,
      container: this._layout.chart(),
      layout: this._layout,
    }

    const applyTransform = this.applyTransform.bind(this)

    this._reactiveLayer = new ReactiveLayer(layerOptions, options, applyTransform)

    this._chartLayer = new ChartLayer({
      ...layerOptions,
      board: this._reactiveLayer.board,
    }).addChart('candle', options)

    this._indicatorLayer = new IndicatorLayer({
      ...layerOptions,
      board: this._reactiveLayer.board,
    }, applyTransform)
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

  private onResize () {
    this._mainAxis.resize()
    this._series.default.resize()
    this._chartLayer.resize()
    this._indicatorLayer.resize()
    this._reactiveLayer.resize()
  }

  private applyTransform () {
    if (this._lastUpdate) {
      this._lastUpdate.level = UpdateLevel.FULL
      this.apply()
    }
  }

  apply (update?: UpdatePayload) {
    if (update) {
      this._lastUpdate = update

      if (update.level === UpdateLevel.APPEND || update.level === UpdateLevel.FULL) {
        this._mainAxis.domain(update.domain)
      }

      // console.log('[jojo]update level:', update.level, 'update last domain:', update.domain.slice(-1)[0], 'axis last domain:', this._mainAxis.domain().slice(-1)[0])
    }

    if (this._lastUpdate) {
      this._mainAxis.apply(this._lastUpdate)

      const focusedUpdate = this.setUpdateSpan(this._lastUpdate)

      this._series.default.apply(focusedUpdate)
      this._chartLayer.apply(focusedUpdate)
      this._indicatorLayer.apply(focusedUpdate)
      this._reactiveLayer.apply(focusedUpdate)
    }
  }

  addStudy<T extends IndicatorNames> (name: T, inputs?: IndicatorInputs[T], typeUnique = false) {
    return this._indicatorLayer.add(name, inputs, typeUnique)
  }

  createDrawing (type: string) {
    return this._chartLayer.createDrawing(type)
  }

  renderDrawing () {
    return this._chartLayer.renderDrawing()
  }

  loading () {
    if (!this._$loading) {
      const div = document.createElement('div')

      div.classList.add('sc_loading')

      div.innerHTML = `
        <div class="mask"></div>
        <div class="halo"></div>
        <div class="face"></div>
    `

      this._$loading = div
    }

    this.$container.append(this._$loading)
  }

  loaded () {
    if (this._$loading) {
      this.$container.removeChild(this._$loading)
    }
  }
}

export default Scene

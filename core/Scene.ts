/**
 *  管理所有与canvas相关的[需要绘制]组件
 *  Scene.ts of project stock-chart
 *  @date 2022/7/27 17:52
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'
import { DrawingOptions, DrawingType } from '../drawing/drawings'
import extend from '../helper/extend'
import { IndicatorInputs, IndicatorNames } from '../indicator/indicators'
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
    }).addChart(options)

    this._indicatorLayer = new IndicatorLayer({
      ...layerOptions,
      board: this._reactiveLayer.board,
    }, applyTransform)
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

  applyUpdate (update: UpdatePayload) {
    this._mainAxis.apply(update)
    this._series.default.apply(update)
    this._chartLayer.apply(update)
    this._indicatorLayer.apply(update)
    this._reactiveLayer.apply(update)
  }

  apply (update?: UpdatePayload) {
    const p = update ?? this._lastUpdate

    if (p) {
      const update = { ...p }

      /**
       * 限定主轴渲染区间[开始渲染index, 结束渲染index + 1]
       */
      update.span = this._mainAxis.extent(update)[1]

      if (update.level !== UpdateLevel.REPLAY) {
        /**
         * 限定交叉轴渲染区间[最小值, 最大值]
         */
        const [isChanged, extent] = this._series.default.extent(update)
        if (isChanged) {
          update.extent = extent
          update.level = UpdateLevel.FULL
        }
      }

      this.applyUpdate(this._lastUpdate = update)
    }
  }

  addStudy<T extends IndicatorNames> (name: T, inputs?: IndicatorInputs[T], typeUnique = false) {
    return this._indicatorLayer.add(name, inputs, typeUnique)
  }

  createDrawing<T extends DrawingType> (type: T, options?: DrawingOptions[T]) {
    return this._chartLayer.createDrawing(type, options)
  }

  clearDrawing () {
    this._chartLayer.clearDrawing()
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
    if (this._$loading?.parentElement === this.$container) {
      this.$container.removeChild(this._$loading)
    }
  }

  home (duration = 0) {
    this._reactiveLayer.board.applyTransform(new Transform(), duration)
  }

  activeChart () {
    return this._chartLayer.chart
  }

  destroy () {
    this._chartLayer.destroy()
    this._reactiveLayer.destroy()
    this._indicatorLayer.destroy()
    this._layout.destroy()
  }
}

export default Scene

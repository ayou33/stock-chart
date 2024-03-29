/**
 *  index.ts of project stock-chart
 *  @date 2022/7/25 16:32
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import DataSource from './core/DataSource'
import Scene from './core/Scene'
import { DrawingOptions, DrawingType } from './drawing/drawings'
import extend from './helper/extend'
import { IndicatorInputs, IndicatorNames } from './indicator/indicators'
import IDataFeed, { Periodicity } from './interface/IDataFeed'
import IIndicator from './interface/IIndicator'
import stockChartOptions, { StockChartOptions } from './options'
import './index.css'

export class StockChart {
  private readonly _options: StockChartOptions
  private readonly _dataSource: DataSource
  private readonly _scene: Scene

  public symbol = ''

  constructor (mixed: string | RecursivePartial<StockChartOptions>) {
    const containerOptions = typeof mixed === 'string' ? { root: mixed } : mixed

    this._options = extend(stockChartOptions, containerOptions)

    this._scene = new Scene(this._options)

    this._dataSource = new DataSource(this._options.dataSource)
      .on('loading', () => this._scene.loading())
      .on('loaded', () => this._scene.loaded())

    this._dataSource.on('update', (_, update) => {
      this._scene.apply(update)
    })
  }

  attach (dataFeed: IDataFeed) {
    this._dataSource.attach(dataFeed)

    return this
  }

  async load (symbol: string) {
    this.symbol = symbol
    const result = await this._dataSource.load(symbol)
    this.home()
    return result
  }

  clearDrawings () {
    this._scene.clearDrawing()

    return this
  }

  setPeriodicity (periodicity: Periodicity) {
    this._dataSource.setPeriodicity(periodicity)

    return this
  }

  addStudy<T extends IndicatorNames> (name: T, inputs?: IndicatorInputs[T], typeUnique = false): IIndicator<IndicatorInputs[T]> {
    return this._scene.addStudy(name, inputs, typeUnique)
  }

  showStudy<T extends IndicatorNames> (name: T, inputs?: IndicatorInputs[T]): IIndicator<IndicatorInputs[T]> {
    return this.addStudy(name, inputs, true)
  }

  draw <T extends DrawingType>(type: T, options?: DrawingOptions[T]) {
    return this._scene.createDrawing(type, options)
  }

  progress (state: boolean) {
    if (state) {
      this._scene.loading()
    } else {
      this._scene.loaded()
    }

    return this
  }

  home () {
    this._scene.home()
  }

  activeChart () {
    return this._scene.activeChart()
  }

  destroy () {
    this._dataSource.destroy()
    this._scene.destroy()
  }
}

export default StockChart

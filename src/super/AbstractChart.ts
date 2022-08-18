/**
 *  顶层抽象渲染器
 *  AbstractRenderer.ts of project stock-chart
 *  @date 2022/8/3 15:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import IAxis from '../interface/IAxis'
import IChart from '../interface/IChart'
import IMainAxis from '../interface/IMainAxis'
import { RendererOptions } from '../options'
import AbstractCanvas from './AbstractCanvas'

abstract class AbstractChart<E extends string, T = unknown> extends AbstractCanvas<E> implements IChart {
  protected readonly _options: RendererOptions & T
  xAxis: IMainAxis
  yAxis: IAxis

  constructor (options: RendererOptions & T) {
    super(options.container, options.context)

    this._options = options

    this.autoStroke = options.autoStroke ?? !options.context

    this.yAxis = options.yAxis

    this.xAxis = options.xAxis
  }

  draw (update: UpdatePayload): this {
    if (update.level === UpdateLevel.PATCH) {
      this.drawLatest(update)
    } else {
      this.drawAll(update)
    }

    return this
  }

  abstract drawAll (update: UpdatePayload): this

  abstract drawLatest (update: UpdatePayload): this
}


export default AbstractChart

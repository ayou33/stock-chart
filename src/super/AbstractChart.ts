/**
 *  顶层抽象渲染器
 *  AbstractRenderer.ts of project stock-chart
 *  @date 2022/8/3 15:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import IAxis from '../interface/IAxis'
import IChart from '../interface/IChart'
import IMainAxis from '../interface/IMainAxis'
import { RendererOptions } from '../options'
import AbstractCanvas from './AbstractCanvas'

abstract class AbstractChart<E extends string, T = unknown> extends AbstractCanvas<E> implements IChart {
  options: RendererOptions & T
  autoStroke = true
  xAxis: IMainAxis
  yAxis: IAxis

  constructor (options: RendererOptions & T) {
    super(options.container)

    this.options = options

    this.autoStroke = options.autoStroke ?? !options.context

    if (options.context) {
      this.context = options.context
      this.canvas = this.context.canvas
    }

    this.yAxis = options.yAxis

    this.xAxis = options.xAxis

    return this
  }

  abstract paint (update: UpdatePayload): this
}

export default AbstractChart

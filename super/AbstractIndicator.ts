/**
 *  @file         src/super/AbstractIndicator.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/23 16:08
 *  @description
 */
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import Series from '../core/Series'
import extend from '../helper/extend'
import IIndicator, { DisplayType, Inputs } from '../interface/IIndicator'
import { RenderOptions } from '../options'
import AbstractShape from './AbstractShape'

abstract class AbstractIndicator<I extends object, O> extends AbstractShape implements IIndicator<I, O> {
  static displayType: DisplayType = DisplayType.INNER

  displayType = DisplayType.INNER

  output: O[] = []

  inputs: I

  constructor (options: RenderOptions & RecursivePartial<Inputs<I>>, name?: string) {
    super(options, name)

    this.inputs = this.default(options.inputs)

    if (this.isExternal()) {
      /**
       * 副图指标的y轴不渲染，这里用chart的context阻止新的y轴的canvas生成
       * @todo 支持配置是否渲染y轴
       */
      this.yAxis = new Series(this.externalSeriesContainer(), { context: options.context })
      this.yAxis.domain([100, 0])
    }
  }

  config (inputs: I) {
    this.inputs = extend(this.inputs, inputs)

    this.applyConfig()

    this.replay()

    return this
  }

  isExternal (): boolean {
    return false
  }

  externalSeriesContainer () {
    return this.container.right()
  }

  beforeRepaint (values: O[]): this

  beforeRepaint () {
    return this
  }

  drawAll (update: UpdatePayload): this {
    if (update.level === UpdateLevel.FULL || !this.isCached(update)) {
      this.output = this.compute(update)
    }

    const values = this.output.slice(update.span[0], update.span[1])

    this.beforeRepaint(values)

    this.paint(values)

    this.drawLatest(update)

    return this
  }

  drawLatest (update: UpdatePayload): this {
    this.paint(this.output.slice(-1).concat(this.computeLatest(update)))

    return this
  }

  isCached (update: UpdatePayload): boolean {
    return this.output.length === update.bars.length - 1
  }

  abstract compute (update: UpdatePayload): O[]

  abstract computeLatest (update: UpdatePayload): O[]

  abstract paint (values: O[]): this

  abstract default (options?: RecursivePartial<I>): I

  abstract applyConfig (): this
}

export default AbstractIndicator

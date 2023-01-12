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
import { GraphOptions } from '../options'
import AbstractGraph from './AbstractGraph'

abstract class AbstractIndicator<I extends Record<string, unknown>, O> extends AbstractGraph implements IIndicator<I, O> {
  static displayType: DisplayType = DisplayType.INNER

  displayType = DisplayType.INNER

  initOutput: O[] = []

  lastOutput: O | null = null

  inputs: I

  constructor (options: GraphOptions & RecursivePartial<Inputs<I>>, name?: string) {
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
      this.initOutput = this.computeInit(update)
    }

    const values = this.initOutput.slice(update.span[0], update.span[1])

    this.beforeRepaint(values)

    this.paint(values)

    this.drawLast(update)

    return this
  }

  drawLast (update: UpdatePayload): this {
    this.lastOutput = this.computeLast(update)[0]
    this.paint(this.initOutput.slice(-1).concat(this.lastOutput))

    return this
  }

  isCached (update: UpdatePayload): boolean {
    return this.initOutput.length === update.bars.length - 1
  }

  resultOf (index: number) {
    return index === this.initOutput.length ? this.lastOutput : this.initOutput[index]
  }

  abstract computeInit (update: UpdatePayload): O[]

  abstract computeLast (update: UpdatePayload): O[]

  abstract paint (values: O[]): this

  abstract default (options?: RecursivePartial<I>): I

  abstract applyConfig (): this
}

export default AbstractIndicator

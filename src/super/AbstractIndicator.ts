/**
 *  @file         src/super/AbstractIndicator.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/23 16:08
 *  @description
 */
import { UpdatePayload } from '../core/DataSource'
import Series from '../core/Series'
import extend from '../helper/extend'
import IIndicator, { DisplayType } from '../interface/IIndicator'
import { RenderOptions } from '../options'
import AbstractChart from './AbstractChart'

abstract class AbstractIndicator<I extends object, O> extends AbstractChart implements IIndicator<I, O> {
  static displayType = DisplayType.INNER

  output: O[] = []

  inputs: I

  constructor (options: RenderOptions & RecursivePartial<Inputs<I>>, name?: string) {
    super(options, name)

    this.inputs = this.default(options.inputs)

    if (this.isExternal()) {
      this.yAxis = new Series(this.externalSeriesContainer())
      this.yAxis.domain([100, 0])
    }
  }

  config (inputs: I) {
    this.inputs = extend(this.inputs, inputs)

    this.applyConfig()

    this.apply()

    return this
  }

  isExternal (): boolean {
    return false
  }

  externalSeriesContainer () {
    return this.container.right()
  }

  drawAll (update: UpdatePayload): this {
    if (!this.isCached(update)) {
      this.output = this.compute(update)
    }

    this.paint(this.output)

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

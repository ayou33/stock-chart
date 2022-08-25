/**
 *  @file         src/super/AbstractIndicator.ts created by WebStorm
 *  @project      stock-chart
 *  @author       ayooo[ayooooo@petalmail.com]
 *  @date         2022/8/23 16:08
 *  @description
 */
import { UpdatePayload } from '../core/DataSource'
import Series from '../core/Series'
import extend from '../helper/extend'
import IIndicator, { DisplayType } from '../interface/IIndicator'
import { RenderOptions } from '../options'
import AbstractChart from './AbstractChart'

abstract class AbstractIndicator<I extends { inputs: any }, O> extends AbstractChart implements IIndicator<I, O> {
  static displayType = DisplayType.INNER

  result: O[] = []

  inputs: I['inputs']

  constructor (options: RenderOptions & RecursivePartial<I>, name?: string) {
    super(options, name)

    this.inputs = options.inputs ?? {}

    if (this.isExternal()) {
      this.yAxis = new Series(this.externalSeriesContainer())
    }
  }

  config (inputs: I) {
    this.inputs = extend(this.inputs, inputs)

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
      this.result = this.compute(update)
    }

    this.paint(this.result)

    this.drawLatest(update)

    return this
  }

  drawLatest (update: UpdatePayload): this {
    this.paint(this.computeLatest(update))

    return this
  }

  isCached (update: UpdatePayload): boolean {
    return this.result.length === update.bars.length - 1
  }

  abstract compute (update: UpdatePayload): O[]

  abstract computeLatest (update: UpdatePayload): O[]

  abstract paint (data: O[]): this
}

export default AbstractIndicator

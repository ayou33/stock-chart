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

abstract class AbstractIndicator<I extends { inputs: any }, O = unknown> extends AbstractChart implements IIndicator<I, O> {
  static displayType = DisplayType.INNER

  inputs: I['inputs']

  constructor (options: RenderOptions & RecursivePartial<I>) {
    super(options)

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
    this.clear()

    this.paintAll(this.calc(update))

    return this
  }

  drawLatest (update: UpdatePayload): this {
    this.clearLatest()

    this.paintLatest(this.calc(update))

    return this
  }

  abstract calc (update: UpdatePayload): O

  abstract paintAll (o: O): this

  abstract clearLatest (): this

  abstract paintLatest (o: O): this
}

export default AbstractIndicator

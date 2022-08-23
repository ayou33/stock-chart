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

abstract class AbstractIndicator<T extends { inputs: any }> extends AbstractChart implements IIndicator<T> {
  static displayType = DisplayType.INNER

  inputs: T['inputs']

  constructor (options: RenderOptions & RecursivePartial<T>) {
    super(options)

    this.inputs = options.inputs ?? {}

    if (this.isExternal()) {
      this.yAxis = new Series(options.container)
    }
  }

  config (inputs: T) {
    this.inputs = extend(this.inputs, inputs)

    this.apply()

    return this
  }

  abstract drawAll (update: UpdatePayload): this

  abstract drawLatest (update: UpdatePayload): this

  isExternal (): boolean {
    return false
  }
}

export default AbstractIndicator

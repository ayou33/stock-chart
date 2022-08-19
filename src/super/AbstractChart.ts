/**
 *  AbstractChart.ts of project stock-chart
 *  @date 2022/8/19 16:45
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import IAxis from '../interface/IAxis'
import IChart from '../interface/IChart'
import IMainAxis from '../interface/IMainAxis'
import { RendererOptions } from '../options'
import AbstractCanvas from './AbstractCanvas'

abstract class AbstractChart<E extends string = never> extends AbstractCanvas<E> implements IChart<E> {
  options: RendererOptions
  name: string
  xAxis: IMainAxis
  yAxis: IAxis

  protected constructor (options: RendererOptions, name = Math.random().toString(36).slice(2)) {
    super(options.container, options.context)

    this.options = options
    this.name = name

    this.xAxis = options.xAxis
    this.yAxis = options.yAxis
  }

  fx (x: number): number {
    return this.xAxis.value(x)
  }

  fy (y: number): number {
    return this.yAxis.value(y)
  }

  invertX (x: number): number {
    return this.xAxis.invert(x)
  }

  invertY (y: number): number {
    return this.yAxis.invert(y)
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

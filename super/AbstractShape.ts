/**
 *  AbstractChart.ts of project stock-chart
 *  @date 2022/8/19 16:45
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import IAxis from '../interface/IAxis'
import IShape from '../interface/IShape'
import IMainAxis from '../interface/IMainAxis'
import { RenderOptions } from '../options'
import AbstractCanvas from './AbstractCanvas'

abstract class AbstractShape<E extends string = never, O = unknown> extends AbstractCanvas<E> implements IShape<E> {
  options: RenderOptions & O
  name: string
  xAxis: IMainAxis
  yAxis: IAxis
  valueAlign = 0.5

  protected constructor (options: RenderOptions & O, name = 'chart_' + Math.random().toString(36).slice(2)) {
    super(options.container, options.context)

    this.options = options
    this.name = name

    this.xAxis = options.xAxis
    this.yAxis = options.yAxis
  }

  fx (x: number, align = this.valueAlign): number {
    return this.xAxis.value(x, align)
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
      this.resetLatest()
      this.drawLatest(update)
    } else {
      this.clear()
      this.drawAll(update)
    }

    return this
  }

  resetLatest (): this {
    if (this.lastUpdate?.latest) {
      const step = this.xAxis.step()
      this.context.clearRect(
        this.fx(this.lastUpdate.latest.date) - step * Math.ceil(this.valueAlign),
        0,
        step,
        this.container.height(),
      )
    }

    return this
  }

  abstract drawAll (update: UpdatePayload): this

  abstract drawLatest (update: UpdatePayload): this
}

export default AbstractShape
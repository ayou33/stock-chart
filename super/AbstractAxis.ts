/**
 *  AbstractAxis.ts of project stock-chart
 *  @date 2022/8/11 17:05
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import { extent } from '../helper/extent'
import isIn from '../helper/range'
import IAxis from '../interface/IAxis'
import IScale from '../interface/IScale'
import LayoutCell from '../layout/LayoutCell'
import AbstractCanvas from './AbstractCanvas'

abstract class AbstractAxis<E extends string, U = Extent, T extends IScale = IScale<U>> extends AbstractCanvas<E> implements IAxis<U> {
  readonly scale: T

  private _extent: Extent = [0, 0]

  protected constructor (container: LayoutCell, context?: CanvasRenderingContext2D | null) {
    super(container, context)

    this.scale = this.makeScale()
  }

  blur (): this {
    this.replay()

    return this
  }

  value (domainValue: number, align?: number): number {
    return this.scale.value(domainValue, align)
  }

  invert (rangeValue: number): number {
    return this.scale.invert(rangeValue)
  }

  domain (domain?: U): U {
    return this.scale.domain(domain)
  }

  range (range?: Extent) {
    return this.scale.range(range)
  }

  private makeExtent (update: UpdatePayload) {
    return extent(update.bars.slice(...update.span), d => d.low, d => d.high)
  }

  extent (update: UpdatePayload): Extent {
    if (update.level === UpdateLevel.FULL || update.level === UpdateLevel.APPEND) {
      return this._extent = this.makeExtent(update)
    }

    if (update.level === UpdateLevel.PATCH) {
      if (isIn(...this._extent)(update.latest!.close)) {
        return this._extent
      }

      return this._extent = this.makeExtent(update)
    }

    return update.extent
  }

  abstract tickFormat (format: (value: number, pos: number) => string): this

  abstract ticks (interval: number): this

  abstract transform (transform: Transform, ref?: number): this

  abstract makeScale (): T

  abstract focus (position: number, domain: number): this
}

export default AbstractAxis

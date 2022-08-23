/**
 *  AbstractAxis.ts of project stock-chart
 *  @date 2022/8/11 17:05
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'
import IAxis from '../interface/IAxis'
import IScale from '../interface/IScale'
import LayoutCell from '../layout/LayoutCell'
import AbstractCanvas from './AbstractCanvas'

abstract class AbstractAxis<E extends string, U = Extent, T extends IScale = IScale<U>> extends AbstractCanvas<E> implements IAxis<U> {
  readonly scale: T

  protected constructor (container: LayoutCell) {
    super(container)

    this.scale = this.makeScale()
  }

  blur (): this {
    this.apply()
    return this
  }

  value (domainValue: number): number {
    return this.scale.value(domainValue)
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

  abstract tickFormat (format: (value: number, pos: number) => string): this

  abstract ticks (interval: number): this

  abstract transform (transform: Transform, ref?: number): this

  abstract makeScale (): T

  abstract focus (position: number): this
}

export default AbstractAxis

/**
 *  主轴
 *  MainAxis.ts of project stock-chart
 *  @date 2022/7/25 17:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IMainAxis from '../interface/IMainAxis'
import { MainAxisOptions } from '../options'
import Band from '../scale/Band'
import Transform from 'nanie/src/Transform'
import AbstractAxis from '../super/AbstractAxis'

class MainAxis extends AbstractAxis<'transform', number[], Band> implements IMainAxis {
  private _transform = new Transform()

  constructor (options: MainAxisOptions['call']) {
    super(options.container)
  }

  makeScale () {
    return new Band()
  }

  bandWidth (width?: number) {
    return this.scale.bandWidth(width)
  }

  step (step?: number) {
    return this.scale.step(step)
  }

  paint (): this {
    const domain = this.domain()
    const ctx = this.context
    ctx.save()
    ctx.textBaseline = 'top'
    ctx.textAlign = 'center'

    for (let i = 0, l = domain.length; i < l; i++) {
      if (i % 20 === 0) {
        ctx.fillText(new Date(domain[i]).toLocaleString(), this.value(domain[i]), 0)
      }
    }

    ctx.restore()

    return this
  }

  transform (transform: Transform): this {
    const diff = this._transform.diff(transform)
    this._transform = transform
    const range = this.range()
    const step = this.scale.step() * diff.k
    this.scale.step(step)
    this.range([range[0] * diff.k + diff.x, range[1] * diff.k + diff.x])
    // console.log(range, diff, this.range())
    return this
  }

  focus (x: number): this {
    this.clear()
    this.draw()

    const date = this.invert(x)
    this.context.save()
    this.context.textBaseline = 'top'
    this.context.textAlign = 'center'
    this.context.fillText(new Date(date).toLocaleString(), x, 0)
    this.context.restore()

    return this
  }

  tickFormat (format: (value: number, pos: number) => string): this {
    return this
  }

  ticks (count: number): this
  ticks (decide: (index: number, value: number, pos: number) => boolean): this
  ticks (count: number | ((index: number, value: number, pos: number) => boolean)): this {
    return this
  }
}

export default MainAxis

/**
 *  主轴
 *  MainAxis.ts of project stock-chart
 *  @date 2022/7/25 17:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IMainAxis from '../interface/IMainAxis'
import { StockChartOptions } from '../options'
import Band from '../scale/Band'
import Transform from 'nanie/src/Transform'
import AbstractAxis from '../super/AbstractAxis'
import { UpdatePayload } from './DataSource'

class MainAxis extends AbstractAxis<'transform', number[], Band> implements IMainAxis {
  private _transform = new Transform()

  constructor (container: ContainerCell, options: StockChartOptions) {
    super(container)

    this.injectAfter('resize', () => {
      this.range([-Infinity, container.width])
    })
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

  paint (update: UpdatePayload): this {
    // @todo update level判断
    this.domain(update.domain)

    const ctx = this.context
    ctx.save()
    ctx.textBaseline = 'top'
    ctx.textAlign = 'center'

    for (let i = 0; i < this.container.width; i += 90) {
      ctx.fillText(this.invert(i).toString(), i, 0)
    }

    ctx.restore()

    return this
  }

  transform (transform: Transform, ref: number): this {
    const diff = this._transform.diff(transform)
    const range = this.range()

    this._transform = transform

    let nextRange: Extent = [range[0] + diff.x, range[1] + diff.x]

    if (diff.k !== 1 && ref) {
      const scale = diff.k - 1
      nextRange = [range[0] + scale * (range[0] - ref), range[1] + scale * (range[1] - ref)]
    }

    this.range(nextRange)

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

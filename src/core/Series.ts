/**
 *  交叉轴
 *  Series.ts of project stock-chart
 *  @date 2022/7/25 17:12
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IAxis from '../interface/IAxis'
import IScale from '../interface/IScale'
import { SeriesOptions } from '../options'
import Linear from '../scale/Linear'
import AbstractAxis from '../super/AbstractAxis'

class Series extends AbstractAxis<'transform'> implements IAxis {
  private _tickSize = 10
  private _tickFormat: (value: number, pos: number) => string = (v: number) => v.toString()
  private _tickPred: (index: number, value: number, pos: number) => boolean = () => true

  constructor (options: SeriesOptions['call']) {
    super(options.container)
  }

  makeScale () {
    return new Linear()
  }

  paint (): this {
    const range = this.range()
    const step = (range[1] - range[0]) / this._tickSize
    const ctx = this.context

    this.clear()

    ctx.save()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'start'

    for (let y = range[0] + 10; y < range[1]; y += step) {
      ctx.fillText(this._tickFormat(this.invert(y), y), 0, y)
    }

    ctx.restore()

    return this
  }

  transform (): this {
    return this
  }

  focus (y: number): this {
    this.clear()
    this.draw()
    this.context.save()
    this.context.textBaseline = 'middle'
    this.context.textAlign = 'start'
    this.context.fillText(this.invert(y).toString(), 0, y)
    this.context.restore()
    return this
  }

  rerender () {
    this.clear()
    this.draw()
  }

  tickFormat (format: (value: number, pos: number) => string): this {
    this._tickFormat = format
    this.rerender()
    return this
  }

  ticks (count: number): this
  ticks (decide: (index: number, value: number, pos: number) => boolean): this
  ticks (mixed: number | ((index: number, value: number, pos: number) => boolean)): this {
    if ('number' === typeof mixed) {
      this._tickPred = () => true
    } else {
      this._tickPred = mixed
    }
    return this
  }
}

export default Series

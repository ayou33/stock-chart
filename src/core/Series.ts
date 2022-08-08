/**
 *  交叉轴
 *  Series.ts of project stock-chart
 *  @date 2022/7/25 17:12
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { createAAContext } from '../helper/aa'
import extend from '../helper/extend'
import IAxis from '../interface/IAxis'
import { seriesOptions, SeriesOptions } from '../options'
import Linear from '../scale/Linear'

class Series extends Linear implements IAxis {
  private readonly _context: CanvasRenderingContext2D
  private readonly _options: SeriesOptions['define']

  private _tickSize = 10
  private _tickFormat: (value: number, pos: number) => string = (v: number) => v.toString()
  private _tickPred: (index: number, value: number, pos: number) => boolean = () => true

  constructor (options: SeriesOptions['call']) {
    super()

    this._options = extend(seriesOptions, options)

    this._context = createAAContext(options.container?.width, options.container?.height)

    options.container.node.appendChild(this._context.canvas)
  }

  render () {
    const range = this.range()
    const step = (range[1] - range[0]) / this._tickSize
    const ctx = this._context

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
    this.render()
    this._context.save()
    this._context.textBaseline = 'middle'
    this._context.textAlign = 'start'
    this._context.fillText(this.invert(y).toString(), 0, y)
    this._context.restore()
    return this
  }

  blur () {
    this.clear()
    this.render()

    return this
  }

  clear () {
    this._context.clearRect(0, 0, this._options.container.width, this._options.container.height)
    return this
  }

  rerender () {
    this.clear()
    this.render()
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

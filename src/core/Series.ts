/**
 *  交叉轴
 *  Series.ts of project stock-chart
 *  @date 2022/7/25 17:12
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { createAAContext } from '../helper/aa'
import IAxis from '../interface/IAxis'
import { SeriesOptions } from '../options'
import Linear from '../scale/Linear'

class Series extends Linear implements IAxis {
  private readonly _context: CanvasRenderingContext2D
  private _tickSize = 10
  private readonly _options: SeriesOptions['define']

  constructor (options: SeriesOptions['call']) {
    super()

    this._options = options

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

    for (let y = range[0]; y < range[1]; y += step) {
      ctx.fillText(this.invert(y).toString(), 0, y)
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
    this._context.fillText(this.invert(y), 0, y)
    return this
  }

  clear () {
    this._context.clearRect(0, 0, this._options.container.width, this._options.container.height)
    return this
  }
}


export default Series

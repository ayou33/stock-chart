/**
 *  主轴
 *  MainAxis.ts of project stock-chart
 *  @date 2022/7/25 17:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { createAAContext } from '../helper/aa'
import extend from '../helper/extend'
import IAxis from '../interface/IAxis'
import { mainAxisOptions, MainAxisOptions } from '../options'
import Band from '../scale/Band'

class MainAxis extends Band implements IAxis {
  private readonly _options: MainAxisOptions['define']
  private readonly _context: CanvasRenderingContext2D

  constructor (options: MainAxisOptions['call']) {
    super()

    this._options = extend(mainAxisOptions, options)

    this._context = createAAContext(options.container?.width, options.container?.height)

    options.container.node.appendChild(this._context.canvas)
  }

  transform (): this {
    return this
  }

  clear (): this {
    this._context.clearRect(0, 0, this._options.container.width, this._options.container.height)
    return this
  }

  render (): this {
    this.clear()
    const domain = this.domain()
    const ctx = this._context
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

  focus (x: number): this {
    this.clear()
    this.render()

    const date = this.invert(x)
    this._context.save()
    this._context.textBaseline = 'top'
    this._context.textAlign = 'center'
    this._context.fillText(new Date(date).toLocaleString(), x, 0)
    this._context.restore()

    return this
  }

  blur () {
    this.clear()
    this.render()
    return this
  }
}

export default MainAxis

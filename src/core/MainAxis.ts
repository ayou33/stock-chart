/**
 *  主轴
 *  MainAxis.ts of project stock-chart
 *  @date 2022/7/25 17:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { createAAContext } from '../helper/aa'
import IAxis from '../interface/IAxis'
import { MainAxisOptions } from '../options'
import Band from '../scale/Band'

class MainAxis extends Band implements IAxis {
  private readonly _context: CanvasRenderingContext2D

  constructor (options: MainAxisOptions) {
    super()

    this._context = createAAContext(options.container?.width, options.container?.height)

    options.container.node.appendChild(this._context.canvas)

    this.clear = () => this._context.clearRect(0, 0, options.container.width, options.container.height)
  }

  transform (): this {
    return this
  }

  clear (): this {
    return this
  }

  render (): this {
    this.clear()
    const domain = this.domain()
    const ctx = this._context
    ctx.save()
    ctx.textBaseline = 'top'

    for (let i = 0, l = domain.length; i < l; i++) {
      if (i % 20 === 0) {
        ctx.fillText(new Date(domain[i]).toLocaleString(), this.value(domain[i]), 0)
      }
    }

    ctx.restore()
    return this
  }

  focus (x: number): this {
    return this
  }
}

export default MainAxis

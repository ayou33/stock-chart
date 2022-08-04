/**
 *  Crosshair.ts of project stock-chart
 *  @date 2022/8/3 15:08
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { RendererOptions } from '../options'
import AbstractChart from '../super/AbstractChart'

class Crosshair extends AbstractChart implements AbstractChart {
  private readonly _width: number
  private readonly _height: number

  constructor (options: RendererOptions) {
    super(options)

    options.container.node.style.position = 'relative'

    this._width = options.container.width
    this._height = options.container.height

    this.canvas.style.cssText += `
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      left: 0;
    `

    this.canvas.addEventListener('mousemove', (e) => {
      this.draw(e.clientX, e.clientY)
    })

    this.canvas.addEventListener('mouseleave', () => {
      this.clean()
    })

    this.autoStroke = true
  }

  paint (x: number, y: number) {
    this.clean()
    const ctx = this.context

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, this._height)

    ctx.moveTo(0, y)
    ctx.lineTo(this._width, y)


    if (this.autoStroke) {
      ctx.stroke()
    }

    console.log(this.yAxis.invert(-50))

    return this
  }

}

export default Crosshair

/**
 *  Crosshair.ts of project stock-chart
 *  @date 2022/8/3 15:08
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { RendererOptions } from '../options'
import AbstractRenderer from '../super/AbstractRenderer'

class Crosshair extends AbstractRenderer implements AbstractRenderer {
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
  }

  paint (x: number, y: number) {
    this.clean()

    this.context.beginPath()
    this.context.moveTo(x, 0)
    this.context.lineTo(x, this._height)

    this.context.moveTo(0, y)
    this.context.lineTo(this._width, y)

    this.context.stroke()

    return this
  }

  clean () {
    this.context.clearRect(0, 0, this._width, this._height)

    return this
  }
}

export default Crosshair

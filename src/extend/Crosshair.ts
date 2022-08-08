/**
 *  Crosshair.ts of project stock-chart
 *  @date 2022/8/3 15:08
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { RendererOptions } from '../options'
import AbstractChart from '../super/AbstractChart'

export type CrosshairEvents = 'focus' | 'blur' | 'transform'

class Crosshair extends AbstractChart<CrosshairEvents> implements AbstractChart<CrosshairEvents> {
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
      this.drawCrosshair(e.clientX, e.clientY)
    })

    this.canvas.addEventListener('mouseleave', () => {
      this.emit('blur')
      this.clear()
    })

    this.canvas.addEventListener('mousedown', () => {

    })

    this.canvas.addEventListener('mousemove', () => {
      this.emit('transform', 1, (a: string) => {
        console.log('transform confirmed msg', 1, a)
      })
    })

    this.autoStroke = true
  }

  private drawCrosshair (x: number, y: number) {
    if (!this._enable) return

    this.clear()
    const ctx = this.context

    ctx.beginPath()
    ctx.moveTo(x, 0)
    ctx.lineTo(x, this._height)

    ctx.moveTo(0, y)
    ctx.lineTo(this._width, y)

    if (this.autoStroke) {
      ctx.stroke()
    }

    this.emit('focus', x, y)
  }

  paint () {
    return this
  }

  getElement (): HTMLElement {
    return this.canvas
  }
}

export default Crosshair

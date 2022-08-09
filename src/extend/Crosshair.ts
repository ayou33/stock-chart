/**
 *  Crosshair.ts of project stock-chart
 *  @date 2022/8/9 11:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { RendererOptions } from '../options'
import Gesture from './Gesture'

export type CrosshairEvents = 'focus' | 'blur'

class Crosshair extends Gesture<CrosshairEvents> {
  private readonly _width: number
  private readonly _height: number

  constructor (options: RendererOptions) {
    super(options)

    this._width = options.container.width
    this._height = options.container.height

    this.canvas.addEventListener('mousemove', (e) => {
      this.drawCrosshair(e.clientX, e.clientY)
    })

    this.canvas.addEventListener('mouseleave', () => {
      this.emit('blur')
      this.clear()
    })
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
}

export default Crosshair

/**
 *  Crosshair.ts of project stock-chart
 *  @date 2022/8/9 11:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { RendererOptions } from '../options'
import Gesture from './Gesture'

export type CrosshairEvents = 'focus' | 'blur'

class Crosshair extends Gesture<CrosshairEvents> {
  private _width: number
  private _height: number
  private _lastX = 0
  private _lastY = 0
  private focus = false

  constructor (options: RendererOptions) {
    super(options)

    this._width = options.container.width
    this._height = options.container.height

    if (this._options.crosshair) {
      this.canvas.addEventListener('mouseenter', () => {
        this.focus = true
      })

      this.canvas.addEventListener('mouseleave', () => {
        this.focus = false
        this.emit('blur')
        this.clear()
      })

      this.canvas.addEventListener('mousemove', (e) => {
        if (this.focus) this.drawCrosshair(e.clientX, e.clientY)
      })
    }

    this.injectAfter('resize', () => {
      this._width = options.container.width
      this._height = options.container.height
    })
  }

  private drawCrosshair (x: number, y: number) {
    if (this.disabled || !this._options.crosshair) return

    this.clear()
    const ctx = this.context
    const options = this._options.crosshair

    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = options.color
    ctx.lineWidth = options.lineWidth

    let offset = 0
    ctx.moveTo(x, offset)
    for (let i = 0, s = options.dashArray.length; offset < this._height;) {
      offset += options.dashArray[i++ % s]
      ctx.lineTo(x, offset)
      offset += options.dashArray[i++ % s]
      ctx.moveTo(x, offset)
    }

    offset = 0
    ctx.moveTo(offset, y)
    for (let i = 0, s = options.dashArray.length; offset < this._width;) {
      offset += options.dashArray[i++ % s]
      ctx.lineTo(offset, y)
      offset += options.dashArray[i++ % s]
      ctx.moveTo(offset, y)
    }

    if (this.autoStroke) {
      ctx.stroke()
    }

    ctx.restore()

    this._lastX = x
    this._lastY = y

    this.emit('focus', x, y)
  }

  draw () {
    super.draw()

    if (this.focus) this.emit('focus', this._lastX, this._lastY)

    return this
  }
}

export default Crosshair

/**
 *  Crosshair.ts of project stock-chart
 *  @date 2022/8/9 11:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import Line from '../drawing/Line'
import { RendererOptions } from '../options'
import Gesture from './Gesture'

export type CrosshairEvents = 'focus' | 'blur'

class Crosshair extends Gesture<CrosshairEvents> {
  private _width: number
  private _height: number
  private _lastX = 0
  private _lastY = 0
  private focus = false
  private _currentPriceLine: Line | null = null

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

    if (this._options.currentPrice) {
      this._currentPriceLine = new Line(this.context, {
        style: 'dashed',
        color: this._options.currentPrice.background ?? this._options.currentPrice.color,
        dashArray: this._options.currentPrice?.dashArray,
      })
    }
  }

  private drawCrosshair (x: number, y: number) {
    if (this.disabled || !this._options.crosshair) return

    this.clear()
    const ctx = this.context
    const options = this._options.crosshair

    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = options.background ?? options.color
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

  draw (update: UpdatePayload) {
    if (this.focus) this.emit('focus', this._lastX, this._lastY)

    if (update.latest) {
      // this.drawCurrent(update.latest)
      // this._currentPriceLine?.transform([0, this.yAxis.value(update.latest.close)])
    }

    return this
  }

  drawCurrent (latest: Bar): this {
    if (this._options.currentPrice) {
      this.clear()
      if (this.focus) this.drawCrosshair(this._lastX, this._lastY)

      const ctx = this.context
      const options = this._options.currentPrice
      const y = this.yAxis.value(latest.close)

      ctx.beginPath()
      ctx.strokeStyle = options.background ?? options.color
      let offset = 0
      for (let i = 0, s = options.dashArray.length; offset < this._width;) {
        offset += options.dashArray[i++ % s]
        ctx.lineTo(offset, y)
        offset += options.dashArray[i++ % s]
        ctx.moveTo(offset, y)
      }

      ctx.stroke()
    }

    return this
  }
}

export default Crosshair

/**
 *  Skin.ts of project stock-chart
 *  @date 2022/8/9 11:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import Line from '../graphics/Line'
import { GraphOptions, StockChartOptions } from '../options'
import Gesture from './Gesture'

export type CrosshairEvents = 'focus' | 'blur'

class Board extends Gesture<CrosshairEvents> {
  private _lastX = 0
  private _lastY = 0
  private _priceY = 0
  private _focus = false
  private _currentPriceLine: Line | null = null
  private _priceLine: Line | null = null
  private _timeLine: Line | null = null

  constructor (options: GraphOptions & StockChartOptions) {
    super(options)

    if (this.options.crosshair) {
      this.canvas.style.cssText += `
        cursor: crosshair;
      `
      this.canvas.addEventListener('mouseenter', () => {
        this._focus = true
      })

      this.canvas.addEventListener('mouseleave', () => {
        this._focus = false
        this.emit('blur')
        this.clear()
        this.drawCurrentPrice()
      })

      this.canvas.addEventListener('mousemove', (e) => {
        const p = this.pointer(e.clientX, e.clientY)
        if (this._focus) {
          this.drawPrices(p[0], p[1])
          this.emit('focus', this._lastX, this._lastY, this.xAxis.invert(this._lastX))
        }
      })

      this._priceLine = new Line(this.context, {
        width: 0.5,
        style: 'dashed',
        color: this.options.crosshair.background ?? this.options.crosshair.color,
        dashArray: this.options.crosshair.dashArray,
      })

      this._timeLine = new Line(this.context, {
        width: 0.5,
        radian: Math.PI / 2,
        style: 'dashed',
        color: this.options.crosshair.background ?? this.options.crosshair.color,
        dashArray: this.options.crosshair.dashArray,
      })
    }

    if (this.options.currentPrice) {
      this._currentPriceLine = new Line(this.context, {
        style: 'dashed',
        color: this.options.currentPrice.background ?? this.options.currentPrice.color,
        dashArray: this.options.currentPrice.dashArray,
      })
    }

    this.injectAfter('resize', () => {
      this._priceLine?.resize()
      this._timeLine?.resize()
      this._currentPriceLine?.resize()
    })
  }

  private drawCrosshair () {
    this._timeLine?.transform([this._lastX, 0])
    this._priceLine?.transform([0, this._lastY])
    this.options.yAxis.focus(this._lastY)
    this.options.xAxis.focus(this._lastX)
  }

  private drawPrices (x: number, y: number) {
    if (this.disabled || !this.options.crosshair) return

    this.clear()

    this._lastX = x
    this._lastY = y

    this.drawCrosshair()
    this.drawCurrentPrice()
  }

  private drawCurrentPrice () {
    this._currentPriceLine?.transform([0, this._priceY])
  }

  /**
   * @override
   * @param update
   */
  draw (update: UpdatePayload) {
    this.clear()

    if (update.latest) {
      this._priceY = this.fy(update.latest.close)
      this.drawCurrentPrice()
    }

    if (this._focus) this.drawCrosshair()

    return this
  }
}

export default Board

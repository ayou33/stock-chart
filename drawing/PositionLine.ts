/**
 *  @file         stock-chart/drawing/PositionLine.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 16:45
 *  @description
 */
import * as R from 'ramda'
import Line, { lineOptions, LineOptions } from '../graphics/Line'
import { assertIsDefined } from '../helper/assert'
import extend from '../helper/extend'
import { expandPadding } from '../helper/format'
import { measureText } from '../helper/typo'
import { PointValue } from '../interface/IDrawing'
import IGraph from '../interface/IGraph'
import AbstractDrawing from '../super/AbstractDrawing'
import { themeOptions } from '../theme'
import imgSrc from './reminder@2x.png'

export type PositionLineOptions = RecursivePartial<LineOptions>

const _horizontalAngle = 0

class PositionLine extends AbstractDrawing<LineOptions> {
  private readonly $img = new Image()
  private readonly _line: Line

  private _centre = NaN
  private _options: LineOptions
  private _alertOn = false

  constructor (chart: IGraph, options?: PositionLineOptions) {
    const _options = extend(lineOptions, extend(options ?? {}, { angle: _horizontalAngle }))

    super(chart, _options)

    this._line = new Line(chart.context, _options)

    this._options = _options

    this.$img.src = imgSrc
  }

  draw () {
    const p = this.trace(0)

    assertIsDefined(p)

    const { x, y } = p
    const ctx = this.chart.context
    const text = String(this.trace(0)?.price)

    ctx.strokeStyle = this._options.color
    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'start'

    this._line.transform([x, y])
    const { topOffset, width, height } = measureText(ctx, text)
    const Y = y + topOffset
    const pad = expandPadding({ top: 4, left: this._alertOn ? 20 : 4 })

    ctx.fillStyle = this._options.color
    ctx.fillRect(0, Y - pad.top - pad.bottom, width + pad.left + pad.right, height + pad.top + pad.bottom)
    ctx.fillStyle = 'white'
    ctx.fillText(text, pad.left, y - pad.top)

    if (this._alertOn) {
      ctx.fillStyle = 'red'
      ctx.drawImage(this.$img, 4, Y - pad.top - 2, 16, 16)
    }

    this._centre = y

    return this
  }

  toggleAlert (state: boolean) {
    this._alertOn = state
    this.emit('refresh')

    return this
  }

  locate ({ date, price }: PointValue) {
    return {
      date,
      price,
      x: 0,
      y: this.chart.fy(price),
    }
  }

  render (points: PointValue[], alertState: boolean): this {
    this._alertOn = alertState
    const p = this.locate(points[0])
    this.push(p)
    this.draw()
    this.emit('done')
    this.ready()

    return this
  }

  test (_: number, y: number): boolean {
    return Math.abs(y - this._centre) <= 4
  }

  highlight () {
    const ctx = this.chart.context
    const x = this.chart.container.width() / 2
    ctx.save()
    ctx.beginPath()
    ctx.strokeStyle = themeOptions.primaryColor
    ctx.lineWidth = 2

    R.map(
      ({ price }) =>
        ctx.arc(x, this.chart.fy(price), 6, 0, Math.PI * 2),
      this.trace(),
    )

    ctx.stroke()
    ctx.restore()

    return this
  }

  update (options: Partial<LineOptions>): this {
    this._line.update(options)

    this._options = extend(this._options, options)

    this.emit('refresh')

    return this
  }
}

export default PositionLine

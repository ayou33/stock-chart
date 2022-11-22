/**
 *  @file         stock-chart/drawing/PositionLine.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 16:45
 *  @description
 */
import * as R from 'ramda'
import Line, { lineOptions, LineOptions } from '../graphics/Line'
import extend from '../helper/extend'
import { expandPadding } from '../helper/format'
import { measureText } from '../helper/typo'
import { DrawingPoint } from '../interface/IDrawing'
import IGraph from '../interface/IGraph'
import AbstractDrawing from '../super/AbstractDrawing'
import { themeOptions } from '../theme'
import imgSrc from './reminder@2x.png'

export type PositionLineOptions = RecursivePartial<LineOptions>

const _horizontalAngle = 0

class PositionLine extends AbstractDrawing<LineOptions> {
  private _line: Line
  private _centre = NaN
  private _options: LineOptions
  img

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  constructor (chart: IGraph, options?: PositionLineOptions) {
    const _options = extend(lineOptions, extend(options ?? {}, { angle: _horizontalAngle }))

    super(chart, _options)

    this._line = new Line(chart.context, _options)

    this._options = _options

    const img = new Image()
    img.src = imgSrc
    this.img = img
  }

  draw (path: Vector[]) {
    const [x, y] = path[0]
    const ctx = this.chart.context
    const text = String(this.trace()[0].price)

    ctx.textBaseline = 'bottom'
    ctx.textAlign = 'start'

    this._line.transform([x, y])
    const { topOffset, width, height } = measureText(ctx, text)
    const Y = y + topOffset
    const p = expandPadding({ top: 4, left: 20 })

    ctx.fillStyle = this._options.color
    ctx.fillRect(0, Y - p.top - p.bottom, width + p.left + p.right, height + p.top + p.bottom)
    ctx.fillStyle = 'white'
    ctx.fillText(text, p.left, y - p.top)
    ctx.fillStyle = 'red'
    ctx.drawImage(this.img, 4, Y - p.top - 2, 16, 16)

    this._centre = y

    return this
  }

  toggleAlert () {
    return this
  }

  use (point: Vector): this {
    this.record(point)

    this.draw([point])

    this.emit('end', this, (ok: boolean) => {
      this.emit(ok ? 'done' : 'fail')
      if (ok) this.ready()
    })

    return this
  }

  format ({ price, date }: DrawingPoint) {
    return {
      x: 0,
      y: this.chart.fy(price),
      price,
      date,
    }
  }

  render (points: DrawingPoint[]): this {
    const point = this.format(points[0])
    this.push(point)
    this.draw([[point.x, point.y]])
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

    console.log('ayo', options)

    this.emit('refresh')

    return this
  }
}

export default PositionLine

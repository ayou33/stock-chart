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
import { background } from '../helper/typo'
import { DrawingPoint } from '../interface/IDrawing'
import IGraph from '../interface/IGraph'
import AbstractDrawing from '../super/AbstractDrawing'
import { themeOptions } from '../theme'

export type PositionLineOptions = RecursivePartial<LineOptions>

const _horizontalAngle = 0

class PositionLine extends AbstractDrawing<LineOptions> {
  private _line: Line
  private _centre: number = NaN

  constructor (chart: IGraph, options?: PositionLineOptions) {
    const _options = extend(lineOptions, extend(options ?? {}, { angle: _horizontalAngle }))

    super(chart, _options)

    this._line = new Line(chart.context, _options)
  }

  draw (path: Vector[]) {
    const point = path[0]
    const ctx = this.chart.context

    this._line.transform(point)
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = 'black'
    const text = String(this.trace()[0].price)
    background(ctx, text, 0, point[1] - 4, 4)
    ctx.fillStyle = 'white'
    ctx.fillText(text, 2, point[1] - 2)

    this._centre = point[1]

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
}

export default PositionLine

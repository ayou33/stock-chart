/**
 *  @file         stock-chart/drawing/PositionLine.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 16:45
 *  @description
 */
import Line, { lineOptions, LineOptions } from '../graphics/Line'
import extend from '../helper/extend'
import { background } from '../helper/typo'
import IGraph from '../interface/IGraph'
import AbstractDrawing from '../super/AbstractDrawing'

export type PositionLineOptions = RecursivePartial<LineOptions>

const _horizontalAngle = 0

class PositionLine extends AbstractDrawing<LineOptions> {
  private _line: Line

  constructor (chart: IGraph, options?: PositionLineOptions) {
    const _options = extend(lineOptions, extend(options ?? {}, { angle: _horizontalAngle }))

    super(chart, _options)

    this._line = new Line(chart.context, _options)
  }

  transform (point: Vector): this {
    this._line.transform(point, this.options.radian)

    return this
  }

  draw (path: Vector[]) {
    const ctx = this.chart.context
    this._line.transform(path[0])
    ctx.textBaseline = 'bottom'
    ctx.fillStyle = 'black'
    const text = String(this.path()[0][1])
    background(ctx, text, 0, path[0][1] - 2, 2)
    ctx.fillStyle = 'white'
    ctx.fillText(text, 0, path[0][1])

    return this
  }

  use (location: Vector): this {
    this.record(location)

    this.draw([location])

    this.emit('end', this, (ok: boolean) => {
      this.emit(ok ? 'done' :'fail')
    })

    return this
  }

  render (locations: Vector[]): this {
    this.push(locations[0])
    this.transform([0, this.chart.fy(locations[0][1])])

    return this
  }
}

export default PositionLine

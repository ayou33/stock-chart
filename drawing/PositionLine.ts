/**
 *  @file         stock-chart/drawing/PositionLine.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 16:45
 *  @description
 */
import Line, { lineOptions, LineOptions } from '../graphics/Line'
import extend from '../helper/extend'
import AbstractDrawing from '../super/AbstractDrawing'

const _horizontalAngle = 0

class PositionLine extends AbstractDrawing<LineOptions> {
  private _line: Line

  constructor (context: CanvasRenderingContext2D, options?: RecursivePartial<LineOptions>) {
    const _options = extend(lineOptions, extend(options ?? {}, { angle: _horizontalAngle }))

    super(context, _options)

    this._line = new Line(context, _options)
  }

  transform (location: Vector): this {
    this._line.transform(location, this.options.angle)

    return this
  }

  use (location: Vector, position: Vector): this {
    this.transform(location)

    this.collect(position)

    this.emit('end', this.positions(), (ok: boolean) => {
      this.emit(ok ? 'done' :'fail')
    })

    return this
  }

  draw (points: Vector[]) {
    this._line.transform(points[0])

    return this
  }

  render (position: Vector) {
    this.collectAll([position])

    // this.draw()

    return this
  }
}

export default PositionLine

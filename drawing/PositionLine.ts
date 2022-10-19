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

  draw (points: Vector[]) {
    this._line.transform(points[0])
    this.context.textBaseline = 'bottom'
    this.context.fillStyle = 'black'
    const text = String(this.positions()[0][1])
    background(this.context, text, 0, points[0][1] - 2, 2)
    this.context.fillStyle = 'white'
    this.context.fillText(text, 0, points[0][1])

    return this
  }

  use (location: Vector, position: Vector): this {
    this.collect(position)

    this.draw([location])

    this.emit('end', this.positions(), (ok: boolean) => {
      this.emit(ok ? 'done' :'fail')
    })

    return this
  }

  render (position: Vector) {
    this.collectAll([position])

    // this.draw()

    return this
  }
}

export default PositionLine

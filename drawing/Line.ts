/**
 *  Line.ts of project stock-chart
 *  @date 2022/7/25 17:55
 *  @author 阿佑[ayooooo@petalmail.com]
 *  直线
 */
import extend from '../helper/extend'
import IDrawing from '../interface/IDrawing'
import AbstractDrawing from '../super/AbstractDrawing'
import { BLACK, Color, themeOptions } from '../theme'

export type LineRenderOptions = {
  origin: Vector;
  type: 'segment' | 'line' | 'ray';
  stop?: Vector;
  angle?: number;
}

export type StyleOptions = {
  style: 'dashed' | 'solid';
  color: Color;
  dashArray: number[];
}

export type LineOptions = LineRenderOptions & StyleOptions

const lineOptions: LineOptions = {
  origin: [0, 0],
  type: 'line',
  angle: 0,
  style: 'solid',
  color: BLACK,
  dashArray: themeOptions.dashArray,
}

class Line extends AbstractDrawing implements IDrawing<LineRenderOptions & Partial<StyleOptions>> {
  private readonly _context: CanvasRenderingContext2D
  private _options: LineOptions
  private _width = 300
  private _height = 150
  private _start: Vector
  private _angle = 0
  private _offsetArray: Vector[]

  constructor (context: CanvasRenderingContext2D, options?: RecursivePartial<LineOptions>) {
    super()

    this._context = context

    this.measureCanvas()

    this._options = extend(lineOptions, options ?? {})

    this._offsetArray = this.applyAngle(this.parseAngle())

    this._start = this.deriveStart(this._options.origin)
  }

  private parseAngle () {
    if (this._options.angle !== undefined) return this._options.angle

    if (!this._options.origin || !this._options.stop) {
      throw new ReferenceError(
        'No Angle or enough points provide to determine line\'s direction!')
    }

    return Math.atan(
      (this._options.stop[1] - this._options.origin[1]) / (this._options.stop[0] - this._options.origin[0]))
  }

  render (options: LineRenderOptions & Partial<StyleOptions>) {
    this._options = extend(this._options, options)

    this._offsetArray = this.applyAngle(this.parseAngle())

    this._start = this.deriveStart(this._options.origin)

    this.draw()

    return this
  }

  /**
   * @deprecated This method is empty!
   */
  create () {
    return this
  }

  draw () {
    const ctx = this._context
    let [x, y] = this._start

    ctx.beginPath()
    ctx.strokeStyle = this._options.color
    ctx.moveTo(x, y)

    for (let i = 0, s = this._offsetArray.length; x < this._width && y < this._height;) {
      x += this._offsetArray[i % s][0]
      y += this._offsetArray[i % s][1]
      ctx.lineTo(x, y)
      i++
      x += this._offsetArray[i % s][0]
      y += this._offsetArray[i % s][1]
      ctx.moveTo(x, y)
      i++
    }

    ctx.stroke()

    return this
  }

  measureCanvas () {
    this._width = parseFloat(this._context.canvas.style.width)
    this._height = parseFloat(this._context.canvas.style.height)

    return this
  }

  resize () {
    this.measureCanvas()

    this.draw()

    return this
  }

  protected applyAngle (angle: number): Vector[] {
    this._angle = angle

    if (this._options.style === 'solid') {
      return [[this._width * Math.cos(this._angle), this._height * Math.sin(this._angle)]]
    }

    // 水平线
    if (this._angle === Math.PI || this._angle === 0) {
      return this._options.dashArray.map(x => ([x, 0]))
    }

    // 垂直线
    if (this._angle === Math.PI / 2 || this._angle === Math.PI * 3 / 2) {
      return this._options.dashArray.map(y => ([0, y]))
    }

    return this._options.dashArray.map(
      x => ([Math.cos(this._angle) * x, Math.sin(this._angle) * x]))
  }

  protected deriveStart (location: Vector): Vector {
    const [x, y] = this._offsetArray[0]

    if (x === 0) return [location[0], 0]

    if (y === 0) return [0, location[1]]

    // @todo 斜线起点推断

    return location
  }

  transform (location: Vector, radian?: number) {
    if (radian !== undefined) this._offsetArray = this.applyAngle(radian)

    this._start = this.deriveStart(location)

    this.draw()

    return this
  }
}

export default Line

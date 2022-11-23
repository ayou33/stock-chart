/**
 *  在指定的context中绘制两点[或者一个点+角度]直线
 *  Line.ts of project stock-chart
 *  @date 2022/7/25 17:55
 *  @author 阿佑[ayooooo@petalmail.com]
 *  直线
 */
import extend from '../helper/extend'
import { BLACK, Color, themeOptions } from '../theme'

export type LineRenderOptions = {
  type: 'segment' | 'line' | 'ray';
  point1: Vector;
  point2?: Vector;
  radian?: number;
}

export type StyleOptions = {
  width: number;
  style: 'dashed' | 'solid';
  color: Color;
  dashArray: number[];
}

export type LineOptions = LineRenderOptions & StyleOptions

export const lineOptions: LineOptions = {
  point1: [0, 0],
  type: 'line',
  radian: 0,
  style: 'solid',
  color: BLACK,
  width: 1,
  dashArray: themeOptions.dashArray,
}

class Line {
  private readonly _context: CanvasRenderingContext2D
  private _options: LineOptions
  private _width = 300
  private _height = 150
  private _start: Vector
  private _angle = 0
  private _offsetArray: Vector[]

  constructor (context: CanvasRenderingContext2D, options?: RecursivePartial<LineOptions>) {
    this._context = context

    this.measureCanvas()

    this._options = extend(lineOptions, options ?? {})

    this._offsetArray = this.applyAngle(this.parseAngle())

    this._start = this.deriveStart(this._options.point1)
  }

  private measureCanvas () {
    this._width = parseFloat(this._context.canvas.style.width)
    this._height = parseFloat(this._context.canvas.style.height)

    return this
  }

  private parseAngle () {
    if (this._options.radian !== undefined) return this._options.radian

    if (!this._options.point1 || !this._options.point2) {
      throw new ReferenceError(
        'No Angle or enough points provide to determine line\'s direction!')
    }

    return Math.atan(
      (this._options.point2[1] - this._options.point1[1]) / (this._options.point2[0] - this._options.point1[0]))
  }

  render (options: RecursivePartial<LineOptions>) {
    this._options = extend(this._options, options)

    this._offsetArray = this.applyAngle(this.parseAngle())

    this._start = this.deriveStart(this._options.point1)

    this.draw()

    return this
  }

  draw () {
    const ctx = this._context
    let [x, y] = this._start

    ctx.lineWidth = this._options.width
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

  update (options: Partial<LineOptions>) {
    this._options = extend(this._options, options)
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

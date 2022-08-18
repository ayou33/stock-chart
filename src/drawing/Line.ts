/**
 *  Line.ts of project stock-chart
 *  @date 2022/7/25 17:55
 *  @author 阿佑[ayooooo@petalmail.com]
 *  直线
 */
import extend from '../helper/extend'
import { BLACK, Color, themeOptions } from '../theme'

export type RenderOptions = {
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

export type LineOptions = RenderOptions & StyleOptions

const defaultAngle = Math.PI / 4

const lineOptions: LineOptions = {
  origin: [0, 0],
  type: 'line',
  angle: defaultAngle,
  style: 'solid',
  color: BLACK,
  dashArray: themeOptions.dashArray,
}

class Line {
  private readonly _context: CanvasRenderingContext2D
  private _options: LineOptions
  private _start: Vector
  private _angle = defaultAngle
  private _width = 300
  private _height = 150
  private _offsetArray: Vector[]

  constructor (context: CanvasRenderingContext2D, options: RecursivePartial<LineOptions>) {
    this._context = context

    this.measureCanvas()

    this._options = extend(lineOptions, options)

    this._offsetArray = this.applyAngle(this.parseAngle())

    this._start = this.applyOrigin(this._options.origin)
  }

  private drawHorizontalLine () {
    const ctx = this._context
    const dashArray = this._options.dashArray
    const y = this._start[1]
    let offset = 0

    ctx.strokeStyle = this._options.color

    ctx.moveTo(offset, y)
    for (let i = 0, s = this._options.dashArray.length; offset < this._options.length;) {
      offset += dashArray[i++ % s]
      ctx.lineTo(offset, y)
      offset += dashArray[i++ % s]
      ctx.moveTo(offset, y)
    }
  }

  private parseAngle () {
    if (this._options.angle) return this._options.angle

    if (!this._options.origin || !this._options.stop) throw new ReferenceError('No Angle or enough points provide to determine line\'s direction!')

    return 1
  }

  render (options: RenderOptions & Partial<StyleOptions>) {
    this._options = extend(this._options, options)
    this.applyAngle(this.parseAngle())
    this.applyOrigin(this._options.origin)
    this.draw()
  }

  draw () {
    const ctx = this._context
    ctx.save()
    ctx.beginPath()

    ctx.stroke()
    ctx.restore()
  }

  ease () {
  }

  measureCanvas () {
    this._width = parseFloat(this._context.canvas.style.width)
    this._height = parseFloat(this._context.canvas.style.height)
  }

  resize () {
    this.measureCanvas()
    this.draw()
  }

  private applyAngle (angle: number): Vector[] {
    if (angle) this._angle = angle

    // if (!this._angle)

    if (this._options.style === 'solid') {
      return [[this._width, this._height]]
    }

    if (this._angle === Math.PI || this._angle === 0) {
      return this._options.dashArray.map(x => ([x, 0]))
    }

    if (this._angle === Math.PI / 2 || this._angle === Math.PI * 3 / 2) {
      return this._options.dashArray.map(y => ([0, y]))
    }

    return this._options.dashArray.map(x => ([Math.cos(this._angle) * x, Math.sin(this._angle) * x]))
  }

  private applyOrigin (location: Vector) {
    return location
  }

  transform (location: Vector, angle?: number) {
    if (angle) this.applyAngle(angle)

    this._start = this.applyOrigin(location)

    this.draw()
  }
}

export default Line

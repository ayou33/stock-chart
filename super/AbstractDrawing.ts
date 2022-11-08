/**
 *  @file         stock-chart/super/AbstractDrawing.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 18:43
 *  @description
 */
import * as R from 'ramda'
import Event from '../base/Event'
import IDrawing, {
  ControlPoint,
  DrawingEvents,
  DrawingPoint,
  DrawingState,
} from '../interface/IDrawing'
import IGraph from '../interface/IGraph'
import { themeOptions } from '../theme'

abstract class AbstractDrawing<O = unknown, E extends string = never> extends Event<DrawingEvents | E> implements IDrawing {
  chart: IGraph
  options: O
  state = DrawingState.BUSY

  /**
   * 以canvas坐标系为参考的点
   * @private
   */
  private readonly _controlPoints: ControlPoint[] = []

  private _data: unknown = null

  protected hit = false

  protected constructor (chart: IGraph, options: O) {
    super()

    this.chart = chart
    this.options = options
  }

  busy () {
    this.state = DrawingState.BUSY
  }

  ready () {
    this.state = DrawingState.READY
  }

  push (point: ControlPoint) {
    this._controlPoints.push(point)

    return this
  }

  private toControlPoint ([x, y]: Vector): ControlPoint {
    return {
      x,
      y,
      price: this.chart.invertY(y),
      date: this.chart.invertX(x),
    }
  }

  format ({ price, date }: DrawingPoint): ControlPoint {
    return {
      x: this.chart.fx(date),
      y: this.chart.fy(price),
      price,
      date,
    }
  }

  record (point: Vector) {
    this.push(this.toControlPoint(point))

    return this
  }

  trace () {
    return this._controlPoints
  }

  bind<T = unknown> (data?: T) {
    if (data !== undefined) {
      this._data = data
    }

    return this._data as T
  }

  remove () {
    this.emit('remove', this)

    return this
  }

  click () {
    if (this.state === DrawingState.ACTIVE) {
      this.state = DrawingState.FOCUSED
      this.emit('focus', this)
    } else if (this.state === DrawingState.FOCUSED) {
      this.state = DrawingState.BLUR
      this.emit('blur')
    }

    return this
  }

  highlight () {
    const ctx = this.chart.context
    ctx.beginPath()
    ctx.strokeStyle = themeOptions.primaryColor
    R.map(
      ({ date, price }) =>
        ctx.arc(this.chart.fx(date), this.chart.fy(price), 5, 0, Math.PI * 2),
      this._controlPoints,
    )
    ctx.stroke()

    return this
  }

  render (points: DrawingPoint[]) {
    const ps: Vector[] = []

    R.map(p => {
      const point = this.format(p)
      this.push(point)
      ps.push([point.x, point.y])
    }, points)

    this.draw(ps)
    this.emit('done')
    this.ready()

    return this
  }

  test (_: number, __: number) {
    return false
  }

  activated () {
    this.emit('activate', (a, b) => {
      console.log('ayo', a, b)
    })
  }

  check (x: number, y: number) {
    if (this.state === DrawingState.BUSY) return this

    const hit = this.test(x, y)

    if (hit && !this.hit) {
      this.hit = true
      this.state = DrawingState.ACTIVE
      this.activated()
      this.highlight()
    } else if (this.hit && !hit) {
      this.emit('deactivate')
      this.state = DrawingState.INACTIVE
      this.hit = false
    }

    return this
  }

  abstract use (point: Vector): this

  abstract draw (points: Vector[]): this
}

export default AbstractDrawing

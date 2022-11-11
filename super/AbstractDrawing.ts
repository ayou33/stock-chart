/**
 *  @file         stock-chart/super/AbstractDrawing.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 18:43
 *  @description
 */
import { TransformReceiver } from 'nanie'
import Transform from 'nanie/src/Transform'
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
  private _stashedState: DrawingState[] = []

  /**
   * 以canvas坐标系为参考的点
   * @private
   */
  private readonly _controlPoints: ControlPoint[] = []

  private _activePoint: ControlPoint | null = null
  private _data: unknown = null
  private _hit = false

  protected constructor (chart: IGraph, options: O) {
    super()

    this.chart = chart
    this.options = options
  }

  private freeze () {
    this._stashedState.push(this.state)

    this.state = DrawingState.BUSY
  }

  private release () {
    const state = this._stashedState.pop()

    if (state !== undefined) {
      this.state = state
    }
  }

  private toControlPoint ([x, y]: Vector): ControlPoint {
    return {
      x,
      y,
      price: this.chart.invertY(y),
      date: this.chart.invertX(x),
    }
  }

  ready () {
    this.state = DrawingState.READY
  }

  push (point: ControlPoint) {
    this._controlPoints.push(point)

    return this
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
    this.deactivate()
    this.emit('remove', this)

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

  testControlPoint (_: number, __: number): ControlPoint {
    return this.trace()[0]
  }

  private click () {
    if (this.state === DrawingState.ACTIVE) {
      this.state = DrawingState.FOCUSED
      this.emit('focus', this)
    } else if (this.state === DrawingState.FOCUSED) {
      this.state = DrawingState.BLUR
      this.emit('blur')
    }
  }

  private transform (diff: Transform) {
    if (this._activePoint) {
      this._activePoint.price = this.chart.invertY(this.chart.fy(this._activePoint.price) + diff.y)
      this._activePoint.date = this.chart.invertX(this.chart.fx(this._activePoint.date) + diff.x)
    }
  }

  /**
   * 激活drawing对象
   * 接管用户在chart上手势响应，并以来来更新激活状态的drawing对象
   */
  activate () {
    let from = new Transform()

    this.emit('activate', (({ type, transform, dirty }) => {
      if (type === 'start') {
        this.freeze()
        from = transform
      } else if (type === 'zoom') {
        this.transform(from.diff(transform))
        from = transform
      } else if (type === 'end') {
        this.release()
        if (dirty) {
          this.highlight()
          this.emit('transform', this.trace())
        }
      } else if (type === 'click') {
        this.click()
      }
    }) as TransformReceiver)
  }

  private deactivate () {
    this.state = DrawingState.INACTIVE
    this._hit = false
    this._activePoint = null
    this.emit('deactivate')
  }

  check (x: number, y: number) {
    if (this.state === DrawingState.BUSY) return this

    const hit = this.test(x, y)

    if (hit && !this._hit) {
      this._hit = true
      this.state = DrawingState.ACTIVE
      this._activePoint = this.testControlPoint(x, y)
      this.highlight()
      this.activate()
    } else if (this._hit && !hit) {
      this.deactivate()
    }

    return this
  }

  abstract use (point: Vector): this

  abstract draw (points: Vector[]): this
}

export default AbstractDrawing

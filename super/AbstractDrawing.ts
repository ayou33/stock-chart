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
import extend from '../helper/extend'
import IDrawing, {
  ValuePoint,
  DrawingEvents,
  PointValue,
  DrawingState,
} from '../interface/IDrawing'
import IGraph from '../interface/IGraph'
import { themeOptions } from '../theme'

abstract class AbstractDrawing<O extends Record<string, unknown> = Record<string, unknown>, E extends string = never> extends Event<DrawingEvents | E> implements IDrawing<O> {
  chart: IGraph
  options: O
  state = DrawingState.BUSY

  /**
   * 以canvas坐标系为参考的点
   * @private
   */
  private readonly _points: ValuePoint[] = []

  private _stashedState: DrawingState[] = []
  private _hitIndex: number | null = null
  private _binding: unknown = null
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

  /**
   * 通过坐标计算[date, price]
   * @private
   * @param point {PointLocation}
   */
  private evaluate ({ x, y }: PointLocation): ValuePoint {
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

  push (point: ValuePoint) {
    this._points.push(point)

    return this
  }

  /**
   * 计算[date, price]对应的坐标
   */
  locate ({ price, date }: PointValue): ValuePoint {
    return {
      price,
      date,
      x: this.chart.fx(date),
      y: this.chart.fy(price),
    }
  }

  /**
   * 获取所有/指定的控制点
   */
  trace<T extends (number | undefined) = undefined,
    R = T extends number
        ? (ValuePoint | undefined)
        : Array<ValuePoint>> (index?: T): R

  trace (index?: number) {
    return index === undefined ? this._points : this._points[index]
  }

  bind<T = unknown> (data?: T) {
    if (data !== undefined) {
      this._binding = data
    }

    return this._binding as T
  }

  remove () {
    this.deactivate()
    this.emit('remove', this)

    return this
  }

  /**
   * 高亮显示
   */
  highlight () {
    const ctx = this.chart.context
    ctx.beginPath()
    ctx.strokeStyle = themeOptions.primaryColor
    R.map(
      ({ date, price }) =>
        ctx.arc(this.chart.fx(date), this.chart.fy(price), 5, 0, Math.PI * 2),
      this._points,
    )
    ctx.stroke()

    return this
  }

  render (points: PointValue[], _extra?: unknown) {
    R.map(p => this.push(this.locate(p)), points)

    this.draw()
    this.emit('done')
    this.ready()

    return this
  }

  /**
   * 测试鼠标点是否与图形交叉
   */
  test (_x: number, _y: number) {
    return false
  }

  /**
   * 测试鼠标点是否与控制点交叉
   */
  testPoint (_: number, __: number): number | null {
    return 0
  }

  /**
   * 响应鼠标点击
   * @private
   */
  private click () {
    if (this.state === DrawingState.ACTIVE) {
      this.state = DrawingState.FOCUSED
      this.emit('focus', this)
    } else if (this.state === DrawingState.FOCUSED) {
      this.state = DrawingState.BLUR
      this.emit('blur')
    }
  }

  /**
   * 更新控制点
   */
  private transform (diff: Transform) {
    if (this._hitIndex === null) {
      this._points.map(
        (p, i) =>
          this._points[i] = this.evaluate({ x: p.x + diff.x, y: p.y + diff.y }),
      )
    } else {
      const p = this._points[this._hitIndex]
      this._points[this._hitIndex] = this.evaluate({
        x: p.x + diff.x,
        y: p.y + diff.y,
      })
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
    this._hitIndex = null
    this.emit('deactivate')
  }

  /**
   * 响应鼠标移动
   */
  isContain (x: number, y: number) {
    if (this.state === DrawingState.BUSY) return false

    const hit = this.test(x, y)

    if (hit && !this._hit) {
      this._hit = true
      this.state = DrawingState.ACTIVE
      this._hitIndex = this.testPoint(x, y)
      this.highlight()
      this.activate()
    } else if (this._hit && !hit) {
      this.deactivate()
    }

    return hit
  }

  /**
   * 拾取鼠标点
   */
  use ([x, y]: Vector): this {
    this.push(this.evaluate({ x, y }))

    this.draw()

    this.emit('end', this, (ok: boolean) => {
      this.emit(ok ? 'done' : 'fail')
      if (ok) this.ready()
    })

    return this
  }

  update (_options: Partial<O>) {
    this.options = extend(this.options, _options)
    this.emit('refresh')

    return this
  }

  redraw () {
    this.trace().map((p, i) => this._points[i] = this.locate(p))
    this.draw()
  }

  abstract draw (): this
}

export default AbstractDrawing

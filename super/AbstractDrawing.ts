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
import IDrawing, { DrawingEvents, PointValue, ValuePoint } from '../interface/IDrawing'
import IGraph from '../interface/IGraph'
import { themeOptions } from '../theme'
import createStateMachine from './DrawingStateManager'

abstract class AbstractDrawing<O extends Record<string, unknown> = Record<string, unknown>, E extends string = never> extends Event<DrawingEvents | E> implements IDrawing<O> {
  chart: IGraph
  options: O
  state = createStateMachine()

  /**
   * 以canvas坐标系为参考的点
   * @private
   */
  private readonly _points: ValuePoint[] = []
  private _index = 0

  private _hitIndex: number | null = null
  private _hitFlag = false
  private _binding: unknown = null

  protected constructor (chart: IGraph, options: O) {
    super()

    this.chart = chart
    this.options = options
  }

  /**
   * 通过坐标计算[date, price]
   * @private
   * @param point {PointLocation}
   */
  evaluate ({ x, y }: PointLocation): ValuePoint {
    return {
      x,
      y,
      price: this.chart.invertY(y),
      date: this.chart.invertX(x),
    }
  }

  ready () {
    this.state.ready()
  }

  record (point: ValuePoint, replace = false) {
    this._points[this._index] = point

    if (this.state.isPending() && !replace) {
      this._index = this._points.length
    }

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

  count () {
    return this._index
  }

  bind<T = unknown> (data?: T) {
    if (data !== undefined) {
      this._binding = data
    }

    return this._binding as T
  }

  remove () {
    this.emit('remove', this)

    return this
  }

  /**
   * 高亮显示
   */
  highlight () {
    const ctx = this.chart.context
    ctx.strokeStyle = themeOptions.primaryColor
    R.map(
      ({ date, price }) => {
        ctx.beginPath()
        ctx.arc(this.chart.fx(date), this.chart.fy(price), 5, 0, Math.PI * 2)
        ctx.stroke()
      },
      this._points,
    )

    return this
  }

  render (points: PointValue[], _extra?: unknown) {
    R.map(p => this.record(this.locate(p)), points)

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
    if (this.state.isActive()) {
      this.state.focus()
      this.emit('focus', this)
    } else if (this.state.isFocused()) {
      this.state.reset()
      this.emit('blur')
    }
  }

  /**
   * 更新控制点
   */
  transform (diff: Transform) {
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

    return this
  }

  /**
   * 激活drawing对象
   * 接管用户在chart上手势响应，并以来来更新激活状态的drawing对象
   */
  activate () {
    let from = new Transform()

    this.emit('activate', (({ type, transform, dirty }) => {
      if (type === 'start') {
        this.state.save()
        this.state.busy()
        from = transform
      } else if (type === 'zoom') {
        this.transform(from.diff(transform))
        from = transform
      } else if (type === 'end') {
        this.state.restore()
        if (dirty) {
          this.highlight()
          this.emit('transform', this.trace())
        }
      } else if (type === 'click') {
        this.click()
      }
    }) as TransformReceiver)
  }

  onPointerMove (x: number, y: number) {
    if (this.state.isBusy()) return false

    if (this.state.isPending()) {
      this.record(this.evaluate({ x, y }), true)
      this.emit('refresh')

      return true
    }

    const isHit = this.test(x, y)

    /**
     * 本次校验结果与当前保存的结果
     * 实现命中激活状态的切换并过滤多余的操作
     */
    if (isHit && !this._hitFlag) {
      this._hitFlag = true
      this.state.active()
      this._hitIndex = this.testPoint(x, y)
      this.highlight()
      this.activate()
    } else if (this._hitFlag && !isHit) {
      this.state.reset()
      this._hitFlag = false
      this._hitIndex = null
      this.emit('deactivate')
    }

    return isHit
  }

  /**
   * 拾取鼠标点
   */
  use ([x, y]: Vector): this {
    this.record(this.evaluate({ x, y }))

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

/**
 *  @file         stock-chart/super/AbstractDrawing.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 18:43
 *  @description
 */
import Event from '../base/Event'
import IDrawing, { DrawingEvents } from '../interface/IDrawing'
import IGraph from '../interface/IGraph'

abstract class AbstractDrawing<O = unknown, E extends string = never> extends Event<DrawingEvents | E> implements IDrawing {
  chart: IGraph
  options: O

  private readonly _tracePoints: Vector[] = []
  private readonly _controlPoints: Vector[] = []

  private _data: unknown = null

  protected focused = false

  protected constructor (chart: IGraph, options: O) {
    super()

    this.chart = chart
    this.options = options
  }

  push (location: Vector) {
    this._tracePoints.push(location)

    return this
  }

  protected record (point: Vector) {
    this.push([this.chart.invertX(point[0]), this.chart.invertY(point[1])])
    return this
  }

  trace () {
    return this._tracePoints
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

  highlight () {
    this.focused = true

    return this
  }

  blur () {
    this.focused = false

    return this
  }

  abstract transform (point: Vector, radian?: number): this

  abstract use (point: Vector): this

  abstract draw (path: Vector[]): this

  abstract render (locations: Vector[]): this

  abstract isPointInPath (x: number, y: number): boolean
}



export default AbstractDrawing

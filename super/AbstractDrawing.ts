/**
 *  @file         stock-chart/super/AbstractDrawing.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 18:43
 *  @description
 */
import Event from '../base/Event'
import IDrawing, { DrawingEvents } from '../interface/IDrawing'

abstract class AbstractDrawing<O = unknown, E extends string = never> extends Event<DrawingEvents | E> implements IDrawing<O> {
  context: CanvasRenderingContext2D
  options: O

  private readonly _positions: Vector[] = []

  protected constructor (context: CanvasRenderingContext2D, options: O) {
    super()

    this.context = context
    this.options = options
  }

  protected collect (position: Vector) {
    this._positions.push(position)
  }

  protected collectAll (positions: Vector[]) {
    this._positions.length = 0
    this._positions.push(...positions)

    return this
  }

  positions () {
    return this._positions
  }

  abstract transform (location: Vector, radian?: number): this

  abstract use (location: Vector, position: Vector): this

  abstract render (options: O): this

  abstract draw (points: Vector[]): this
}


export default AbstractDrawing

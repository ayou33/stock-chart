/**
 *  @file         stock-chart/interface/IDrawing.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 14:44
 *  @description
 */
import Event from '../base/Event'

export type DrawingEvents =
  'click'
  | 'end'
  | 'done'
  | 'fail'
  | 'cancel'
  | 'active'
  | 'focus'
  | 'blur'
  | 'transform'

interface IDrawing<T = unknown> extends Event<DrawingEvents> {
  render (options: T): this;

  draw (points: Vector[]): this;

  use (location: Vector, position: Vector): this;

  transform (location: Vector, radian?: number): this;

  positions (): Vector[];
}

export default IDrawing

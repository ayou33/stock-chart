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
  | 'focus'
  | 'blur'
  | 'remove'
  | 'transform'

interface IDrawing extends Event<DrawingEvents> {
  draw (path: Vector[]): this;

  use (point: Vector): this;

  transform (point: Vector, radian?: number): this;

  trace (): Vector[];

  bind <T = unknown>(data?: T): T | null;

  remove (): this;

  render (locations: Vector[]): this;

  isPointInPath (x: number, y: number): boolean;

  highlight (): this;

  blur (): this;
}

export default IDrawing

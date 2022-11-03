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

export type ControlPoint = {
  x: number;
  y: number;
  price: number;
  date: number;
}

export type DrawingPoint = Omit<ControlPoint, 'x' | 'y'>

interface IDrawing extends Event<DrawingEvents> {
  draw (path: Vector[]): this;

  use (point: Vector): this;

  render (points: DrawingPoint[]): this;

  remove (): this;

  bind <T = unknown>(data?: T): T | null;

  trace (): ControlPoint[];

  active (): this;

  check (x: number, y: number): this;
}

export default IDrawing

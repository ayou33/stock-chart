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
  | 'activate'
  | 'focus'
  | 'deactivate'
  | 'blur'
  | 'remove'
  | 'transform'

export type ControlPoint = {
  x: number;
  y: number;
  price: number;
  date: number;
}

export enum DrawingState {
  BUSY, // 忙，包括正在绘制，正在删除等不可操作状态
  READY, // 一般状态
  ACTIVE, // hovered
  FOCUSED, // hover & click
  INACTIVE, // mouseout
  BLUR // mouseout & click
}

export type DrawingPoint = Omit<ControlPoint, 'x' | 'y'>

interface IDrawing extends Event<DrawingEvents> {
  state: DrawingState

  draw (path: Vector[]): this;

  use (point: Vector): this;

  render (points: DrawingPoint[]): this;

  remove (): this;

  bind <T = unknown>(data?: T): T | null;

  trace (): ControlPoint[];

  click (): this;

  check (x: number, y: number): this;
}

export default IDrawing

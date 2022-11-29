/**
 *  @file         stock-chart/interface/IDrawing.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 14:44
 *  @description
 */
import Event from '../base/Event'
import { StateMachine } from '../super/DrawingStateManager'

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
  | 'refresh'

export type ValuePoint = {
  x: number;
  y: number;
  price: number;
  date: number;
}

export type PointValue = Omit<ValuePoint, 'x' | 'y'>

interface IDrawing<O = unknown> extends Event<DrawingEvents> {
  state: StateMachine

  draw (): this;

  /**
   * 拾取点
   * @param point
   */
  use (point: Vector): this;

  /**
   * 利用价值坐标渲染
   * @param points
   * @param extra
   */
  render (points: PointValue[], extra?: unknown): this;

  remove (): this;

  /**
   * 绑定/获取图形相关信息
   * @param data
   */
  bind<T = unknown> (data?: T): T | null;

  /**
   * 读取控制点
   */
  trace (): ValuePoint | ValuePoint[];

  /**
   * 响应指针移动
   * @param x
   * @param y
   */
  onPointerMove (x: number, y: number): boolean;

  update (options: Partial<O>): this;
}

export default IDrawing

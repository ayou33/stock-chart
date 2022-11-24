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
  | 'refresh'

export type ValuePoint = {
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

export type PointValue = Omit<ValuePoint, 'x' | 'y'>

interface IDrawing<O = unknown> extends Event<DrawingEvents> {
  state: DrawingState

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
   * 响应鼠标移动
   * @param x
   * @param y
   */
  isContain (x: number, y: number): boolean;

  update (options: Partial<O>): this;
}

export default IDrawing

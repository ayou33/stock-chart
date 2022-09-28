/**
 *  @file         stock-chart/interface/IDrawing.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 14:44
 *  @description
 */
interface IDrawing<T = unknown> {
  render (options: T): this;

  create (): this;

  transform (location: Vector, radian?: number): this;
}

export default IDrawing

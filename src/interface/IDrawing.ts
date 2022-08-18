/**
 *  IDrawing.ts of project stock-chart
 *  @date 2022/7/25 18:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
interface IDrawing {
  context: CanvasRenderingContext2D;

  create (): this;

  draw (): this;

  transform (location: Vector, angle?: number): this;

  resize (): this;

  ease (): this;
}

export default IDrawing

/**
 *  canvas绘图接口
 *  Shape.ts of project stock-chart
 *  @date 2022/7/25 17:58
 *  @author 阿佑[ayooooo@petalmail.com]
 */
interface ICanvas {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  render (): this;

  disable (hide?: boolean): this;

  enable (show?: boolean): this;

  draw (...args: unknown[]): this;

  paint (...args: unknown[]): this;

  hide (): this;

  show (): this;

  remove (): this;

  clear (): this;

  resize (): this;
}

export default ICanvas

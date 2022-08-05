/**
 *  canvas绘图接口
 *  Shape.ts of project stock-chart
 *  @date 2022/7/25 17:58
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IRenderer from './IRenderer'

interface IShape extends IRenderer {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  hide (): this;

  show (): this;

  remove (): this;

  clear (): this;
}

export default IShape

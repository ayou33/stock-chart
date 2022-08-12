/**
 *  canvas绘图接口
 *  Shape.ts of project stock-chart
 *  @date 2022/7/25 17:58
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import IInjectable from './IInjectable'

interface ICanvas extends IInjectable {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  render (): this;

  disable (hide?: boolean): this;

  enable (show?: boolean): this;

  draw (update?: UpdatePayload): this;

  paint (update: UpdatePayload): this;

  hide (): this;

  show (): this;

  remove (): this;

  clear (): this;

  resize (): this;
}

export default ICanvas

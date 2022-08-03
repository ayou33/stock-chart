/**
 *  所有依赖坐标系的渲染器的公共接口
 *  IRenderer.ts of project stock-chart
 *  @date 2022/8/3 14:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IMainAxis from './IMainAxis'
import ISeries from './ISeries'

interface IRenderer {
  yAxis: ISeries;
  xAxis: IMainAxis;

  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;

  draw (...args: unknown[]): this;

  render (): this;

  disable (): this;

  enable (): this;

  hide (): this;

  show (): this;
}

export default IRenderer

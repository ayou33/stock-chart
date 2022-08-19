/**
 *  IChartRenderer.ts of project stock-chart
 *  @date 2022/8/19 16:46
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import { RenderOptions } from '../options'
import IAxis from './IAxis'
import ICanvas from './ICanvas'
import IMainAxis from './IMainAxis'

interface IChart<E extends string = never> extends ICanvas<E> {
  options: RenderOptions;
  name: string;
  yAxis: IAxis;
  xAxis: IMainAxis;

  fx (x: number): number;

  fy (y: number): number;

  invertX (x: number): number;

  invertY (y: number): number;

  drawAll (update: UpdatePayload): this;

  drawLatest (update: UpdatePayload): this;
}

export default IChart

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

interface IShape<E extends string = never> extends ICanvas<E> {
  options: RenderOptions;
  name: string;
  yAxis: IAxis;
  xAxis: IMainAxis;
  valueAlign: number;

  fx (x: number): number;

  fy (y: number): number;

  invertX (x: number): number;

  invertY (y: number): number;

  drawAll (update: UpdatePayload): this;

  resetLatest (): this;

  drawLatest (update: UpdatePayload): this;
}

export default IShape

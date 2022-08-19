/**
 *  IIndicator.ts of project stock-chart
 *  @date 2022/7/25 18:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { RenderOptions } from '../options'
import IChart from './IChart'

export enum DisplayType {
  INNER,
  EXTERNAL
}

interface IIndicator<T = unknown, E extends string = never> extends IChart<E> {
  readonly displayType: DisplayType

  config (inputs: T): this;
}

export interface IIndicatorCtor<T = unknown> {
  readonly displayType: DisplayType

  new (options: RenderOptions): IIndicator<T>
}

export default IIndicator

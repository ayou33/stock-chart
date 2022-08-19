/**
 *  IIndicator.ts of project stock-chart
 *  @date 2022/7/25 18:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { RendererOptions } from '../options'
import IChart from './IChart'

interface IIndicator<T = unknown, E extends string = never> extends IChart<E> {
  // readonly displayType: 'inner' | 'external'

  config (inputs: T): this;
}

export interface IIndicatorCtor<T = unknown> {
  readonly displayType: 'inner' | 'external'

  new (options: RendererOptions): IIndicator<T>
}

export default IIndicator

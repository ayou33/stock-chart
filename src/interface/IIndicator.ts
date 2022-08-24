/**
 *  IIndicator.ts of project stock-chart
 *  @date 2022/7/25 18:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import { RenderOptions } from '../options'
import IChart from './IChart'

export enum DisplayType {
  INNER,
  EXTERNAL
}

interface IIndicator<I = unknown, O = unknown, E extends string = never> extends IChart<E> {
  config (inputs: I): this;

  calc (update: UpdatePayload): O

  paintAll (o: O): this

  paintLatest (o: O): this
}

export interface IIndicatorCtor<I = any, O = unknown> {
  readonly displayType: DisplayType

  new (options: RenderOptions & RecursivePartial<{
    inputs: I,
  }>): IIndicator<I, O>
}

export default IIndicator

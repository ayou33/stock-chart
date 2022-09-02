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

export type Inputs<T> = { inputs: T }

export type IndexName = `index_${number}`

interface IIndicator<I extends object = any, O = unknown, E extends string = never> extends IChart<E> {
  displayType: DisplayType

  inputs: I

  output: O[]

  config (inputs: I): this;

  compute (update: UpdatePayload): O[]

  computeLatest (update: UpdatePayload): O[]

  paint (values: O[]): this
}

export interface IIndicatorCtor<I extends object = any, O = unknown> {
  readonly displayType: DisplayType

  new (options: RenderOptions & RecursivePartial<Inputs<I>>): IIndicator<I, O>
}

export default IIndicator
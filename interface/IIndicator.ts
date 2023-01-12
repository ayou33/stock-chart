/**
 *  IIndicator.ts of project stock-chart
 *  @date 2022/7/25 18:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import { GraphOptions } from '../options'
import IGraph from './IGraph'

export enum DisplayType {
  INNER,
  EXTERNAL
}

export type Inputs<T> = { inputs: T }

export type IndexName = `index_${number}`

interface IIndicator<I extends object = any, O = unknown, E extends string = never> extends IGraph<E> {
  displayType: DisplayType

  inputs: I

  initOutput: O[]

  lastOutput: O | null

  config (inputs: I): this;

  computeInit (update: UpdatePayload): O[]

  computeLast (update: UpdatePayload): O[]

  paint (values: O[]): this

  output (index: number): O | null | undefined
}

export interface IIndicatorCtor<I extends object = any, O = unknown> {
  readonly displayType: DisplayType

  new (options: GraphOptions & RecursivePartial<Inputs<I>>): IIndicator<I, O>
}

export default IIndicator

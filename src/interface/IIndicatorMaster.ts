/**
 *  IIndicatorMaster.ts of project stock-chart
 *  @date 2022/8/19 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { IndicatorInputs, IndicatorNames } from '../indicator/all'
import IIndicator, { IIndicatorCtor } from './IIndicator'
import IRenderer from './IRenderer'
import { RenderMasterOptions } from '../options'
import Layout from '../core/Layout'

interface IIndicatorMaster<E extends string = never> extends IRenderer<E> {
  options: RenderMasterOptions
  layout: Layout

  add (name: IndicatorNames, config?: IndicatorInputs[typeof name]): this;

  remove<T> (Ctor: IIndicatorCtor<T>): this;

  replace<T> (old: string | IIndicatorCtor, Ctor: IIndicatorCtor<T>): this;

  show<T> (Ctor: string | IIndicator<T>): this;

  config<T> (config: T): this;
}

export default IIndicatorMaster

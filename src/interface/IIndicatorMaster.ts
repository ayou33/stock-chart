/**
 *  IIndicatorMaster.ts of project stock-chart
 *  @date 2022/8/19 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Layout from '../core/Layout'
import IIndicator, { IIndicatorCtor } from './IIndicator'
import IRenderer from './IRenderer'

interface IIndicatorMaster<E extends string = never> extends IRenderer<E> {
  layout: Layout

  add<T> (Ctor: IIndicatorCtor<T>): this;

  remove<T> (Ctor: IIndicatorCtor<T>): this;

  replace<T> (old: string | IIndicatorCtor, Ctor: IIndicatorCtor<T>): this;

  show<T> (Ctor: string | IIndicator<T>): this;

  config<T> (config: T): this;
}

export default IIndicatorMaster

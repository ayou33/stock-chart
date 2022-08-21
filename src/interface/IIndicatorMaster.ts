/**
 *  IIndicatorMaster.ts of project stock-chart
 *  @date 2022/8/19 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { IndicatorInputs, IndicatorNames } from '../indicator/all'
import IRenderer from './IRenderer'
import { RenderMasterOptions } from '../options'
import Layout from '../core/Layout'

interface IIndicatorMaster<E extends string = never> extends IRenderer<E> {
  options: RenderMasterOptions
  layout: Layout

  add (name: IndicatorNames, config?: IndicatorInputs[typeof name]): this;

  remove (name: IndicatorNames): this;

  replace (name: IndicatorNames, config?: IndicatorInputs[typeof name]): this;

  config (name: IndicatorNames, config: IndicatorInputs[typeof name]): this;
}

export default IIndicatorMaster

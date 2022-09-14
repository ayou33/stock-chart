/**
 *  IIndicatorMaster.ts of project stock-chart
 *  @date 2022/8/19 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { IndicatorInputs, IndicatorNames } from '../indicator/all'
import IIndicator from './IIndicator'
import IRenderer from './IRenderer'
import { RenderMasterOptions } from '../options'
import Layout from '../layout/Layout'

interface IIndicatorMaster<E extends string = never> extends IRenderer<E> {
  options: RenderMasterOptions
  layout: Layout

  add (name: IndicatorNames, config?: IndicatorInputs[typeof name]): IIndicator;

  remove (name: IndicatorNames): this;

  config (name: IndicatorNames, config: IndicatorInputs[typeof name]): this;
}

export default IIndicatorMaster

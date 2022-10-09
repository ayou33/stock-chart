/**
 *  IIndicatorMaster.ts of project stock-chart
 *  @date 2022/8/19 17:28
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { IndicatorInputs, IndicatorNames } from '../indicator/all'
import Board from '../ui/Board'
import IIndicator from './IIndicator'
import IRenderer from './IRenderer'
import Layout from '../layout/Layout'

interface IIndicatorMaster<E extends string = never> extends IRenderer<E> {
  board: Board
  layout: Layout

  add (name: IndicatorNames, config?: IndicatorInputs[typeof name]): IIndicator;

  remove (name: IndicatorNames): this;

  config (name: IndicatorNames, config: IndicatorInputs[typeof name]): this;
}

export default IIndicatorMaster

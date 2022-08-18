/**
 *  IIndicator.ts of project stock-chart
 *  @date 2022/7/25 18:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IChart from './IChart'

interface IIndicator<T> extends IChart {
  config (inputs: T): this;
}

export default IIndicator

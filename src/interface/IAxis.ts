/**
 *  IAxis.ts of project stock-chart
 *  @date 2022/8/4 15:50
 *  @author 阿佑[ayooooo@petalmail.com]
 */
interface IAxis {
  value (domainValue: number): number;

  invert (rangeValue: number): number;

  transform (): this;

  render (): this;

  clear (): this;

  focus (position: number): this;

  blur (): this;
}

export default IAxis

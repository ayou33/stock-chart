/**
 *  IAxis.ts of project stock-chart
 *  @date 2022/8/4 15:50
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'

interface IAxis {
  value (domainValue: number): number;

  invert (rangeValue: number): number;

  transform (transform: Transform): this;

  render (): this;

  clear (): this;

  focus (position: number): this;

  blur (): this;

  ticks (count: number): this;

  ticks (decide: (index: number, value: number, pos: number) => boolean): this;

  tickFormat (format: (value: number, pos: number) => string): this;
}

export default IAxis

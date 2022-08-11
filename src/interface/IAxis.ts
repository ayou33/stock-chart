/**
 *  IAxis.ts of project stock-chart
 *  @date 2022/8/4 15:50
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'
import ICanvas from './ICanvas'

interface IAxis<T = Extent> extends ICanvas {
  range (range?: Extent): Extent;

  domain (domain?: T): T;

  value (domainValue: number): number;

  invert (rangeValue: number): number;

  transform (transform: Transform, ref?: number): this;

  focus (position: number): this;

  blur (): this;

  ticks (count: number): this;

  ticks (decide: (index: number, value: number, pos: number) => boolean): this;

  tickFormat (format: (value: number, pos: number) => string): this;
}

export default IAxis

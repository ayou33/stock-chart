/**
 *  数据分布类抽象
 *  IScale.ts of project stock-chart
 *  @date 2022/8/11 17:36
 *  @author 阿佑[ayooooo@petalmail.com]
 */
interface IScale<T = any> {
  value (domainValue: number): number;

  invert (rangeValue: number): number;

  range (range?: Extent): Extent

  domain (domain?: T): T;

  translate (x: number): Extent;

  scale (k: number, ref?: number): Extent;
}

export default IScale

/**
 *  IMainAxis.ts of project stock-chart
 *  @date 2022/8/3 14:58
 *  @author 阿佑[ayooooo@petalmail.com]
 */
interface IMainAxis {
  fx (date: number): number | undefined;

  invertX (x: number): number | undefined;

  range (range?: Extent): Extent;

  domain (domain?: number[]): number[];

  step (): number;

  padding (padding?: number): number;

  bandWidth (width?: number): number;
}

export default IMainAxis

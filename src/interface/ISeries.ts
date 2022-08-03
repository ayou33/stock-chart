/**
 *  ISeries.ts of project stock-chart
 *  @date 2022/8/3 14:58
 *  @author 阿佑[ayooooo@petalmail.com]
 */
interface ISeries {
  fy (value: number): number;

  invertY (y: number): number;

  range (range?: Extent): Extent;

  domain (domain?: Extent): Extent;
}

export default ISeries

/**
 *  主做标注抽象
 *  IMainAxis.ts of project stock-chart
 *  @date 2022/8/11 18:17
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IAxis from './IAxis'

interface IMainAxis extends IAxis<number[]> {
  bandWidth (width?: number): number;

  step (step?: number): number;
}

export default IMainAxis

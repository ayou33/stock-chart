/**
 *  AbstractIndicator.ts of project stock-chart
 *  @date 2022/8/18 17:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IAxis from '../interface/IAxis'
import IIndicator from '../interface/IIndicator'
import IMainAxis from '../interface/IMainAxis'

abstract class AbstractIndicator implements IIndicator {
  context: CanvasRenderingContext2D
  xAxis: IMainAxis
  yAxis: IAxis

  constructor (context: CanvasRenderingContext2D, xAxis: IMainAxis, yAxis: IAxis) {
    this.context = context
    this.xAxis = xAxis
    this.yAxis = yAxis
  }


}

export default AbstractIndicator

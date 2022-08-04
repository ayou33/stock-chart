/**
 *  主轴
 *  MainAxis.ts of project stock-chart
 *  @date 2022/7/25 17:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IAxis from '../interface/IAxis'
import Band from '../scale/Band'

class MainAxis extends Band implements IAxis {
  transform (): this {
    return this
  }
}

export default MainAxis

/**
 *  交叉轴
 *  Series.ts of project stock-chart
 *  @date 2022/7/25 17:12
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IAxis from '../interface/IAxis'
import Linear from '../scale/Linear'

class Series extends Linear implements IAxis {
  transform (): this {
    return this
  }
}


export default Series

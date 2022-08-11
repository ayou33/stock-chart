/**
 *  所有依赖坐标系的渲染器的基础(绘制)公共接口
 *  IRenderer.ts of project stock-chart
 *  @date 2022/8/3 14:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import IAxis from './IAxis'
import IMainAxis from './IMainAxis'

interface IRenderer {
  yAxis: IAxis;
  xAxis: IMainAxis;
}

export default IRenderer

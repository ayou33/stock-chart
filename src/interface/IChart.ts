/**
 *  IChart.ts of project stock-chart
 *  @date 2022/7/25 18:20
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import ICanvas from './ICanvas'
import IRenderer from './IRenderer'

interface IChart extends IRenderer, ICanvas {}

export default IChart

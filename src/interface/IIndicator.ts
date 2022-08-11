/**
 *  IIndicator.ts of project stock-chart
 *  @date 2022/7/25 18:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import ICanvas from './ICanvas'
import IRenderer from './IRenderer'

interface IIndicator extends IRenderer, ICanvas {}

export default IIndicator

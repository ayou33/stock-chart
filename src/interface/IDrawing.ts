/**
 *  IDrawing.ts of project stock-chart
 *  @date 2022/7/25 18:23
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import ICanvas from './ICanvas'
import IRenderer from './IRenderer'

interface IDrawing extends IRenderer, ICanvas {}

export default IDrawing

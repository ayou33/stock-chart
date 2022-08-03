/**
 *  需要呈现在主视图区域的图形
 *  Chart.ts of project stock-chart
 *  @date 2022/7/25 18:22
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import MainAxis from './MainAxis'
import Series from './Series'

class Chart {
  series: Series
  mainAxis: MainAxis

  private _canvas: HTMLCanvasElement
  private _context: CanvasRenderingContext2D

  constructor () {
    this._canvas = document.createElement('canvas')

    const context = this._canvas.getContext('2d')

    if (!context) {
      throw new ReferenceError('Invalid canvas rendering context!')
    }

    this._context = context
  }
}

export default Chart

/**
 *  @file         stock-chart/core/DrawingMaster.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 17:34
 *  @description
 */
import HorizontalLine from '../drawing/HorizontalLine'

class DrawingMaster {
  private readonly context: CanvasRenderingContext2D

  constructor (context: CanvasRenderingContext2D) {
    this.context = context
  }

  define () {}

  create () {
    return new HorizontalLine(this.context)
  }

  render () {}
}

export default DrawingMaster

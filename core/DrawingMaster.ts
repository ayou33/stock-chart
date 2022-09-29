/**
 *  @file         stock-chart/core/DrawingMaster.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 17:34
 *  @description
 */
import HorizontalLine from '../drawing/HorizontalLine'
import IDrawing from '../interface/IDrawing'

export type DrawingTypes = 'position' | 'trendLine' | 'text' | 'dir' | string

class DrawingMaster {
  private readonly context: CanvasRenderingContext2D
  private drawing: IDrawing | null = null

  constructor (context: CanvasRenderingContext2D) {
    this.context = context
  }

  define () {}

  create (type: DrawingTypes) {
    switch (type) {
      case 'position':
        return this.drawing = new HorizontalLine(this.context)
    }

    throw new TypeError(`Drawing type "${type}" is not recognized!`)
  }

  render () {}

  pick (x: number, y: number) {
    this.drawing?.transform([x, y])
    // console.log('click point', x, y)
  }
}

export default DrawingMaster

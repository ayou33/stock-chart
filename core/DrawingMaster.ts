/**
 *  @file         stock-chart/core/DrawingMaster.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/27 17:34
 *  @description
 */
import HorizontalLine from '../drawing/HorizontalLine'
import IDrawing from '../interface/IDrawing'
import Board from '../ui/Board'

export type DrawingTypes = 'position' | 'trendLine' | 'text' | 'dir' | string

class DrawingMaster {
  private readonly context: CanvasRenderingContext2D
  private drawing: IDrawing | null = null
  private drawings: IDrawing[] = []

  constructor (board: Board) {
    this.context = board.context

    board.on('click', (_, [x, y]: Vector) => {
      this.pick(x, y)
    })
  }

  define () {}

  create (type: DrawingTypes) {
    switch (type) {
      case 'position':
        this.drawings.push(this.drawing = new HorizontalLine(this.context))
        return this.drawing
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

/**
 *  @file         stock-chart/super/AbstractChart.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/9/20 17:51
 *  @description
 */
import { UpdateLevel, UpdatePayload } from '../core/DataSource'
import AbstractGraph from './AbstractGraph'

abstract class AbstractChart extends AbstractGraph {
  draw (update: UpdatePayload): this {
    if (update.level === UpdateLevel.PATCH) {
      this.resetLast()
      this.drawLast(update)
    } else {
      this.clear()
      this.drawAll({
        ...update,
        bars: update.bars.slice(...update.span),
      })
    }

    return this
  }

  abstract drawAll (update: UpdatePayload): this

  abstract drawLast (update: UpdatePayload): this
}

export default AbstractChart

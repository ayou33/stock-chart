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
      this.resetLatest()
      this.drawLatest(update)
    } else {
      this.clear()
      this.drawAll({
        ...update,
        bars: update.bars.slice(update.span[0], update.span[1]),
      })
    }

    return this
  }

  abstract drawAll (update: UpdatePayload): this

  abstract drawLatest (update: UpdatePayload): this
}

export default AbstractChart

/**
 *  @file         stock-chart/core/ChartLayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 19:03
 *  @description
 */
import Candle from '../chart/Candle'
import { UpdatePayload } from '../core/DataSource'
import ILayer from '../interface/ILayer'
import { StockChartOptions } from '../options'
import AbstractChart from '../super/AbstractChart'
import AbstractLayer from '../super/AbstractLayer'

class ChartLayer extends AbstractLayer implements ILayer {
  private _chart: AbstractChart | null = null

  apply (update: UpdatePayload): this {
    this._chart?.apply(update)

    return this
  }

  resize (): this {
    this._chart?.resize()

    return this
  }

  addChart (type: 'candle' | 'mountain', options: StockChartOptions) {
    switch (type) {
      case 'candle':
        this._chart = new Candle({
          ...this.options,
          ...options,
        }).prepend()
        break
    }

    return this
  }
}

export default ChartLayer

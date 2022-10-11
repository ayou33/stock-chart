/**
 *  @file         stock-chart/core/ChartLayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 19:03
 *  @description
 */
import { UpdatePayload } from '../core/DataSource'
import ILayer from '../interface/ILayer'
import AbstractLayer from '../super/AbstractLayer'

class ChartLayer extends AbstractLayer implements ILayer {
  apply (update: UpdatePayload): this {
    return this
  }

  resize (): this {
    return this
  }
}

export default ChartLayer

/**
 *  @file         stock-chart/core/IndicatorLayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 19:04
 *  @description
 */
import { UpdatePayload } from '../core/DataSource'
import ILayer from '../interface/ILayer'
import AbstractLayer from '../super/AbstractLayer'

class IndicatorLayer extends AbstractLayer implements ILayer {
  apply (update: UpdatePayload): this {
    return this
  }

  resize (): this {
    return this
  }
}

export default IndicatorLayer

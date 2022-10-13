/**
 *  @file         stock-chart/super/AbstractLayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 15:41
 *  @description
 */
import { UpdatePayload } from '../core/DataSource'
import { createAAContext } from '../helper/aa'
import ILayer from '../interface/ILayer'
import Layout from '../layout/Layout'
import LayoutCell from '../layout/LayoutCell'
import { ScaledOptions } from '../options'

export type LayerOptions = ScaledOptions & {
  layout: Layout;
  container: LayoutCell;
}

abstract class AbstractLayer implements ILayer {
  options: LayerOptions

  protected constructor (layerOptions: LayerOptions) {
    this.options = layerOptions
  }

  newDraft (): CanvasRenderingContext2D {
    return createAAContext(this.options.container.width(), this.options.container.height())
  }

  abstract apply (update: UpdatePayload): this

  abstract resize (): this
}

export default AbstractLayer

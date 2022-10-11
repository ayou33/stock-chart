/**
 *  @file         stock-chart/interface/ILayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 15:41
 *  @description
 */
import { UpdatePayload } from '../core/DataSource'

interface ILayer {
  apply (update: UpdatePayload): this;

  resize (): this;

  newDraft (): CanvasRenderingContext2D;
}

export default ILayer

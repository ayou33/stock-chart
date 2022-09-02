/**
 *  功能渲染器抽象
 *  负责数据分发
 *  IRenderer.ts of project stock-chart
 *  @date 2022/8/3 14:56
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { UpdatePayload } from '../core/DataSource'
import IInjectable from './IInjectable'
import Event from '../base/Event'

interface IRenderer<E extends string = never> extends Event<E>, IInjectable {
  lastUpdate: UpdatePayload | null;

  apply (update?: UpdatePayload | null): this;

  draw (update: UpdatePayload): this;

  destroy (): this;

  resize () :this;
}

export default IRenderer

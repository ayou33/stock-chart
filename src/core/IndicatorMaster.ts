/**
 *  Indicator.ts of project stock-chart
 *  @date 2022/8/19 17:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { createAAContext } from '../helper/aa'
import IIndicator, { IIndicatorCtor } from '../interface/IIndicator'
import IIndicatorMaster from '../interface/IIndicatorMaster'
import { InjectTypes } from '../interface/IInjectable'
import AbstractRenderer from '../super/AbstractRenderer'
import { UpdatePayload } from './DataSource'
import Layout from './Layout'

class IndicatorMaster extends AbstractRenderer implements IIndicatorMaster {
  layout: Layout

  private readonly _indicators: Record<string, IIndicator> = {}

  constructor (layout: Layout) {
    super()

    this.layout = layout
  }

  applyInject (name: InjectTypes, type: 'before' | 'after'): this {
    return this
  }

  draw (update: UpdatePayload): this {
    return this
  }

  add<T> (Ctor: IIndicatorCtor<T>): this {
    const i = new Ctor(this.options)

    if (i.displayType === 'inner') {
    }

    this._indicators[i.name] = i
    return this
  }

  remove<T> (indicator: IIndicator<T>): this {
    return this
  }

  replace<T> (old: string | IIndicator, indicator: IIndicator<T>): this {
    return this
  }

  config<T> (config: T): this {
    return this
  }

  show<T> (indicator: string | IIndicator<T>): this {
    return this
  }
}

export default IndicatorMaster

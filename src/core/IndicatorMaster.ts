/**
 *  Indicator.ts of project stock-chart
 *  @date 2022/8/19 17:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { IndicatorInputs, IndicatorNames } from '../indicator/all'
import MA from '../indicator/ma/MA'
import IIndicator, { DisplayType, IIndicatorCtor } from '../interface/IIndicator'
import IIndicatorMaster from '../interface/IIndicatorMaster'
import { InjectTypes } from '../interface/IInjectable'
import AbstractRenderer from '../super/AbstractRenderer'
import { UpdatePayload } from './DataSource'
import { RenderMasterOptions } from '../options'
import Layout from './Layout'

class IndicatorMaster extends AbstractRenderer implements IIndicatorMaster {
  options: RenderMasterOptions
  layout: Layout

  private readonly _indicators: Record<string, IIndicator> = {}

  constructor (options: RenderMasterOptions) {
    super()

    this.options = options
    this.layout = options.layout
  }

  private reduce (name: IndicatorNames):IIndicatorCtor {
    return MA
  }

  applyInject (name: InjectTypes, type: 'before' | 'after'): this {
    return this
  }

  draw (update: UpdatePayload): this {
    return this
  }

  add (name: IndicatorNames, config?: IndicatorInputs[typeof name]): this {
    // const Ctor = this.reduce(name)
    // const indicator = new Ctor(config)
    //
    // this._indicators[indicator.name] = indicator
    //
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

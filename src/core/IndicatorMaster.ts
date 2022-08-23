/**
 *  Indicator.ts of project stock-chart
 *  @date 2022/8/19 17:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { createAAContext } from '../helper/aa'
import { IndicatorInputs, IndicatorNames, indicators } from '../indicator/all'
import IIndicator, { DisplayType, IIndicatorCtor } from '../interface/IIndicator'
import IIndicatorMaster from '../interface/IIndicatorMaster'
import { InjectPosition, InjectTypes } from '../interface/IInjectable'
import LayoutCell from '../layout/LayoutCell'
import { RenderMasterOptions } from '../options'
import AbstractRenderer from '../super/AbstractRenderer'
import { UpdatePayload } from './DataSource'
import Layout from '../layout/Layout'

class IndicatorMaster extends AbstractRenderer implements IIndicatorMaster {
  options: RenderMasterOptions
  layout: Layout

  private readonly _indicators: Record<string, IIndicator> = {}
  private _innerContainer: LayoutCell | null = null
  private _innerContext: CanvasRenderingContext2D | null = null
  private _externalContainer: LayoutCell | null = null

  constructor (options: RenderMasterOptions) {
    super()

    this.options = options
    this.layout = options.layout
  }

  private reduce (name: IndicatorNames): IIndicatorCtor {
    return indicators[name]
  }

  private useInnerContext (): [LayoutCell, CanvasRenderingContext2D] {
    if (this._innerContainer === null) {
      this._innerContainer = this.layout.chart()
      const context = createAAContext(this._innerContainer.width(), this._innerContainer.height())
      const canvas = context.canvas
      canvas.style.cssText += `
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      `
      this._innerContext = context
      this._innerContainer.node().firstElementChild?.insertAdjacentElement('afterend', context.canvas)
    }

    return [this._innerContainer, this._innerContext]
  }

  private useExternalContainer (): [LayoutCell, CanvasRenderingContext2D] {
    if (this._externalContainer === null) {
      this._externalContainer = this.layout.appendRow({
        name: 'indicator',
        cells: [{
          colSpan: 2,
          height: 200,
        }],
      }).at(0)
    }

    return [this._externalContainer, this._innerContext]
  }

  applyInject (name: InjectTypes, position: InjectPosition): this {
    const handlers = position === 'before' ? this.beforeInjections[name] : this.afterInjections[name]

    handlers.map(fn => fn(this.context, this.lastUpdate))

    return this
  }

  draw (update: UpdatePayload): this {
    for (let k in this._indicators) {
      this._indicators[k].drawAll(update)
    }
    return this
  }

  add (name: IndicatorNames, config?: IndicatorInputs[typeof name]): this {
    const Ctor = this.reduce(name)

    const [container, context] = Ctor.displayType === DisplayType.INNER ? this.useInnerContext()
      : this.useExternalContainer()

    const indicator = new Ctor({
      container,
      xAxis: this.options.xAxis,
      yAxis: this.options.yAxis,
      context,
      inputs: config,
    })

    this._indicators[indicator.name] = indicator

    return this
  }

  config (name: IndicatorNames, config: IndicatorInputs[typeof name]): this {
    console.log('indicator master config', name, config)
    return this
  }

  remove (name: IndicatorNames): this {
    console.log('indicator master remove', name)
    return this
  }

  replace (name: IndicatorNames, config?: IndicatorInputs[typeof name]): this {
    console.log('indicator master replace', name, config)
    return this
  }
}

export default IndicatorMaster

/**
 *  Indicator.ts of project stock-chart
 *  @date 2022/8/19 17:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { createAAContext } from '../helper/aa'
import { IndicatorInputs, IndicatorNames, indicators } from '../indicator/all'
import IIndicator, { DisplayType, IIndicatorCtor } from '../interface/IIndicator'
import IIndicatorMaster from '../interface/IIndicatorMaster'
import { InjectTypes } from '../interface/IInjectable'
import { RenderMasterOptions } from '../options'
import AbstractRenderer from '../super/AbstractRenderer'
import { UpdatePayload } from './DataSource'
import Layout from './Layout'

class IndicatorMaster extends AbstractRenderer implements IIndicatorMaster {
  options: RenderMasterOptions
  layout: Layout

  private readonly _indicators: Record<string, IIndicator> = {}
  private _innerContainer:  ContainerCell | null = null
  private _innerContext: CanvasRenderingContext2D | undefined = undefined
  private _externalContainer: ContainerCell | null = null

  constructor (options: RenderMasterOptions) {
    super()

    this.options = options
    this.layout = options.layout
  }

  private reduce (name: IndicatorNames): IIndicatorCtor {
    return indicators[name]
  }

  private useInnerContext () {
    if (this._innerContainer === null) {
      this._innerContainer = this.layout.chart()
      const context = createAAContext(this._innerContainer.width, this._innerContainer.height)
      const canvas = context.canvas
      canvas.style.cssText += `
        position: absolute;
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      `
      this._innerContext = context
      this._innerContainer.node.firstElementChild?.insertAdjacentElement('afterend', context.canvas)
    }

    return this._innerContainer
  }

  private useExternalContainer () {
    if (this._externalContainer === null) {}

    return this._externalContainer
  }

  applyInject (name: InjectTypes, type: 'before' | 'after'): this {
    // console.log('indicator master apply inject', name, type)
    return this
  }

  draw (update: UpdatePayload): this {
    console.log('indicator master draw', update)
    for (let k in this._indicators) {
      this._indicators[k].drawAll(update)
    }
    return this
  }

  add (name: IndicatorNames, config?: IndicatorInputs[typeof name]): this {
    const Ctor = this.reduce(name)

    const indicator = new Ctor({
      container: Ctor.displayType === DisplayType.INNER ? this.useInnerContext() : this.useExternalContainer(),
      xAxis: this.options.xAxis,
      yAxis: this.options.yAxis,
      inputs: config,
      context: this._innerContext,
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

/**
 *  Indicator.ts of project stock-chart
 *  @date 2022/8/19 17:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Line from '../drawing/Line'
import { aa, createAAContext } from '../helper/aa'
import { IndicatorInputs, IndicatorNames, indicators } from '../indicator/all'
import IIndicator, { DisplayType, IIndicatorCtor } from '../interface/IIndicator'
import IIndicatorMaster from '../interface/IIndicatorMaster'
import Layout from '../layout/Layout'
import LayoutCell from '../layout/LayoutCell'
import { RenderMasterOptions } from '../options'
import AbstractRenderer from '../super/AbstractRenderer'
import { UpdatePayload } from './DataSource'

class IndicatorMaster extends AbstractRenderer implements IIndicatorMaster {
  options: RenderMasterOptions
  layout: Layout

  private readonly _indicators: Record<string, IIndicator> = {}
  private _innerContainer: LayoutCell | null = null
  private _innerContext: CanvasRenderingContext2D | null = null
  private _externalContainer: LayoutCell | null = null
  private _externalContext: CanvasRenderingContext2D | null = null
  private _externalBoard: CanvasRenderingContext2D | null = null
  private _cursor: Line | null = null

  constructor (options: RenderMasterOptions) {
    super()

    this.options = options
    this.layout = options.layout
  }

  private reduce<T> (name: IndicatorNames): IIndicatorCtor<T> {
    return indicators[name]
  }

  private useInnerContext (): [LayoutCell, CanvasRenderingContext2D] {
    if (this._innerContainer === null) {
      this._innerContainer = this.layout.chart()
    }

    if (!this._innerContext) {
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
      this._innerContainer.insert(context.canvas, 0)
    }

    return [this._innerContainer, this._innerContext]
  }

  private useExternalContainer (): [LayoutCell, CanvasRenderingContext2D] {
    if (this._externalContainer === null) {
      this._externalContainer = this.layout.appendRow({
        name: 'indicator',
        cells: [
          {
            height: 200,
          }, null,
        ],
      }).at(0)
    }

    if (!this._externalContext) {
      const context = createAAContext(this._externalContainer.width(), this._externalContainer.height())
      const canvas = context.canvas
      this._externalContext = context
      this._externalContainer.insert(canvas)
    }

    if (!this._externalBoard) {
      this._externalBoard = createAAContext(this._externalContainer.width(), this._externalContainer.height())
      const canvas = this._externalBoard.canvas
      canvas.style.cssText += `
        position: absolute;
        inset: 0;
      `
      this._externalContainer.insert(canvas)

      this._cursor = new Line(this._externalBoard, {
        angle: Math.PI / 2,
        style: 'dashed',
      })
    }

    return [this._externalContainer, this._externalContext]
  }

  /**
   * @ignore
   */
  applyInject (): this {
    return this
  }

  /**
   * @ignore
   */
  draw () {
    return this
  }

  apply (update?: UpdatePayload): this {
    for (let k in this._indicators) {
      this._indicators[k].apply(update)
    }

    return this
  }

  add (name: IndicatorNames, config?: IndicatorInputs[typeof name]): this {
    const Ctor = this.reduce<typeof config>(name)

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

  resize (): this {
    const [innerCtr, innerCtx] = this.useInnerContext()
    aa(innerCtx, innerCtr.width(), innerCtr.height())
    // let [outCtr, outCtx] = this.useExternalContainer()
    // aa(outCtx, outCtr.width(), outCtr.height())
    return super.resize()
  }

  focus (x: number) {
    const ctx = this._externalBoard
    if (ctx && this._externalContainer) {
      ctx.clearRect(0, 0, this._externalContainer.width(), this._externalContainer.height())
      this._cursor?.transform([x, 0])
    }
  }

  blur () {
    const ctx = this._externalBoard

    if (ctx && this._externalContainer) {
      ctx.clearRect(0, 0, this._externalContainer.width(), this._externalContainer.height())
    }
  }
}

export default IndicatorMaster

/**
 *  Indicator.ts of project stock-chart
 *  @date 2022/8/19 17:27
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import { nanie, Transform, API } from 'nanie'
import Line from '../drawing/Line'
import { aa, createAAContext } from '../helper/aa'
import { IndicatorInputs, IndicatorNames, indicators } from '../indicator/all'
import IIndicator, { DisplayType } from '../interface/IIndicator'
import IIndicatorMaster from '../interface/IIndicatorMaster'
import Layout from '../layout/Layout'
import LayoutCell from '../layout/LayoutCell'
import AbstractRenderer from '../super/AbstractRenderer'
import Board from '../ui/Board'
import { UpdatePayload } from './DataSource'

type IndicatorMasterEvents = 'transform' | 'focus' | 'transformed'

class IndicatorMaster extends AbstractRenderer<IndicatorMasterEvents> implements IIndicatorMaster {
  board: Board
  layout: Layout

  private readonly _indicators: Record<string, IIndicator> = {}
  private _innerContainer: LayoutCell | null = null
  private _innerContext: CanvasRenderingContext2D | null = null
  private _externalContainer: LayoutCell | null = null
  private _externalContext: CanvasRenderingContext2D | null = null
  private _externalBoard: CanvasRenderingContext2D | null = null
  private _cursor: Line | null = null
  private _zoom: API | null = null

  constructor (board: Board, layout: Layout) {
    super()

    this.board = board
    this.layout = layout

    this.board
      .on('focus', (_, x: number, __, date: number) => {
        this.focus(x, date)
      })
      .on('blur', () => this.blur())
      .on('transformed', (_, t) => {
        this.applyTransform(t)
      })
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

  private nanieBoard (canvas: HTMLCanvasElement) {
    this._zoom = nanie(canvas, e => {
      if (e.type === 'zoom') {
        // this.board.apply()
      }
      if (e.type === 'end') {
        this.board.applyTransform(e.transform)
      }
    })
  }

  private useExternalContainer (): [LayoutCell, CanvasRenderingContext2D] {
    if (this._externalContainer === null) {
      this._externalContainer = this.layout.appendRow({
        role: 'indicator',
        cells: [
          {
            height: 200,
          }, null,
        ],
      }).at(0)
    }

    if (!this._externalContext) {
      const context = createAAContext(
        this._externalContainer.width(), this._externalContainer.height())
      const canvas = context.canvas
      this._externalContext = context
      this._externalContainer.insert(canvas)
    }

    if (!this._externalBoard) {
      this._externalBoard = createAAContext(
        this._externalContainer.width(), this._externalContainer.height())
      const canvas = this._externalBoard.canvas

      this.nanieBoard(canvas)

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
    if (update) {
      this.lastUpdate = update

      for (const name in this._indicators) {
        this._indicators[name].apply(this.lastUpdate)
      }
    }

    return this
  }

  add<T extends IndicatorNames> (name: T, inputs?: IndicatorInputs[T], typeUnique = false) {
    const Ctor = indicators[name]

    const [container, context] = Ctor.displayType === DisplayType.INNER ? this.useInnerContext()
                                                                        : this.useExternalContainer()

    const indicator = new Ctor({
      container,
      xAxis: this.board.xAxis,
      yAxis: this.board.yAxis,
      context,
      inputs,
    })

    if (typeUnique) {
      for (const name in this._indicators) {
        if (this._indicators[name].displayType === Ctor.displayType) {
          this._indicators[name].clear()
          delete this._indicators[name]
        }
      }
    }

    this._indicators[indicator.name] = indicator

    return indicator.replay(this.lastUpdate)
  }

  config (name: IndicatorNames, config: IndicatorInputs[typeof name]): this {
    console.log('indicator master config', name, config)
    return this
  }

  remove (name: IndicatorNames): this {
    console.log('indicator master remove', name)
    return this
  }

  resize (): this {
    const [innerCtr, innerCtx] = this.useInnerContext()
    aa(innerCtx, innerCtr.width(), innerCtr.height())
    // let [outCtr, outCtx] = this.useExternalContainer()
    // aa(outCtx, outCtr.width(), outCtr.height())
    return super.resize()
  }

  focus (x: number, _: number) {
    const ctx = this._externalBoard
    if (ctx && this._externalContainer) {
      ctx.clearRect(0, 0, this._externalContainer.width(), this._externalContainer.height())
      this._cursor?.transform([x, 0])
    }
    // console.log(this.board.xAxis.scale.domainIndex(date))
  }

  blur () {
    const ctx = this._externalBoard

    if (ctx && this._externalContainer) {
      ctx.clearRect(0, 0, this._externalContainer.width(), this._externalContainer.height())
    }
  }

  applyTransform (transform: Transform) {
    this._zoom?.apply(transform)
  }
}

export default IndicatorMaster

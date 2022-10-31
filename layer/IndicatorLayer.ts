/**
 *  @file         stock-chart/core/IndicatorLayer.ts created by WebStorm
 *  @project      WeTradeWeb
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/10/11 19:04
 *  @description
 */
import { API, nanie, Transform } from 'nanie'
import { UpdatePayload } from '../core/DataSource'
import Line from '../graphics/Line'
import { createAAContext } from '../helper/aa'
import { IndicatorInputs, IndicatorNames, indicators } from '../indicator/indicators'
import IIndicator, { DisplayType } from '../interface/IIndicator'
import ILayer from '../interface/ILayer'
import LayoutCell from '../layout/LayoutCell'
import AbstractLayer, { LayerOptions } from '../super/AbstractLayer'
import Board from '../ui/Board'

class IndicatorLayer extends AbstractLayer implements ILayer {
  private readonly _indicators: Record<string, IIndicator> = {}
  private readonly _board: Board
  private readonly syncTransform: () => void
  private _innerContainer: LayoutCell | null = null
  private _innerContext: CanvasRenderingContext2D | null = null
  private _externalContainer: LayoutCell | null = null
  private _externalContext: CanvasRenderingContext2D | null = null
  private _externalBoard: CanvasRenderingContext2D | null = null
  private _cursor: Line | null = null
  private _zoom: API | null = null
  private lastUpdate: UpdatePayload | null = null

  constructor (layerOptions: LayerOptions & { board: Board }, applyTransform: () => void) {
    super(layerOptions)

    this.syncTransform = applyTransform

    this._board = layerOptions.board
      .on('focus', (_, x: number, __, date: number) => {
        this.focus(x, date)
      })
      .on('blur', () => this.blur())
      .on('transformed', (_, t) => {
        // 将主图的缩放信息同步到副图
        this.applyTransform(t)
      })
  }

  apply (update: UpdatePayload): this {
    if (update) {
      this.lastUpdate = update

      for (const name in this._indicators) {
        this._indicators[name].apply(this.lastUpdate)
      }
    }

    return this
  }

  resize (): this {
    return this
  }

  private useInnerContext (): [LayoutCell, CanvasRenderingContext2D] {
    if (this._innerContainer === null) {
      this._innerContainer = this.options.layout.chart()
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
        // 将副图的缩放信息同步到主图
        this.options.xAxis.transform(e.transform)
        this.syncTransform()
      } else if (e.type === 'end') {
        this._board.applyTransform(e.transform)
      }
    })
  }

  private useExternalContainer (): [LayoutCell, CanvasRenderingContext2D] {
    if (this._externalContainer === null) {
      this._externalContainer = this.options.layout.appendRow({
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
        radian: Math.PI / 2,
        style: 'dashed',
      })
    }

    return [this._externalContainer, this._externalContext]
  }

  add<T extends IndicatorNames> (name: T, inputs?: IndicatorInputs[T], typeUnique = false) {
    const Ctor = indicators[name]

    const [container, context] = Ctor.displayType === DisplayType.INNER ? this.useInnerContext()
                                                                        : this.useExternalContainer()

    const indicator = new Ctor({
      container,
      xAxis: this.options.xAxis,
      yAxis: this.options.yAxis,
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

export default IndicatorLayer

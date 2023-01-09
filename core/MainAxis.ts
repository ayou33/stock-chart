/**
 *  主轴
 *  MainAxis.ts of project stock-chart
 *  @date 2022/7/25 17:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'
import extend from '../helper/extend'
import { parseResolution, timeFormat } from '../helper/timeFormat'
import { background, fontSize } from '../helper/typo'
import IMainAxis from '../interface/IMainAxis'
import LayoutCell from '../layout/LayoutCell'
import { mainAxisOptions, MainAxisOptions } from '../options'
import Band from '../scale/Band'
import AbstractAxis from '../super/AbstractAxis'
import { BLACK, GRAY, WHITE } from '../theme'
import { UpdateLevel, UpdatePayload } from './DataSource'

const defaultFormat: (date: number, p: number) => string = v => v.toString()

class MainAxis extends AbstractAxis<'transform', number[], Band> implements IMainAxis {
  private readonly _options: MainAxisOptions

  private _format = defaultFormat

  private _transform = new Transform()

  private _tickInterval: number

  private _span: Extent | null = null

  private _grid: Array<number> = []

  constructor (container: LayoutCell, options: RecursivePartial<MainAxisOptions>) {
    super(container)

    this._options = extend(mainAxisOptions, options)

    this._tickInterval = this._options.tickInterval

    this.injectAfter('resize', () => {
      this.range([-Infinity, container.width()])
    })

    this.makeGrid()
  }

  private makeGrid () {
    this._grid = []
    for (let x = this._tickInterval, w = this.container.width(); x < w; x += this._tickInterval) {
      this._grid.push(x)
    }
  }

  makeScale () {
    return new Band()
  }

  bandWidth (width?: number) {
    return this.scale.bandWidth(width)
  }

  step (step?: number) {
    return this.scale.step(step)
  }

  draw (update: UpdatePayload): this {
    // if (update.level === UpdateLevel.PATCH) return this
    //
    // if (update.level === UpdateLevel.FULL) {
    //   this.domain(update.domain)
    // }
    //
    this.clear()

    if (this._format === defaultFormat) {
      const r = parseResolution(update.bars[0].DT)
      this._format = timeFormat(r.formatPattern)
    }

    const ctx = this.context
    const y = (this._options.tick ?? 0)
    const options = this._options

    ctx.beginPath()
    ctx.textBaseline = 'top'
    ctx.textAlign = 'center'
    ctx.font = fontSize(options.labelSize)
    ctx.fillStyle = BLACK
    ctx.strokeStyle = GRAY

    for (let i = 0, l = this._grid.length; i < l; i++) {
      const x = this._grid[i]

      if (options.tick) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, y)
      }

      ctx.fillText(this._format(this.invert(x), x), x, y + options.labelPadding)
    }

    if (options.border) {
      ctx.lineWidth = options.border
      ctx.moveTo(0, 0)
      ctx.lineTo(this.container.width(), 0)
    }

    ctx.stroke()

    return this
  }

  transform (transform: Transform, ref?: number): this {
    const diff = this._transform.diff(transform)

    this._transform = transform

    if (diff.k !== 1) {
      this.scale.scale(diff.k, ref)
    } else {
      this.scale.translate(diff.x)
    }

    return this
  }

  index (x: number) {
    return this.scale.domainIndex(this.invert(x))
  }

  focus (x: number, date?: number): this {
    if (this._options.focus) {
      this.replay()

      const ctx = this.context
      const options = this._options.focus

      ctx.textBaseline = 'top'
      ctx.textAlign = 'center'

      const d = date ?? this.invert(x)
      const text = this._format(d, x)
      const y = (this._options.tick ?? 0) + this._options.labelPadding

      ctx.fillStyle = options.background ?? options.color
      background(
        ctx,
        text,
        x,
        y,
        options.padding,
      )

      ctx.fillStyle = options.background ? options.color : WHITE
      ctx.font = fontSize(options.fontSize)
      ctx.fillText(text, x, y)
    }

    return this
  }

  tickFormat (format: (value: number, pos: number) => string): this {
    this._format = format
    this.clear()
    this.replay()

    return this
  }

  ticks (interval: number): this {
    this._tickInterval = interval
    this.makeGrid()
    this.clear()
    this.replay()
    return this
  }

  extent (update: UpdatePayload): [boolean, Extent] {
    if (update.level === UpdateLevel.PATCH && this._span) {
      return [false, this._span]
    }

    /**
     * index方法返回的值为索引，span[1]的值为索引 + 1 {@see DataSource#makeUpdatePayload}
     */
    this._span = [this.index(0) ?? 0, (this.index(this.container.width()) ?? (update.span[1] - 1)) + 1]

    return [true, this._span]
  }

  grid () {
    return this._grid
  }
}

export default MainAxis

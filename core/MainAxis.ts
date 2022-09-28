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
import { BLACK, WHITE } from '../theme'
import { UpdateLevel, UpdatePayload } from './DataSource'

const defaultFormat: (date: number, p: number) => string = v => v.toString(0)

class MainAxis extends AbstractAxis<'transform', number[], Band> implements IMainAxis {
  private readonly _options: MainAxisOptions

  private _format = defaultFormat

  private _transform = new Transform()

  private _tickInterval: number

  constructor (container: LayoutCell, options: RecursivePartial<MainAxisOptions>) {
    super(container)

    this._options = extend(mainAxisOptions, options)

    this._tickInterval = this._options.tickInterval

    this.injectAfter('resize', () => {
      this.range([-Infinity, container.width()])
    })
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
    if (update.level === UpdateLevel.PATCH) return this

    this.clear()

    if (this._format === defaultFormat) {
      const r = parseResolution(update.bars[0].DT)
      this._format = timeFormat(r.formatPattern)
    }

    const ctx = this.context
    const y = (this._options.tick ?? 0)
    const width = this.container.width()
    const options = this._options

    ctx.beginPath()
    ctx.textBaseline = 'top'
    ctx.textAlign = 'center'
    ctx.font = fontSize(options.labelSize)
    ctx.fillStyle = BLACK

    for (let x = this._tickInterval; x < width; x += this._tickInterval) {
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

  transform (transform: Transform, ref: number): this {
    const diff = this._transform.diff(transform)

    this._transform = transform

    if (diff.k !== 1 && ref) {
      this.scale.scale(diff.k, ref)
    } else {
      this.scale.translate(diff.x)
    }

    return this
  }

  index (x: number) {
    return this.scale.domainIndex(this.invert(x))
  }

  focus (x: number, date: number): this {
    if (this._options.focus) {
      this.replay()

      const ctx = this.context
      const options = this._options.focus

      ctx.textBaseline = 'top'
      ctx.textAlign = 'center'

      const text = this._format(date, x)
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
    this.clear()
    this.replay()
    return this
  }
}

export default MainAxis

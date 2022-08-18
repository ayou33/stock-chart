/**
 *  交叉轴
 *  Series.ts of project stock-chart
 *  @date 2022/7/25 17:12
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'
import { drawSeriesLabel } from '../helper/drawSeriesLabel'
import extend from '../helper/extend'
import { fontSize } from '../helper/typo'
import IAxis from '../interface/IAxis'
import { SeriesOptions, seriesOptions } from '../options'
import Linear from '../scale/Linear'
import AbstractAxis from '../super/AbstractAxis'
import { UpdatePayload } from './DataSource'

class Series extends AbstractAxis<'transform'> implements IAxis {
  private readonly _options: SeriesOptions

  private _transform = new Transform()

  private _format: (value: number, pos: number) => string = (v: number) => v.toString()

  private _tickInterval: number

  constructor (container: ContainerCell, options: RecursivePartial<SeriesOptions>) {
    super(container)

    this._options = extend(seriesOptions, options)

    this._tickInterval = this._options.tickInterval

    this.injectAfter('resize', () => {
      this.range([0, container.height])
    })
  }

  makeScale () {
    return new Linear()
  }

  draw (update: UpdatePayload): this {
    this.clear()

    this.domain(update.extent)

    const options = this._options
    const range = this.range()
    const ctx = this.context
    const x = (options.tick ?? 0)

    this.clear()

    ctx.save()
    ctx.beginPath()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'start'
    ctx.font = fontSize(options.labelSize)

    for (let y = range[0]; y < range[1]; y += this._tickInterval) {
      if (this._options.tick) {
        ctx.moveTo(0, y)
        ctx.lineTo(this._options.tick, y)
      }

      ctx.fillText(this._format(this.invert(y), y), x + options.labelPadding, y)
    }

    if (options.border) {
      ctx.lineWidth = options.border
      ctx.moveTo(0, 0)
      ctx.lineTo(0, this.container.height)
    }

    if (this._options.currentPrice && update.latest) {
      drawSeriesLabel(
        this.context, this.value(update.latest.close), update.latest.close.toString(), this._options.currentPrice,
      )
    }

    ctx.stroke()
    ctx.restore()

    return this
  }

  transform (transform: Transform, ref: number): this {
    const diff = this._transform.diff(transform)

    this._transform = transform

    if (diff.k !== 1 && !ref) return this

    const range = this.range()
    this.range([range[0] + diff.y, range[1] + diff.y])
    return this
  }

  focus (y: number): this {
    if (this._options.focus) {
      this.rerender()

      const ctx = this.context
      const options = this._options.focus

      ctx.save()
      ctx.beginPath()
      ctx.textBaseline = 'middle'
      ctx.textAlign = 'start'
      ctx.font = fontSize(options.fontSize)

      drawSeriesLabel(ctx, y, this.invert(y).toString(), options)

      ctx.restore()
    }

    return this
  }

  rerender () {
    this.clear()
    this.apply()
  }

  tickFormat (format: (value: number, pos: number) => string): this {
    this._format = format
    this.rerender()
    return this
  }

  ticks (interval: number): this {
    this._tickInterval = interval
    return this
  }
}

export default Series

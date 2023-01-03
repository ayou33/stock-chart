/**
 *  交叉轴
 *  Series.ts of project stock-chart
 *  @date 2022/7/25 17:12
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'
import { drawSeriesLabel } from '../helper/drawSeriesLabel'
import extend from '../helper/extend'
import { extent } from '../helper/extent'
import { isOut } from '../helper/range'
import { fontSize } from '../helper/typo'
import IAxis from '../interface/IAxis'
import LayoutCell from '../layout/LayoutCell'
import { SeriesOptions, seriesOptions } from '../options'
import Linear from '../scale/Linear'
import AbstractAxis from '../super/AbstractAxis'
import { BLACK } from '../theme'
import { UpdateLevel, UpdatePayload } from './DataSource'

class Series extends AbstractAxis<'transform'> implements IAxis {
  private readonly _options: SeriesOptions

  private _transform = new Transform()

  private _appliedTransform = new Transform()

  private _format: (value: number, pos: number) => string = (v: number) => v.toString()

  private _tickInterval: number

  private _extent: Extent = [0, 0]

  constructor (container: LayoutCell, options?: RecursivePartial<SeriesOptions>) {
    super(container, options?.context)

    this._options = extend(seriesOptions, options ?? {})

    this._tickInterval = this._options.tickInterval

    this.limitRange()

    this.injectAfter('resize', () => {
      this.limitRange()
    })
  }

  private limitRange () {
    this.range([
      this.container.height() * (1 - Math.min(0.8, this._options.paddingBottom)),
      this.container.height() * this._options.paddingTop,
    ])
  }

  makeScale () {
    return new Linear()
  }

  draw (update: UpdatePayload): this {
    // this.domain(update.extent)

    this.clear()

    const options = this._options
    const ctx = this.context
    const x = (options.tick ?? 0)
    const height = this.container.height()

    this.clear()

    ctx.beginPath()
    ctx.textBaseline = 'middle'
    ctx.textAlign = 'start'
    ctx.font = fontSize(options.labelSize)
    ctx.fillStyle = BLACK

    for (let y = this._tickInterval; y < height; y += this._tickInterval) {
      if (options.tick) {
        ctx.moveTo(0, y)
        ctx.lineTo(options.tick, y)
      }

      ctx.fillText(this._format(this.invert(y), y), x + options.labelPadding, y)
    }

    if (options.border) {
      ctx.lineWidth = options.border
      ctx.moveTo(0, 0)
      ctx.lineTo(0, this.container.height())
    }

    if (options.currentPrice && update.latest) {
      drawSeriesLabel(
        this.context,
        this.value(update.latest.close),
        update.latest.close.toString(),
        options.currentPrice,
      )
    }

    ctx.stroke()

    return this
  }

  transform (transform: Transform): this {
    const diff = this._transform.diff(transform)
    this._transform = transform
    let y = diff.y

    if (diff.k === 1) {
      this._appliedTransform = this._appliedTransform.translate(0, diff.y)
    } else {
      // reset
      if (transform.k === 1) {
        y = this._appliedTransform.diff(transform).y
        this._appliedTransform = transform
      } else {
        // 禁止 因为缩放而产生的y轴平移
        y = 0
      }
    }

    const range = this.range()
    this.range([range[0] + y, range[1] + y])

    return this
  }

  focus (y: number): this {
    if (this._options.focus) {
      this.rerender()

      const ctx = this.context
      const options = this._options.focus

      ctx.textBaseline = 'middle'
      ctx.textAlign = 'start'
      ctx.font = fontSize(options.fontSize)

      drawSeriesLabel(ctx, y, this.invert(y).toString(), options)
    }

    return this
  }

  rerender () {
    this.clear()
    this.replay()
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

  private makeExtent (update: UpdatePayload) {
    return extent(
      update.bars.slice(...update.span),
      d => d[this._options.lowField],
      d => d[this._options.highField],
    )
  }

  extent (update: UpdatePayload): [boolean, Extent] {
    let dirty = update.level === UpdateLevel.PATCH
                ? isOut(...this._extent)(update.latest!.close)
                : true

    if (dirty) {
      const extent = this.makeExtent(update)
      if (this._extent.toString() !== extent.toString()) {
        this._extent = extent

        if (extent[0] === extent[1]) {
          this._extent = [extent[0] - 1, extent[0] + 1]
        }
      } else {
        dirty = false
      }
    }

    console.log('ayo series extent', dirty, this._extent.toString())
    return [dirty, this._extent]
  }
}

export default Series

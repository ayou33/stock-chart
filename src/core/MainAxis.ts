/**
 *  主轴
 *  MainAxis.ts of project stock-chart
 *  @date 2022/7/25 17:13
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import Transform from 'nanie/src/Transform'
import { parseResolution, timeFormat } from '../helper/timeFormat'
import { background, fontSize } from '../helper/typo'
import IMainAxis from '../interface/IMainAxis'
import { StockChartOptions } from '../options'
import Band from '../scale/Band'
import AbstractAxis from '../super/AbstractAxis'
import { UpdatePayload } from './DataSource'

const defaultFormat: (date: number, p: number) => string = v => v.toString(0)

class MainAxis extends AbstractAxis<'transform', number[], Band> implements IMainAxis {
  private readonly _options: StockChartOptions

  private _format = defaultFormat

  private _transform = new Transform()

  private _tickInterval: number

  constructor (container: ContainerCell, options: StockChartOptions) {
    super(container)
    this._options = options

    this._tickInterval = this._options.axis.tickInterval

    this.injectAfter('resize', () => {
      this.range([-Infinity, container.width])
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

  paint (update: UpdatePayload): this {
    // @todo update level判断
    this.domain(update.domain)

    if (this._format === defaultFormat) {
      const r = parseResolution(update.bars[0].DT)
      this._format = timeFormat(r.formatPattern)
    }

    const ctx = this.context
    const y = (this._options.axis.tick ?? 0)
    const width = this.container.width
    const options = this._options.axis

    ctx.save()
    ctx.beginPath()
    ctx.textBaseline = 'top'
    ctx.textAlign = 'center'
    ctx.font = fontSize(options.labelSize)

    for (let x = 0; x < width; x += this._tickInterval) {
      if (options.tick) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, y)
      }
      ctx.fillText(this._format(this.invert(x), x), x, y + options.labelPadding)
    }

    if (options.border) {
      ctx.lineWidth = options.border
      ctx.moveTo(0, 0)
      ctx.lineTo(this.container.width, 0)
    }

    ctx.stroke()
    ctx.restore()

    return this
  }

  transform (transform: Transform, ref: number): this {
    const diff = this._transform.diff(transform)
    const range = this.range()

    this._transform = transform

    let nextRange: Extent = [range[0] + diff.x, range[1] + diff.x]

    if (diff.k !== 1 && ref) {
      const scale = diff.k - 1
      nextRange = [range[0] + scale * (range[0] - ref), range[1] + scale * (range[1] - ref)]
    }

    this.range(nextRange)

    return this
  }

  focus (x: number): this {
    if (this._options.axis.currentLabel) {
      this.clear()
      this.draw()

      const date = this.invert(x)
      const ctx = this.context
      const options = this._options.axis.currentLabel

      ctx.save()
      ctx.beginPath()
      ctx.textBaseline = 'top'
      ctx.textAlign = 'center'

      const text = this._format(date, x)
      const y = (this._options.axis.tick ?? 0) + this._options.axis.labelPadding

      ctx.fillStyle = options.background
      background(
        ctx,
        text,
        x,
        y,
        options.padding,
      )

      ctx.fillStyle = options.color
      ctx.font = fontSize(options.fontSize)
      ctx.fillText(text, x, y)
      ctx.restore()

    }
    return this
  }

  tickFormat (format: (value: number, pos: number) => string): this {
    this._format = format
    this.clear()
    this.draw()

    return this
  }

  ticks (interval: number): this {
    this._tickInterval = interval
    this.clear()
    this.draw()
    return this
  }
}

export default MainAxis

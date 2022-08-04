/**
 *  Band.ts of project stock-chart
 *  @date 2022/8/4 15:48
 *  @author 阿佑[ayooooo@petalmail.com]
 *  @see https://github.com/d3/d3-scale/blob/v4.0.2/README.md#band-scales
 */
const START = 0
const STOP = 1

function isValid0To1 (n: number) {
  return n >= 0 && n < 1
}

class Band {
  private _range: Extent = [0, 1]
  private _rangeStart = 0
  private _rangeStop = 1
  private _domain: number[] = [0, 1]
  private _domainIndex: Record<string, number>
  private _domainStart = 0
  private _bandWidth = 1
  private _step = 1
  private _paddingInner = 0
  private _paddingOuter = 0
  private _align = 0.5
  private _valueAlign = 0

  constructor () {
    this._domainIndex = this.generateDomainIndex()
  }

  private generateDomainIndex () {
    const o: Record<string, number> = {}

    this._domain.map((v, i) => {
      o[v] = i
    })

    return o
  }

  private updateRange () {
    this._rangeStart = this._range[START] + this._step * this._align * this._paddingOuter
    this._rangeStop = this._range[STOP] - this._step * this._paddingOuter * (1 - this._align)
  }

  bandWidth (width?: number): number {
    if (undefined !== width && width > 0) {
      this._bandWidth = width
      this._step = this._bandWidth * (1 + this._paddingInner)
      this.updateRange()
    }

    return this._bandWidth
  }

  step (step?: number): number {
    if (undefined !== step && step > 0) {
      this._step = step
      this._bandWidth = this._step * (1 - this._paddingInner)
      this.updateRange()
    }

    return this._step
  }

  paddingInner (padding?: number) {
    if (undefined !== padding && isValid0To1(padding)) {
      this._paddingInner = padding
      this._step = this._bandWidth * (1 + this._paddingInner)
      this.updateRange()
    }

    return this._paddingInner
  }

  paddingOuter (padding?: number) {
    if (undefined !== padding && isValid0To1(padding)) {
      this._paddingOuter = padding
      this.updateRange()
    }

    return this._paddingOuter
  }

  padding (padding?: number): number {
    if (undefined !== padding && isValid0To1(padding)) {
      this.paddingOuter(padding)
      this.paddingInner(padding)
    }

    return this._paddingInner
  }

  align (align?: number) {
    if (undefined !== align && isValid0To1(align)) {
      this._align = align
      this.updateRange()
    }

    return this._align
  }

  alignValue (align?: number) {
    if (undefined !== align && isValid0To1(align)) {
      this._valueAlign = align
    }

    return this._valueAlign
  }

  range (range?: Extent): Extent {
    if (undefined !== range) {
      this._range = range
      this.updateRange()
    }

    return this._range
  }

  domain (domain?: number[]): number[] {
    if (undefined !== domain) {
      this._domain = [...new Set(domain)]
      this._domainIndex = this.generateDomainIndex()
    }

    return this._domain
  }

  value (date: number): number {
    const index = this._domainIndex[date]

    if (index === -1) return NaN

    return this._rangeStart + (index - this._domainStart) + (this._bandWidth * this._valueAlign)
  }

  invert (x: number): number {
    const index = Math.floor((x - this._rangeStart) / this._step)

    if (index > this._range.length - 1) return NaN

    return this._range[index]
  }
}

export default Band

/**
 *  Linear.ts of project stock-chart
 *  @date 2022/8/4 15:48
 *  @author 阿佑[ayooooo@petalmail.com]
 */
const START = 0
const STOP = 1

class Linear {
  private _clamp = false

  /**
   * 映射值 - input
   * @private
   */
  private _domain: Extent = [0, 1]

  /**
   * 坐标值 - output
   * @private
   */
  private _range: Extent = [0, 1]

  private _rangeStep = 1

  private update () {
    this._rangeStep = (this._domain[STOP] - this._domain[START]) / (this._range[STOP] - this._range[START])

  }

  domain (domain?: Extent): Extent {
    if (undefined !== domain) {
      this._domain = domain
      this.update()
    }

    return this._domain
  }

  range (range?: Extent): Extent {
    if (undefined !== range) {
      this._range = range
      this.update()
    }

    return this._range
  }

  clamp (clamp = false) {
    if (undefined !== clamp) {
      this._clamp = clamp
    }

    return this._clamp
  }

  /**
   * calc range from domain
   * @param domainValue
   */
  value (domainValue: number): number {
    const range = this._range[START] + (domainValue - this._domain[START]) / this._rangeStep

    if (this._clamp) {
      return Math.max(this._range[START], Math.min(this._range[STOP], range))
    }

    return range
  }

  /**
   * calc domain from range
   * @param rangeValue
   */
  invert (rangeValue: number): number {
    return this._domain[START] + (rangeValue - this._range[START]) * this._rangeStep
  }
}

export default Linear

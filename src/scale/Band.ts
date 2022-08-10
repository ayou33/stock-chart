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

export enum ExtendMode {
  SHRINK,
  LEFT,
  RIGHT,
}

class Band {
  /**
   * 一个完整的range内包含
   *  两侧的paddingOuter
   *  n * step - 1 * paddingInner(左右侧的step没有paddingInner)
   * @private
   */
  private _range: Extent = [0, 1]

  /**
   * range内画图的起始位置即（range[0] + 左侧的paddingOuter）
   * @private
   */
  private _rangeStart = 0

  /**
   * 标志range内画图的结束位置即（range[1] - 右侧的paddingOuter）
   * @private
   */
  private _rangeStop = 1

  /**
   * input
   * @private
   */
  private _domain: number[] = [0, 1]

  /**
   * domain的索引表
   * 方便获取指定的domain对应的位置
   * @private
   */
  private _domainIndex: Record<string, number>

  /**
   * 可见图形的宽度
   * @private
   */
  private _bandWidth = 6

  /**
   * bandWidth + paddingInner
   * @private
   */
  private _step = 8

  /**
   * 一个step的宽度 = bandWidth + paddingInner
   * paddingInner在band右侧
   * [0, 1]
   * @private
   */
  private _paddingInner = 0.25

  /**
   * paddingOuter的距离为 paddingOuter * step 根据指定的align分布在range的两端
   * [0, 1]
   * @private
   */
  private _paddingOuter = 0

  /**
   * align为0时所有的paddingOuter分布在range最右端,1分布在最左端，0.5平均分布在两端
   * [0, 1]
   * @private
   */
  private _align = 0.5

  /**
   * band其实左边
   * 0 左边线
   * 0.5 中线
   * 1 右边线
   * [0, 1]
   * @private
   */
  private _valueAlign = 0

  /**
   * range扩展模式
   * @private
   */
  private _extendMode = ExtendMode.SHRINK

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
    /**
     * 边界内缩放
     */
    if (ExtendMode.SHRINK === this._extendMode) {
      this._rangeStart = this._range[START] + this._step * this._align * this._paddingOuter
      this._rangeStop = this._range[STOP] - this._step * (1 - this._align) * this._paddingOuter
    }

    /**
     * 向左侧延申
     * 根据右侧边界结算左边界
     */
    if (ExtendMode.LEFT === this._extendMode) {
      const paddingInner = this._step * this._paddingInner
      this._rangeStop = this._range[STOP] - this._step * (1 - this._align) * this._paddingOuter
      this._rangeStart = this._rangeStop + paddingInner - this._step * this._domain.length
      this._range[START] = this._rangeStart - paddingInner
    }

    /**
     * 向右侧延申
     * 根据左边界计算有边界
     */
    if (ExtendMode.RIGHT === this._extendMode) {
      this._rangeStart = this._range[START] + this._step * this._align * this._paddingOuter
      this._rangeStop = this._rangeStart + this._domain.length * this._step - this._step * this._paddingInner
      this._range[STOP] = this._rangeStop + this._step * (1 - this._align) * this._paddingOuter
    }
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
      if (Math.abs(range[START]) === Infinity && Math.abs(range[STOP]) === Infinity) {
        this._extendMode = ExtendMode.LEFT
      } else if (Math.abs(range[START]) === Infinity) {
        this._extendMode = ExtendMode.LEFT
      } else if (Math.abs(range[STOP]) === Infinity) {
        this._extendMode = ExtendMode.RIGHT
      }

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

  /**
   * 获取domain的坐标位置
   * 返回的位置因valueAlign的值不同而不同
   * @param date
   */
  value (date: number): number {
    const index = this._domainIndex[date]

    if (index === -1) return NaN

    return this._rangeStart + index * this._step + (this._bandWidth * this._valueAlign)
  }

  /**
   * 通过坐标点获取改位置的domain
   * @param x
   */
  invert (x: number): number {
    if (x < this._rangeStart || x > this._rangeStop) return NaN

    const index = Math.floor((x - this._rangeStart) / this._step)

    if (index > this._domain.length - 1) return NaN

    return this._domain[index]
  }
}

export default Band

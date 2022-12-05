/**
 *  Band.ts of project stock-chart
 *  @date 2022/8/4 15:48
 *  @author 阿佑[ayooooo@petalmail.com]
 *  @see https://github.com/d3/d3-scale/blob/v4.0.2/README.md#band-scales
 */
import { parseResolution } from '../helper/timeFormat'
import IScale from '../interface/IScale'

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

class Band implements IScale<number[]>{
  /**
   * 一个完整的range内包含
   *  两侧的paddingOuter
   *  n * step - 1 * paddingInner(左右侧的step没有paddingInner)
   * @private
   */
  private _range: Extent = [0, 1]

  private _fixedRef = 0.5

  /**
   * range渲染区域起始位置即（range[0] + 左侧的paddingOuter）
   * @private
   */
  private _rangeStart = 0

  /**
   * range渲染区域结束位置即（range[-1] - 右侧的paddingOuter）
   * @private
   */
  private _rangeStop = 1

  /**
   * input
   * @private
   */
  private _domain: number[] = [0, 1]

  /**
   * 一个domain代表的值的大小
   * @private
   */
  private _domainStep = 1

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
  private _valueAlign = 0.5

  /**
   * range扩展模式
   * @private
   */
  private _extendMode = ExtendMode.SHRINK

  /**
   * 参考点的偏移量
   * @private
   */
  private _offset = 0

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
     * 自适应模式
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
      if (this._extendMode === ExtendMode.SHRINK) {
        if (width > this._step) return this._bandWidth

        this._paddingInner = (this._step - width) / this._step
      } else {
        this._step = width * (1 + this._paddingInner)
      }

      this._bandWidth = width

      this.updateRange()
    }

    return this._bandWidth
  }

  step (step?: number): number {
    if (undefined !== step && step > 0) {
      this._bandWidth = step * (1 - this._paddingInner)

      this._step = step

      this.updateRange()
    }

    return this._step
  }

  paddingInner (padding?: number) {
    if (undefined !== padding && isValid0To1(padding)) {
      if (this._extendMode === ExtendMode.SHRINK) {
        this._bandWidth = this._step * (1 - padding)
      } else {
        this._step = this._bandWidth * (1 + padding)
      }

      this._paddingInner = padding

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
        throw new RangeError('Range should be limit on at least one side!')
      } else if (Math.abs(range[START]) === Infinity) {
        // 向左侧扩展
        this._extendMode = ExtendMode.LEFT
        this._fixedRef = range[STOP]
      } else if (Math.abs(range[STOP]) === Infinity) {
        // 向右侧扩展
        this._extendMode = ExtendMode.RIGHT
        this._fixedRef = range[START]
      } else {
        // 自适应大小
        this._extendMode = ExtendMode.SHRINK
        this._fixedRef = (range[STOP] / range[START]) / 2
      }

      this._range = range

      this._offset = 0

      /**
       * 缩放模式 自动计算step与bandWidth
       */
      if (this._extendMode === ExtendMode.SHRINK) {
        this.step((this._range[STOP] - this._range[START]) / (this._domain.length + this._paddingInner * 2))
      } else {
        this.updateRange()
      }
    }

    return this._range
  }

  domainIndex (domain: number) {
    return this._domainIndex[domain]
  }

  transformRange (x: number, k: number, ref?: number) {
    if (this._extendMode === ExtendMode.SHRINK) return

    if (x !== 0) {
      this._range = [this._range[START] + x, this._range[STOP] + x]
      this._offset += x
    }

    if (k !== 1) {
      const [start, stop] = this._range
      const r = ref && !Number.isNaN(ref) ? ref : this._fixedRef
      this._range = [start + (k - 1) * (start - r), stop + (k - 1) * (stop - r)]
      const dif = this._extendMode === ExtendMode.LEFT ? (this._range[STOP] - stop) : (this._range[START] - start)
      console.log('ayo', k, dif, r)
      this._offset += dif
    }
  }

  translate (x: number) {
    // this._range = [this._range[START] + x, this._range[STOP] + x]
    this.transformRange(x, 1)

    this.updateRange()

    return this._range
  }

  scale (k: number, ref?: number) {
    this.transformRange(0, k, ref)
    // const [start, stop] = this._range
    // const r = ref && !Number.isNaN(ref) ? ref : this._fixedRef
    // this._range = [start + (k - 1) * (start - r), stop + (k - 1) * (stop - r)]
    this.step(this._step * k)
    return this._range
  }

  domain (domain?: number[]): number[] {
    if (undefined !== domain && domain.length !== 0) {
      this._domain = [...new Set(domain)]
      this._domainIndex = this.generateDomainIndex()
      this.updateRange()
      const lastTwo = this._domain.slice(-2)

      if (lastTwo.length === 2) {
        this._domainStep = Math.abs(lastTwo[0] - lastTwo[1])
      } else {
        this._domainStep = parseResolution(new Date(lastTwo[0])).duration
      }
    }

    return this._domain
  }

  /**
   * 获取domain的坐标位置
   * 返回的位置因valueAlign的值不同而不同
   * @param date
   * @param align
   */
  value (date: number, align: number = this._valueAlign): number {
    const index = this._domainIndex[date]

    if (index === -1) return NaN

    return this._rangeStart + index * this._step + (this._bandWidth * align)
  }

  /**
   * 通过坐标点获取改位置的domain
   * @param x
   */
  invert (x: number): number {
    const index = Math.round((x - this._rangeStart) / this._step)

    if (index < 0) {
      return this._domain[0] - this._domainStep * Math.abs(index)
    }

    const maxIndex = this._domain.length - 1
    if (index > maxIndex) {
      return this._domain[maxIndex] + this._domainStep * (index - maxIndex)
    }

    return this._domain[index]
  }
}

export default Band

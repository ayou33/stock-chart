/**
 *  @file         src/layout/Layout.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/22 17:12
 *  @description
 */
import debounce from 'lodash.debounce'
import Event from '../base/Event'
import { isOut } from '../helper/range'
import { useDescriber } from '../options'
import LayoutRow from './LayoutRow'
import { memoizeWith } from 'ramda'

export type SpaceDescriber = {
  /**
   * 自适应高度
   */
  flexedHeight: boolean;
  /**
   * 自适应宽度
   */
  flexedWidth: boolean;
  /**
   * >=0 的数为 像素值
   * -1 - 0 的值为百分比
   */
  width: number;
  height: number
  isLink: false;
  colSpan: number;
  rowSpan: number;
} | {
  /**
   * 因为colspan或者rowspan而产生的占位单元
   */
  isLink: true;
  /**
   * 指定了span的单元的坐标[列,行]
   */
  source: Vector;
}

export type Computer = {
  width: () => number;
  height: () => number;
}

class Layout extends Event<'resize'> {
  private readonly $container: Element
  private readonly $table: HTMLTableElement

  /**
   * 总的布局空间信息
   * @private
   */
  private readonly _space = {
    width: 0, // 总宽度
    height: 0, // 总高度
    row: 0, // 总行数
    column: 0, // 总列数
  }

  /**
   * 用户可以理解的布局描述对象
   * @private
   */
  private readonly _describer: LayoutDescriber

  /**
   * @private
   * 格式化后的算法需要的，与cell一一对应的布局单元描述对象数组
   *    1._description先于具体的Cell实例而创建
   *    2._description在每次更新时都会重建
   *
   * _description存在的意义在于
   *    _description为具体的cell实例的创建提供的方针(新建or复用)
   *
   * 生成国过程如下
   *    1.根据_describer的行描述初始化所有的空行准备填入cell描述信息
   *    2.根据每个cell的配置信息在自身以及colspan/rowspan辐射到的坐标内填充对应关联信息
   *      （这一步会更新在未来时间才遍历到的cell）
   */
  private readonly _description: SpaceDescriber[][] = []

  /**
   * layout管理tr tr管理td
   * 在layout的创建创建过程总同步完成对_description的创建
   * @private
   */
  private _layout: LayoutRow[]

  /**
   * 单元size计算器
   * @private
   */
  private _computer: Computer[][]

  constructor (container: Element, describer?: LayoutDescriber) {
    super()

    this.$container = container

    const rect = this.$container.getBoundingClientRect()

    this._space.width = rect.width

    this._space.height = rect.height

    this.$table = this.createTableEl(rect.width, rect.height)

    this._describer = useDescriber(describer)

    this.formatDescriber()

    this._layout = this.buildLayout()

    this._computer = this.buildComputer()

    this.mount()

    this.monitorResize()
  }

  private mount () {
    this.$container.appendChild(this.render())
  }

  /**
   * 格式化
   * @private
   */
  private formatDescriber () {
    this._describer.map((_, i) => this._description[i] = [])

    this._space.row = this._describer.length

    if (this._space.row !== 0) {
      this._space.column = this._describer[0].cells.reduce((acc, v) => acc + (v?.colSpan ?? 1), 0)
    }
  }

  private createTableEl (width: number, height: number) {
    const table = document.createElement('table')

    table.style.cssText = `
      width: ${width}px;
      height: ${height}px;
      border: none;
      border-collapse: collapse;
      border-spacing: 0;
    `

    return table
  }

  private buildLayout () {
    return this._describer.map((row, rowIndex) =>
      new LayoutRow(this, {
        ...row,
        row: rowIndex,
      }).buildCells())
  }

  private monitorResize () {
    window.addEventListener('resize', debounce(() => {
      this.resize()
    }, 1000 / 6))
  }

  private keyGen (row: number, col: number) {
    return () => {
      return `${this._space.width}-${this._space.height}-${row}-${col}`
    }
  }

  private createWidthFn (row: number, col: number) {
    const cell = this.read([col, row])

    if (cell.isLink) return memoizeWith(
      this.keyGen(row, col),
      () => this.compute('width', cell.source),
    )

    if (!cell.flexedWidth) {
      return () => cell.width
    }

    return memoizeWith(this.keyGen(row, col), () => {
      let fixedWidth = 0
      let fixedColumn = 0

      for (let i = 0, l = this._description[row].length; i < l; i++) {
        let cell = this.read([i, row])

        if (cell.isLink) cell = this.read(cell.source)

        if (!cell.isLink) {
          fixedWidth += cell.flexedWidth ? 0 : cell.width
          fixedColumn += cell.flexedWidth ? 0 : cell.colSpan
        }
      }

      return (this._space.width - fixedWidth) / (this._space.column - fixedColumn) * cell.colSpan
    })
  }

  private createHeightFn (row: number, col: number) {
    const cell = this.read([col, row])

    if (cell.isLink) return memoizeWith(
      this.keyGen(row, col),
      () => this.compute('height', cell.source),
    )

    if (!cell.flexedHeight) {
      return () => cell.height
    }

    return memoizeWith(this.keyGen(row, col), () => {
      let fixedHeight = 0
      let fixedRow = 0

      for (let i = 0, l = this._description.length; i < l; i++) {
        let cell = this.read([col, i])

        if (cell.isLink) cell = this.read(cell.source)

        if (!cell.isLink) {
          fixedHeight += cell.flexedHeight ? 0 : cell.height
          fixedRow += cell.flexedHeight ? 0 : cell.rowSpan
        }
      }

      return (this._space.height - fixedHeight) / (this._space.row - fixedRow) * cell.rowSpan
    })
  }

  private buildComputer () {
    return this._description.map((r, ri) => r.map((_, ci) => {
      return {
        width: this.createWidthFn(ri, ci),
        height: this.createHeightFn(ri, ci),
      }
    }))
  }

  private refRowHeight (row: number) {
    let height
    for (let c = 0, l = this._description[row].length; c < l && height === undefined; c++) {
      const cell = this.read([c, row])
      if (!cell || cell.isLink) continue
      height = cell.height
    }
    return height
  }

  private refColumnWidth (col: number) {
    let width
    for (let r = 0, l = this._description.length; r < l && width === undefined; r++) {
      const cell = this.read([col, r])
      if (!cell || cell.isLink) continue
      width = cell?.width
    }

    return width
  }

  private render () {
    const fragment = document.createDocumentFragment()

    this._layout.map(r => fragment.appendChild(r.render()))

    this.$table.appendChild(fragment)

    return this.$table
  }

  private assertLocation ([col, row]: Vector) {
    if (
      isOut(0, this._space.row)(row) ||
      isOut(0, this._space.column)(col)
    ) {
      throw new ReferenceError(`Cell in location[row:${row},col:${col}] is out of range!`)
    }
  }

  private read ([col, row]: Vector) {
    this.assertLocation([col, row])

    return this._description[row][col]
  }

  private raw (location: Vector) {
    this.assertLocation(location)

    const cell = this.read(location)
    return cell?.isLink ? cell.source : location
  }

  private set ([col, row]: Vector, describer: SpaceDescriber) {
    this.assertLocation([col, row])

    this._description[row][col] = describer
  }

  describe (row: number, col: number, describer: CellDescriber | null) {
    /**
     * 占位单元不处理
     */
    const cell = this.read([col, row])
    if (cell?.isLink === true) {
      return cell.source
    }

    const rs = describer?.rowSpan ?? 1
    const cs = describer?.colSpan ?? 1
    /**
     * 参考同列的宽度
     */
    const width = describer?.width ?? this.refColumnWidth(col) ?? -1
    /**
     * 参考同行的高度
     */
    const height = describer?.height ?? this.refRowHeight(row) ?? -1

    this.set([col, row], {
      isLink: false,
      flexedHeight: !(height >= 0),
      height,
      flexedWidth: !(width >= 0),
      width,
      colSpan: cs,
      rowSpan: rs,
    })

    /**
     * expand row/column span
     */
    if (rs > 1 || cs > 1) {
      for (let r = row, rc = Math.min(row + rs, this._space.row); r < rc; r++) {
        for (let c = col, cc = Math.min(col + cs, this._space.column); c < cc; c++) {
          if (r === row && c === col) continue
          this.set([c, r], {
            isLink: true,
            source: [col, row],
          })
        }
      }
    }

    return
  }

  locate (location: Vector) {
    location = this.raw(location)

    /**
     * @todo
     *    在_layout初始化的过程中_layout是undefined
     *    但已经存在_layout被访问可能，这导致会有冗余的Cell实例生成
     *    @see LayoutRow#buildCells
     */
    return this._layout?.[location[1]]?.at(location[0])
  }

  compute (dimension: 'width' | 'height', location: Vector) {
    location = this.raw(location)
    return this._computer[location[1]][location[0]]?.[dimension]()
  }

  chart () {
    return this.locate([0, 0])
  }

  mainAxis () {
    return this.locate([0, 1])
  }

  series () {
    return this.locate([1, 0])
  }

  resize () {
    const rect = this.$container.getBoundingClientRect()

    this._space.width = rect.width
    this._space.height = rect.height

    this.$table.style.width = rect.width + 'px'
    this.$table.style.height = rect.height + 'px'

    this.emit('resize')
  }

  insertRow (describer: RowDescriber, index: number) {
    /**
     * 添加空行占位
     */
    this._layout.splice(index, 0, new LayoutRow(this, {
      ...describer,
      row: index,
    }))

    /**
     * 更新新添加行以下行的行号
     */
    for (let i = index, l = this._layout.length; i < l; i++) {
      this._layout[i].moveDown()
    }

    /**
     * 更新描述对象
     */
    this._describer.splice(index, 0, describer)

    this.formatDescriber()

    /**
     * 创建新布局
     */
    const layout = this.buildLayout()

    /**
     * 新建计算器
     */
    this._computer = this.buildComputer()

    this._layout.map(r => r.remove())

    this._layout = layout

    this.mount()

    this.resize()

    return this._layout[index]
  }

  appendRow (row: RowDescriber) {
    return this.insertRow(row, this._layout.length)
  }

  removeRow (row: HTMLTableRowElement) {
    if (row.parentElement === this.$table) {
      this.$table.removeChild(row)
    }
  }
}

export default Layout

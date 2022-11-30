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
import { LayoutOptions, useDescriber } from '../options'
import LayoutRow from './LayoutRow'
import { memoizeWith } from 'ramda'

const reservedRoles = ['chart', 'series', 'axis', 'indicator'] as const

export type CellDescriber = Partial<{
  role: string;
  width: number;
  height: number;
  colSpan: number;
  rowSpan: number;
  node?: HTMLTableCellElement;
}>

export type RowDescriber = {
  role: string;
  cells: (CellDescriber | null)[]
  height?: number;
}

export type LayoutDescriber = RowDescriber[]

export type ReservedRoles = typeof reservedRoles[number]

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

export class Layout extends Event<'resize'> {
  private readonly $container: Element

  private $table!: HTMLTableElement

  private readonly _keyPositions: Record<ReservedRoles, Vector>

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
  private _layout: LayoutRow[] = []

  /**
   * 单元size计算器
   * @private
   */
  private _computer: Computer[][] = []

  private readonly _options: LayoutOptions

  constructor (container: Element, options: LayoutOptions, describer?: LayoutDescriber) {
    super()

    this.$container = container

    this._options = options

    this._keyPositions = this._options.positions

    const $table = this.$container.querySelector('table.layout')

    this._describer = $table instanceof HTMLTableElement
                      ? this.parseLayout(this.$table = $table)
                      : useDescriber(this._options, describer)

    this.calcSpacing()

    this._layout = this.buildLayoutAndDescription()

    this._computer = this.buildComputer()

    this.render()

    this.monitorResize()
  }

  static parseSize (size: string) {
    return !size ? undefined
                 : size.endsWith('%') ? -(parseFloat(size) / 100)
                                      : parseFloat(size)
  }

  private render () {
    const tbody = document.createElement('tbody')

    this._layout.map(r => tbody.appendChild(r.render()))

    if (this.$table?.parentElement === this.$container) {
      this.$container.removeChild(this.$table)
    }

    this.$table = document.createElement('table')

    this.styleTable(this.$table)

    this.$table.appendChild(tbody)

    this.$container.appendChild(this.$table)

    return this
  }

  /**
   * 计算总的size，行和列
   * @private
   */
  private calcSpacing () {
    const rect = this.$container.getBoundingClientRect()

    this._space.width = rect.width

    this._space.height = rect.height

    this._space.row = this._describer.length

    if (this._space.row !== 0) {
      this._space.column = this._describer[0].cells.reduce((acc, v) => acc + (v?.colSpan ?? 1), 0)
    }
  }

  private styleTable (table: HTMLTableElement) {
    table.classList.add('layout')

    table.style.cssText += `
      width: ${this._space.width}px;
      height: ${this._space.height}px;
      border: none;
      border-collapse: collapse;
      border-spacing: 0;
      overflow: hidden;
    `

    return table
  }

  private parseLayout ($table: HTMLTableElement) {
    return [].slice.call($table.querySelectorAll('tr')).map(($tr: HTMLTableRowElement) => {
      return {
        role: $tr.dataset.layoutRole ?? '',
        cells: [].slice.call($tr.querySelectorAll('td')).map(($td: HTMLTableCellElement) => {
          return {
            role: $td.dataset.layoutRole,
            width: Layout.parseSize($td.style.width),
            height: Layout.parseSize($td.style.height),
            colSpan: +($td.getAttribute('colspan') ?? 1),
            rowSpan: +($td.getAttribute('rowspan') ?? 1),
            node: $td,
          }
        }),
      }
    })
  }

  private buildLayoutAndDescription () {
    // 格式化(清空)描述对象
    this._description.length = 0

    return this._describer.map((row, rowIndex) =>
      new LayoutRow(this, {
        ...row,
        row: rowIndex,
      }).buildCells(cellIndex => row.cells[cellIndex]?.node))
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

    if (cell.isLink) {
      return memoizeWith(
        this.keyGen(row, col),
        () => this.compute('width', cell.source),
      )
    }

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

    if (cell.isLink) {
      return memoizeWith(
        this.keyGen(row, col),
        () => this.compute('height', cell.source),
      )
    }

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
    for (let c = 0, l = this._description[row]?.length; c < l && height === undefined; c++) {
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

    return this._description[row]?.[col]
  }

  private raw (location: Vector) {
    this.assertLocation(location)

    const cell = this.read(location)
    return cell?.isLink ? cell.source : location
  }

  private set ([col, row]: Vector, describer: SpaceDescriber) {
    this.assertLocation([col, row])

    // 新建 行 描述对象的 位置空间
    if (!this._description[row]) {
      this._description[row] = []
    }

    this._description[row][col] = describer
  }

  private rebuild () {
    this.calcSpacing()

    /**
     * 创建新布局
     */
    const layout = this.buildLayoutAndDescription()

    /**
     * 新建计算器
     */
    this._computer = this.buildComputer()

    this._layout.map(r => r.remove())

    this._layout = layout

    this.render()

    this.resize()

    return this
  }

  describe (row: number, col: number, describer: CellDescriber | null) {
    const cell = this.read([col, row])

    /**
     * 占位单元不处理
     */
    if (cell?.isLink === true) {
      return cell.source
    }

    const rs = describer?.rowSpan ?? 1
    const cs = describer?.colSpan ?? 1
    /**
     * 参考同列的宽度
     */
    const width = describer?.width ?? (col > 0 && this.refColumnWidth(col) || -1)
    /**
     * 参考同行的高度
     */
    const height = describer?.height ?? (row > 0 && this.refRowHeight(row) || -1)

    this.set([col, row], {
      isLink: false,
      flexedHeight: !(height >= 0),
      height,
      flexedWidth: !(width >= 0),
      width,
      colSpan: cs,
      rowSpan: rs,
    })

    const role = describer?.role as ReservedRoles
    if (reservedRoles.indexOf(role) !== -1) {
      this._keyPositions[role] = [col, row]
    }

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
    const _location = this.raw(location)
    return this._computer[_location[1]][_location[0]]?.[dimension]()
  }

  /**
   * @alias
   */
  chart () {
    return this.locate(this._keyPositions.chart)
  }

  /**
   * @alias
   */
  mainAxis () {
    return this.locate(this._keyPositions.axis)
  }

  /**
   * @alias
   */
  series () {
    return this.locate(this._keyPositions.series)
  }

  resize () {
    const display = this.$table.style.display
    this.$table.style.display = 'none'
    const rect = this.$container.getBoundingClientRect()
    this.$table.style.display = display

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

    this.rebuild()

    return this._layout[index]
  }

  appendRow (describer: RowDescriber) {
    let rowIndex = this._layout.length
    const role = describer.role as ReservedRoles

    if (reservedRoles.indexOf(role) !== -1) {
      rowIndex = this._keyPositions[role][1]
    }

    return this.insertRow(describer, rowIndex)
  }

  removeRow (index: number) {
    for (let i = index, l = this._layout.length; i < l; i++) {
      this._layout[i].moveUp()
    }

    this._layout.splice(index, 1)

    this._describer.splice(index, 1)

    this.rebuild()
  }

  unmountRow (row: HTMLTableRowElement) {
    if (row.parentElement === this.$table) {
      this.$table.removeChild(row)
    }
  }
}

export default Layout

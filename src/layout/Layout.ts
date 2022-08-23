/**
 *  @file         src/layout/Layout.ts created by WebStorm
 *  @project      stock-chart
 *  @author       ayooo[ayooooo@petalmail.com]
 *  @date         2022/8/22 17:12
 *  @description
 */
import debounce from 'lodash.debounce'
import Event from '../base/Event'
import { useDescriber } from '../options'
import LayoutRow from './LayoutRow'

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
  private readonly _describer: LayoutDescriber
  private readonly _description: SpaceDescriber[][] = []
  private readonly _computer: Computer[][]
  private readonly _space = {
    width: 0,
    height: 0,
    row: 0,
    column: 0,
  }

  private _rows: LayoutRow[]

  constructor (container: Element, describer?: LayoutDescriber) {
    super()

    this.$container = container

    const rect = this.$container.getBoundingClientRect()

    this._space.width = rect.width

    this._space.height = rect.height

    this.$table = this.createTable(rect.width, rect.height)

    this._describer = useDescriber(describer)

    this.formatDescriber()

    this._rows = this.buildRows()

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

  private createTable (width: number, height: number) {
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

  private buildRows () {
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

  private createWidthFormula (row: number, col: number) {
    const space = this._description[row][col]

    if (space.isLink) return this._computer[space.source[1]][space.source[0]].width

    if (!space.flexedWidth) {
      return () => space.width
    }

    return () => {
      let fixedWidth = 0
      let fixedColumn = 0

      for (let i = 0, l = this._description[row].length; i < l; i++) {
        const space = this._description[row][i]
        if (space.isLink) continue

        fixedWidth += space.flexedWidth ? 0 : space.width
        fixedColumn += space.flexedWidth ? 0 : space.colSpan
      }

      return (this._space.width - fixedWidth) / (this._space.column - fixedColumn) * space.colSpan
    }
  }

  private createHeightFormula (row: number, col: number) {
    const space = this._description[row][col]

    if (space.isLink) return this._computer[space.source[1]][space.source[0]].height

    if (!space.flexedHeight) {
      return () => space.height
    }

    return () => {
      let fixedHeight = 0
      let fixedRow = 0

      for (let i = 0, l = this._description.length; i < l; i++) {
        const space = this._description[i][col]
        if (space.isLink) continue

        fixedHeight += space.flexedHeight ? 0 : space.height
        fixedRow += space.flexedHeight ? 0 : space.rowSpan
      }

      return (this._space.height - fixedHeight) / (this._space.row - fixedRow) * space.rowSpan
    }
  }

  private buildComputer () {
    return this._description.map((r, ri) => r.map((_, ci) => {
      return {
        width: this.createWidthFormula(ri, ci),
        height: this.createHeightFormula(ri, ci),
      }
    }))
  }

  private refRowHeight (row: number) {
    let height
    for (let c = 0, l = this._description[row].length; c < l && height === undefined; c++) {
      const cell = this._description[row][c]
      if (!cell || cell.isLink) continue
      height = cell.height
    }
    return height
  }

  private refColumnWidth (col: number) {
    let width
    for (let r = 0, l = this._description.length; r < l && width === undefined; r++) {
      const cell = this._description[r][col]
      if (!cell || cell.isLink) continue
      width = cell?.width
    }

    return width
  }

  describe (row: number, col: number, describer: CellDescriber | null) {
    /**
     * 占位单元不处理
     */
    if (this._description[row][col]?.isLink === true) {
      return
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

    this._description[row][col] = {
      isLink: false,
      flexedHeight: !(height >= 0),
      height,
      flexedWidth: !(width >= 0),
      width,
      colSpan: cs,
      rowSpan: rs,
    }

    /**
     * expand row/column span
     */
    if (rs > 1 || cs > 1) {
      for (let r = row, rc = Math.min(row + rs, this._space.row); r < rc; r++) {
        for (let c = col, cc = Math.min(col + cs, this._space.column); c < cc; c++) {
          if (r === row && c === col) continue

          this._description[r][c] = {
            isLink: true,
            source: [col, row],
          }
        }
      }
    }
  }

  render () {
    const fragment = document.createDocumentFragment()

    this._rows.map(r => fragment.appendChild(r.render()))

    this.$table.appendChild(fragment)

    return this.$table
  }

  locate (row: number, col: number) {
    return this._rows?.[row]?.at(col)
  }

  raw (row: number, col: number) {
    const cell = this._description[row][col]
    return cell?.isLink ? this.locate(cell.source[1], cell.source[0]) : this.locate(row, col)
  }

  compute (row: number, col: number, dimension: 'width' | 'height') {
    return this._computer[row][col]?.[dimension]()
  }

  chart () {
    return this.locate(0, 0)
  }

  mainAxis () {
    return this.locate(1, 0)
  }

  series () {
    return this.locate(0, 1)
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
    this._rows.splice(index, 0, new LayoutRow(this, {
      ...describer,
      row: index,
    }))

    this._describer.splice(index, 0, describer)

    this.formatDescriber()

    /**
     * 新建行
     */
    const rows = this.buildRows()

    /**
     * 新建计算器
     */
    this.buildComputer()

    this._rows.map(r => r.remove())

    this._rows = rows

    this.mount()

    this.resize()

    return this._rows[index]
  }

  appendRow (row: RowDescriber) {
    return this.insertRow(row, this._rows.length)
  }

  removeRow (row: HTMLTableRowElement) {
    this.$table.removeChild(row)
  }
}

export default Layout

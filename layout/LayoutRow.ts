/**
 *  @file         src/layout/LayoutRow.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/22 17:14
 *  @description
 */
import Layout, { RowDescriber } from './Layout'
import LayoutCell from './LayoutCell'

type LayoutRowOptions = RowDescriber & {
  row: number;
}

class LayoutRow {
  private readonly $row: HTMLTableRowElement
  private readonly _layout: Layout
  private readonly _options: LayoutRowOptions

  private _cells: LayoutCell[] = []

  constructor (layout: Layout, options: LayoutRowOptions) {
    this.$row = document.createElement('tr')
    this._options = options
    this._layout = layout
  }

  render () {
    this.$row.classList.add('layout_row')

    this._cells.map(c => this.$row.appendChild(c.node()))

    return this.$row
  }

  buildCells (readNode: (cellIndex: number) => HTMLTableCellElement | undefined) {
    this._cells = this._options.cells.map((cell, cellIndex) => {
      const extendedCell = {
        ...cell,
        height: this._options.height ?? cell?.height,
      }

      /**
       * 根据span更新关联单元的信息
       */
      this._layout.describe(this._options.row, cellIndex, extendedCell)

      return this._layout.locate([cellIndex, this._options.row]) ?? new LayoutCell(this._layout, {
        ...extendedCell,
        row: this._options.row,
        column: cellIndex,
      }, readNode(cellIndex))
    })

    return this
  }

  at (column: number) {
    return this._cells[column]
  }

  remove () {
    this._layout.unmountRow(this.$row)
  }

  moveDown () {
    this._cells.map(c => {
      c.moveDown()
    })
  }

  moveUp () {
    this._cells.map(c => {
      c.moveUp()
    })
  }
}

export default LayoutRow

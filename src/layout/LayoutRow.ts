/**
 *  @file         src/layout/LayoutRow.ts created by WebStorm
 *  @project      stock-chart
 *  @author       阿佑[ayooooo@petalmail.com]
 *  @date         2022/8/22 17:14
 *  @description
 */
import Layout from './Layout'
import LayoutCell from './LayoutCell'

type LayoutRowOptions = RowDescriber & {
  row: number;
}

class LayoutRow {
  private readonly $row: HTMLTableRowElement
  private readonly _layout: Layout
  private readonly _options: LayoutRowOptions
  private readonly _name: string

  private _cells: LayoutCell[] = []

  constructor (layout: Layout, options: LayoutRowOptions) {
    this.$row = document.createElement('tr')
    this._options = options
    this._layout = layout
    this._name = options.name
  }

  render () {
    this.$row.setAttribute('name', this._name)

    this._cells.map(c => this.$row.appendChild(c.node()))

    return this.$row
  }

  buildCells () {
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
      })
    })

    return this
  }

  at (column: number) {
    return this._cells[column]
  }

  remove () {
    this._layout.removeRow(this.$row)
  }

  moveDown () {
    this._cells.map(c => {
      c.moveDown()
    })
  }
}

export default LayoutRow

/**
 *  @file         src/layout/LayoutRow.ts created by WebStorm
 *  @project      stock-chart
 *  @author       ayooo[ayooooo@petalmail.com]
 *  @date         2022/8/22 17:14
 *  @description
 */
import Layout from './Layout'
import LayoutCell, { CellDescriber } from './LayoutCell'

export type RowDescriber = {
  name: string;
  row: number;
  cells: (CellDescriber | null)[]
  height?: number;
}

class LayoutRow {
  private readonly name: string
  private readonly _cells: LayoutCell[]

  constructor (layout: Layout, describer: RowDescriber) {
    this.name = describer.name

    this._cells = describer.cells.map((cell, cellIndex) => {
      if (cell?.ref) {
        return layout.locate(cell.ref[1], cell.ref[0])
      }

      const extendedCell = {
        ...cell,
        height: describer.height,
      }

      layout.buildSpaceDescriber(describer.row, cellIndex, extendedCell)

      return new LayoutCell({
        ...extendedCell,
        row: describer.row,
        column: cellIndex,
      })
    })
  }

  render () {
    const row = document.createElement('tr')

    row.setAttribute('name', this.name)

    this._cells.map(c => row.appendChild(c.node()))

    return row
  }

  at (column: number) {
    return this._cells[column]
  }

  resize () {
    this._cells.map(c => c.resize())
  }
}

export default LayoutRow

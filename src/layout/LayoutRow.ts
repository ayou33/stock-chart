/**
 *  @file         src/layout/LayoutRow.ts created by WebStorm
 *  @project      stock-chart
 *  @author       ayooo[ayooooo@petalmail.com]
 *  @date         2022/8/22 17:14
 *  @description
 */
import Layout from './Layout'
import LayoutCell, { OptionalCellDescriber } from './LayoutCell'
import idMaker from '../helper/idMaker'

const idGenerator = idMaker(d => 'layout_' + d)

export type RowDescriber = {
  name: string;
  row: number;
  cells: OptionalCellDescriber[]
  height?: number;
}

class LayoutRow {
  private readonly name: string
  private readonly _cells: LayoutCell[]

  constructor (layout: Layout, describer: RowDescriber) {
    this.name = describer.name

    this._cells = describer.cells.map((c, column) => {
      if (c.ref) {
        return layout.locate(...c.ref)
      }

      return new LayoutCell({
        ...c,
        row: describer.row,
        column,
        height: describer.height,
        id: idGenerator.next(),
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

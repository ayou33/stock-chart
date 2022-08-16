/**
 *  Table.ts of project stock-chart
 *  @date 2022/8/2 15:39
 *  @author 阿佑[ayooooo@petalmail.com]
 */
import idMaker from '../helper/idMaker'

class Table {
  private readonly _table: ContainerCell[][]
  private _id = idMaker()
  private _width: number
  private _height: number
  private _appliedHeight = 0
  private _appliedWidth = 0
  private _flexedRow = 0
  private _flexedColumn = 0

  constructor (width: number, height: number, table: CellDescriber[][]) {
    this._width = width
    this._height = height

    for (let i = 0, l = table[0].length; i < l; i++) {
      this._appliedWidth += table[0][i].width ?? (this._flexedColumn++, 0)
    }

    for (let i = 0, l = table.length; i < l; i++) {
      this._appliedHeight += table[i][0].height ?? (this._flexedRow++, 0)
    }

    const flexWidth = (this._width - this._appliedWidth) / this._flexedColumn
    const flexHeight = (this._height - this._appliedHeight) / this._flexedRow

    // table init
    this._table = table.map(
      (r, ri) => r.map(
        (c, ci) => ({
          declaredWidth: c.width,
          declaredHeight: c.height,
          width: c.width
            ?? table[ri - 1]?.[ci].width // ref pre-row width
            ?? flexWidth,
          height: c.height
            ?? r[ci - 1]?.height // ref pre-column height
            ?? flexHeight,
          id: this._id.next(),
          node: document.createElement('td'),
        })))
  }

  /**
   * table update
   * @private
   */
  private flex () {
    const flexHeight = (this._height - this._appliedHeight) / this._flexedRow
    const flexWidth = (this._width - this._appliedWidth) / this._flexedColumn

    this._table.map(
      (r, ri) => r.map(
        (c, ci) => {
          if (undefined === c.declaredHeight) {
            c.height = r[ci - 1]?.height ?? flexHeight
            c.node.style.height = `${c.height}px`
          }

          if (undefined === c.declaredWidth) {
            c.width = this._table[ri - 1]?.[ci].width ?? flexWidth
            c.node.style.width = `${c.width}px`
          }
        }))
  }

  addRow (index: number, height?: number): ContainerCell[] {
    const isRowFlexed = undefined === height
    this._flexedRow += isRowFlexed ? 1 : 0
    this._appliedHeight += isRowFlexed ? 0 : height
    const flexHeight = (this._height - this._appliedHeight) / this._flexedColumn
    const rowHeight = isRowFlexed ? flexHeight : height

    const row: ContainerCell[] = []
    for (let i = 0, l = this._table[0].length; i < l; i++) {
      const cell = this._table[0][i]

      row.push({
        width: cell.width,
        height: rowHeight,
        declaredHeight: height,
        declaredWidth: cell.declaredWidth,
        id: this._id.next(),
        node: document.createElement('td'),
      })
    }

    const rowIndex = index >= 0 ? index : this._table.length + index
    this._table.splice(rowIndex, 0, row)

    this.flex()

    return row
  }

  removeRow (index: number): ContainerCell[] {
    const rowIndex = index >= 0 ? index : this._table.length + index
    const dropped = this._table[index]
    const isRowFlexed = undefined === dropped[0].declaredHeight
    this._flexedRow -= isRowFlexed ? 1 : 0
    this._appliedHeight -= isRowFlexed ? 0 : dropped[0].height
    this._table.splice(rowIndex, 1)

    this.flex()

    return dropped
  }

  addColumn (index: number, width?: number): ContainerCell[] {
    const columnIndex = index >= 0 ? index : this._table[0].length + index
    const isColumnFlexed = undefined === width
    this._flexedColumn += isColumnFlexed ? 1 : 0
    this._appliedWidth += isColumnFlexed ? 0 : width
    const flexWidth = (this._width - this._appliedWidth) / this._flexedColumn
    const columnWidth = isColumnFlexed ? flexWidth : width

    const column: ContainerCell[] = []

    for (let i = 0, l = this._table.length; i < l; i++) {
      const row = this._table[i]
      const cell = row[0]
      const newCell: ContainerCell = {
        width: columnWidth,
        height: cell.height,
        declaredWidth: width,
        declaredHeight: cell.declaredHeight,
        id: this._id.next(),
        node: document.createElement('td'),
      }
      column.push(newCell)
      row.splice(columnIndex, 0, newCell)
    }

    this.flex()

    return column
  }

  removeColumn (index: number): ContainerCell[] {
    const columnIndex = index >= 0 ? index : this._table[0].length + index
    const column: ContainerCell[] = []
    const isColumnFlex = undefined === this._table[0][columnIndex].declaredWidth
    this._flexedColumn -= isColumnFlex ? 1 : 0
    this._appliedWidth -= isColumnFlex ? 0 : this._table[0][columnIndex].width

    for (let i = 0, l = this._table.length; i < l; i++) {
      column.push(this._table[i][columnIndex])
      this._table[i].splice(columnIndex, 1)
    }

    this.flex()

    return column
  }

  locate (row: number, column: number) {
    return this._table[row][column]
  }

  render () {
    const fragment = document.createDocumentFragment()
    this._table.map(r => {
      const row = document.createElement('tr')
      r.map(c => {
        c.node.style.cssText = `
          width: ${c.width}px;
          height: ${c.height}px;
          padding: 0;
        `
        row.appendChild(c.node)
      })
      fragment.appendChild(row)
    })
    return fragment
  }

  resize (width: number, height: number) {
    this._width = width
    this._height = height
    this.flex()
  }
}

export default Table

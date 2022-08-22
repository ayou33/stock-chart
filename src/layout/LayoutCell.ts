/**
 *  @date:        2022/8/21 23:04
 *  @author:      carol[ayooooo@petalmail.com]
 *  @project:     stock-chart
 *  @product:     WebStorm
 *  @file:        src/core/LayoutCell.ts
 *  @description:
 **/
import isIn from '../helper/range'

const isPercent = isIn(-1, 0)

export type OptionalCellDescriber = Partial<{
  name: string;
  width: number;
  height: number;
  colSpan: number;
  rowSpan: number;
  ref: Vector;
}>

export type CellDescriber = {
  id: string;
  row: number;
  column: number;
} & OptionalCellDescriber

class LayoutCell {
  private readonly _cell: HTMLTableCellElement
  private _bounding: DOMRect | null = null
  private _row: number
  private _column: number

  constructor (describer: CellDescriber) {
    this._row = describer.row

    this._column = describer.column

    const cell = document.createElement('td')

    cell.style.padding = '0'

    cell.setAttribute('data-id', describer.id)

    if (describer.name) cell.setAttribute('name', describer.name)

    if (describer.colSpan) {
      cell.setAttribute('colspan', describer.colSpan.toString())
    }

    if (describer.rowSpan) {
      cell.setAttribute('rowspan', describer.rowSpan.toString())
    }

    if (describer.width !== undefined) {
      const value = Math.abs(describer.width)
      cell.style.width = value + (isPercent(describer.width) ? ((value * 99) + '%') : 'px')
    }

    if (describer.height !== undefined) {
      const value = Math.abs(describer.height)
      cell.style.height = value + (isPercent(describer.height) ? ((value * 99) + '%') : 'px')
    }

    this._cell = cell
  }

  private buildBounding () {
    return this._bounding = this._cell.getBoundingClientRect()
  }

  resize () {
    this.buildBounding()

    return this
  }

  node () {
    return this._cell
  }

  width () {
    if (!this._bounding) this._bounding = this.buildBounding()

    return this._bounding.width
  }

  height () {
    if (!this._bounding) this._bounding = this.buildBounding()

    return this._bounding.height
  }

  $ (mixed?: number | string) {
    if (mixed === undefined) {
      return this.node().children
    } else if (typeof mixed === 'number') {
      return this.node().children.item(mixed)
    }

    return this.node().querySelectorAll(mixed)
  }

  insert (dom: HTMLElement, index?: number) {
    if (index === undefined) {
      this.node().appendChild(dom)
    } else if (index === 0) {
      this.node().prepend(dom)
    } else {
      this.node().children.item(index)?.insertAdjacentElement('beforebegin', dom)
    }

    return this
  }

  calc () {}

  raw () {}
}

export default LayoutCell

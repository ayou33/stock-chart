/**
 *  @date:        2022/8/21 23:04
 *  @author:      carol[ayooooo@petalmail.com]
 *  @project:     stock-chart
 *  @product:     WebStorm
 *  @file:        src/core/LayoutCell.ts
 *  @description:
 **/
import Layout, { CellDescriber } from './Layout'

export type CellOptions = {
  row: number;
  column: number;
} & CellDescriber

class LayoutCell {
  private readonly _layout: Layout
  private readonly $cell: HTMLTableCellElement

  private _row: number
  private _column: number

  constructor (layout: Layout, options: CellOptions, $td?: HTMLTableCellElement) {
    this._layout = layout
    this._row = options.row
    this._column = options.column

    const cell = $td ?? document.createElement('td')

    cell.classList.add('layout_cell')

    cell.style.cssText += `
      overflow: hidden;
      position: relative;
      padding: 0;
    `

    if (options.role) cell.setAttribute('data-layout-role', options.role)

    if (options.colSpan) {
      cell.setAttribute('colspan', options.colSpan.toString())
    }

    if (options.rowSpan) {
      cell.setAttribute('rowspan', options.rowSpan.toString())
    }

    this.$cell = cell
  }

  node () {
    return this.$cell
  }

  width () {
    return this._layout.compute('width', [this._column, this._row])
  }

  height () {
    return this._layout.compute('height', [this._column, this._row])
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

  right () {
    return this._layout.locate([this._column + 1, this._row])
  }

  moveDown () {
    this._row = this._row + 1
  }

  moveUp () {
    this._row = this._row - 1
  }

  moveRight () {
    this._column = this._column + 1
  }
}

export default LayoutCell

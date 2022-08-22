/**
 *  @file         src/layout/Layout.ts created by WebStorm
 *  @project      stock-chart
 *  @author       ayooo[ayooooo@petalmail.com]
 *  @date         2022/8/22 17:12
 *  @description
 */
import debounce from 'lodash.debounce'
import Event from '../base/Event'
import { CellDescriber } from './LayoutCell'
import LayoutRow, { RowDescriber } from './LayoutRow'

export type LayoutDescriber = Omit<RowDescriber, 'row'>[]

export type SpaceDescriber = {
  declaredWidth: number;
  width: number;
  calcWidth: () => number;
  declaredHeight: number;
  calcHeight: () => number;
  height: number;
  colSpan: number;
  rowSpan: number;
  refRow?: number
  refCol?: number;
}

class Layout extends Event<'resize'> {
  private readonly $table: HTMLTableElement
  private readonly _rows: LayoutRow[]
  private readonly _layoutSpace: SpaceDescriber[][] = []
  private _width = 300
  private _height = 150

  constructor (root: Element, describer?: LayoutDescriber) {
    super()

    const rect = root.getBoundingClientRect()

    this._width = rect.width

    this._height = rect.height

    this.$table = this.createTable(this._width, this._height)

    const d = this.useDescriber(describer)

    d.map((_, i) => this._layoutSpace[i] = [])

    this._rows = this.createRows(d)

    this.calc()

    root.appendChild(this.render())

    this.monitorResize(root)
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

  private useDescriber (describer?: LayoutDescriber) {
    return describer ?? [
      {
        name: 'chart_row',
        cells: [
          {
            name: 'main_chart_cell',
          }, { name: 'default_series_cell', width: 60 },
        ],
      },
      {
        name: 'main_axis_row',
        height: 20,
        cells: [
          {
            name: 'main_axis_cell',
          }, {},
        ],
      },
    ]
  }

  private createRows (describer: LayoutDescriber) {
    return describer.map((r, row) =>
      new LayoutRow(this, {
        ...r,
        row,
      }))
  }

  private monitorResize (root: Element) {
    window.addEventListener('resize', debounce(() => {
      this.resize(root.getBoundingClientRect())
    }, 1000 / 6))
  }

  feed (row: number, col: number, describer: CellDescriber) {
    this._layoutSpace[row][col] = {
      declaredWidth: describer.width,
      width: describer.width,
      calcWidth: () => describer.width,
      declaredHeight: describer.height,
      calcHeight: () => describer.height,
      height: 0,
      colSpan: 0,
      rowSpan: 0,
      refRow: 0,
      refCol: 0,
    }
  }

  private calc () {
    this._layoutSpace.map(r => r.map(c => {
      c.width = c.calcWidth()
      c.height = c.calcHeight()
    }))
  }

  render () {
    const fragment = document.createDocumentFragment()

    this._rows.map(r => fragment.appendChild(r.render()))

    this.$table.appendChild(fragment)

    return this.$table
  }

  locate (row: number, col: number) {
    return this._rows[row].at(col)
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

  resize (rect: DOMRect) {
    this._width = rect.width
    this._height = rect.height

    this.$table.style.height = this._height + 'px'
    this.$table.style.width = this._width + 'px'

    this.calc()

    this.emit('resize')
  }

  appendRow () {
    return this
  }
}

export default Layout
